package cloud.xcan.angus.core.ai.interfaces.activity.facade;

import cloud.xcan.angus.core.ai.interfaces.activity.facade.dto.ActivityFindDto;
import cloud.xcan.angus.core.ai.interfaces.activity.facade.vo.ActivityDetailVo;
import cloud.xcan.angus.remote.PageResult;

public interface ActivityFacade {

  PageResult<ActivityDetailVo> list(ActivityFindDto dto);

}
