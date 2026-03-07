package cloud.xcan.angus.core.ai.application.cmd.model.impl;

import static cloud.xcan.angus.spec.utils.ObjectUtils.nullSafe;

import cloud.xcan.angus.core.ai.application.cmd.model.ModelCmd;
import cloud.xcan.angus.core.ai.application.query.model.ModelQuery;
import cloud.xcan.angus.core.ai.domain.model.Model;
import cloud.xcan.angus.core.ai.domain.model.ModelRepo;
import cloud.xcan.angus.core.biz.BizTemplate;
import cloud.xcan.angus.core.biz.cmd.CommCmd;
import cloud.xcan.angus.core.jpa.repository.BaseRepository;
import cloud.xcan.angus.remote.message.http.ResourceExisted;
import cloud.xcan.angus.remote.message.http.ResourceNotFound;
import cloud.xcan.angus.spec.utils.ObjectUtils;
import cloud.xcan.core.model.ModelConfigDefinition;
import jakarta.annotation.Resource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
          throw ResourceExisted.of("模型「{0}」已存在", new Object[]{model.getName()});
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
        if (ObjectUtils.isNotEmpty(model.getName())
            && modelQuery.existsByNameAndIdNot(actualName, modelDb.getId())) {
          throw ResourceExisted.of("模型「{0}」已存在", new Object[]{actualName});
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
  public Model updateConfig(Long id, ModelConfigDefinition config) {
    return new BizTemplate<Model>() {
      Model modelDb;

      @Override
      protected void checkParams() {
        // 获取模型并验证是否存在
        modelDb = modelQuery.findAndCheck(id);

        // 检查名称是否已存在（排除当前模型）
        if (ObjectUtils.isNotEmpty(config.getModelName())
            && modelQuery.existsByNameAndIdNot(config.getModelName(), modelDb.getId())) {
          throw ResourceExisted.of("模型「{0}」已存在", new Object[]{config.getModelName()});
        }
      }

      @Override
      protected Model process() {
        modelDb.setName(config.getModelName());
        modelDb.setType(config.getType());
        modelDb.setProvider(config.getProvider());
        modelDb.setConfig(config);
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
