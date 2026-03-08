package cloud.xcan.angus.core.ai.application.converter;

import cloud.xcan.angus.core.ai.domain.application.AIApplication;
import cloud.xcan.angus.core.ai.domain.application.ApplicationAgent;
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
    newApplication.setLanguage(sourceApplication.getLanguage());
    newApplication.setConfig(sourceApplication.getConfig());
    // 复制智能体绑定关系
    if (sourceApplication.getAgentBindings() != null && !sourceApplication.getAgentBindings().isEmpty()) {
      for (ApplicationAgent src : sourceApplication.getAgentBindings()) {
        ApplicationAgent binding = new ApplicationAgent()
            .setAgentId(src.getAgentId())
            .setIsDefault(src.getIsDefault())
            .setSortOrder(src.getSortOrder());
        binding.setApplication(newApplication);
        newApplication.getAgentBindings().add(binding);
      }
    }
    return newApplication;
  }

  public static void updateAssociatedIds(ApplicationConfig config, AIApplication applicationDb) {
    if (config != null && config.getAgentIds() != null && !config.getAgentIds().isEmpty()) {
      Long defaultId = config.getDefaultAgentId() != null && config.getAgentIds().contains(config.getDefaultAgentId())
          ? config.getDefaultAgentId() : config.getAgentIds().get(0);
      applicationDb.getAgentBindings().clear();
      int sortOrder = 0;
      for (Long agentId : config.getAgentIds()) {
        ApplicationAgent binding = new ApplicationAgent()
            .setAgentId(agentId)
            .setIsDefault(agentId.equals(defaultId))
            .setSortOrder(sortOrder++);
        binding.setApplication(applicationDb);
        applicationDb.getAgentBindings().add(binding);
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
