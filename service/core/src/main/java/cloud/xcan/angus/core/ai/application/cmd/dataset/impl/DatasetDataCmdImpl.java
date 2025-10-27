package cloud.xcan.angus.core.ai.application.cmd.dataset.impl;

import cloud.xcan.angus.core.ai.application.cmd.dataset.DatasetDataCmd;
import cloud.xcan.angus.core.ai.application.query.dataset.DatasetQuery;
import cloud.xcan.angus.core.ai.domain.dataset.Dataset;
import cloud.xcan.angus.core.ai.domain.dataset.DatasetData;
import cloud.xcan.angus.core.ai.domain.dataset.DatasetDataRepo;
import cloud.xcan.angus.core.ai.domain.dataset.SyncDataResult;
import cloud.xcan.angus.core.biz.Biz;
import cloud.xcan.angus.core.biz.BizTemplate;
import cloud.xcan.angus.core.biz.cmd.CommCmd;
import cloud.xcan.angus.core.jpa.repository.BaseRepository;
import cloud.xcan.angus.remote.message.BizException;
import cloud.xcan.angus.spec.annotations.DoInFuture;
import cloud.xcan.angus.spec.utils.ObjectUtils;
import jakarta.annotation.Resource;
import java.util.List;
import org.springframework.lang.Nullable;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@DoInFuture("添加权限校验")
@Component
@Biz
public class DatasetDataCmdImpl extends CommCmd<DatasetData, Long> implements DatasetDataCmd {

  @Resource
  private DatasetDataRepo datasetDataRepo;

  @Resource
  private DatasetQuery datasetQuery;

  @Override
  @Transactional
  public List<SyncDataResult> syncDatasetData(Long datasetId, List<String> names) {
    return new BizTemplate<List<SyncDataResult>>() {
      Dataset datasetDb;

      @Override
      protected void checkParams() {
        // 获取数据集并检查是否存在
        datasetDb = datasetQuery.findAndCheck(datasetId);
      }

      @Override
      protected List<SyncDataResult> process() {
        if (datasetDb.getType().isDatasource()) {
          // TODO 同步表和统计信息
        } else {
          List<DatasetData> data = ObjectUtils.isEmpty(names)
              ? datasetDataRepo.findByDatasetId(datasetId)
              : datasetDataRepo.findByDatasetIdAndNameIn(datasetId, names);
          if (data.isEmpty()) {
            throw BizException.of("没有可同步的文件数据，请上传后再试");
          }

          // TODO 执行文件数据到数据库同步
        }
        return List.of();
      }
    }.execute();
  }

  @Override
  @Transactional
  public void batchDeleteData(Long id, @Nullable List<String> names) {
    new BizTemplate<Void>() {
      @Override
      protected Void process() {
        if (ObjectUtils.isEmpty(names)) {
          datasetDataRepo.deleteById(id);
        } else {
          datasetDataRepo.deleteByIdAndNameIn(id, names);
        }
        return null;
      }
    }.execute();
  }

  @Override
  protected BaseRepository<DatasetData, Long> getRepository() {
    return datasetDataRepo;
  }
}
