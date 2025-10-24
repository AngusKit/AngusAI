package cloud.xcan.angus.core.ai.interfaces.activity.facade.internal;

import static cloud.xcan.angus.core.ai.interfaces.activity.facade.internal.assembler.ActivityAssembler.getSpecification;
import static cloud.xcan.angus.core.jpa.criteria.SearchCriteriaBuilder.getMatchSearchFields;
import static cloud.xcan.angus.core.utils.CoreUtils.buildVoPageResult;

import cloud.xcan.angus.core.ai.application.query.activity.ActivityQuery;
import cloud.xcan.angus.core.ai.domain.activity.Activity;
import cloud.xcan.angus.core.ai.interfaces.activity.facade.ActivityFacade;
import cloud.xcan.angus.core.ai.interfaces.activity.facade.dto.ActivityFindDto;
import cloud.xcan.angus.core.ai.interfaces.activity.facade.internal.assembler.ActivityAssembler;
import cloud.xcan.angus.core.ai.interfaces.activity.facade.vo.ActivityDetailVo;
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

}
