package cloud.xcan.angus.core.ai.application.query.plugin.impl;

import static cloud.xcan.angus.core.ai.infra.util.TimeRangeUtils.buildPeriodFilters;
import static cloud.xcan.angus.core.ai.infra.util.TimeRangeUtils.getPeriodRange;

import cloud.xcan.angus.core.ai.application.query.plugin.PluginQuery;
import cloud.xcan.angus.core.ai.domain.StatisticsPeriod;
import cloud.xcan.angus.core.ai.domain.plugin.CategoryCountView;
import cloud.xcan.angus.core.ai.domain.plugin.LongTotalView;
import cloud.xcan.angus.core.ai.domain.plugin.Plugin;
import cloud.xcan.angus.core.ai.domain.plugin.PluginRecordRepo;
import cloud.xcan.angus.core.ai.domain.plugin.PluginRecordType;
import cloud.xcan.angus.core.ai.domain.plugin.PluginRepo;
import cloud.xcan.angus.core.ai.domain.plugin.PluginReviewRepo;
import cloud.xcan.angus.core.ai.domain.plugin.PluginSearchRepo;
import cloud.xcan.angus.core.ai.domain.plugin.PluginStatistics;
import cloud.xcan.angus.core.ai.domain.plugin.PluginStatus;
import cloud.xcan.angus.core.biz.BizTemplate;
import cloud.xcan.angus.core.jpa.criteria.GenericSpecification;
import cloud.xcan.angus.remote.message.http.ResourceNotFound;
import cloud.xcan.angus.remote.search.SearchCriteria;
import cloud.xcan.angus.spec.principal.PrincipalContext;
import jakarta.annotation.Resource;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

@Service
public class PluginQueryImpl implements PluginQuery {

  @Resource
  private PluginRepo pluginRepo;

  @Resource
  private PluginSearchRepo pluginSearchRepo;

  @Resource
  private PluginReviewRepo pluginReviewRepo;

  @Resource
  private PluginRecordRepo pluginRecordRepo;

  @Override
  public Plugin findAndCheck(Long id) {
    return new BizTemplate<Plugin>() {
      @Override
      protected Plugin process() {
        return pluginRepo.findById(id)
            .orElseThrow(() -> ResourceNotFound.of("插件不存在", new Object[]{}));
      }
    }.execute();
  }

  @Override
  public Page<Plugin> find(GenericSpecification<Plugin> spec, PageRequest pageable,
      boolean fullTextSearch, String[] match) {
    return new BizTemplate<Page<Plugin>>() {
      @Override
      protected Page<Plugin> process() {
        return fullTextSearch
            ? pluginSearchRepo.find(spec.getCriteria(), pageable, Plugin.class, match)
            : pluginRepo.findAll(spec, pageable);
      }
    }.execute();
  }

  @Override
  public PluginStatistics getStatistics(StatisticsPeriod period) {
    return new BizTemplate<PluginStatistics>() {
      @Override
      protected PluginStatistics process() {
        PluginStatistics stats = new PluginStatistics();

        var filters = buildPeriodFilters(period);

        // Total plugins
        stats.setTotalPlugins(pluginRepo.countAllByFilters(filters));

        // Total available plugins (ACTIVE)
        stats.setTotalAvailablePlugins(pluginRepo.countAllByFilters(
            SearchCriteria.merge(filters, SearchCriteria.equal("status", PluginStatus.ACTIVE))));

        // My plugins (created by current user)
        Long userId = PrincipalContext.getUserId();
        stats.setMyPlugins(pluginRepo.countAllByFilters(
            SearchCriteria.merge(filters, SearchCriteria.equal("createdBy", userId))));

        // Public plugins
        stats.setPublicPlugins(
            pluginRepo.countAllByFilters(SearchCriteria.merge(filters,
                SearchCriteria.equal("isPublic", true))));

        // Installed plugins (installCount > 0)
        stats.setInstalledPlugins(
            pluginRepo.countAllByFilters(SearchCriteria.merge(filters,
                SearchCriteria.greaterThan("installCount", 0L))));

        // Totals: installs and usages
        LongTotalView installTotal = pluginRepo.sumByFilters(
            Plugin.class, LongTotalView.class, filters, "installCount");
        stats.setTotalInstalls(installTotal == null || installTotal.getTotal() == null
            ? 0L : installTotal.getTotal());

        LongTotalView usageTotal = pluginRepo.sumByFilters(
            Plugin.class, LongTotalView.class, filters, "usageCount");
        stats.setTotalUsages(usageTotal == null || usageTotal.getTotal() == null
            ? 0L : usageTotal.getTotal());

        // Total ratings from review table
        stats.setTotalRatings(pluginReviewRepo.count());

        // Download and visit totals from PluginRecord
        LocalDateTime[] periodRange = getPeriodRange(period);
        if (periodRange == null) {
          Long downloads = pluginRecordRepo.countByType(PluginRecordType.DOWNLOAD);
          Long visits = pluginRecordRepo.countByType(PluginRecordType.VISIT);
          stats.setDownloadPlugins(downloads == null ? 0L : downloads);
          stats.setVisitsPlugins(visits == null ? 0L : visits);
        } else {
          Long downloads = pluginRecordRepo.countByTypeBetween(
              PluginRecordType.DOWNLOAD, periodRange[0], periodRange[1]);
          Long visits = pluginRecordRepo.countByTypeBetween(
              PluginRecordType.VISIT, periodRange[0], periodRange[1]);
          stats.setDownloadPlugins(downloads == null ? 0L : downloads);
          stats.setVisitsPlugins(visits == null ? 0L : visits);
        }

        // Category stats: count and install sum per category
        List<CategoryCountView> counts = pluginRepo.countByFiltersAndGroup(
            Plugin.class, CategoryCountView.class, filters, "category", "id");
        List<PluginStatistics.CategoryStats> categoryStats = new ArrayList<>();
        for (CategoryCountView c : counts) {
          LongTotalView catInstall = pluginRepo.sumByFilters(
              Plugin.class, LongTotalView.class,
              SearchCriteria.merge(filters, SearchCriteria.equal("category", c.getKey())),
              "installCount");
          PluginStatistics.CategoryStats cs = new PluginStatistics.CategoryStats();
          cs.setCategory(c.getKey());
          cs.setCount(c.getTotal());
          cs.setInstallCount(catInstall == null || catInstall.getTotal() == null
              ? 0L : catInstall.getTotal());
          categoryStats.add(cs);
        }
        stats.setCategoryStats(categoryStats);

        // Last month growth trend using last 30 days
        PluginStatistics.LastMonthGrowthTrend trend = new PluginStatistics.LastMonthGrowthTrend();
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime last30Start = now.minusDays(29).toLocalDate().atStartOfDay();

        long availableAdded = pluginRepo.countAllByFilters(SearchCriteria.merge(
            SearchCriteria.criteria(
                SearchCriteria.greaterThanEqual("createdDate", last30Start),
                SearchCriteria.lessThanEqual("createdDate", now)),
            SearchCriteria.equal("status", PluginStatus.ACTIVE)));
        trend.setAvailablePluginsAdded(availableAdded);

        long installedAdded = pluginRepo.countAllByFilters(SearchCriteria.merge(
            SearchCriteria.criteria(
                SearchCriteria.greaterThanEqual("createdDate", last30Start),
                SearchCriteria.lessThanEqual("createdDate", now)),
            SearchCriteria.greaterThan("installCount", 0L)));
        trend.setInstalledPluginsAdded(installedAdded);

        Long downloadsAdded = pluginRecordRepo.countByTypeBetween(
            PluginRecordType.DOWNLOAD, last30Start, now);
        Long visitsAdded = pluginRecordRepo.countByTypeBetween(
            PluginRecordType.VISIT, last30Start, now);
        Long ratingsAdded = pluginReviewRepo.countByCreatedDateBetween(last30Start, now);
        trend.setDownloadsAdded(downloadsAdded == null ? 0L : downloadsAdded);
        trend.setVisitsAdded(visitsAdded == null ? 0L : visitsAdded);
        trend.setRatingsAdded(ratingsAdded == null ? 0L : ratingsAdded);
        stats.setLastMonthGrowthTrend(trend);

        // Trending plugins: Top 5 by installCount then rating (within period)
        PageRequest top5 = PageRequest.of(0, 5,
            Sort.by(Sort.Order.desc("installCount"), Sort.Order.desc("rating")));
        Page<Plugin> topPage = pluginRepo.findAll(new GenericSpecification<>(filters), top5);
        List<PluginStatistics.TrendingPlugin> trending = new ArrayList<>();
        topPage.getContent().forEach(p -> {
          PluginStatistics.TrendingPlugin tp = new PluginStatistics.TrendingPlugin();
          tp.setId(p.getId());
          tp.setName(p.getName());
          tp.setIcon(p.getIcon());
          tp.setInstallCount(p.getInstallCount());
          tp.setRating(p.getRating());
          trending.add(tp);
        });
        stats.setTrendingPlugins(trending);
        return stats;
      }
    }.execute();
  }

  @Override
  public boolean existsByNameAndVersion(String name, String version) {
    return pluginRepo.existsByNameAndVersion(name, version);
  }

  @Override
  public boolean existsByNameAndVersionAndIdNot(String name, String version, Long id) {
    return pluginRepo.existsByNameAndVersionAndIdNot(name, version, id);
  }
}
