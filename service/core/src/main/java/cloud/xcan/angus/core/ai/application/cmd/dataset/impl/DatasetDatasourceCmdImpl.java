package cloud.xcan.angus.core.ai.application.cmd.dataset.impl;

import cloud.xcan.angus.core.ai.application.cmd.dataset.DatasetDatasourceCmd;
import cloud.xcan.angus.core.ai.application.query.dataset.DatasetQuery;
import cloud.xcan.angus.core.ai.domain.dataset.Dataset;
import cloud.xcan.angus.core.ai.interfaces.dataset.facade.dto.DataSourceCreateDto;
import cloud.xcan.angus.core.biz.Biz;
import cloud.xcan.angus.core.biz.BizTemplate;
import cloud.xcan.angus.remote.message.http.ResourceNotFound;
import cloud.xcan.angus.spec.annotations.DoInFuture;
import jakarta.annotation.Resource;
import org.springframework.stereotype.Component;

@DoInFuture("添加权限校验")
@Component
@Biz
public class DatasetDatasourceCmdImpl implements DatasetDatasourceCmd {

  @Resource
  private DatasetQuery datasetQuery;

  @Override
  public Dataset addDataSource(Long datasetId, DataSourceCreateDto dto) {
    return new BizTemplate<Dataset>() {
      Dataset datasetDb;

      @Override
      protected void checkParams() {
        // 获取数据集并验证是否存在
        datasetDb = datasetQuery.findById(datasetId);
        if (datasetDb == null) {
          throw ResourceNotFound.of("数据集不存在", new Object[]{});
        }
      }

      @Override
      protected Dataset process() {
        // TODO: 实现添加数据源逻辑
        return datasetDb;
      }
    }.execute();
  }

  @Override
  public Dataset syncDataSource(Long datasetId, Long sourceId) {
    return new BizTemplate<Dataset>() {
      Dataset datasetDb;

      @Override
      protected void checkParams() {
        // 获取数据集并验证是否存在
        datasetDb = datasetQuery.findById(datasetId);
        if (datasetDb == null) {
          throw ResourceNotFound.of("数据集不存在", new Object[]{});
        }
      }

      @Override
      protected Dataset process() {
        // TODO: 实现数据源同步逻辑
        return datasetDb;
      }
    }.execute();
  }

  @Override
  public void deleteDataSource(Long datasetId, Long sourceId) {
    new BizTemplate<Void>() {
      @Override
      protected void checkParams() {
        // 验证数据集是否存在
        Dataset datasetDb = datasetQuery.findById(datasetId);
        if (datasetDb == null) {
          throw ResourceNotFound.of("数据集不存在", new Object[]{});
        }
      }

      @Override
      protected Void process() {
        // TODO: 实现删除数据源逻辑
        return null;
      }
    }.execute();
  }

  @Override
  public boolean testDataSourceConnection(DataSourceCreateDto dto) {
    return new BizTemplate<Boolean>() {
      @Override
      protected Boolean process() {
        // TODO: 实现数据源连接测试逻辑
        return true;
      }
    }.execute();
  }

}