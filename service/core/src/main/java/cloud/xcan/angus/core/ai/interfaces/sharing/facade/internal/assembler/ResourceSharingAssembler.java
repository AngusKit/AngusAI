package cloud.xcan.angus.core.ai.interfaces.sharing.facade.internal.assembler;

import static cloud.xcan.angus.spec.principal.PrincipalContext.getUserFullName;
import static cloud.xcan.angus.spec.principal.PrincipalContext.getUserId;

import cloud.xcan.angus.core.ai.domain.sharing.ResourceInfo;
import cloud.xcan.angus.core.ai.domain.sharing.ResourceSharing;
import cloud.xcan.angus.core.ai.domain.sharing.ResourceSharingMember;
import cloud.xcan.angus.core.ai.domain.sharing.SharePermission;
import cloud.xcan.angus.core.ai.interfaces.sharing.facade.dto.ResourceSharingCreateDto;
import cloud.xcan.angus.core.ai.interfaces.sharing.facade.dto.ResourceSharingFindDto;
import cloud.xcan.angus.core.ai.interfaces.sharing.facade.vo.ResourceAccessCheckVo;
import cloud.xcan.angus.core.ai.interfaces.sharing.facade.vo.ResourceSharingDetailVo;
import cloud.xcan.angus.core.ai.interfaces.sharing.facade.vo.ResourceSharingListVo;
import cloud.xcan.angus.core.jpa.criteria.GenericSpecification;
import cloud.xcan.angus.core.jpa.criteria.SearchCriteriaBuilder;
import cloud.xcan.angus.remote.search.SearchCriteria;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
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

    // 设置审计信息
    vo.setTenantId(sharing.getTenantId());
    vo.setCreatedBy(sharing.getCreatedBy());
    vo.setCreatedDate(sharing.getCreatedDate());
    vo.setModifiedBy(sharing.getModifiedBy());
    vo.setModifiedDate(sharing.getModifiedDate());
    return vo;
  }

  public static ResourceAccessCheckVo toResourceAccessCheckVo(
      Map<ResourceInfo, List<SharePermission>> resourcePermissions) {
    ResourceAccessCheckVo vo = new ResourceAccessCheckVo();
    vo.setHasAccess(!resourcePermissions.isEmpty());
    vo.setResourcePermissions(
        resourcePermissions.isEmpty() ? null : resourcePermissions.values().iterator().next());
    vo.setUserId(getUserId());
    vo.setUserName(getUserFullName());
    return vo;
  }

  private static ResourceSharingDetailVo.MemberVo toMemberVo(ResourceSharingMember member) {
    ResourceSharingDetailVo.MemberVo vo = new ResourceSharingDetailVo.MemberVo();
    vo.setUserId(member.getUserId());
    vo.setUserName(member.getUserName());
    vo.setUserAvatar(member.getUserAvatar());
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
