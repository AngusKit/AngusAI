package cloud.xcan.angus.core.ai.application.cmd.model.impl;

import static cloud.xcan.angus.spec.utils.ObjectUtils.emptySafe;
import static cloud.xcan.angus.spec.utils.ObjectUtils.nullSafe;

import cloud.xcan.angus.core.ai.application.cmd.model.ModelCmd;
import cloud.xcan.angus.core.ai.application.query.model.ModelQuery;
import cloud.xcan.angus.core.ai.domain.model.Model;
import cloud.xcan.angus.core.ai.domain.model.ModelRepo;
import cloud.xcan.angus.core.ai.domain.model.ModelStatus;
import cloud.xcan.angus.core.ai.infra.ai.model.ModelConfig;
import cloud.xcan.angus.core.ai.infra.ai.model.ModelProvider;
import cloud.xcan.angus.core.biz.BizTemplate;
import cloud.xcan.angus.core.biz.cmd.CommCmd;
import cloud.xcan.angus.core.jpa.repository.BaseRepository;
import cloud.xcan.angus.remote.message.SysException;
import cloud.xcan.angus.remote.message.http.ResourceExisted;
import cloud.xcan.angus.remote.message.http.ResourceNotFound;
import cloud.xcan.angus.spec.annotations.DoInFuture;
import cloud.xcan.angus.spec.utils.ObjectUtils;
import jakarta.annotation.Resource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import cloud.xcan.angus.core.ai.infra.ai.model.LocalModelManager;

@DoInFuture("添加权限校验")
@Service
public class ModelCmdImpl extends CommCmd<Model, Long> implements ModelCmd {

  @Resource
  private ModelRepo modelRepo;

  @Resource
  private ModelQuery modelQuery;

  @Resource
  private LocalModelManager localModelManager;

  @Override
  @Transactional
  public Model create(Model model) {
    return new BizTemplate<Model>() {
      @Override
      protected void checkParams() {
        // 检查名称是否已存在
        if (modelQuery.existsByNameAndVersion(model.getName(), model.getVersion())) {
          throw ResourceExisted.of("模型「{0} {1}」已存在",
              new Object[]{model.getName(), model.getVersion()});
        }
      }

      @Override
      protected Model process() {
        insert0(model);
        return model;
      }
    }.execute();
  }

  @Override
  @Transactional
  public Model update(Model model) {
    return new BizTemplate<Model>() {
      Model modelDb;

      @Override
      protected void checkParams() {
        // 获取模型并验证是否存在
        modelDb = modelQuery.findAndCheck(model.getId());

        // 检查名称是否已存在（排除当前模型）
        String actualName = nullSafe(model.getName(), modelDb.getName());
        String actualVersion = nullSafe(model.getVersion(), modelDb.getVersion());
        if (ObjectUtils.isNotEmpty(model.getName())
            && modelQuery.existsByNameAndVersionAndIdNot(actualName, actualVersion,
            modelDb.getId())) {
          throw ResourceExisted.of("模型「{0} {1}」已存在",
              new Object[]{actualName, actualVersion});
        }
      }

      @Override
      protected Model process() {
        update(model, modelDb);
        return modelDb;
      }
    }.execute();
  }

  @Override
  @Transactional
  public Model updateConfig(Long id, ModelConfig config) {
    return new BizTemplate<Model>() {
      Model modelDb;

      @Override
      protected void checkParams() {
        // 获取模型并验证是否存在
        modelDb = modelQuery.findAndCheck(id);

        // 检查名称是否已存在（排除当前模型）
        if (ObjectUtils.isNotEmpty(config.getModelName())
            && modelQuery.existsByNameAndVersionAndIdNot(config.getModelName(),
            config.getVersion(), modelDb.getId())) {
          throw ResourceExisted.of("模型「{0} {1}」已存在",
              new Object[]{config.getModelName(), config.getVersion()});
        }
      }

      @Override
      protected Model process() {
        modelDb.setName(config.getModelName());
        modelDb.setDescription(emptySafe(config.getDescription(), modelDb.getDescription()));
        modelDb.setType(config.getModelType());
        modelDb.setProvider(config.getProvider());
        modelDb.setVersion(config.getVersion());
        modelDb.setConfig(config);
        return modelRepo.save(modelDb);
      }
    }.execute();
  }

  @Override
  public Model start(Long id) {
    return new BizTemplate<Model>() {
      Model modelDb;

      @Override
      protected void checkParams() {
        // 获取模型并验证是否存在
        modelDb = modelQuery.findAndCheck(id);
      }

      @Override
      protected Model process() {
        if (modelDb.getProvider().equals(ModelProvider.LOCAL)) {
          try {
            localModelManager.startLocalModel(modelDb.getId(), modelDb.getConfig());
          } catch (Exception e) {
            throw new SysException("启动本地模型失败: " + e.getMessage(), e);
          }
        }
        modelDb.setStatus(ModelStatus.RUNNING);
        return modelRepo.save(modelDb);
      }
    }.execute();
  }

  @Override
  public Model stop(Long id, Boolean graceful) {
    return new BizTemplate<Model>() {
      Model modelDb;

      @Override
      protected void checkParams() {
        // 获取模型并验证是否存在
        modelDb = modelQuery.findAndCheck(id);
      }

      @Override
      protected Model process() {
        if (modelDb.getProvider().equals(ModelProvider.LOCAL)) {
          try {
            localModelManager.stopLocalModel(modelDb.getId(), Boolean.TRUE.equals(graceful));
          } catch (Exception e) {
            throw new SysException("停止本地模型失败: " + e.getMessage(), e);
          }
        }
        modelDb.setStatus(ModelStatus.STOPPED);
        return modelRepo.save(modelDb);
      }
    }.execute();
  }

  @Override
  public Model restart(Long id) {
    return new BizTemplate<Model>() {
      Model modelDb;

      @Override
      protected void checkParams() {
        // 获取模型并验证是否存在
        modelDb = modelQuery.findAndCheck(id);
      }

      @Override
      protected Model process() {
        if (modelDb.getProvider().equals(ModelProvider.LOCAL)) {
          try {
            localModelManager.restartLocalModel(modelDb.getId(), modelDb.getConfig());
          } catch (Exception e) {
            throw new RuntimeException("重启本地模型失败: " + e.getMessage(), e);
          }
        }
        modelDb.setStatus(ModelStatus.RUNNING);
        return modelRepo.save(modelDb);
      }
    }.execute();
  }

  @Override
  public Model test(Long id, String testPrompt) {
    return new BizTemplate<Model>() {
      Model modelDb;

      @Override
      protected void checkParams() {
        // 获取模型并验证是否存在
        modelDb = modelQuery.findAndCheck(id);
        if (modelDb == null) {
          throw ResourceNotFound.of("模型不存在", new Object[]{});
        }
      }

      @Override
      protected Model process() {
        // TODO: 实现测试逻辑
        return modelDb;
      }
    }.execute();
  }

  @Override
  @Transactional
  public void delete(Long id) {
    new BizTemplate<Void>() {
      @Override
      protected Void process() {
        modelRepo.deleteById(id);
        return null;
      }
    }.execute();
  }

  @Override
  protected BaseRepository<Model, Long> getRepository() {
    return modelRepo;
  }
}
