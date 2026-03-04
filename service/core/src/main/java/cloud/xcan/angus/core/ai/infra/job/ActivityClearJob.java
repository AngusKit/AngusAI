package cloud.xcan.angus.core.ai.infra.job;

import static cloud.xcan.angus.spec.utils.ObjectUtils.isNotEmpty;

import cloud.xcan.angus.api.manager.SettingManager;
import cloud.xcan.angus.core.ai.domain.team.activity.ActivityRepo;
import cloud.xcan.angus.core.job.JobTemplate;
import jakarta.annotation.Resource;
import java.util.List;
import java.util.concurrent.TimeUnit;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Slf4j
@Component
public class ActivityClearJob {

  private static final String LOCK_KEY = "ai:job:ActivityClearJob";

  private static final Long RESERVED_NUM = 200L;
  private static final Long COUNT = 2000L;

  @Resource
  private JobTemplate jobTemplate;

  @Resource
  private ActivityRepo activityRepo;

  /**
   * Only {@link ActivityClearJob#RESERVED_NUM} activities are reserved for each target
   */
  @Scheduled(fixedDelay = 5 * 60 * 1000, initialDelay = 60000)
  public void execute() {
    jobTemplate.execute(LOCK_KEY, 6, TimeUnit.MINUTES, () -> {
      long reservedNum = RESERVED_NUM;
      List<Long> targetIds = activityRepo.getResourceIdsHavingCount(reservedNum, COUNT);
      if (isNotEmpty(targetIds)) {
        for (Long targetId : targetIds) {
          try {
            // Submitted transaction by repo
            activityRepo.deleteByResourceIdAndCount(targetId, reservedNum);
          } catch (Exception e) {
            log.error("ActivityClearJob#inner execute fail:{}", e.getMessage());
          }
        }
      }
    });
  }

}
