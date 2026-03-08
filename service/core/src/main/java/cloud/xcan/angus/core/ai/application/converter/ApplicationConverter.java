package cloud.xcan.angus.core.ai.application.converter;

import cloud.xcan.angus.core.ai.domain.application.AIApplication;
import cloud.xcan.angus.core.ai.domain.application.ApplicationAgent;
import cloud.xcan.angus.core.ai.domain.application.ApplicationAgentRepo;
import cloud.xcan.angus.core.ai.domain.application.ApplicationConfig;
import cloud.xcan.angus.core.ai.domain.application.ApplicationShare;
import cloud.xcan.angus.core.ai.domain.application.ApplicationStatus;
import java.util.UUID;

public class ApplicationConverter {

  public static AIApplication toDuplicateApplication(String newName, AIApplication sourceApplication) {
    AIApplication newApplication = new AIApplication()
        .setName(newName)
        .setStatus(ApplicationStatus.DRAFT)
        .setApiCalls(0L)
        .setTotalTokens(0L)
        .setAvgResponseTime(0.0)
        .setSuccessRate(0.0)
        .setPublicAccess(false)
        .setEmbedEnabled(false)
        .setApiEnabled(false);
    newApplication.setIcon(sourceApplication.getIcon());
    newApplication.setDescription(sourceApplication.getDescription());
    newApplication.setCategory(sourceApplication.getCategory());
    newApplication.setConfig(sourceApplication.getConfig());
    // 智能体绑定关系由 ApplicationCmdImpl.duplicate 在保存新应用后根据 sourceBindings 写入
    return newApplication;
  }

  /**
   * 根据 config 更新应用绑定的智能体（先删后增）
   */
  public static void updateAssociatedIds(ApplicationConfig config, Long applicationId,
      ApplicationAgentRepo applicationAgentRepo) {
    if (config != null && config.getAgentIds() != null && !config.getAgentIds().isEmpty()) {
      Long defaultId = config.getDefaultAgentId() != null && config.getAgentIds().contains(config.getDefaultAgentId())
          ? config.getDefaultAgentId() : config.getAgentIds().get(0);
      applicationAgentRepo.deleteByApplicationId(applicationId);
      int sortOrder = 0;
      for (Long agentId : config.getAgentIds()) {
        ApplicationAgent binding = new ApplicationAgent()
            .setApplicationId(applicationId)
            .setAgentId(agentId)
            .setIsDefault(agentId.equals(defaultId))
            .setSortOrder(sortOrder++);
        applicationAgentRepo.save(binding);
      }
    }
  }

  public static void toApplicationShare(AIApplication application, AIApplication applicationDb) {
    String shareId = UUID.randomUUID().toString();
    applicationDb.setShareId(shareId);
    applicationDb.setShareExpiresAt(applicationDb.getShareExpiresAt());
    ApplicationShare share = new ApplicationShare();
    share.setPublicAccess(application.isSharePublicAccess());
    share.setAnonymousAccess(application.isShareAnonymousAccess());
    share.setPublicAccess(application.isSharePublicAccess());
    share.setShareId(shareId);
    share.setShareUrl(null); // TODO
    share.setQrCode(null); // TODO
    share.setExpiresAt(applicationDb.getShareExpiresAt());
    applicationDb.setShare(share);
  }
}
