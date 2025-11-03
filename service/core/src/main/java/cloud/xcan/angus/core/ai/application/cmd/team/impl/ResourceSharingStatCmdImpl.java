package cloud.xcan.angus.core.ai.application.cmd.team.impl;

import static cloud.xcan.angus.core.ai.application.converter.ResourceSharingConverter.toStatDomain;

import cloud.xcan.angus.core.ai.application.cmd.team.ResourceSharingStatCmd;
import cloud.xcan.angus.core.ai.domain.ResourceType;
import cloud.xcan.angus.core.ai.domain.team.resourcesharing.ResourceSharingStat;
import cloud.xcan.angus.core.ai.domain.team.resourcesharing.ResourceSharingStatRepo;
import cloud.xcan.angus.core.ai.domain.team.resourcesharing.ShareAccessAction;
import cloud.xcan.angus.core.biz.cmd.CommCmd;
import cloud.xcan.angus.core.jpa.repository.BaseRepository;
import jakarta.annotation.Resource;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

@Service
public class ResourceSharingStatCmdImpl extends CommCmd<ResourceSharingStat, Long>
    implements ResourceSharingStatCmd {

  @Resource
  private ResourceSharingStatRepo resourceSharingStatRepo;

  @Transactional
  @Override
  public void updateStats(ResourceType type, Long id, ShareAccessAction accessAction) {
    ResourceSharingStat stat = resourceSharingStatRepo.findByResourceTypeAndResourceId(type, id);
    if (stat == null) {
      stat = toStatDomain(type, id, accessAction);
      insert(stat);
    } else {
      stat.setTotalAccesses(stat.getTotalAccesses() + 1);
      stat.setTotalViews(accessAction.isView() ? stat.getTotalViews() + 1 : 0L);
      stat.setTotalEdits(accessAction.isEdit() ? stat.getTotalEdits() + 1 : 0L);
      stat.setTotalDeletions(accessAction.isDelete() ? stat.getTotalDeletions() + 1 : 0L);
      resourceSharingStatRepo.save(stat);
    }
  }

  @Override
  protected BaseRepository<ResourceSharingStat, Long> getRepository() {
    return resourceSharingStatRepo;
  }
}
