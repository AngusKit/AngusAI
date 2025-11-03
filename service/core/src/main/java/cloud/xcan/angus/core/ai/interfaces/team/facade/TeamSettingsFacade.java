package cloud.xcan.angus.core.ai.interfaces.team.facade;

import cloud.xcan.angus.core.ai.interfaces.team.facade.dto.TeamSettingsDto;
import cloud.xcan.angus.core.ai.interfaces.team.facade.vo.TeamSettingsVo;

public interface TeamSettingsFacade {

  /**
   * 更新团队设置
   */
  TeamSettingsVo update(TeamSettingsDto dto);

  /**
   * 获取团队设置详情
   */
  TeamSettingsVo getDetail();

}
