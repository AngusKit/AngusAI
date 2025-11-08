package cloud.xcan.angus.core.ai.application.cmd.dataset.impl;

import static java.util.Objects.isNull;
import static java.util.Objects.nonNull;

import cloud.xcan.angus.core.ai.application.cmd.dataset.DatasetCmd;
import cloud.xcan.angus.core.ai.application.query.dataset.DatasetQuery;
import cloud.xcan.angus.core.ai.domain.Visibility;
import cloud.xcan.angus.core.ai.domain.dataset.Dataset;
import cloud.xcan.angus.core.ai.domain.dataset.DatasetRepo;
import cloud.xcan.angus.core.ai.domain.dataset.DatasourceConfig;
import cloud.xcan.angus.core.ai.infra.util.DatasourceUtils;
import cloud.xcan.angus.core.ai.infra.util.DatasourceUtils.ConnectionTestResult;
import cloud.xcan.angus.core.biz.BizTemplate;
import cloud.xcan.angus.core.biz.cmd.CommCmd;
import cloud.xcan.angus.core.jpa.repository.BaseRepository;
import cloud.xcan.angus.remote.message.ProtocolException;
import cloud.xcan.angus.remote.message.http.ResourceExisted;
import cloud.xcan.angus.spec.annotations.DoInFuture;
import cloud.xcan.angus.spec.utils.ObjectUtils;
import jakarta.annotation.Resource;
import java.util.Optional;
import org.springframework.lang.Nullable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@DoInFuture("添加权限校验")
@Service
public class DatasetCmdImpl extends CommCmd<Dataset, Long> implements DatasetCmd {

  @Resource
  private DatasetRepo datasetRepo;

  @Resource
  private DatasetQuery datasetQuery;

  @Override
  @Transactional
  public Dataset create(Dataset dataset) {
    return new BizTemplate<Dataset>() {
      @Override
      protected void checkParams() {
        // 检查名称是否已存在
        if (datasetQuery.existsByName(dataset.getName())) {
          throw ResourceExisted.of("数据集名称「{0}」已存在", new Object[]{dataset.getName()});
        }
      }

      @Override
      protected Dataset process() {
        insert0(dataset);
        return dataset;
      }
    }.execute();
  }

  @Override
  @Transactional
  public Dataset update(Dataset dataset) {
    return new BizTemplate<Dataset>() {
      Dataset datasetDb;

      @Override
      protected void checkParams() {
        // 获取数据集并验证是否存在
        datasetDb = datasetQuery.findAndCheck(dataset.getId());

        // 检查名称是否已存在（排除当前数据集）
        if (ObjectUtils.isNotEmpty(dataset.getName())
            && datasetQuery.existsByNameAndIdNot(dataset.getName(), datasetDb.getId())) {
          throw ResourceExisted.of("数据集名称「{0}」已存在", new Object[]{dataset.getName()});
        }
      }

      @Override
      protected Dataset process() {
        update(dataset, datasetDb);
        return datasetDb;
      }
    }.execute();
  }

  @Override
  @Transactional
  public Dataset modifyVisibility(Long id, Visibility visibility) {
    return new BizTemplate<Dataset>() {
      Dataset datasetDb;

      @Override
      protected void checkParams() {
        // 获取数据集并检查是否存在
        datasetDb = datasetQuery.findAndCheck(id);
      }

      @Override
      protected Dataset process() {
        // 更新可见性
        datasetDb.setVisibility(visibility);
        return datasetRepo.save(datasetDb);
      }
    }.execute();
  }

  @Override
  @Transactional
  public Dataset modifyDataSource(Long id, DatasourceConfig config) {
    return new BizTemplate<Dataset>() {
      Dataset datasetDb;

      @Override
      protected void checkParams() {
        // 获取数据集并检查是否存在
        datasetDb = datasetQuery.findAndCheck(id);

        // TODO 检查数据源配置有效性
      }

      @Override
      protected Dataset process() {
        // 更新配置
        datasetDb.setConfig(config);

        // TODO 拉去表信息到DatasetData表

        return datasetRepo.save(datasetDb);
      }
    }.execute();
  }

  @Override
  @Transactional
  public ConnectionTestResult testDatasourceConnection(
      @Nullable Long datasetId, @Nullable DatasourceConfig config) {
    return new BizTemplate<ConnectionTestResult>() {
      @Override
      protected void checkParams() {
        if (datasetId == null && (config == null || !config.isValid())) {
          throw ProtocolException.of("数据集ID和数据源配置必须指定其中一个参数");
        }
      }

      @Override
      protected ConnectionTestResult process() {
        DatasourceConfig checkConfig = nonNull(config) && config.isValid() ? config
            : datasetQuery.findAndCheck(datasetId).getConfig();
        if (isNull(checkConfig) || !checkConfig.isValid()) {
          throw ProtocolException.of("数据集的数据源未配置");
        }

        return DatasourceUtils.testConnection(checkConfig);
      }
    }.execute();
  }

  @Override
  @Transactional
  public void deleteDataSource(Long id) {
    new BizTemplate<Void>() {
      @Override
      protected Void process() {
        return new BizTemplate<Void>() {
          Dataset datasetDb;

          @Override
          protected void checkParams() {
            // 获取数据集并检查是否存在
            datasetDb = datasetQuery.findAndCheck(id);
          }

          @Override
          protected Void process() {
            // 更新配置
            datasetDb.setConfig(null);

            // TODO 删除数据源DatasetData记录

            datasetRepo.save(datasetDb);
            return null;
          }
        }.execute();
      }
    }.execute();
  }

  @Override
  @Transactional
  public void delete(Long id) {
    new BizTemplate<Void>() {
      @Override
      protected Void process() {
        datasetRepo.deleteById(id);
        return null;
      }
    }.execute();
  }

  @Override
  protected BaseRepository<Dataset, Long> getRepository() {
    return datasetRepo;
  }
}
