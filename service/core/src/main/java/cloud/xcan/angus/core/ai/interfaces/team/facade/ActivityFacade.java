package cloud.xcan.angus.core.ai.interfaces.team.facade;

import cloud.xcan.angus.core.ai.interfaces.team.facade.dto.ActivityFindDto;
import cloud.xcan.angus.core.ai.interfaces.team.facade.vo.ActivityDetailVo;
import cloud.xcan.angus.core.ai.interfaces.team.facade.vo.ActivityStatisticsVo;
import cloud.xcan.angus.remote.PageResult;

public interface ActivityFacade {

  PageResult<ActivityDetailVo> list(ActivityFindDto dto);

  ActivityStatisticsVo getStatistics(String startDate, String endDate);

}
