package cloud.xcan.angus.core.ai.application.query.activity;

import cloud.xcan.angus.core.ai.domain.activity.Activity;
import cloud.xcan.angus.core.ai.interfaces.activity.facade.vo.ActivityStatisticsVo;
import cloud.xcan.angus.core.jpa.criteria.GenericSpecification;
import cloud.xcan.angus.remote.dto.SimpleStatisticsDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;

public interface ActivityQuery {

  Page<Activity> find(GenericSpecification<Activity> spec, PageRequest pageable,
      boolean fullTextSearch, String[] match);

  ActivityStatisticsVo getStatistics(SimpleStatisticsDto dto);
}
