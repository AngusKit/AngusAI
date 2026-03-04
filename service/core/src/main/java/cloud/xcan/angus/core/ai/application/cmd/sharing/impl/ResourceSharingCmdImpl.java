package cloud.xcan.angus.core.ai.application.cmd.sharing.impl;

import cloud.xcan.angus.core.ai.application.cmd.sharing.ResourceSharingCmd;
import cloud.xcan.angus.core.ai.application.cmd.sharing.ResourceSharingMemberCmd;
import cloud.xcan.angus.core.ai.application.query.sharing.ResourceSharingQuery;
import cloud.xcan.angus.core.ai.domain.sharing.ResourceSharing;
import cloud.xcan.angus.core.ai.domain.sharing.ResourceSharingRepo;
import cloud.xcan.angus.core.ai.domain.sharing.SharePermission;
import cloud.xcan.angus.core.ai.domain.sharing.SharedWith;
import cloud.xcan.angus.core.biz.BizTemplate;
import cloud.xcan.angus.core.biz.cmd.CommCmd;
import cloud.xcan.angus.core.jpa.repository.BaseRepository;
import cloud.xcan.angus.remote.message.ProtocolException;
import cloud.xcan.angus.spec.principal.PrincipalContext;
import jakarta.annotation.Resource;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * 资源共享命令服务实现
 */
@Service
public class ResourceSharingCmdImpl extends CommCmd<ResourceSharing, Long> implements
    ResourceSharingCmd {

  @Resource
  private ResourceSharingRepo resourceSharingRepo;

  @Resource
  private ResourceSharingMemberCmd resourceSharingMemberCmd;

  @Resource
  private ResourceSharingQuery resourceSharingQuery;

  @Override
  @Transactional
  public ResourceSharing create(ResourceSharing sharing) {
    return new BizTemplate<ResourceSharing>() {
      @Override
      protected void checkParams() {
        // 如果是指定成员共享，检查成员列表
        if (sharing.getSharedWith() == SharedWith.SPECIFIC) {
          if (sharing.getMemberIds() == null || sharing.getMemberIds().isEmpty()) {
            throw ProtocolException.of("指定成员共享时必须提供成员列表");
          }
        }

        // TODO 检查共享资源存在
      }

      @Override
      protected ResourceSharing process() {
        // TODO 设置共享资源拥有者（资源创建人）

        // 保存共享
        insert0(sharing);

        // 如果是指定成员共享,创建成员记录
        resourceSharingMemberCmd.addMembers(sharing);

        // TODO: 发送通知给成员
        // notificationService.notifyResourceShared(saved, dto.getMessage());
        return sharing;
      }
    }.execute();
  }

  @Override
  @Transactional
  public ResourceSharing update(Long id, SharedWith sharedWith, SharePermission permission,
      List<Long> memberIds) {
    return new BizTemplate<ResourceSharing>() {
      ResourceSharing sharingDb;

      @Override
      protected void checkParams() {
        // 查找现有共享并检查存在性
        sharingDb = resourceSharingQuery.findAndCheck(id);

        // 权限检查：只有所有者可以更新
        // TODO 资源有管理权限也可以修改
        if (!sharingDb.getOwnerId().equals(PrincipalContext.getUserId())) {
          throw ProtocolException.of("无权限操作此共享");
        }

        // 如果改为指定成员共享，检查成员列表
        if (sharedWith == SharedWith.SPECIFIC) {
          if (memberIds == null || memberIds.isEmpty()) {
            throw ProtocolException.of("指定成员共享时必须提供成员列表");
          }
        }
      }

      @Override
      protected ResourceSharing process() {
        sharingDb.setSharedWith(sharedWith);
        sharingDb.setPermission(permission);
        sharingDb.setMemberIds(memberIds);

        // 更新成员列表
        if (memberIds != null) {
          // 删除旧成员
          resourceSharingMemberCmd.deleteBySharingId(id);
          // 添加新成员
          resourceSharingMemberCmd.addMembers(sharingDb);
        }

        // 保存更新
        ResourceSharing updated = resourceSharingRepo.save(sharingDb);

        // 发送通知
        // TODO: notificationService.notifyResourceSharingUpdated(updated);
        return updated;
      }
    }.execute();
  }

  @Override
  @Transactional
  public ResourceSharing toggle(Long id, Boolean enabled) {
    return new BizTemplate<ResourceSharing>() {
      ResourceSharing sharingDb;

      @Override
      protected void checkParams() {
        // 查找现有共享并检查存在性
        sharingDb = resourceSharingQuery.findAndCheck(id);

        // 权限检查：只有所有者可以更新
        // TODO 资源有管理权限也可以修改
        if (!sharingDb.getOwnerId().equals(PrincipalContext.getUserId())) {
          throw ProtocolException.of("无权限操作此共享");
        }
      }

      @Override
      protected ResourceSharing process() {
        sharingDb.setEnabled(enabled);
        resourceSharingRepo.save(sharingDb);
        return sharingDb;
      }
    }.execute();
  }

  @Override
  @Transactional
  public void delete(Long id) {
    new BizTemplate<Void>() {
      ResourceSharing sharingDb;

      @Override
      protected void checkParams() {
        // 查找现有共享并检查存在性
        sharingDb = resourceSharingQuery.findAndCheck(id);

        // 权限检查：只有所有者可以更新
        // TODO 资源有管理权限也可以修改
        if (!sharingDb.getOwnerId().equals(PrincipalContext.getUserId())) {
          throw ProtocolException.of("无权限操作此共享");
        }
      }

      @Override
      protected Void process() {
        // 删除成员记录
        resourceSharingMemberCmd.deleteBySharingId(id);

        // 删除共享记录
        resourceSharingRepo.deleteById(id);

        // TODO: 发送通知
        // notificationService.notifyResourceSharingCancelled(entity);
        return null;
      }
    }.execute();
  }

  @Override
  protected BaseRepository<ResourceSharing, Long> getRepository() {
    return resourceSharingRepo;
  }
}
