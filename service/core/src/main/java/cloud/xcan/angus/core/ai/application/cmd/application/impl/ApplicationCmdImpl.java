package cloud.xcan.angus.core.ai.application.cmd.application.impl;

import static cloud.xcan.angus.core.ai.application.converter.ApplicationConverter.toApplicationShare;
import static cloud.xcan.angus.core.ai.application.converter.ApplicationConverter.toDuplicateApplication;
import static cloud.xcan.angus.spec.utils.ObjectUtils.isNull;

import static cloud.xcan.angus.spec.principal.PrincipalContext.getUserId;

import cloud.xcan.angus.core.ai.application.cmd.application.ApplicationCmd;
import cloud.xcan.angus.core.ai.application.query.agent.AgentQuery;
import cloud.xcan.angus.core.ai.application.query.application.ApplicationQuery;
import cloud.xcan.angus.core.ai.domain.application.AIApplication;
import cloud.xcan.angus.core.ai.domain.application.AIApplicationRepo;
import cloud.xcan.angus.core.ai.domain.application.ApplicationAgent;
import cloud.xcan.angus.core.ai.domain.application.ApplicationStar;
import cloud.xcan.angus.core.ai.domain.application.ApplicationStarRepo;
import cloud.xcan.angus.core.ai.domain.application.ApplicationAgentRepo;
import cloud.xcan.angus.core.ai.domain.application.ApplicationConfig;
import cloud.xcan.angus.core.ai.domain.application.ApplicationStatus;
import cloud.xcan.angus.core.biz.BizTemplate;
import cloud.xcan.angus.core.biz.cmd.CommCmd;
import cloud.xcan.angus.core.jpa.repository.BaseRepository;
import cloud.xcan.angus.remote.message.ProtocolException;
import cloud.xcan.angus.remote.message.http.ResourceExisted;
import cloud.xcan.angus.spec.utils.ObjectUtils;
import jakarta.annotation.Resource;
import org.apache.commons.lang3.RandomStringUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

@Service
public class ApplicationCmdImpl extends CommCmd<AIApplication, Long> implements ApplicationCmd {

  @Resource
  private AIApplicationRepo applicationRepo;

  @Resource
  private ApplicationAgentRepo applicationAgentRepo;

  @Resource
  private ApplicationQuery applicationQuery;

  @Resource
  private AgentQuery agentQuery;

  @Resource
  private ApplicationStarRepo applicationStarRepo;

  @Override
  @Transactional
  public AIApplication create(AIApplication application) {
    return new BizTemplate<AIApplication>() {
      @Override
      protected void checkParams() {
        // 检查名称是否已存在
        if (applicationQuery.existsByName(application.getName())) {
          throw ResourceExisted.of("应用名称「{0}」已存在", new Object[]{application.getName()});
        }
        // 检查绑定的智能体是否存在（至少一个，且全部有效）
        if (application.getConfig() == null || application.getConfig().getAgentIds() == null
            || application.getConfig().getAgentIds().isEmpty()) {
          throw ProtocolException.of("应用必须绑定至少一个智能体");
        }
        for (Long agentId : application.getConfig().getAgentIds()) {
          agentQuery.findAndCheck(agentId);
        }
      }

      @Override
      protected AIApplication process() {
        insert0(application);

        // 保存智能体绑定（以 applicationId 关联）
        Long defaultId = application.getConfig().getDefaultAgentId() != null
            && application.getConfig().getAgentIds()
            .contains(application.getConfig().getDefaultAgentId())
            ? application.getConfig().getDefaultAgentId()
            : application.getConfig().getAgentIds().get(0);
        int sortOrder = 0;
        for (Long agentId : application.getConfig().getAgentIds()) {
          ApplicationAgent binding = new ApplicationAgent()
              .setId(uidGenerator.getUID())
              .setApplicationId(application.getId())
              .setAgentId(agentId)
              .setIsDefault(agentId.equals(defaultId))
              .setSortOrder(sortOrder++);
          applicationAgentRepo.save(binding);
        }
        return application;
      }
    }.execute();
  }

  @Override
  @Transactional
  public AIApplication duplicate(Long sourceId, String name) {
    return new BizTemplate<AIApplication>() {
      AIApplication applicationDb;

      @Override
      protected void checkParams() {
        // 获取源应用并检查是否存在
        applicationDb = applicationQuery.findAndCheck(sourceId);
      }

      @Override
      protected AIApplication process() {
        // 复制源应用的配置
        String newName = StringUtils.hasText(name) ? name : applicationDb.getName() + "-Copy";
        // 检查新名称是否已存在
        if (applicationQuery.existsByName(newName)) {
          newName = newName + "-" + RandomStringUtils.randomAlphabetic(5);
        }

        AIApplication newApplication = toDuplicateApplication(newName, applicationDb);
        AIApplication saved = applicationRepo.save(newApplication);
        // 复制智能体绑定
        for (ApplicationAgent src : applicationAgentRepo.findByApplicationIdOrderBySortOrderAsc(
            sourceId)) {
          ApplicationAgent binding = new ApplicationAgent()
              .setId(uidGenerator.getUID())
              .setApplicationId(saved.getId())
              .setAgentId(src.getAgentId())
              .setIsDefault(src.getIsDefault())
              .setSortOrder(src.getSortOrder());
          applicationAgentRepo.save(binding);
        }
        return saved;
      }
    }.execute();
  }

  @Override
  @Transactional
  public AIApplication update(AIApplication application) {
    return new BizTemplate<AIApplication>() {
      AIApplication applicationDb;

      @Override
      protected void checkParams() {
        // 获取源应用并检查是否存在
        applicationDb = applicationQuery.findAndCheck(application.getId());

        // 检查名称是否已存在（排除当前应用）
        if (ObjectUtils.isNotEmpty(application.getName()) &&
            applicationQuery.existsByNameAndIdNot(application.getName(), applicationDb.getId())) {
          throw ResourceExisted.of("应用名称「{0}」已存在", new Object[]{application.getName()});
        }

        // 检查应用关联资源（模型、知识库、数据集、工作流）是否存在 TODO
      }

      @Override
      protected AIApplication process() {
        // 设置关联资源ID（冗余字段）
        updateAssociatedIds(application.getConfig(), applicationDb.getId());

        update(application, applicationDb);
        return applicationDb;
      }
    }.execute();
  }

  @Override
  @Transactional
  public AIApplication updateConfig(Long id, ApplicationConfig config) {
    return new BizTemplate<AIApplication>() {
      AIApplication applicationDb;

      @Override
      protected void checkParams() {
        // 获取源应用并检查是否存在
        applicationDb = applicationQuery.findAndCheck(id);

        // 检查应用关联资源（模型、知识库、数据集、接口集、工作流）是否存在 TODO
      }

      @Override
      protected AIApplication process() {
        // TODO 如果信息应用模型被修改，同步更新已有会话默认模型

        // 更新配置
        applicationDb.setConfig(config);

        // 设置关联资源ID（冗余字段）
        updateAssociatedIds(config, applicationDb.getId());
        return applicationRepo.save(applicationDb);
      }
    }.execute();
  }

  @Override
  public AIApplication modifyStatus(Long id, ApplicationStatus status) {
    return new BizTemplate<AIApplication>() {
      AIApplication applicationDb;

      @Override
      protected void checkParams() {
        // 获取源应用并检查是否存在
        applicationDb = applicationQuery.findAndCheck(id);

        // 检查是否已经正确配置应用
        if (isNull(applicationDb.getConfig())) {
          throw ProtocolException.of("应用未配置，请先配置应用");
        }
      }

      @Override
      protected AIApplication process() {
        applicationDb.setStatus(status);
        return applicationRepo.save(applicationDb);
      }
    }.execute();
  }

  @Override
  @Transactional
  public AIApplication share(AIApplication application) {
    return new BizTemplate<AIApplication>() {
      AIApplication applicationDb;

      @Override
      protected void checkParams() {
        // 获取源应用并检查是否存在
        applicationDb = applicationQuery.findAndCheck(application.getId());
      }

      @Override
      protected AIApplication process() {
        toApplicationShare(application, applicationDb);
        return applicationRepo.save(applicationDb);
      }
    }.execute();
  }

  @Override
  @Transactional
  public AIApplication star(Long id, Boolean isStarred) {
    return new BizTemplate<AIApplication>() {
      AIApplication applicationDb;

      @Override
      protected void checkParams() {
        applicationDb = applicationQuery.findAndCheck(id);
      }

      @Override
      protected AIApplication process() {
        Long userId = getUserId();
        if (Boolean.TRUE.equals(isStarred)) {
          if (!applicationStarRepo.existsByApplicationIdAndUserId(id, userId)) {
            ApplicationStar star = new ApplicationStar()
                .setId(uidGenerator.getUID())
                .setApplicationId(id)
                .setUserId(userId);
            applicationStarRepo.save(star);
          }
        } else {
          applicationStarRepo.deleteByApplicationIdAndUserId(id, userId);
        }
        return applicationDb;
      }
    }.execute();
  }

  @Override
  @Transactional
  public void delete(Long id) {
    new BizTemplate<Void>() {
      @Override
      protected Void process() {
        applicationAgentRepo.deleteByApplicationId(id);
        applicationStarRepo.deleteByApplicationIdAndUserId(id, getUserId());
        applicationRepo.deleteById(id);
        return null;
      }
    }.execute();
  }

  /**
   * 根据 config 更新应用绑定的智能体（先删后增）
   */
  public void updateAssociatedIds(ApplicationConfig config, Long applicationId) {
    if (config != null && config.getAgentIds() != null && !config.getAgentIds().isEmpty()) {
      Long defaultId = config.getDefaultAgentId() != null
          && config.getAgentIds().contains(config.getDefaultAgentId())
          ? config.getDefaultAgentId() : config.getAgentIds().get(0);
      applicationAgentRepo.deleteByApplicationId(applicationId);
      int sortOrder = 0;
      for (Long agentId : config.getAgentIds()) {
        ApplicationAgent binding = new ApplicationAgent()
            .setId(uidGenerator.getUID())
            .setApplicationId(applicationId)
            .setAgentId(agentId)
            .setIsDefault(agentId.equals(defaultId))
            .setSortOrder(sortOrder++);
        applicationAgentRepo.save(binding);
      }
    }
  }

  @Override
  protected BaseRepository<AIApplication, Long> getRepository() {
    return applicationRepo;
  }
}
