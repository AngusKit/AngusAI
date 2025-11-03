package cloud.xcan.angus.core.ai.interfaces.team.facade.internal;

import static cloud.xcan.angus.core.utils.CoreUtils.buildVoPageResult;

import cloud.xcan.angus.core.ai.application.cmd.team.ResourceSharingCmd;
import cloud.xcan.angus.core.ai.application.query.team.ResourceSharingQuery;
import cloud.xcan.angus.core.ai.domain.ResourceType;
import cloud.xcan.angus.core.ai.domain.StatisticsPeriod;
import cloud.xcan.angus.core.ai.domain.team.resourcesharing.ResourceSharing;
import cloud.xcan.angus.core.ai.domain.team.resourcesharing.ResourceSharingMember;
import cloud.xcan.angus.core.ai.interfaces.team.facade.ResourceSharingFacade;
import cloud.xcan.angus.core.ai.interfaces.team.facade.dto.ResourceSharingCreateDto;
import cloud.xcan.angus.core.ai.interfaces.team.facade.dto.ResourceSharingFindDto;
import cloud.xcan.angus.core.ai.interfaces.team.facade.dto.ResourceSharingToggleDto;
import cloud.xcan.angus.core.ai.interfaces.team.facade.dto.ResourceSharingUpdateDto;
import cloud.xcan.angus.core.ai.interfaces.team.facade.internal.assembler.ResourceSharingAssembler;
import cloud.xcan.angus.core.ai.interfaces.team.facade.vo.ResourceAccessCheckVo;
import cloud.xcan.angus.core.ai.interfaces.team.facade.vo.ResourceSharingDetailVo;
import cloud.xcan.angus.core.ai.interfaces.team.facade.vo.ResourceSharingListVo;
import cloud.xcan.angus.core.ai.interfaces.team.facade.vo.ResourceSharingStatisticsVo;
import cloud.xcan.angus.remote.PageResult;
import jakarta.annotation.Resource;
import java.util.List;
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

  @Override
  public ResourceSharingDetailVo create(ResourceSharingCreateDto dto) {
    ResourceSharing sharing = ResourceSharingAssembler.toCreateDomain(dto);
    ResourceSharing saved = resourceSharingCmd.create(sharing);
    List<ResourceSharingMember> members = resourceSharingQuery.getMembers(sharing.getId());
    return ResourceSharingAssembler.toDetailVo(saved, members);
  }

  @Override
  public ResourceSharingDetailVo update(Long id, ResourceSharingUpdateDto dto) {
    ResourceSharing saved = resourceSharingCmd.update(id, dto.getSharedWith(),
        dto.getPermission(), dto.getMemberIds());
    List<ResourceSharingMember> members = resourceSharingQuery.getMembers(id);
    return ResourceSharingAssembler.toDetailVo(saved, members);
  }

  @Override
  public ResourceSharingDetailVo toggle(Long id, ResourceSharingToggleDto dto) {
    ResourceSharing saved = resourceSharingCmd.toggle(id, dto.getEnabled());
    List<ResourceSharingMember> members = resourceSharingQuery.getMembers(id);
    return ResourceSharingAssembler.toDetailVo(saved, members);
  }

  @Override
  public void delete(Long id) {
    resourceSharingCmd.delete(id);
  }

  @Override
  public ResourceSharingDetailVo getDetail(Long id) {
    ResourceSharing sharing = resourceSharingQuery.findAndCheck(id);
    List<ResourceSharingMember> members = resourceSharingQuery.getMembers(id);
    return ResourceSharingAssembler.toDetailVo(sharing, members);
  }

  @Override
  public PageResult<ResourceSharingListVo> list(ResourceSharingFindDto dto) {
    Page<ResourceSharing> page = resourceSharingQuery.find(
        ResourceSharingAssembler.getSpecification(dto), dto.tranPage());
    return buildVoPageResult(page, ResourceSharingAssembler::toListVo);
  }

  @Override
  public ResourceAccessCheckVo checkAccess(Long resourceId, ResourceType resourceType) {
    ResourceAccessCheckVo vo = new ResourceAccessCheckVo();

    return vo;
  }

  @Override
  public ResourceSharingStatisticsVo getStatistics(Long id, @Nullable StatisticsPeriod period) {
    return null;
  }
}
