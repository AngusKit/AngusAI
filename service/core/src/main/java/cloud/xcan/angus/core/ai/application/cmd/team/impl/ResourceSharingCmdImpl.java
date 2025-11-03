package cloud.xcan.angus.core.ai.application.cmd.team.impl;

import cloud.xcan.angus.core.ai.application.cmd.team.ResourceSharingCmd;
import cloud.xcan.angus.core.ai.application.query.team.ResourceSharingQuery;
import cloud.xcan.angus.core.ai.domain.team.resourcesharing.ResourceSharing;
import cloud.xcan.angus.core.ai.domain.team.resourcesharing.ResourceSharingAccessLog;
import cloud.xcan.angus.core.ai.domain.team.resourcesharing.ResourceSharingAccessLogRepo;
import cloud.xcan.angus.core.ai.domain.team.resourcesharing.ResourceSharingMember;
import cloud.xcan.angus.core.ai.domain.team.resourcesharing.ResourceSharingMemberRepo;
import cloud.xcan.angus.core.ai.domain.team.resourcesharing.ResourceSharingRepo;
import cloud.xcan.angus.core.ai.domain.team.resourcesharing.ResourceType;
import cloud.xcan.angus.core.ai.domain.team.resourcesharing.SharedWith;
import cloud.xcan.angus.core.ai.interfaces.team.facade.dto.ResourceSharingAccessDto;
import cloud.xcan.angus.core.ai.interfaces.team.facade.dto.ResourceSharingCreateDto;
import cloud.xcan.angus.core.ai.interfaces.team.facade.dto.ResourceSharingUpdateDto;
import cloud.xcan.angus.core.biz.BizTemplate;
import cloud.xcan.angus.core.biz.cmd.CommCmd;
import cloud.xcan.angus.core.jpa.repository.BaseRepository;
import cloud.xcan.angus.remote.message.http.ResourceNotFound;
import jakarta.annotation.Resource;
import java.time.LocalDateTime;
import java.util.ArrayList;
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
  private ResourceSharingMemberRepo resourceSharingMemberRepo;

  @Resource
  private ResourceSharingAccessLogRepo resourceSharingAccessLogRepo;

  @Resource
  private ResourceSharingQuery resourceSharingQuery;

  @Override
  protected BaseRepository<ResourceSharing, Long> getRepository() {
    return resourceSharingRepo;
  }

  @Override
  @Transactional
  public ResourceSharing create(ResourceSharingCreateDto dto, Long userId) {
    return new BizTemplate<ResourceSharing>() {
      @Override
      protected void checkParams() {
        // 检查资源是否已共享
        boolean exists = resourceSharingRepo.existsByResourceIdAndResourceType(
            dto.getResourceId(), dto.getResourceType());
        if (exists) {
          throw new IllegalStateException("资源已共享，不能重复创建");
        }

        // 如果是指定成员共享，检查成员列表
        if (dto.getSharedWith() == SharedWith.SPECIFIC) {
          if (dto.getMemberIds() == null || dto.getMemberIds().isEmpty()) {
            throw new IllegalArgumentException("指定成员共享时必须提供成员列表");
          }
        }
      }

      @Override
      protected ResourceSharing process() {
        // 创建共享实体
        ResourceSharing entity = new ResourceSharing();
        entity.setResourceId(dto.getResourceId());
        entity.setResourceType(dto.getResourceType());
        entity.setResourceName(getResourceName(dto.getResourceId(), dto.getResourceType()));
        entity.setOwnerId(userId);
        entity.setSharedWith(dto.getSharedWith());
        entity.setPermission(dto.getPermission());
        entity.setNotifyMembers(dto.getNotifyMembers() != null ? dto.getNotifyMembers() : true);
        entity.setMessage(dto.getMessage());
        entity.setTotalViews(0L);
        entity.setTotalEdits(0L);
        entity.setTotalDownloads(0L);
        entity.setUniqueVisitors(0L);
        entity.setEnabled(true);

        // 保存共享
        insert0(entity);
        ResourceSharing saved = resourceSharingRepo.save(entity);

        // 如果是指定成员共享,创建成员记录
        if (dto.getSharedWith() == SharedWith.SPECIFIC && dto.getMemberIds() != null) {
          for (Long memberId : dto.getMemberIds()) {
            // 不添加所有者自己
            if (!memberId.equals(userId)) {
              ResourceSharingMember member = new ResourceSharingMember();
              member.setSharingId(saved.getId());
              member.setUserId(memberId);
              member.setPermission(dto.getPermission()); // 使用默认权限
              member.setAccessCount(0L);
              resourceSharingMemberRepo.save(member);
            }
          }
        }

        // TODO: 发送通知给成员
        if (Boolean.TRUE.equals(dto.getNotifyMembers())) {
          // notificationService.notifyResourceShared(saved, dto.getMessage());
        }

        return saved;
      }
    }.execute();
  }

  @Override
  @Transactional
  public ResourceSharing update(Long id, ResourceSharingUpdateDto dto, Long userId) {
    return new BizTemplate<ResourceSharing>() {
      ResourceSharing entity;

      @Override
      protected void checkParams() {
        entity = resourceSharingQuery.findById(id);
        if (entity == null) {
          throw ResourceNotFound.of("共享不存在", new Object[]{});
        }

        // 权限检查：只有所有者可以更新
        if (!entity.getOwnerId().equals(userId)) {
          throw new IllegalStateException("无权限操作此共享");
        }

        // 如果改为指定成员共享，检查成员列表
        if (dto.getSharedWith() == SharedWith.SPECIFIC) {
          if (dto.getMemberIds() == null || dto.getMemberIds().isEmpty()) {
            throw new IllegalArgumentException("指定成员共享时必须提供成员列表");
          }
        }
      }

      @Override
      protected ResourceSharing process() {
        // 更新共享范围
        if (dto.getSharedWith() != null) {
          entity.setSharedWith(dto.getSharedWith());
        }

        // 更新权限
        if (dto.getPermission() != null) {
          entity.setPermission(dto.getPermission());
        }

        // 更新成员列表
        if (dto.getMemberIds() != null) {
          // 删除旧成员
          resourceSharingMemberRepo.deleteBySharingId(id);

          // 添加新成员
          if (entity.getSharedWith() == SharedWith.SPECIFIC) {
            for (Long memberId : dto.getMemberIds()) {
              if (!memberId.equals(userId)) {
                ResourceSharingMember member = new ResourceSharingMember();
                member.setSharingId(id);
                member.setUserId(memberId);
                member.setPermission(entity.getPermission());
                member.setAccessCount(0L);
                resourceSharingMemberRepo.save(member);
              }
            }
          }
        }

        // 保存更新
        ResourceSharing updated = resourceSharingRepo.save(entity);

        // 发送通知
        if (Boolean.TRUE.equals(dto.getNotifyMembers())) {
          // TODO: notificationService.notifyResourceSharingUpdated(updated);
        }

        return updated;
      }
    }.execute();
  }

  @Override
  @Transactional
  public List<ResourceSharingMember> addMembers(Long sharingId, List<Long> memberIds,
      Long userId) {
    return new BizTemplate<List<ResourceSharingMember>>() {
      ResourceSharing entity;

      @Override
      protected void checkParams() {
        entity = resourceSharingQuery.findById(sharingId);
        if (entity == null) {
          throw ResourceNotFound.of("共享不存在", new Object[]{});
        }

        // 权限检查
        if (!entity.getOwnerId().equals(userId)) {
          throw new IllegalStateException("无权限操作此共享");
        }

        // 检查共享范围
        if (entity.getSharedWith() != SharedWith.SPECIFIC) {
          throw new IllegalStateException("只有指定成员共享才能添加成员");
        }

        if (memberIds == null || memberIds.isEmpty()) {
          throw new IllegalArgumentException("成员列表不能为空");
        }
      }

      @Override
      protected List<ResourceSharingMember> process() {
        List<ResourceSharingMember> addedMembers = new ArrayList<>();

        for (Long memberId : memberIds) {
          // 跳过所有者
          if (memberId.equals(userId)) {
            continue;
          }

          // 检查是否已存在
          boolean exists = resourceSharingMemberRepo.existsBySharingIdAndUserId(
              sharingId, memberId);
          if (exists) {
            continue; // 跳过已存在的成员
          }

          // 创建成员记录
          ResourceSharingMember member = new ResourceSharingMember();
          member.setSharingId(sharingId);
          member.setUserId(memberId);
          member.setPermission(entity.getPermission()); // 使用默认权限
          member.setAccessCount(0L);

          ResourceSharingMember saved = resourceSharingMemberRepo.save(member);
          addedMembers.add(saved);
        }

        // TODO: 发送通知
        // notificationService.notifyMembersAdded(entity, addedMembers);

        return addedMembers;
      }
    }.execute();
  }

  @Override
  @Transactional
  public void removeMember(Long sharingId, Long memberId, Long userId) {
    new BizTemplate<Void>() {
      ResourceSharing entity;

      @Override
      protected void checkParams() {
        entity = resourceSharingQuery.findById(sharingId);
        if (entity == null) {
          throw ResourceNotFound.of("共享不存在", new Object[]{});
        }

        // 权限检查
        if (!entity.getOwnerId().equals(userId)) {
          throw new IllegalStateException("无权限操作此共享");
        }

        // 不能移除所有者
        if (memberId.equals(userId)) {
          throw new IllegalArgumentException("不能移除所有者");
        }
      }

      @Override
      protected Void process() {
        // 删除成员记录
        resourceSharingMemberRepo.deleteBySharingIdAndUserId(sharingId, memberId);

        // TODO: 发送通知
        // notificationService.notifyMemberRemoved(entity, memberId);

        return null;
      }
    }.execute();
  }

  @Override
  @Transactional
  public void recordAccess(Long sharingId, ResourceSharingAccessDto dto, Long userId) {
    new BizTemplate<Void>() {
      ResourceSharing entity;

      @Override
      protected void checkParams() {
        entity = resourceSharingQuery.findById(sharingId);
        if (entity == null) {
          throw ResourceNotFound.of("共享不存在", new Object[]{});
        }
      }

      @Override
      protected Void process() {
        // 创建访问日志
        ResourceSharingAccessLog log = new ResourceSharingAccessLog();
        log.setSharingId(sharingId);
        log.setResourceId(entity.getResourceId());
        log.setResourceType(entity.getResourceType());
        log.setUserId(userId);
        log.setAction(dto.getAction());
        log.setMetadata(dto.getMetadata());
        // TODO: 从请求中获取IP和UserAgent
        // log.setIpAddress(request.getRemoteAddr());
        // log.setUserAgent(request.getHeader("User-Agent"));

        resourceSharingAccessLogRepo.save(log);

        // 更新统计数据
        switch (dto.getAction()) {
          case VIEW:
            entity.setTotalViews(entity.getTotalViews() + 1);
            break;
          case EDIT:
            entity.setTotalEdits(entity.getTotalEdits() + 1);
            break;
          case DOWNLOAD:
            entity.setTotalDownloads(entity.getTotalDownloads() + 1);
            break;
          default:
            break;
        }
        resourceSharingRepo.save(entity);

        // 更新成员访问记录
        if (!userId.equals(entity.getOwnerId())) {
          resourceSharingMemberRepo.findBySharingIdAndUserId(sharingId, userId)
              .ifPresent(member -> {
                member.setLastAccessed(LocalDateTime.now());
                member.setAccessCount(member.getAccessCount() + 1);
                resourceSharingMemberRepo.save(member);
              });

          // 更新独立访客数
          Long uniqueVisitors = resourceSharingMemberRepo.countUniqueVisitorsBySharingId(
              sharingId);
          entity.setUniqueVisitors(uniqueVisitors);
          resourceSharingRepo.save(entity);
        }

        return null;
      }
    }.execute();
  }

  @Override
  @Transactional
  public void delete(Long id, Long userId) {
    new BizTemplate<Void>() {
      ResourceSharing entity;

      @Override
      protected void checkParams() {
        entity = resourceSharingQuery.findById(id);
        if (entity == null) {
          throw ResourceNotFound.of("共享不存在", new Object[]{});
        }

        // 权限检查：只有所有者可以删除
        if (!entity.getOwnerId().equals(userId)) {
          throw new IllegalStateException("无权限操作此共享");
        }
      }

      @Override
      protected Void process() {
        // 删除成员记录
        resourceSharingMemberRepo.deleteBySharingId(id);

        // 删除共享记录
        resourceSharingRepo.deleteById(id);

        // TODO: 发送通知
        // notificationService.notifyResourceSharingCancelled(entity);

        return null;
      }
    }.execute();
  }

  @Override
  @Transactional
  public void cancelByResource(Long resourceId, ResourceType resourceType, Long userId) {
    new BizTemplate<Void>() {
      ResourceSharing entity;

      @Override
      protected void checkParams() {
        entity = resourceSharingRepo.findByResourceIdAndResourceType(resourceId, resourceType)
            .orElseThrow(() -> ResourceNotFound.of("资源共享不存在", new Object[]{}));

        // 权限检查
        if (!entity.getOwnerId().equals(userId)) {
          throw new IllegalStateException("无权限操作此共享");
        }
      }

      @Override
      protected Void process() {
        // 删除成员记录
        resourceSharingMemberRepo.deleteBySharingId(entity.getId());

        // 删除共享记录
        resourceSharingRepo.deleteById(entity.getId());

        // TODO: 发送通知
        // notificationService.notifyResourceSharingCancelled(entity);

        return null;
      }
    }.execute();
  }

  /**
   * 获取资源名称（根据资源ID和类型）
   * TODO: 需要注入相应的服务来获取实际的资源名称
   */
  private String getResourceName(Long resourceId, ResourceType resourceType) {
    // 根据资源类型查询资源名称
    switch (resourceType) {
      case APPLICATION:
        // return applicationQuery.findById(resourceId).getName();
        return "Application-" + resourceId;
      case WORKFLOW:
        // return workflowQuery.findById(resourceId).getName();
        return "Workflow-" + resourceId;
      case DATASET:
        // return datasetQuery.findById(resourceId).getName();
        return "Dataset-" + resourceId;
      case KNOWLEDGE:
        // return knowledgeQuery.findById(resourceId).getName();
        return "Knowledge-" + resourceId;
      case MODEL:
        // return modelQuery.findById(resourceId).getName();
        return "Model-" + resourceId;
      default:
        return "Resource-" + resourceId;
    }
  }
}
