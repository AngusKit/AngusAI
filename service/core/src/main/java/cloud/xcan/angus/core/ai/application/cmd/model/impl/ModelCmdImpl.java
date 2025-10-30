package cloud.xcan.angus.core.ai.application.cmd.model.impl;

import cloud.xcan.angus.core.ai.application.cmd.model.ModelCmd;
import cloud.xcan.angus.core.ai.application.query.model.ModelQuery;
import cloud.xcan.angus.core.ai.domain.model.Model;
import cloud.xcan.angus.core.ai.domain.model.ModelRepo;
import cloud.xcan.angus.core.ai.domain.model.ModelStatus;
import cloud.xcan.angus.core.ai.infra.ai.model.ModelConfig;
import cloud.xcan.angus.core.biz.BizTemplate;
import cloud.xcan.angus.core.biz.cmd.CommCmd;
import cloud.xcan.angus.core.jpa.repository.BaseRepository;
import cloud.xcan.angus.remote.message.http.ResourceExisted;
import cloud.xcan.angus.remote.message.http.ResourceNotFound;
import cloud.xcan.angus.spec.annotations.DoInFuture;
import cloud.xcan.angus.spec.utils.ObjectUtils;
import jakarta.annotation.Resource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@DoInFuture("添加权限校验")
@Service
public class ModelCmdImpl extends CommCmd<Model, Long> implements ModelCmd {

  @Resource
  private ModelRepo modelRepo;

  @Resource
  private ModelQuery modelQuery;

  @Override
  @Transactional
  public Model create(Model model) {
    return new BizTemplate<Model>() {
      @Override
      protected void checkParams() {
        // 检查名称是否已存在
        if (modelQuery.existsByName(model.getName())) {
          throw ResourceExisted.of("模型名称「{0}」已存在", new Object[]{model.getName()});
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
        if (modelDb == null) {
          throw ResourceNotFound.of("模型不存在", new Object[]{});
        }

        // 检查名称是否已存在（排除当前模型）
        if (ObjectUtils.isNotEmpty(model.getName())
            && modelQuery.existsByNameAndIdNot(model.getName(), modelDb.getId())) {
          throw ResourceExisted.of("模型名称「{0}」已存在", new Object[]{model.getName()});
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
        if (modelDb == null) {
          throw ResourceNotFound.of("模型不存在", new Object[]{});
        }
      }

      @Override
      protected Model process() {
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
        if (modelDb == null) {
          throw ResourceNotFound.of("模型不存在", new Object[]{});
        }
      }

      @Override
      protected Model process() {
        modelDb.setStatus(ModelStatus.DEPLOYING);
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
        if (modelDb == null) {
          throw ResourceNotFound.of("模型不存在", new Object[]{});
        }
      }

      @Override
      protected Model process() {
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
        if (modelDb == null) {
          throw ResourceNotFound.of("模型不存在", new Object[]{});
        }
      }

      @Override
      protected Model process() {
        modelDb.setStatus(ModelStatus.DEPLOYING);
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
  public Model updateStatus(Long id, String status) {
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
        modelDb.setStatus(ModelStatus.valueOf(status));
        return modelRepo.save(modelDb);
      }
    }.execute();
  }

  @Override
  public void recordCall(Long id, Long tokens, Double cost, Long responseTime) {
    new BizTemplate<Void>() {
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
      protected Void process() {
        modelDb.setTotalCalls(modelDb.getTotalCalls() + 1);
        modelDb.setTotalTokens(modelDb.getTotalTokens() + tokens);
        modelDb.setTotalCost(modelDb.getTotalCost() + cost);
        modelDb.setAvgResponseTime((modelDb.getAvgResponseTime() + responseTime) / 2);
        modelRepo.save(modelDb);
        return null;
      }
    }.execute();
  }

  @Override
  public void updateMetrics(Long id, Double latency, Double throughput, Double accuracy) {
    new BizTemplate<Void>() {
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
      protected Void process() {
        modelDb.setLatencyMs(latency);
        modelDb.setThroughputRaw(throughput);
        modelDb.setAccuracyPercent(accuracy);
        modelRepo.save(modelDb);
        return null;
      }
    }.execute();
  }

  @Override
  public void batchStart(Long[] ids) {
    for (Long id : ids) {
      start(id);
    }
  }

  @Override
  public void batchStop(Long[] ids, Boolean graceful) {
    for (Long id : ids) {
      stop(id, graceful);
    }
  }

  @Override
  public void batchRestart(Long[] ids) {
    for (Long id : ids) {
      restart(id);
    }
  }

  @Override
  public void batchDelete(Long[] ids) {
    for (Long id : ids) {
      delete(id);
    }
  }

  @Override
  public Model importConfig(String configJson) {
    // TODO: 实现导入逻辑
    return new Model();
  }

  @Override
  public void cleanupResources(Long id) {
    // TODO: 实现资源清理逻辑
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
  public String exportConfig(Long id) {
    Model model = modelRepo.findById(id);
    if (model != null) {
      // TODO: 实现导出逻辑
      return "{}";
    }
    return null;
  }

  @Override
  public boolean validateConfig(ModelConfig config) {
    // TODO: 实现配置验证逻辑
    return true;
  }

  @Override
  public boolean checkDependencies(Long id) {
    // TODO: 实现依赖检查逻辑
    return true;
  }

  @Override
  protected BaseRepository<Model, Long> getRepository() {
    return modelRepo;
  }
}
