package cloud.xcan.angus.core.ai.application.query.model.impl;

import static cloud.xcan.angus.core.ai.infra.util.TimeRangeUtils.buildPeriodFilters;
import static cloud.xcan.angus.core.ai.infra.util.TimeRangeUtils.getPeriodRange;

import cloud.xcan.angus.core.ai.application.query.model.ModelQuery;
import cloud.xcan.angus.core.ai.domain.StatisticsPeriod;
import cloud.xcan.angus.core.ai.domain.model.LastMonthGrowthTrend;
import cloud.xcan.angus.core.ai.domain.model.Model;
import cloud.xcan.angus.core.ai.domain.model.ModelCallRecord;
import cloud.xcan.angus.core.ai.domain.model.ModelCallRecordRepo;
import cloud.xcan.angus.core.ai.domain.model.ModelRepo;
import cloud.xcan.angus.core.ai.domain.model.ModelSearchRepo;
import cloud.xcan.angus.core.ai.domain.model.ModelStats;
import cloud.xcan.angus.core.ai.domain.model.ModelStatus;
import cloud.xcan.angus.core.ai.domain.model.TodayGrowthTrend;
import cloud.xcan.angus.core.ai.domain.plugin.LongTotalView;
import cloud.xcan.angus.core.biz.BizTemplate;
import cloud.xcan.angus.core.jpa.criteria.GenericSpecification;
import cloud.xcan.angus.remote.message.http.ResourceNotFound;
import cloud.xcan.angus.remote.search.SearchCriteria;
import jakarta.annotation.Resource;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Set;
import lombok.Getter;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

@Service
public class ModelQueryImpl implements ModelQuery {

  @Resource
  private ModelRepo modelRepo;

  @Resource
  private ModelSearchRepo modelSearchRepo;

  @Override
  public Model findAndCheck(Long id) {
    return new BizTemplate<Model>() {
      @Override
      protected Model process() {
        return modelRepo.findById(id)
            .orElseThrow(() -> ResourceNotFound.of("模型不存在", new Object[]{}));
      }
    }.execute();
  }

  @Override
  public Page<Model> find(GenericSpecification<Model> spec, PageRequest pageable,
      boolean fullTextSearch, String[] match) {
    return new BizTemplate<Page<Model>>() {
      @Override
      protected Page<Model> process() {
        return fullTextSearch
            ? modelSearchRepo.find(spec.getCriteria(), pageable, Model.class, match)
            : modelRepo.findAll(spec, pageable);
      }
    }.execute();
  }

  @Override
  public boolean existsByNameAndVersion(String name, String version) {
    return modelRepo.existsByNameAndVersion(name, version);
  }

  @Override
  public boolean existsByNameAndVersionAndIdNot(String name, String version, Long id) {
    return modelRepo.existsByNameAndVersionAndIdNot(name, version, id);
  }

}
