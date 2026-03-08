package cloud.xcan.angus.core.ai.application.cmd.application.impl;

import static cloud.xcan.angus.core.ai.application.converter.ApplicationConverter.toApplicationShare;
import static cloud.xcan.angus.core.ai.application.converter.ApplicationConverter.toDuplicateApplication;
import static cloud.xcan.angus.core.ai.application.converter.ApplicationConverter.updateAssociatedIds;
import static cloud.xcan.angus.spec.utils.ObjectUtils.isNull;

import cloud.xcan.angus.core.ai.application.cmd.application.ApplicationCmd;
import cloud.xcan.angus.core.ai.application.query.agent.AgentQuery;
import cloud.xcan.angus.core.ai.application.query.application.ApplicationQuery;
import cloud.xcan.angus.core.ai.domain.application.AIApplication;
import cloud.xcan.angus.core.ai.domain.application.ApplicationConfig;
import cloud.xcan.angus.core.ai.domain.application.AIApplicationRepo;
import cloud.xcan.angus.core.ai.domain.application.ApplicationStatus;
import cloud.xcan.angus.core.biz.BizTemplate;
import cloud.xcan.angus.core.biz.cmd.CommCmd;
import cloud.xcan.angus.core.jpa.repository.BaseRepository;
import cloud.xcan.angus.remote.message.ProtocolException;
import cloud.xcan.angus.remote.message.http.ResourceExisted;
import cloud.xcan.angus.spec.annotations.DoInFuture;
import cloud.xcan.angus.spec.utils.ObjectUtils;
import jakarta.annotation.Resource;
import org.apache.commons.lang3.RandomStringUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

@DoInFuture("添加权限校验")
@Service
public class ApplicationCmdImpl extends CommCmd<AIApplication, Long> implements ApplicationCmd {

  @Resource
  private AIApplicationRepo applicationRepo;

  @Resource
  private ApplicationQuery applicationQuery;

  @Resource
  private AgentQuery agentQuery;

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
        if (application.getAgentIds() == null || application.getAgentIds().isEmpty()) {
          throw ProtocolException.of("应用必须绑定至少一个智能体");
        }
        for (Long agentId : application.getAgentIds()) {
          agentQuery.findAndCheck(agentId);
        }
      }

      @Override
      protected AIApplication process() {
        insert0(application);
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
        return applicationRepo.save(newApplication);
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
        if (ObjectUtils.isNotEmpty(application.getName())
            && applicationQuery.existsByNameAndIdNot(application.getName(),
            applicationDb.getId())) {
          throw ResourceExisted.of("应用名称「{0}」已存在", new Object[]{application.getName()});
        }

        // 检查应用关联资源（模型、知识库、数据集、工作流）是否存在 TODO
      }

      @Override
      protected AIApplication process() {
        // 设置关联资源ID（冗余字段）
        updateAssociatedIds(application.getConfig(), applicationDb);

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
        updateAssociatedIds(config, applicationDb);
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
        if (isNull(applicationDb.getConfig())){
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
  public void delete(Long id) {
    new BizTemplate<Void>() {
      @Override
      protected Void process() {
        applicationRepo.deleteById(id);
        return null;
      }
    }.execute();
  }

  @Override
  protected BaseRepository<AIApplication, Long> getRepository() {
    return applicationRepo;
  }
}
