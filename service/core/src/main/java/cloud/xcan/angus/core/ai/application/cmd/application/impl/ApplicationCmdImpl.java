package cloud.xcan.angus.core.ai.application.cmd.application.impl;

import static cloud.xcan.angus.core.ai.application.converter.ApplicationConverter.toApplicationShare;
import static cloud.xcan.angus.core.ai.application.converter.ApplicationConverter.toDuplicateApplication;

import cloud.xcan.angus.core.ai.application.cmd.application.ApplicationCmd;
import cloud.xcan.angus.core.ai.application.query.application.ApplicationQuery;
import cloud.xcan.angus.core.ai.domain.application.Application;
import cloud.xcan.angus.core.ai.domain.application.ApplicationConfig;
import cloud.xcan.angus.core.ai.domain.application.ApplicationRepo;
import cloud.xcan.angus.core.ai.domain.application.ApplicationStatus;
import cloud.xcan.angus.core.biz.Biz;
import cloud.xcan.angus.core.biz.BizTemplate;
import cloud.xcan.angus.core.biz.cmd.CommCmd;
import cloud.xcan.angus.core.jpa.repository.BaseRepository;
import cloud.xcan.angus.core.utils.CoreUtils;
import cloud.xcan.angus.remote.message.http.ResourceExisted;
import cloud.xcan.angus.remote.message.http.ResourceNotFound;
import cloud.xcan.angus.spec.annotations.DoInFuture;
import cloud.xcan.angus.spec.utils.ObjectUtils;
import jakarta.annotation.Resource;
import org.apache.commons.lang3.RandomStringUtils;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

@DoInFuture("添加权限校验")
@Component
@Biz
public class ApplicationCmdImpl extends CommCmd<Application, Long> implements ApplicationCmd {

  @Resource
  private ApplicationRepo applicationRepo;

  @Resource
  private ApplicationQuery applicationQuery;

  @Override
  @Transactional
  public Application create(Application application) {
    return new BizTemplate<Application>() {
      @Override
      protected void checkParams() {
        // 检查名称是否已存在
        if (applicationQuery.existsByName(application.getName())) {
          throw ResourceExisted.of("应用名称「{0}」已存在", new Object[]{application.getName()});
        }
      }

      @Override
      protected Application process() {
        insert0(application);
        return application;
      }
    }.execute();
  }

  @Override
  @Transactional
  public Application duplicate(Long sourceId, String name) {
    return new BizTemplate<Application>() {
      Application sourceApplication;

      @Override
      protected void checkParams() {
        // 获取源应用并检查是否存在
        sourceApplication = applicationQuery.findById(sourceId);
        if (sourceApplication == null) {
          throw ResourceNotFound.of("应用不存在，应用可能已被删除", new Object[]{});
        }
      }

      @Override
      protected Application process() {
        // 复制源应用的配置
        String newName = StringUtils.hasText(name) ? name : sourceApplication.getName() + "-Copy";
        // 检查新名称是否已存在
        if (applicationQuery.existsByName(newName)) {
          newName = newName + "-" + RandomStringUtils.randomAlphabetic(5);
        }

        Application newApplication = toDuplicateApplication(newName, sourceApplication);
        return applicationRepo.save(newApplication);
      }
    }.execute();
  }

  @Override
  @Transactional
  public Application update(Application application) {
    return new BizTemplate<Application>() {
      Application applicationDb;

      @Override
      protected void checkParams() {
        // 获取应用并验证是否存在
        applicationDb = applicationQuery.findById(application.getId());
        if (applicationDb == null) {
          throw ResourceNotFound.of("应用不存在", new Object[]{});
        }

        // 检查名称是否已存在（排除当前应用）
        if (ObjectUtils.isNotEmpty(application.getName())
            && applicationQuery.existsByNameAndIdNot(application.getName(),
            applicationDb.getId())) {
          throw ResourceExisted.of("应用名称「{0}」已存在", new Object[]{application.getName()});
        }
      }

      @Override
      protected Application process() {
        CoreUtils.copyPropertiesIgnoreNull(application, applicationDb);
        return applicationRepo.save(applicationDb);
      }
    }.execute();
  }

  @Override
  @Transactional
  public Application updateConfig(Long id, ApplicationConfig config) {
    return new BizTemplate<Application>() {
      Application applicationDb;

      @Override
      protected void checkParams() {
        // 获取应用并验证是否存在
        applicationDb = applicationQuery.findById(id);
        if (applicationDb == null) {
          throw ResourceNotFound.of("应用不存在", new Object[]{});
        }
      }

      @Override
      protected Application process() {
        applicationDb.setConfig(config);
        return applicationRepo.save(applicationDb);
      }
    }.execute();
  }

  @Override
  public Application modifyStatus(Long id, ApplicationStatus status) {
    return new BizTemplate<Application>() {
      Application applicationDb;

      @Override
      protected void checkParams() {
        // 获取应用并验证是否存在
        applicationDb = applicationQuery.findById(id);
        if (applicationDb == null) {
          throw ResourceNotFound.of("应用不存在", new Object[]{});
        }
      }

      @Override
      protected Application process() {
        applicationDb.setStatus(status);
        return applicationRepo.save(applicationDb);
      }
    }.execute();
  }

  @Override
  @Transactional
  public Application share(Application application) {
    return new BizTemplate<Application>() {
      Application applicationDb;

      @Override
      protected void checkParams() {
        // 获取应用并验证是否存在
        applicationDb = applicationQuery.findById(application.getId());
        if (applicationDb == null) {
          throw ResourceNotFound.of("应用不存在", new Object[]{});
        }
      }

      @Override
      protected Application process() {
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
  protected BaseRepository<Application, Long> getRepository() {
    return applicationRepo;
  }
}
