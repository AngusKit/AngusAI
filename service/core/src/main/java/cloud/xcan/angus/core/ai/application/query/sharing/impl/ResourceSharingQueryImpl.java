package cloud.xcan.angus.core.ai.application.query.sharing.impl;

import static cloud.xcan.angus.spec.principal.PrincipalContext.getUserId;
import static cloud.xcan.angus.spec.utils.ObjectUtils.isNotEmpty;

import cloud.xcan.angus.core.ai.application.query.sharing.ResourceSharingMemberQuery;
import cloud.xcan.angus.core.ai.application.query.sharing.ResourceSharingQuery;
import cloud.xcan.angus.core.ai.domain.ResourceType;
import cloud.xcan.angus.core.ai.domain.sharing.ResourceInfo;
import cloud.xcan.angus.core.ai.domain.sharing.ResourceSharing;
import cloud.xcan.angus.core.ai.domain.sharing.ResourceSharingMember;
import cloud.xcan.angus.core.ai.domain.sharing.ResourceSharingRepo;
import cloud.xcan.angus.core.ai.domain.sharing.SharePermission;
import cloud.xcan.angus.core.biz.BizTemplate;
import cloud.xcan.angus.core.jpa.criteria.GenericSpecification;
import cloud.xcan.angus.remote.message.http.ResourceNotFound;
import jakarta.annotation.Resource;
import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

/**
 * 资源共享查询服务实现
 */
@Service
public class ResourceSharingQueryImpl implements ResourceSharingQuery {

  @Resource
  private ResourceSharingRepo resourceSharingRepo;

  @Resource
  private ResourceSharingMemberQuery resourceSharingMemberQuery;

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
  public Map<ResourceInfo, List<SharePermission>> getResourcePermissions(
      Long resourceId, ResourceType resourceType) {
    return new BizTemplate<Map<ResourceInfo, List<SharePermission>>>() {
      @Override
      protected void checkParams() {
        // TODO 查询并检查授权资源是否存在
      }

      @Override
      protected Map<ResourceInfo, List<SharePermission>> process() {
        // TODO 如果是资源拥有者返回所有权限

        List<ResourceSharingMember> members
            = resourceSharingMemberQuery.findByUserIdAndResourceIdAndResourceType(
            getUserId(), resourceId, resourceType);
        Map<ResourceInfo, List<SharePermission>> resourcePermissions = new HashMap<>();
        if (isNotEmpty(members)) {
          ResourceInfo resourceInfo = new ResourceInfo();
          resourceInfo.setResourceId(resourceId);
          resourceInfo.setResourceType(resourceType);
          resourceInfo.setResourceName(null); // TODO 根据check参数设置
          resourcePermissions.put(resourceInfo, members.stream().map(
              ResourceSharingMember::getPermission).distinct().toList());
        }
        return resourcePermissions;
      }
    }.execute();
  }

  @Override
  public Map<Long, Integer> getShareCountMap(Collection<Long> userIds) {
    if (userIds == null || userIds.isEmpty()) {
      return new HashMap<>();
    }
    List<Object[]> results = resourceSharingRepo.countByOwnerIdIn(userIds);
    Map<Long, Integer> map = new HashMap<>();
    for (Long userId : userIds) {
      map.put(userId, 0);
    }
    for (Object[] row : results) {
      Long ownerId = ((Number) row[0]).longValue();
      int count = ((Number) row[1]).intValue();
      map.put(ownerId, count);
    }
    return map;
  }

  @Override
  public ResourceSharing findByResource(Long resourceId, ResourceType resourceType) {
    return resourceSharingRepo.findByResourceIdAndResourceType(resourceId, resourceType)
        .orElse(null);
  }

  @Override
  public List<ResourceSharingMember> getMembers(Long sharingId) {
    return resourceSharingMemberQuery.findBySharingIdOrderByCreatedDateDesc(sharingId);
  }
}
