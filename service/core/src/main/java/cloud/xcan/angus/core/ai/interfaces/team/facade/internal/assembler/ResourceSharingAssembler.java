package cloud.xcan.angus.core.ai.interfaces.team.facade.internal.assembler;

import cloud.xcan.angus.core.ai.domain.team.resourcesharing.ResourceSharing;
import cloud.xcan.angus.core.ai.domain.team.resourcesharing.ResourceSharingMember;
import cloud.xcan.angus.core.ai.interfaces.team.facade.dto.ResourceSharingCreateDto;
import cloud.xcan.angus.core.ai.interfaces.team.facade.dto.ResourceSharingFindDto;
import cloud.xcan.angus.core.ai.interfaces.team.facade.vo.ResourceSharingDetailVo;
import cloud.xcan.angus.core.ai.interfaces.team.facade.vo.ResourceSharingDetailVo.AccessStatisticsVo;
import cloud.xcan.angus.core.ai.interfaces.team.facade.vo.ResourceSharingListVo;
import cloud.xcan.angus.core.jpa.criteria.GenericSpecification;
import cloud.xcan.angus.core.jpa.criteria.SearchCriteriaBuilder;
import cloud.xcan.angus.remote.search.SearchCriteria;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

public class ResourceSharingAssembler {

  public static ResourceSharing toCreateDomain(ResourceSharingCreateDto dto) {
    ResourceSharing sharing = new ResourceSharing();
    sharing.setResourceId(dto.getResourceId());
    sharing.setResourceType(dto.getResourceType());
    sharing.setSharedWith(dto.getSharedWith());
    sharing.setPermission(dto.getPermission());
    sharing.setMemberIds(dto.getMemberIds());

    // 设置默认值
    sharing.setEnabled(true);
    sharing.setTotalViews(0L);
    sharing.setTotalEdits(0L);
    sharing.setUniqueVisitors(0L);
    return sharing;
  }

  public static ResourceSharingDetailVo toDetailVo(
      ResourceSharing sharing, List<ResourceSharingMember> members) {
    ResourceSharingDetailVo vo = new ResourceSharingDetailVo();
    vo.setId(sharing.getId());
    vo.setResourceId(sharing.getResourceId());
    vo.setResourceName(sharing.getResourceName());
    vo.setResourceType(sharing.getResourceType());
    vo.setEnabled(sharing.getEnabled());

    // 所有者信息
    ResourceSharingDetailVo.OwnerVo owner = new ResourceSharingDetailVo.OwnerVo();
    owner.setUserId(sharing.getOwnerId());
    vo.setOwner(owner);

    vo.setSharedWith(sharing.getSharedWith());
    vo.setPermission(sharing.getPermission());
    vo.setMemberCount((long) (members != null ? members.size() : 0));

    // 成员列表
    if (members != null && !members.isEmpty()) {
      List<ResourceSharingDetailVo.MemberVo> memberVos = members.stream()
          .map(ResourceSharingAssembler::toMemberVo)
          .collect(Collectors.toList());
      vo.setMembers(memberVos);
    } else {
      vo.setMembers(new ArrayList<>());
    }

    // 统计信息
    AccessStatisticsVo statistics = new AccessStatisticsVo();
    statistics.setTotalViews(sharing.getTotalViews());
    statistics.setTotalEdits(sharing.getTotalEdits());
    statistics.setUniqueVisitors(sharing.getUniqueVisitors());

    // 计算平均访问次数
    if (sharing.getUniqueVisitors() != null && sharing.getUniqueVisitors() > 0) {
      statistics.setAvgAccessesPerUser(
          (double) sharing.getTotalViews() / sharing.getUniqueVisitors()
      );
    } else {
      statistics.setAvgAccessesPerUser(0.0);
    }

    vo.setStatistics(statistics);

    // 设置审计信息
    vo.setTenantId(sharing.getTenantId());
    vo.setCreatedBy(sharing.getCreatedBy());
    vo.setCreatedDate(sharing.getCreatedDate());
    vo.setModifiedBy(sharing.getModifiedBy());
    vo.setModifiedDate(sharing.getModifiedDate());
    return vo;
  }

  public static ResourceSharingListVo toListVo(ResourceSharing sharing) {
    ResourceSharingListVo vo = new ResourceSharingListVo();
    vo.setId(sharing.getId());
    vo.setResourceId(sharing.getResourceId());
    vo.setResourceName(sharing.getResourceName());
    vo.setResourceType(sharing.getResourceType());
    vo.setEnabled(sharing.getEnabled());

    vo.setOwnerId(sharing.getOwnerId());
    vo.setSharedWith(sharing.getSharedWith());
    vo.setMemberCount(sharing.getMemberIds().size());
    vo.setPermission(sharing.getPermission());
    vo.setViews(sharing.getTotalViews());
    vo.setEdits(sharing.getTotalEdits());

    // 设置审计信息
    vo.setTenantId(sharing.getTenantId());
    vo.setCreatedBy(sharing.getCreatedBy());
    vo.setCreatedDate(sharing.getCreatedDate());
    vo.setModifiedBy(sharing.getModifiedBy());
    vo.setModifiedDate(sharing.getModifiedDate());
    return vo;
  }

  private static ResourceSharingDetailVo.MemberVo toMemberVo(ResourceSharingMember member) {
    ResourceSharingDetailVo.MemberVo vo = new ResourceSharingDetailVo.MemberVo();
    vo.setUserId(member.getUserId());
    vo.setPermission(member.getPermission());
    vo.setSharedAt(member.getCreatedDate());
    vo.setLastAccessed(member.getLastAccessed());
    vo.setAccessCount(member.getAccessCount());
    return vo;
  }

  public static GenericSpecification<ResourceSharing> getSpecification(ResourceSharingFindDto dto) {
    // Build the final filters
    Set<SearchCriteria> filters = new SearchCriteriaBuilder<>(dto)
        .rangeSearchFields("id", "createdDate", "modifiedDate")
        .orderByFields("id", "type", "permission", "sharedWith", "createdDate")
        .build();
    return new GenericSpecification<>(filters);
  }

}
