package cloud.xcan.angus.core.ai.application.query.application.impl;

import static cloud.xcan.angus.core.ai.infra.util.TimeRangeUtils.parseEndDate;
import static cloud.xcan.angus.core.ai.infra.util.TimeRangeUtils.parseStartDate;
import static cloud.xcan.angus.spec.principal.PrincipalContext.getUserId;
import static cloud.xcan.angus.spec.utils.ObjectUtils.nullSafe;
import static java.util.Objects.nonNull;

import cloud.xcan.angus.core.ai.application.query.agent.AgentQuery;
import cloud.xcan.angus.core.ai.application.query.application.ApplicationQuery;
import cloud.xcan.angus.core.ai.application.query.model.ModelQuery;
import cloud.xcan.angus.core.ai.domain.agent.Agent;
import cloud.xcan.angus.core.ai.domain.application.AIApplication;
import cloud.xcan.angus.core.ai.domain.application.AIApplicationRepo;
import cloud.xcan.angus.core.ai.domain.application.AIApplicationSearchRepo;
import cloud.xcan.angus.core.ai.domain.application.ApplicationAgent;
import cloud.xcan.angus.core.ai.domain.application.ApplicationAgentRepo;
import cloud.xcan.angus.core.ai.domain.application.ApplicationCountsProjection;
import cloud.xcan.angus.core.ai.domain.application.ApplicationStar;
import cloud.xcan.angus.core.ai.domain.application.ApplicationStarRepo;
import cloud.xcan.angus.core.ai.domain.model.Model;
import cloud.xcan.angus.core.ai.domain.analytics.ApiUsageLogRepo;
import cloud.xcan.angus.core.ai.interfaces.application.facade.vo.ApplicationCountVo;
import cloud.xcan.angus.core.ai.interfaces.application.facade.vo.ApplicationStatisticsVo;
import cloud.xcan.angus.core.biz.BizTemplate;
import cloud.xcan.angus.core.jpa.criteria.CriteriaUtils;
import cloud.xcan.angus.core.jpa.criteria.GenericSpecification;
import cloud.xcan.angus.remote.message.ProtocolException;
import cloud.xcan.angus.remote.message.http.ResourceNotFound;
import cloud.xcan.angus.remote.search.SearchCriteria;
import jakarta.annotation.Resource;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.lang.Nullable;
import org.springframework.stereotype.Service;

@Service
public class ApplicationQueryImpl implements ApplicationQuery {

  @Resource
  private AIApplicationRepo applicationRepo;

  @Resource
  private ApplicationAgentRepo applicationAgentRepo;

  @Resource
  private AIApplicationSearchRepo applicationSearchRepo;

  @Resource
  private ModelQuery modelQuery;

  @Resource
  private AgentQuery agentQuery;

  @Resource
  private ApplicationStarRepo applicationStarRepo;

  @Resource
  private ApiUsageLogRepo apiUsageLogRepo;

  private static final int DEFAULT_TOP_USERS_LIMIT = 20;

  @Override
  public Optional<AIApplication> findById(Long id) {
    return new BizTemplate<Optional<AIApplication>>() {
      @Override
      protected Optional<AIApplication> process() {
        return applicationRepo.findById(id);
      }
    }.execute();
  }

  @Override
  public List<AIApplication> findByIds(Collection<Long> ids) {

    return new BizTemplate<List<AIApplication>>() {
      @Override
      protected List<AIApplication> process() {
        if (ids == null || ids.isEmpty()) {
          return List.of();
        }
        return applicationRepo.findAllById(ids);
      }
    }.execute();
  }

  @Override
  public AIApplication findAndCheck(Long id) {
    return new BizTemplate<AIApplication>() {
      @Override
      protected AIApplication process() {
        return applicationRepo.findById(id)
            .orElseThrow(() -> ResourceNotFound.of("应用「{0}」不存在", new Object[]{id}));
      }
    }.execute();
  }

  @Override
  public AIApplication findAndCheck(Long id, @Nullable Long currentUseModelId) {
    return new BizTemplate<AIApplication>() {
      AIApplication application;
      Agent agent;
      Model currentUseMode;
      Model appDefaultModel;

      @Override
      protected void checkParams() {
        // 检查应用是否存在
        application = findAndCheck(id);
        Long defaultAgentId = applicationAgentRepo.findByApplicationIdOrderBySortOrderAsc(id)
            .stream()
            .filter(b -> Boolean.TRUE.equals(b.getIsDefault()))
            .findFirst()
            .map(ApplicationAgent::getAgentId)
            .orElseGet(() -> {
              List<ApplicationAgent> list = applicationAgentRepo.findByApplicationIdOrderBySortOrderAsc(
                  id);
              return list.isEmpty() ? null : list.get(0).getAgentId();
            });
        if (defaultAgentId == null) {
          throw ProtocolException.of("应用未绑定智能体，请先配置应用");
        }
        // 从绑定的智能体获取模型
        agent = agentQuery.findAndCheck(defaultAgentId);
        if (nonNull(agent.getDefaultModelId())) {
          appDefaultModel = modelQuery.findAndCheck(agent.getDefaultModelId());
        }
        // 检查当前使用模型是否存在
        if (nonNull(currentUseModelId)) {
          currentUseMode = modelQuery.findAndCheck(currentUseModelId);
        }
        // 切换应用模型时，检查模型类型是否一致
        if (nonNull(currentUseModelId) && nonNull(agent.getDefaultModelId())
            && !Objects.equals(currentUseModelId, agent.getDefaultModelId())
            && nonNull(appDefaultModel)
            && !Objects.equals(currentUseMode.getType(), appDefaultModel.getType())) {
          throw ProtocolException.of("当前选择模型类型[{0}]与智能体默认模型类型[{1}]不一致",
              new Object[]{currentUseMode.getType(), appDefaultModel.getType()});
        }
      }

      @Override
      protected AIApplication process() {
        application.setAppDefaultModel(appDefaultModel);
        application.setCurrentUseMode(nullSafe(currentUseMode, appDefaultModel));
        return application;
      }
    }.execute();
  }

  @Override
  public Page<AIApplication> find(GenericSpecification<AIApplication> spec, PageRequest pageable,
      boolean fullTextSearch, String[] match) {
    return new BizTemplate<Page<AIApplication>>() {
      @Override
      protected Page<AIApplication> process() {
        String starStr = CriteriaUtils.findFirstValueAndRemove(spec.getCriteria(), "starred");
        if (starStr != null) {
          boolean starred = Boolean.parseBoolean(starStr);
          Set<Long> starredAppIds = applicationStarRepo.findByUserId(getUserId()).stream()
              .map(ApplicationStar::getApplicationId)
              .collect(Collectors.toSet());
          if (starred && starredAppIds.isEmpty()) {
            return Page.empty(pageable);
          } else if (starred) {
            spec.getCriteria().add(SearchCriteria.in("id", starredAppIds));
          } else {
            spec.getCriteria().add(SearchCriteria.notIn("id", starredAppIds));
          }
        }

        return fullTextSearch
            ? applicationSearchRepo.find(spec.getCriteria(), pageable, AIApplication.class, match)
            : applicationRepo.findAll(spec, pageable);
      }
    }.execute();
  }

  @Override
  public ApplicationCountVo getCurrentUserCounts() {
    return new BizTemplate<ApplicationCountVo>() {
      @Override
      protected ApplicationCountVo process() {
        Long userId = getUserId();
        ApplicationCountsProjection counts = applicationRepo.countByCreatedByGrouped(userId);
        long starred = applicationStarRepo.countByUserId(userId);
        return ApplicationCountVo.builder()
            .total(counts != null ? counts.getTotal() : 0L)
            .draft(counts != null ? counts.getDraft() : 0L)
            .published(counts != null ? counts.getPublished() : 0L)
            .paused(counts != null ? counts.getPaused() : 0L)
            .starred(starred)
            .build();
      }
    }.execute();
  }

  @Override
  public ApplicationStatisticsVo getStatistics(Long id, String startDate, String endDate,
      String period) {
    return new BizTemplate<ApplicationStatisticsVo>() {
      @Override
      protected ApplicationStatisticsVo process() {
        findAndCheck(id);
        LocalDateTime start = parseStartDate(startDate);
        LocalDateTime end = parseEndDate(endDate);
        if (start.equals(LocalDateTime.of(1970, 1, 1, 0, 0))) {
          start = LocalDateTime.now().minusDays(30).toLocalDate().atStartOfDay();
        }

        ApplicationStatisticsVo vo = new ApplicationStatisticsVo();
        buildOverview(vo, id, start, end);
        buildTrends(vo, id, start, end);
        buildTopUsers(vo, id, start, end);
        return vo;
      }
    }.execute();
  }

  @Override
  public boolean existsByName(String name) {
    return applicationRepo.existsByName(name);
  }

  @Override
  public boolean existsByNameAndIdNot(String name, Long id) {
    return applicationRepo.existsByNameAndIdNot(name, id);
  }

  @Override
  public Long getDefaultAgentId(Long applicationId) {
    List<ApplicationAgent> list =
        applicationAgentRepo.findByApplicationIdOrderBySortOrderAsc(applicationId);
    if (list.isEmpty()) {
      return null;
    }
    return list.stream()
        .filter(b -> Boolean.TRUE.equals(b.getIsDefault()))
        .findFirst()
        .map(ApplicationAgent::getAgentId)
        .orElse(list.get(0).getAgentId());
  }

  @Override
  public List<Long> getAgentIds(Long applicationId) {
    return applicationAgentRepo.findByApplicationIdOrderBySortOrderAsc(applicationId).stream()
        .map(ApplicationAgent::getAgentId)
        .toList();
  }

  @Override
  public Set<Long> findStarredApplicationIds(List<Long> applicationIds) {
    if (applicationIds == null || applicationIds.isEmpty()) {
      return Set.of();
    }
    Long userId = getUserId();
    return applicationStarRepo.findByUserIdAndApplicationIdIn(userId, applicationIds).stream()
        .map(ApplicationStar::getApplicationId)
        .collect(Collectors.toSet());
  }

  private void buildOverview(ApplicationStatisticsVo vo, Long appId, LocalDateTime start,
      LocalDateTime end) {
    Object[] row = apiUsageLogRepo.getAppOverviewStats(appId, start, end);
    ApplicationStatisticsVo.OverviewStatsVo overview = new ApplicationStatisticsVo.OverviewStatsVo();
    if (row != null && row.length >= 5) {
      long totalCalls = row[0] != null ? ((Number) row[0]).longValue() : 0;
      long successfulCalls = row[1] != null ? ((Number) row[1]).longValue() : 0;
      long totalTokens = row[2] != null ? ((Number) row[2]).longValue() : 0;
      int costCents = row[3] != null ? ((Number) row[3]).intValue() : 0;
      Double avgResponseTime = row[4] != null ? ((Number) row[4]).doubleValue() : null;

      overview.setTotalCalls(totalCalls);
      overview.setTotalTokens(totalTokens);
      overview.setTotalCost(costCents / 100.0);
      overview.setAvgResponseTime(avgResponseTime);
      overview.setSuccessRate(totalCalls > 0 ? successfulCalls * 100.0 / totalCalls : 0.0);
    } else {
      overview.setTotalCalls(0L);
      overview.setTotalTokens(0L);
      overview.setTotalCost(0.0);
      overview.setAvgResponseTime(0.0);
      overview.setSuccessRate(0.0);
    }
    vo.setOverview(overview);
  }

  private void buildTrends(ApplicationStatisticsVo vo, Long appId, LocalDateTime start,
      LocalDateTime end) {
    List<Object[]> rows = apiUsageLogRepo.getAppTrendByDay(appId, start, end);
    List<ApplicationStatisticsVo.TrendDataVo> calls = new ArrayList<>();
    List<ApplicationStatisticsVo.TrendDataVo> tokens = new ArrayList<>();
    List<ApplicationStatisticsVo.TrendDataVo> responseTime = new ArrayList<>();

    if (rows != null) {
      for (Object[] r : rows) {
        Object dateObj = r[0];
        long datetime = 0L;
        if (dateObj != null) {
          if (dateObj instanceof java.sql.Date sqlDate) {
            datetime = sqlDate.toLocalDate().atStartOfDay(ZoneId.systemDefault())
                .toInstant().toEpochMilli();
          } else if (dateObj instanceof LocalDate localDate) {
            datetime = localDate.atStartOfDay(ZoneId.systemDefault()).toInstant().toEpochMilli();
          }
        }
        long callCount = r[1] != null ? ((Number) r[1]).longValue() : 0;
        long tokenCount = r[2] != null ? ((Number) r[2]).longValue() : 0;
        Double avgResp = r[3] != null ? ((Number) r[3]).doubleValue() : 0.0;

        ApplicationStatisticsVo.TrendDataVo callPoint = new ApplicationStatisticsVo.TrendDataVo();
        callPoint.setDatetime(datetime);
        callPoint.setValue((double) callCount);
        calls.add(callPoint);

        ApplicationStatisticsVo.TrendDataVo tokenPoint = new ApplicationStatisticsVo.TrendDataVo();
        tokenPoint.setDatetime(datetime);
        tokenPoint.setValue((double) tokenCount);
        tokens.add(tokenPoint);

        ApplicationStatisticsVo.TrendDataVo respPoint = new ApplicationStatisticsVo.TrendDataVo();
        respPoint.setDatetime(datetime);
        respPoint.setValue(avgResp);
        responseTime.add(respPoint);
      }
    }

    ApplicationStatisticsVo.TrendsStatsVo trends = new ApplicationStatisticsVo.TrendsStatsVo();
    trends.setCalls(calls);
    trends.setTokens(tokens);
    trends.setResponseTime(responseTime);
    vo.setTrends(trends);
  }

  private void buildTopUsers(ApplicationStatisticsVo vo, Long appId, LocalDateTime start,
      LocalDateTime end) {
    List<Object[]> rows = apiUsageLogRepo.getTopUsersByAppId(appId, start, end,
        PageRequest.of(0, DEFAULT_TOP_USERS_LIMIT));
    List<ApplicationStatisticsVo.TopUserVo> topUsers = new ArrayList<>();
    if (rows != null) {
      for (Object[] r : rows) {
        ApplicationStatisticsVo.TopUserVo u = new ApplicationStatisticsVo.TopUserVo();
        u.setUserId(r[0] != null ? ((Number) r[0]).longValue() : null);
        u.setUsername(null);
        u.setCallCount(r[1] != null ? ((Number) r[1]).longValue() : 0L);
        topUsers.add(u);
      }
    }
    vo.setTopUsers(topUsers);
  }

}
