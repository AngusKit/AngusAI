package cloud.xcan.angus.core.ai.application.converter;

import cloud.xcan.angus.core.ai.domain.ResourceType;
import cloud.xcan.angus.core.ai.domain.team.resourcesharing.ResourceSharingStat;
import cloud.xcan.angus.core.ai.domain.team.resourcesharing.ShareAccessAction;

public class SharingStatConverter {

  public static ResourceSharingStat toDomain(ResourceType type, Long id,
      ShareAccessAction accessAction) {
    ResourceSharingStat stat = new ResourceSharingStat();
    stat.setResourceType(type);
    stat.setResourceId(id);
    stat.setTotalAccesses(1L);
    stat.setTotalViews(accessAction.isView() ? 1L : 0L);
    stat.setTotalEdits(accessAction.isEdit() ? 1L : 0L);
    stat.setTotalDeletions(accessAction.isDelete() ? 1L : 0L);
    return stat;
  }
}
