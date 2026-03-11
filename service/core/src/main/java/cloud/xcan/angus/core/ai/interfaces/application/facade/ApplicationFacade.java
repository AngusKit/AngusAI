package cloud.xcan.angus.core.ai.interfaces.application.facade;

import cloud.xcan.angus.core.ai.domain.application.ApplicationConfig;
import cloud.xcan.angus.core.ai.domain.application.ApplicationStatus;
import cloud.xcan.angus.core.ai.interfaces.application.facade.dto.ApplicationCreateDto;
import cloud.xcan.angus.core.ai.interfaces.application.facade.dto.ApplicationDuplicateDto;
import cloud.xcan.angus.core.ai.interfaces.application.facade.dto.ApplicationFindDto;
import cloud.xcan.angus.core.ai.interfaces.application.facade.dto.ApplicationShareDto;
import cloud.xcan.angus.core.ai.interfaces.application.facade.dto.ApplicationUpdateDto;
import cloud.xcan.angus.core.ai.interfaces.application.facade.vo.ApplicationCountVo;
import cloud.xcan.angus.core.ai.interfaces.application.facade.vo.ApplicationDetailVo;
import cloud.xcan.angus.core.ai.interfaces.application.facade.vo.ApplicationListVo;
import cloud.xcan.angus.core.ai.interfaces.application.facade.vo.ApplicationStatisticsVo;
import cloud.xcan.angus.remote.PageResult;

public interface ApplicationFacade {

  /**
   * 创建应用
   */
  ApplicationDetailVo create(ApplicationCreateDto dto);

  /**
   * 复制应用
   */
  ApplicationDetailVo duplicate(Long id, ApplicationDuplicateDto dto);

  /**
   * 更新应用基本信息
   */
  ApplicationDetailVo update(Long id, ApplicationUpdateDto dto);

  /**
   * 更新应用配置
   */
  ApplicationDetailVo updateConfig(Long id, ApplicationConfig dto);

  /**
   * 发布应用
   */
  ApplicationDetailVo modifyStatus(Long id, ApplicationStatus status);

  /**
   * 收藏/取消收藏应用
   */
  ApplicationDetailVo star(Long id, Boolean isStarred);

  /**
   * 分享应用
   */
  ApplicationDetailVo share(Long id, ApplicationShareDto dto);

  /**
   * 删除应用
   */
  void delete(Long id);

  /**
   * 获取应用详情
   */
  ApplicationDetailVo getDetail(Long id);

  /**
   * 获取应用列表
   */
  PageResult<ApplicationListVo> list(ApplicationFindDto dto);

  /**
   * 获取应用数量统计
   */
  ApplicationCountVo getCounts();

  /**
   * 获取应用统计
   */
  ApplicationStatisticsVo getStatistics(Long id, String startDate, String endDate, String period);

}
