package cloud.xcan.angus.core.ai.application.cmd.team.impl;

import static cloud.xcan.angus.core.ai.application.converter.SharingAccessLogConverter.toDomain;

import cloud.xcan.angus.core.ai.application.cmd.team.ResourceSharingAccessLogCmd;
import cloud.xcan.angus.core.ai.application.cmd.team.ResourceSharingMemberCmd;
import cloud.xcan.angus.core.ai.application.cmd.team.ResourceSharingStatCmd;
import cloud.xcan.angus.core.ai.domain.ResourceType;
import cloud.xcan.angus.core.ai.domain.team.resourcesharing.ResourceSharingAccessLog;
import cloud.xcan.angus.core.ai.domain.team.resourcesharing.ResourceSharingAccessLogRepo;
import cloud.xcan.angus.core.ai.domain.team.resourcesharing.ShareAccessAction;
import cloud.xcan.angus.core.biz.BizTemplate;
import cloud.xcan.angus.core.biz.cmd.CommCmd;
import cloud.xcan.angus.core.jpa.repository.BaseRepository;
import jakarta.annotation.Resource;
import java.util.Map;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ResourceSharingAccessLogCmdImpl extends CommCmd<ResourceSharingAccessLog, Long>
    implements ResourceSharingAccessLogCmd {

  @Resource
  private ResourceSharingAccessLogRepo resourceSharingAccessLogRepo;

  @Resource
  private ResourceSharingStatCmd resourceSharingStatCmd;

  @Resource
  private ResourceSharingMemberCmd resourceSharingMemberCmd;

  @Override
  @Transactional
  public void recordAccess(ResourceType resourceType, Long resourceId, Long userId,
      ShareAccessAction accessAction, Map<String, Object> metadata) {
    new BizTemplate<Void>() {

      @Override
      protected void checkParams() {
        // TODO 检查访问资源是否存在
      }

      @Override
      protected Void process() {
        // 创建访问日志
        ResourceSharingAccessLog log = toDomain(resourceId, resourceType,
            userId, accessAction, metadata);
        insert0(log);

        // 更新统计数据
        resourceSharingStatCmd.updateStats(resourceType, resourceId, accessAction);

        // 更新成员访问记录
        resourceSharingMemberCmd.updateMemberAccessStats(userId, accessAction);
        return null;
      }
    }.execute();
  }

  @Override
  protected BaseRepository<ResourceSharingAccessLog, Long> getRepository() {
    return resourceSharingAccessLogRepo;
  }
}
