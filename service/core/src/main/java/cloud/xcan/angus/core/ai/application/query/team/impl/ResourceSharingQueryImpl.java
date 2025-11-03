package cloud.xcan.angus.core.ai.application.query.team.impl;

import cloud.xcan.angus.core.ai.application.query.team.ResourceSharingQuery;
import cloud.xcan.angus.core.ai.domain.ResourceType;
import cloud.xcan.angus.core.ai.domain.team.resourcesharing.ResourceSharing;
import cloud.xcan.angus.core.ai.domain.team.resourcesharing.ResourceSharingAccessLogRepo;
import cloud.xcan.angus.core.ai.domain.team.resourcesharing.ResourceSharingMember;
import cloud.xcan.angus.core.ai.domain.team.resourcesharing.ResourceSharingMemberRepo;
import cloud.xcan.angus.core.ai.domain.team.resourcesharing.ResourceSharingRepo;
import cloud.xcan.angus.core.ai.domain.team.resourcesharing.SharedWith;
import cloud.xcan.angus.core.biz.BizTemplate;
import cloud.xcan.angus.core.jpa.criteria.GenericSpecification;
import cloud.xcan.angus.remote.message.http.ResourceNotFound;
import jakarta.annotation.Resource;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * 资源共享查询服务实现
 */
@Service
public class ResourceSharingQueryImpl implements ResourceSharingQuery {

  @Resource
  private ResourceSharingRepo resourceSharingRepo;

  @Resource
  private ResourceSharingMemberRepo resourceSharingMemberRepo;

  @Resource
  private ResourceSharingAccessLogRepo resourceSharingAccessLogRepo;

  @Override
  public ResourceSharing findAndCheck(Long id) {
    return new BizTemplate<ResourceSharing>() {
      @Override
      protected ResourceSharing process() {
        return resourceSharingRepo.findById(id)
            .orElseThrow(() -> ResourceNotFound.of("资源共享不存在", new Object[]{}));
      }
    }.execute();
  }

  @Override
  public Page<ResourceSharing> find(GenericSpecification<ResourceSharing> spec,
      PageRequest pageable) {
    return new BizTemplate<Page<ResourceSharing>>() {
      @Override
      protected Page<ResourceSharing> process() {
        return resourceSharingRepo.findAll(spec, pageable);
      }
    }.execute();
  }

  @Override
  @Transactional(readOnly = true)
  public ResourceSharing findByResource(Long resourceId, ResourceType resourceType) {
    return resourceSharingRepo.findByResourceIdAndResourceType(resourceId, resourceType)
        .orElse(null);
  }

  @Override
  @Transactional(readOnly = true)
  public List<ResourceSharingMember> getMembers(Long sharingId) {
    return resourceSharingMemberRepo.findBySharingIdOrderByCreatedDateDesc(sharingId);
  }

  @Override
  @Transactional(readOnly = true)
  public boolean hasAccess(Long resourceId, ResourceType resourceType, Long userId) {
    // 查找共享配置
    ResourceSharing sharing = findByResource(resourceId, resourceType);
    if (sharing == null || !sharing.getEnabled()) {
      return false;
    }

    // 检查是否是所有者
    if (sharing.getOwnerId().equals(userId)) {
      return true;
    }

    // 如果是全体成员共享，直接允许
    if (sharing.getSharedWith() == SharedWith.ALL) {
      return true;
    }

    // 检查是否在成员列表中
    return resourceSharingMemberRepo.existsBySharingIdAndUserId(sharing.getId(), userId);
  }

}
