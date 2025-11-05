package cloud.xcan.angus.core.ai.interfaces.team.facade.internal;

import static cloud.xcan.angus.core.ai.interfaces.team.facade.internal.assembler.ActivityAssembler.getSpecification;
import static cloud.xcan.angus.core.jpa.criteria.SearchCriteriaBuilder.getMatchSearchFields;
import static cloud.xcan.angus.core.utils.CoreUtils.buildVoPageResult;

import cloud.xcan.angus.core.ai.application.query.team.ActivityQuery;
import cloud.xcan.angus.core.ai.domain.team.activity.Activity;
import cloud.xcan.angus.core.ai.interfaces.team.facade.ActivityFacade;
import cloud.xcan.angus.core.ai.interfaces.team.facade.dto.ActivityFindDto;
import cloud.xcan.angus.core.ai.interfaces.team.facade.internal.assembler.ActivityAssembler;
import cloud.xcan.angus.core.ai.interfaces.team.facade.vo.ActivityDetailVo;
import cloud.xcan.angus.core.ai.interfaces.team.facade.vo.ActivityStatisticsVo;
import cloud.xcan.angus.remote.PageResult;
import jakarta.annotation.Resource;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Component;

@Component
public class ActivityFacadeImpl implements ActivityFacade {

  @Resource
  private ActivityQuery activityQuery;

  @Override
  public PageResult<ActivityDetailVo> list(ActivityFindDto dto) {
    Page<Activity> page = activityQuery.find(getSpecification(dto), dto.tranPage(),
        dto.fullTextSearch, getMatchSearchFields(dto.getClass()));
    return buildVoPageResult(page, ActivityAssembler::toDetailVo);
  }

  @Override
  public ActivityStatisticsVo getStatistics(String startDate, String endDate) {
    return activityQuery.getStatistics(startDate, endDate);
  }

}
