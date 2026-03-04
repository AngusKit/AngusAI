package cloud.xcan.angus.core.ai.interfaces.activity.facade;

import cloud.xcan.angus.core.ai.interfaces.activity.facade.dto.ActivityFindDto;
import cloud.xcan.angus.core.ai.interfaces.activity.facade.vo.ActivityDetailVo;
import cloud.xcan.angus.core.ai.interfaces.activity.facade.vo.ActivityStatisticsVo;
import cloud.xcan.angus.remote.PageResult;
import cloud.xcan.angus.remote.dto.SimpleStatisticsDto;

public interface ActivityFacade {

  PageResult<ActivityDetailVo> list(ActivityFindDto dto);

  ActivityStatisticsVo getStatistics(SimpleStatisticsDto dto);

}
