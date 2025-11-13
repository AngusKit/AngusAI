package cloud.xcan.angus.core.ai.application.converter;

import cloud.xcan.angus.core.ai.domain.application.Application;
import cloud.xcan.angus.core.ai.domain.application.ApplicationConfig;
import cloud.xcan.angus.core.ai.domain.application.ApplicationShare;
import cloud.xcan.angus.core.ai.domain.application.ApplicationStatus;
import java.util.List;
import java.util.UUID;

public class ApplicationConverter {

  public static Application toDuplicateApplication(String newName, Application sourceApplication) {
    Application newApplication = new Application()
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

    // 设置关联资源ID（冗余字段）
    newApplication.setModelId(sourceApplication.getModelId());
    newApplication.setKnowledgeBaseIds(sourceApplication.getKnowledgeBaseIds());
    newApplication.setDatasetIds(sourceApplication.getDatasetIds());
    newApplication.setApiCollectionIds(sourceApplication.getApiCollectionIds());
    newApplication.setWorkflowId(sourceApplication.getWorkflowId());
    return newApplication;
  }

  public static void updateAssociatedIds(ApplicationConfig config, Application applicationDb) {
    applicationDb.setModelId(config.getModel().getId());
    applicationDb.setKnowledgeBaseIds(config.getResources().getKnowledgeBaseIds());
    applicationDb.setDatasetIds(config.getResources().getDatasetIds());
    applicationDb.setApiCollectionIds(config.getResources().getApiCollectionIds());
    applicationDb.setWorkflowId(config.getResources().getWorkflowId());
  }

  public static void toApplicationShare(Application application, Application applicationDb) {
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
