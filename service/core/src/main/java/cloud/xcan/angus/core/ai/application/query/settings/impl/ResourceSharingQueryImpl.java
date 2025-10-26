package cloud.xcan.angus.core.ai.application.query.settings.impl;

import cloud.xcan.angus.core.ai.application.query.settings.ResourceSharingQuery;
import cloud.xcan.angus.core.ai.domain.settings.resourcesharing.SharePermission;
import cloud.xcan.angus.core.ai.domain.settings.resourcesharing.ResourceSharing;
import cloud.xcan.angus.core.ai.domain.settings.resourcesharing.ResourceSharingAccessLog;
import cloud.xcan.angus.core.ai.domain.settings.resourcesharing.ResourceSharingAccessLogRepo;
import cloud.xcan.angus.core.ai.domain.settings.resourcesharing.ResourceSharingMember;
import cloud.xcan.angus.core.ai.domain.settings.resourcesharing.ResourceSharingMemberRepo;
import cloud.xcan.angus.core.ai.domain.settings.resourcesharing.ResourceSharingRepo;
import cloud.xcan.angus.core.ai.domain.settings.resourcesharing.ResourceType;
import cloud.xcan.angus.core.ai.domain.settings.resourcesharing.ShareAction;
import cloud.xcan.angus.core.ai.domain.settings.resourcesharing.SharedWith;
import cloud.xcan.angus.core.ai.interfaces.settings.facade.dto.ResourceSharingFindDto;
import jakarta.annotation.Resource;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
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

  @PersistenceContext
  private EntityManager entityManager;

  @Override
  @Transactional(readOnly = true)
  public ResourceSharing findById(Long id) {
    return resourceSharingRepo.findById(id).orElse(null);
  }

  @Override
  @Transactional(readOnly = true)
  public ResourceSharing getDetail(Long id, Long userId) {
    ResourceSharing sharing = resourceSharingRepo.findById(id)
        .orElseThrow(() -> new IllegalArgumentException("共享不存在"));

    // 检查权限：所有者或成员
    if (!sharing.getOwnerId().equals(userId) && !hasAccess(sharing.getResourceId(),
        sharing.getResourceType(), userId)) {
      throw new IllegalArgumentException("无权限访问");
    }

    return sharing;
  }

  @Override
  @Transactional(readOnly = true)
  public Page<ResourceSharing> list(ResourceSharingFindDto dto, Long userId) {
    // 构建分页参数
    String orderSort = dto.getOrderSort() != null ? dto.getOrderSort().toString() : "desc";
    Sort sort = Sort.by(
        "desc".equalsIgnoreCase(orderSort) ? Sort.Direction.DESC : Sort.Direction.ASC,
        dto.getOrderBy() != null ? dto.getOrderBy() : dto.getDefaultOrderBy()
    );
    int pageNum = dto.getPageNo() != null ? dto.getPageNo() - 1 : 0;
    int pageSize = dto.getPageSize() != null ? dto.getPageSize() : 20;
    Pageable pageable = PageRequest.of(pageNum, pageSize, sort);

    // 构建查询条件
    Specification<ResourceSharing> spec = (root, query, cb) -> {
      var predicates = new java.util.ArrayList<jakarta.persistence.criteria.Predicate>();

      // 关键词搜索
      if (dto.getKeyword() != null && !dto.getKeyword().trim().isEmpty()) {
        predicates.add(cb.like(root.get("resourceName"), "%" + dto.getKeyword() + "%"));
      }

      // 资源类型筛选
      if (dto.getType() != null) {
        predicates.add(cb.equal(root.get("resourceType"), dto.getType()));
      }

      // 权限筛选
      if (dto.getPermission() != null) {
        predicates.add(cb.equal(root.get("permission"), dto.getPermission()));
      }

      // 共享范围筛选
      if (dto.getSharedWith() != null) {
        predicates.add(cb.equal(root.get("sharedWith"), dto.getSharedWith()));
      }

      // 我创建的
      if (Boolean.TRUE.equals(dto.getOwnedByMe())) {
        predicates.add(cb.equal(root.get("ownerId"), userId));
      }

      // 共享给我的
      if (Boolean.TRUE.equals(dto.getSharedToMe())) {
        // 子查询：查找用户是成员的共享ID
        var subquery = query.subquery(Long.class);
        var memberRoot = subquery.from(ResourceSharingMember.class);
        subquery.select(memberRoot.get("sharingId"));
        subquery.where(cb.equal(memberRoot.get("userId"), userId));

        predicates.add(root.get("id").in(subquery));
      }

      return cb.and(predicates.toArray(new jakarta.persistence.criteria.Predicate[0]));
    };

    return resourceSharingRepo.findAll(spec, pageable);
  }

  @Override
  @Transactional(readOnly = true)
  public ResourceSharing findByResource(Long resourceId, ResourceType resourceType) {
    return resourceSharingRepo.findByResourceIdAndResourceType(resourceId, resourceType)
        .orElse(null);
  }

  @Override
  @Transactional(readOnly = true)
  public boolean isResourceShared(Long resourceId, ResourceType resourceType) {
    return resourceSharingRepo.existsByResourceIdAndResourceType(resourceId, resourceType);
  }

  @Override
  @Transactional(readOnly = true)
  public List<ResourceSharingMember> getMembers(Long sharingId) {
    return resourceSharingMemberRepo.findBySharingIdOrderByCreatedDateDesc(sharingId);
  }

  @Override
  @Transactional(readOnly = true)
  public Long getMemberCount(Long sharingId) {
    return resourceSharingMemberRepo.countBySharingId(sharingId);
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

  @Override
  @Transactional(readOnly = true)
  public ResourceSharingMember getUserPermission(Long resourceId, ResourceType resourceType,
      Long userId) {
    ResourceSharing sharing = findByResource(resourceId, resourceType);
    if (sharing == null || !sharing.getEnabled()) {
      return null;
    }

    // 如果是所有者，返回管理权限
    if (sharing.getOwnerId().equals(userId)) {
      ResourceSharingMember member = new ResourceSharingMember();
      member.setSharingId(sharing.getId());
      member.setUserId(userId);
      member.setPermission(SharePermission.MANAGE);
      return member;
    }

    // 全体成员共享，返回默认权限
    if (sharing.getSharedWith() == SharedWith.ALL) {
      ResourceSharingMember member = new ResourceSharingMember();
      member.setSharingId(sharing.getId());
      member.setUserId(userId);
      member.setPermission(sharing.getPermission());
      return member;
    }

    // 查找成员记录
    return resourceSharingMemberRepo.findBySharingIdAndUserId(sharing.getId(), userId)
        .orElse(null);
  }

  @Override
  @Transactional(readOnly = true)
  public List<ResourceSharing> getUserSharedResources(Long userId) {
    return resourceSharingRepo.findByOwnerIdOrderByLastModifiedDateDesc(userId);
  }

  @Override
  @Transactional(readOnly = true)
  public List<ResourceSharingMember> getSharedToUser(Long userId) {
    return resourceSharingMemberRepo.findByUserIdOrderByLastAccessedDesc(userId);
  }

  @Override
  @Transactional(readOnly = true)
  public Page<ResourceSharingAccessLog> getAccessLogs(Long sharingId, int pageNo, int pageSize) {
    Pageable pageable = PageRequest.of(pageNo - 1, pageSize);
    return resourceSharingAccessLogRepo.findBySharingIdOrderByCreatedDateDesc(sharingId, pageable);
  }

  @Override
  @Transactional(readOnly = true)
  public Map<String, Object> getStatistics(Long sharingId, LocalDateTime startDate,
      LocalDateTime endDate) {
    Map<String, Object> stats = new HashMap<>();

    // 总访问次数
    Long totalViews = resourceSharingAccessLogRepo.countAccessesBySharingIdAndActionAndDateRange(
        sharingId, ShareAction.VIEW, startDate, endDate);

    // 总编辑次数
    Long totalEdits = resourceSharingAccessLogRepo.countAccessesBySharingIdAndActionAndDateRange(
        sharingId, ShareAction.EDIT, startDate, endDate);

    // 总下载次数
    Long totalDownloads = resourceSharingAccessLogRepo.countAccessesBySharingIdAndActionAndDateRange(
        sharingId, ShareAction.DOWNLOAD, startDate, endDate);

    // 独立访客数
    Long uniqueVisitors = getUniqueVisitors(sharingId);

    // 访问趋势
    List<Object[]> viewTrend = resourceSharingAccessLogRepo.getAccessTrendBySharingIdAndDateRange(
        sharingId, startDate, endDate);

    // Top访问者
    Pageable topLimit = PageRequest.of(0, 10);
    List<Object[]> topVisitors = resourceSharingAccessLogRepo.findTopVisitorsBySharingId(
        sharingId, topLimit);

    // 按小时统计
    List<Object[]> byHour = resourceSharingAccessLogRepo.getAccessDistributionByHour(sharingId);

    stats.put("totalViews", totalViews);
    stats.put("totalEdits", totalEdits);
    stats.put("totalDownloads", totalDownloads);
    stats.put("uniqueVisitors", uniqueVisitors);
    stats.put("viewTrend", viewTrend);
    stats.put("topVisitors", topVisitors);
    stats.put("byHour", byHour);

    return stats;
  }

  @Override
  @Transactional(readOnly = true)
  public Map<String, Object> getUserStatistics(Long userId) {
    Map<String, Object> stats = new HashMap<>();

    // 我创建的共享
    List<ResourceSharing> sharedByMe = getUserSharedResources(userId);
    Long totalSharedByMe = (long) sharedByMe.size();

    // 按类型统计
    Map<String, Long> byType = new HashMap<>();
    for (ResourceType type : ResourceType.values()) {
      Long count = resourceSharingRepo.countByOwnerIdAndResourceType(userId, type);
      byType.put(type.name(), count);
    }

    // 总访问次数和总成员数
    Long totalViews = sharedByMe.stream()
        .mapToLong(ResourceSharing::getTotalViews)
        .sum();
    Long totalMembers = sharedByMe.stream()
        .mapToLong(s -> getMemberCount(s.getId()))
        .sum();

    Map<String, Object> sharedByMeStats = new HashMap<>();
    sharedByMeStats.put("total", totalSharedByMe);
    sharedByMeStats.put("byType", byType);
    sharedByMeStats.put("totalViews", totalViews);
    sharedByMeStats.put("totalMembers", totalMembers);

    // 共享给我的
    List<ResourceSharingMember> sharedToMe = getSharedToUser(userId);
    Long totalSharedToMe = (long) sharedToMe.size();

    Map<String, Long> sharedToMeByType = new HashMap<>();
    for (ResourceSharingMember member : sharedToMe) {
      ResourceSharing sharing = findById(member.getSharingId());
      if (sharing != null) {
        String typeName = sharing.getResourceType().name();
        sharedToMeByType.merge(typeName, 1L, Long::sum);
      }
    }

    Map<String, Object> sharedToMeStats = new HashMap<>();
    sharedToMeStats.put("total", totalSharedToMe);
    sharedToMeStats.put("byType", sharedToMeByType);

    stats.put("sharedByMe", sharedByMeStats);
    stats.put("sharedToMe", sharedToMeStats);

    return stats;
  }

  @Override
  @Transactional(readOnly = true)
  public Long getUniqueVisitors(Long sharingId) {
    return resourceSharingMemberRepo.countUniqueVisitorsBySharingId(sharingId);
  }
}
