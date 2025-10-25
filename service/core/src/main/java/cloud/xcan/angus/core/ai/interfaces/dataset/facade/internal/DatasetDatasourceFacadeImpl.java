package cloud.xcan.angus.core.ai.interfaces.dataset.facade.internal;

import cloud.xcan.angus.core.ai.application.cmd.dataset.DatasetDatasourceCmd;
import cloud.xcan.angus.core.ai.application.query.dataset.DatasetQuery;
import cloud.xcan.angus.core.ai.domain.dataset.Dataset;
import cloud.xcan.angus.core.ai.interfaces.dataset.facade.DatasetDatasourceFacade;
import cloud.xcan.angus.core.ai.interfaces.dataset.facade.dto.ConnectionTestDto;
import cloud.xcan.angus.core.ai.interfaces.dataset.facade.dto.DataSourceCreateDto;
import cloud.xcan.angus.core.ai.interfaces.dataset.facade.internal.assembler.DatasetAssembler;
import cloud.xcan.angus.core.ai.interfaces.dataset.facade.vo.ConnectionTestVo;
import cloud.xcan.angus.core.ai.interfaces.dataset.facade.vo.DataSourceListVo;
import cloud.xcan.angus.core.ai.interfaces.dataset.facade.vo.DatasetDetailVo;
import cloud.xcan.angus.core.ai.interfaces.dataset.facade.vo.SyncResultVo;
import cloud.xcan.angus.remote.PageResult;
import jakarta.annotation.Resource;
import org.springframework.stereotype.Component;

@Component
public class DatasetDatasourceFacadeImpl implements DatasetDatasourceFacade {

  @Resource
  private DatasetQuery datasetQuery;

  @Resource
  private DatasetDatasourceCmd datasetDatasourceCmd;

  @Override
  public DatasetDetailVo addDataSource(Long datasetId, DataSourceCreateDto dto) {
    Dataset saved = datasetDatasourceCmd.addDataSource(datasetId, dto);
    return DatasetAssembler.toDetailVo(saved);
  }

  @Override
  public PageResult<DataSourceListVo> getDataSources(Long datasetId, Integer pageNo, Integer pageSize, String sourceType, String status) {
    // 这里应该调用数据源查询服务
    // 暂时返回模拟数据
    PageResult<DataSourceListVo> result = new PageResult<>();
    // TODO: 实现数据源查询逻辑
    return result;
  }

  @Override
  public SyncResultVo syncDataSource(Long datasetId, Long sourceId) {
    datasetDatasourceCmd.syncDataSource(datasetId, sourceId);
    // 这里应该调用数据同步服务
    // 暂时返回模拟数据
    SyncResultVo result = new SyncResultVo();
    // TODO: 实现数据同步逻辑
    return result;
  }

  @Override
  public void deleteDataSource(Long datasetId, Long sourceId) {
    datasetDatasourceCmd.deleteDataSource(datasetId, sourceId);
  }

  @Override
  public ConnectionTestVo testConnection(ConnectionTestDto dto) {
    // 这里应该调用连接测试服务
    // 暂时返回模拟数据
    ConnectionTestVo result = new ConnectionTestVo();
    // TODO: 实现连接测试逻辑
    return result;
  }

}
