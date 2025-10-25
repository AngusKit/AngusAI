package cloud.xcan.angus.core.ai.application.cmd.dataset.impl;

import cloud.xcan.angus.core.ai.application.cmd.dataset.DatasetCmd;
import cloud.xcan.angus.core.ai.application.query.dataset.DatasetQuery;
import cloud.xcan.angus.core.ai.domain.dataset.Dataset;
import cloud.xcan.angus.core.ai.domain.dataset.DatasetConfig;
import cloud.xcan.angus.core.ai.domain.dataset.DatasetRepo;
import cloud.xcan.angus.core.ai.domain.dataset.DatasetStatus;
import cloud.xcan.angus.core.ai.interfaces.dataset.facade.dto.DataUploadDto;
import cloud.xcan.angus.core.ai.interfaces.dataset.facade.dto.BatchDeleteDto;
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
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@DoInFuture("添加权限校验")
@Component
@Biz
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
        datasetDb = datasetQuery.findById(dataset.getId());
        if (datasetDb == null) {
          throw ResourceNotFound.of("数据集不存在", new Object[]{});
        }

        // 检查名称是否已存在（排除当前数据集）
        if (ObjectUtils.isNotEmpty(dataset.getName())
            && datasetQuery.existsByNameAndIdNot(dataset.getName(), datasetDb.getId())) {
          throw ResourceExisted.of("数据集名称「{0}」已存在", new Object[]{dataset.getName()});
        }
      }

      @Override
      protected Dataset process() {
        CoreUtils.copyPropertiesIgnoreNull(dataset, datasetDb);
        return datasetRepo.save(datasetDb);
      }
    }.execute();
  }

  @Override
  @Transactional
  public Dataset updateConfig(Long id, DatasetConfig config) {
    return new BizTemplate<Dataset>() {
      Dataset datasetDb;

      @Override
      protected void checkParams() {
        // 获取数据集并验证是否存在
        datasetDb = datasetQuery.findById(id);
        if (datasetDb == null) {
          throw ResourceNotFound.of("数据集不存在", new Object[]{});
        }
      }

      @Override
      protected Dataset process() {
        datasetDb.setConfig(config);
        return datasetRepo.save(datasetDb);
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
  public Dataset uploadData(Long id, DataUploadDto dto) {
    return new BizTemplate<Dataset>() {
      Dataset datasetDb;

      @Override
      protected void checkParams() {
        // 获取数据集并验证是否存在
        datasetDb = datasetQuery.findById(id);
        if (datasetDb == null) {
          throw ResourceNotFound.of("数据集不存在", new Object[]{});
        }
      }

      @Override
      protected Dataset process() {
        // TODO: 实现数据上传逻辑
        return datasetDb;
      }
    }.execute();
  }

  @Override
  public String exportData(Long id, String format, Long sourceId) {
    return new BizTemplate<String>() {
      Dataset datasetDb;

      @Override
      protected void checkParams() {
        // 获取数据集并验证是否存在
        datasetDb = datasetQuery.findById(id);
        if (datasetDb == null) {
          throw ResourceNotFound.of("数据集不存在", new Object[]{});
        }
      }

      @Override
      protected String process() {
        // TODO: 实现数据导出逻辑
        return "export_url";
      }
    }.execute();
  }

  @Override
  public Dataset batchDeleteData(Long id, BatchDeleteDto dto) {
    return new BizTemplate<Dataset>() {
      Dataset datasetDb;

      @Override
      protected void checkParams() {
        // 获取数据集并验证是否存在
        datasetDb = datasetQuery.findById(id);
        if (datasetDb == null) {
          throw ResourceNotFound.of("数据集不存在", new Object[]{});
        }
      }

      @Override
      protected Dataset process() {
        // TODO: 实现批量删除数据逻辑
        return datasetDb;
      }
    }.execute();
  }

  @Override
  public boolean validateConfig(DatasetConfig config) {
    return new BizTemplate<Boolean>() {
      @Override
      protected Boolean process() {
        // TODO: 实现配置验证逻辑
        return true;
      }
    }.execute();
  }

  @Override
  public boolean checkDependencies(Long id) {
    return new BizTemplate<Boolean>() {
      @Override
      protected Boolean process() {
        // TODO: 实现依赖检查逻辑
        return true;
      }
    }.execute();
  }

  @Override
  public void cleanupResources(Long id) {
    new BizTemplate<Void>() {
      @Override
      protected Void process() {
        // TODO: 实现资源清理逻辑
        return null;
      }
    }.execute();
  }

  @Override
  public Dataset updateStatus(Long id, String status) {
    return new BizTemplate<Dataset>() {
      Dataset datasetDb;

      @Override
      protected void checkParams() {
        // 获取数据集并验证是否存在
        datasetDb = datasetQuery.findById(id);
        if (datasetDb == null) {
          throw ResourceNotFound.of("数据集不存在", new Object[]{});
        }
      }

      @Override
      protected Dataset process() {
        datasetDb.setStatus(DatasetStatus.valueOf(status));
        return datasetRepo.save(datasetDb);
      }
    }.execute();
  }

  @Override
  public void recordAccess(Long id) {
    new BizTemplate<Void>() {
      Dataset datasetDb;

      @Override
      protected void checkParams() {
        // 获取数据集并验证是否存在
        datasetDb = datasetQuery.findById(id);
        if (datasetDb == null) {
          throw ResourceNotFound.of("数据集不存在", new Object[]{});
        }
      }

      @Override
      protected Void process() {
        datasetDb.setAccessCount(datasetDb.getAccessCount() + 1);
        datasetDb.setLastAccessTime(System.currentTimeMillis());
        datasetRepo.save(datasetDb);
        return null;
      }
    }.execute();
  }

  @Override
  public void updateStatistics(Long id, Long recordCount, Long totalSize) {
    new BizTemplate<Void>() {
      Dataset datasetDb;

      @Override
      protected void checkParams() {
        // 获取数据集并验证是否存在
        datasetDb = datasetQuery.findById(id);
        if (datasetDb == null) {
          throw ResourceNotFound.of("数据集不存在", new Object[]{});
        }
      }

      @Override
      protected Void process() {
        datasetDb.setTotalRecords(recordCount);
        datasetDb.setTotalSize(totalSize);
        datasetDb.setLastUpdateTime(System.currentTimeMillis());
        datasetRepo.save(datasetDb);
        return null;
      }
    }.execute();
  }

  @Override
  public Dataset backupDataset(Long id) {
    return new BizTemplate<Dataset>() {
      Dataset datasetDb;

      @Override
      protected void checkParams() {
        // 获取数据集并验证是否存在
        datasetDb = datasetQuery.findById(id);
        if (datasetDb == null) {
          throw ResourceNotFound.of("数据集不存在", new Object[]{});
        }
      }

      @Override
      protected Dataset process() {
        // TODO: 实现数据集备份逻辑
        return datasetDb;
      }
    }.execute();
  }

  @Override
  public Dataset restoreDataset(Long id, String backupId) {
    return new BizTemplate<Dataset>() {
      Dataset datasetDb;

      @Override
      protected void checkParams() {
        // 获取数据集并验证是否存在
        datasetDb = datasetQuery.findById(id);
        if (datasetDb == null) {
          throw ResourceNotFound.of("数据集不存在", new Object[]{});
        }
      }

      @Override
      protected Dataset process() {
        // TODO: 实现数据集恢复逻辑
        return datasetDb;
      }
    }.execute();
  }

  @Override
  public Dataset duplicateDataset(Long id, String name) {
    return new BizTemplate<Dataset>() {
      Dataset sourceDataset;

      @Override
      protected void checkParams() {
        // 获取源数据集并检查是否存在
        sourceDataset = datasetQuery.findById(id);
        if (sourceDataset == null) {
          throw ResourceNotFound.of("数据集不存在", new Object[]{});
        }
      }

      @Override
      protected Dataset process() {
        // TODO: 实现数据集复制逻辑
        return sourceDataset;
      }
    }.execute();
  }

  @Override
  public void batchOperation(Long[] ids, String operation) {
    new BizTemplate<Void>() {
      @Override
      protected Void process() {
        // TODO: 实现批量操作逻辑
        return null;
      }
    }.execute();
  }

  @Override
  public Dataset archiveDataset(Long id) {
    return new BizTemplate<Dataset>() {
      Dataset datasetDb;

      @Override
      protected void checkParams() {
        // 获取数据集并验证是否存在
        datasetDb = datasetQuery.findById(id);
        if (datasetDb == null) {
          throw ResourceNotFound.of("数据集不存在", new Object[]{});
        }
      }

      @Override
      protected Dataset process() {
        datasetDb.setArchived(true);
        datasetDb.setArchivedAt(System.currentTimeMillis());
        return datasetRepo.save(datasetDb);
      }
    }.execute();
  }

  @Override
  public Dataset unarchiveDataset(Long id) {
    return new BizTemplate<Dataset>() {
      Dataset datasetDb;

      @Override
      protected void checkParams() {
        // 获取数据集并验证是否存在
        datasetDb = datasetQuery.findById(id);
        if (datasetDb == null) {
          throw ResourceNotFound.of("数据集不存在", new Object[]{});
        }
      }

      @Override
      protected Dataset process() {
        datasetDb.setArchived(false);
        datasetDb.setArchivedAt(null);
        return datasetRepo.save(datasetDb);
      }
    }.execute();
  }

  @Override
  protected BaseRepository<Dataset, Long> getRepository() {
    return datasetRepo;
  }
}
