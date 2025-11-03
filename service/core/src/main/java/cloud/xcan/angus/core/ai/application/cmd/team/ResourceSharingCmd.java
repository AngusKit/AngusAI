package cloud.xcan.angus.core.ai.application.cmd.team;

import cloud.xcan.angus.core.ai.domain.team.resourcesharing.ResourceSharing;
import cloud.xcan.angus.core.ai.domain.team.resourcesharing.SharePermission;
import cloud.xcan.angus.core.ai.domain.team.resourcesharing.SharedWith;
import java.util.List;

/**
 * 资源共享命令服务接口
 */
public interface ResourceSharingCmd {

  /**
   * 创建资源共享
   */
  ResourceSharing create(ResourceSharing sharing);

  /**
   * 更新资源共享
   */
  ResourceSharing update(Long id, SharedWith sharedWith, SharePermission permission,
      List<Long> memberIds);

  /**
   * 切换资源启用或禁用状态
   */
  ResourceSharing toggle(Long id, Boolean enabled);

  /**
   * 删除资源共享
   */
  void delete(Long id);

}
