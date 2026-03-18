package cloud.xcan.angus.core.ai.interfaces.sharing.facade.internal;

import static cloud.xcan.angus.core.ai.interfaces.sharing.facade.internal.assembler.ResourceSharingAssembler.toResourceAccessCheckVo;
import static cloud.xcan.angus.core.utils.CoreUtils.buildVoPageResult;

import cloud.xcan.angus.api.manager.UserManager;
import cloud.xcan.angus.api.commonlink.FullResourceType;
import cloud.xcan.angus.core.ai.application.cmd.activity.ActivityCmd;
import cloud.xcan.angus.core.ai.application.cmd.sharing.ResourceSharingCmd;
import cloud.xcan.angus.core.ai.domain.activity.ActivityActions;
import cloud.xcan.angus.core.ai.application.query.sharing.ResourceSharingQuery;
import cloud.xcan.angus.core.ai.domain.ResourceType;
import cloud.xcan.angus.core.ai.domain.StatisticsPeriod;
import cloud.xcan.angus.core.ai.domain.sharing.ResourceInfo;
import cloud.xcan.angus.core.ai.domain.sharing.ResourceSharing;
import cloud.xcan.angus.core.ai.domain.sharing.ResourceSharingMember;
import cloud.xcan.angus.core.ai.domain.sharing.SharePermission;
import cloud.xcan.angus.core.ai.interfaces.sharing.facade.ResourceSharingFacade;
import cloud.xcan.angus.core.ai.interfaces.sharing.facade.dto.ResourceSharingCreateDto;
import cloud.xcan.angus.core.ai.interfaces.sharing.facade.dto.ResourceSharingFindDto;
import cloud.xcan.angus.core.ai.interfaces.sharing.facade.dto.ResourceSharingToggleDto;
import cloud.xcan.angus.core.ai.interfaces.sharing.facade.dto.ResourceSharingUpdateDto;
import cloud.xcan.angus.core.ai.interfaces.sharing.facade.internal.assembler.ResourceSharingAssembler;
import cloud.xcan.angus.core.ai.interfaces.sharing.facade.vo.ResourceAccessCheckVo;
import cloud.xcan.angus.core.ai.interfaces.sharing.facade.vo.ResourceSharingDetailVo;
import cloud.xcan.angus.core.ai.interfaces.sharing.facade.vo.ResourceSharingListVo;
import cloud.xcan.angus.core.ai.interfaces.sharing.facade.vo.ResourceSharingStatisticsVo;
import cloud.xcan.angus.core.biz.NameJoin;
import cloud.xcan.angus.remote.PageResult;
import jakarta.annotation.Resource;
import java.util.List;
import java.util.Map;
import org.springframework.data.domain.Page;
import org.springframework.lang.Nullable;
import org.springframework.stereotype.Service;

/**
 * 资源共享门面实现
 */
@Service
public class ResourceSharingFacadeImpl implements ResourceSharingFacade {

  @Resource
  private ResourceSharingCmd resourceSharingCmd;

  @Resource
  private ResourceSharingQuery resourceSharingQuery;

  @Resource
  private UserManager userManager;

  @Resource
  private ActivityCmd activityCmd;

  @NameJoin
  @Override
  public ResourceSharingDetailVo create(ResourceSharingCreateDto dto) {
    ResourceSharing sharing = ResourceSharingAssembler.toCreateDomain(dto);
    ResourceSharing saved = resourceSharingCmd.create(sharing);
    activityCmd.recordActivity(FullResourceType.RESOURCE_SHARDING, saved.getId(),
        saved.getResourceName(), ActivityActions.ACTIVITY_SHARING_CREATED);
    return assembleResourceSharingDetailVo(sharing.getId(), saved);
  }

  @NameJoin
  @Override
  public ResourceSharingDetailVo update(Long id, ResourceSharingUpdateDto dto) {
    ResourceSharing saved = resourceSharingCmd.update(id, dto.getSharedWith(),
        dto.getPermission(), dto.getMemberIds());
    activityCmd.recordActivity(FullResourceType.RESOURCE_SHARDING, id, saved.getResourceName(),
        ActivityActions.ACTIVITY_SHARING_UPDATED);
    return assembleResourceSharingDetailVo(id, saved);
  }

  @NameJoin
  @Override
  public ResourceSharingDetailVo toggle(Long id, ResourceSharingToggleDto dto) {
    ResourceSharing saved = resourceSharingCmd.toggle(id, dto.getEnabled());
    activityCmd.recordActivity(FullResourceType.RESOURCE_SHARDING, id, saved.getResourceName(),
        ActivityActions.ACTIVITY_SHARING_TOGGLED);
    return assembleResourceSharingDetailVo(id, saved);
  }

  @Override
  public void delete(Long id) {
    ResourceSharing existing = resourceSharingQuery.findAndCheck(id);
    resourceSharingCmd.delete(id);
    activityCmd.recordActivity(FullResourceType.RESOURCE_SHARDING, id, existing.getResourceName(),
        ActivityActions.ACTIVITY_SHARING_DELETED);
  }

  @NameJoin
  @Override
  public ResourceSharingDetailVo getDetail(Long id) {
    ResourceSharing sharing = resourceSharingQuery.findAndCheck(id);
    return assembleResourceSharingDetailVo(id, sharing);
  }

  @NameJoin
  @Override
  public PageResult<ResourceSharingListVo> list(ResourceSharingFindDto dto) {
    Page<ResourceSharing> page = resourceSharingQuery.find(
        ResourceSharingAssembler.getSpecification(dto), dto.tranPage());
    return buildVoPageResult(page, ResourceSharingAssembler::toListVo);
  }

  @Override
  public ResourceAccessCheckVo checkAccess(Long resourceId, ResourceType resourceType) {
    Map<ResourceInfo, List<SharePermission>> resourcePermissions =
        resourceSharingQuery.getResourcePermissions(resourceId, resourceType);
    return toResourceAccessCheckVo(resourcePermissions);
  }

  @Override
  public Map<ResourceInfo, List<SharePermission>> getResourcePermissions(Long resourceId,
      ResourceType resourceType) {
    return resourceSharingQuery.getResourcePermissions(resourceId, resourceType);
  }

  @Override
  public ResourceSharingStatisticsVo getStatistics(Long id, @Nullable StatisticsPeriod period) {
    return null; // TODO
  }

  private ResourceSharingDetailVo assembleResourceSharingDetailVo(Long id,
      ResourceSharing sharing) {
    userManager.setUserNameAndAvatar(List.of(sharing), "ownerId", "ownerName", "ownerAvatar");

    List<ResourceSharingMember> members = resourceSharingQuery.getMembers(id);
    userManager.setUserNameAndAvatar(members, "userId", "userName", "userAvatar");
    return ResourceSharingAssembler.toDetailVo(sharing, members);
  }
}
