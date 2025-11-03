package cloud.xcan.angus.core.ai.application.cmd.team.impl;


import static cloud.xcan.angus.core.utils.PrincipalContextUtils.isUserAction;
import static cloud.xcan.angus.spec.utils.ObjectUtils.isEmpty;

import cloud.xcan.angus.api.commonlink.FullResourceType;
import cloud.xcan.angus.core.ai.application.cmd.team.ActivityCmd;
import cloud.xcan.angus.core.ai.domain.team.activity.Activity;
import cloud.xcan.angus.core.ai.domain.team.activity.ActivityRepo;
import cloud.xcan.angus.core.biz.cmd.CommCmd;
import cloud.xcan.angus.core.jpa.repository.BaseRepository;
import java.util.Collection;
import java.util.List;
import java.util.Objects;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Command implementation for Activity entity. Handles add, batch add, and delete operations with
 * transaction management.
 */
@Service
public class ActivityCmdImpl extends CommCmd<Activity, Long> implements ActivityCmd {

  // Inject ActivityRepo for database operations. 'required = false' allows for optional injection.
  @Autowired(required = false)
  private ActivityRepo activityRepo;

  /**
   * Add a single Activity entity. Only executes if the action is performed by a user and the
   * activity is not null.
   */
  @Transactional(rollbackFor = Exception.class)
  @Override
  public void add(Activity activity) {
    if (!isUserAction() || Objects.isNull(activity)) {
      return;
    }
    insert0(activity);
  }

  /**
   * Add a collection of Activity entities in batch. Only executes if the action is performed by a
   * user and the collection is not empty.
   */
  @Transactional(rollbackFor = Exception.class)
  @Override
  public void addAll(Collection<Activity> activities) {
    if (!isUserAction() || isEmpty(activities)) {
      return;
    }
    batchInsert0(activities);
  }

  /**
   * Delete activities by target type and target IDs.
   *
   * @param targetType the type of the target
   * @param targetIds  the list of target IDs
   */
  @Transactional(rollbackFor = Exception.class)
  @Override
  public void deleteByTarget(FullResourceType targetType, List<Long> targetIds) {
    activityRepo.deleteByResourceIdAndResourceType(targetIds, targetType.getValue());
  }

  /**
   * Get the repository for Activity entity.
   *
   * @return the ActivityRepo instance
   */
  @Override
  protected BaseRepository<Activity, Long> getRepository() {
    return this.activityRepo;
  }
}




