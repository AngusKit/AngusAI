package cloud.xcan.angus.core.ai.interfaces.dataset.facade.internal;

import static cloud.xcan.angus.core.jpa.criteria.SearchCriteriaBuilder.getMatchSearchFields;
import static cloud.xcan.angus.core.utils.CoreUtils.buildVoPageResult;

import cloud.xcan.angus.core.ai.application.cmd.dataset.DatasetDataCmd;
import cloud.xcan.angus.core.ai.application.query.dataset.DatasetDataQuery;
import cloud.xcan.angus.core.ai.domain.dataset.DatasetData;
import cloud.xcan.angus.core.ai.domain.dataset.SyncDataResult;
import cloud.xcan.angus.core.ai.infra.util.DatasourceUtils.TableDataResult;
import cloud.xcan.angus.core.ai.interfaces.dataset.facade.DatasetDataFacade;
import cloud.xcan.angus.core.ai.interfaces.dataset.facade.dto.DatasetDataFindDto;
import cloud.xcan.angus.core.ai.interfaces.dataset.facade.dto.DatasetFileUploadDto;
import cloud.xcan.angus.core.ai.interfaces.dataset.facade.internal.assembler.DatasetDataAssembler;
import cloud.xcan.angus.core.ai.interfaces.dataset.facade.vo.DatasetDataListVo;
import cloud.xcan.angus.core.ai.interfaces.dataset.facade.vo.DatasourceTableDataPreviewVo;
import cloud.xcan.angus.core.ai.interfaces.dataset.facade.vo.SyncDataVo;
import cloud.xcan.angus.core.jpa.criteria.GenericSpecification;
import cloud.xcan.angus.remote.PageResult;
import cloud.xcan.angus.remote.search.SearchCriteria;
import jakarta.annotation.Resource;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Component;

@Component
public class DatasetDataFacadeImpl implements DatasetDataFacade {

  @Resource
  private DatasetDataQuery datasetDataQuery;

  @Resource
  private DatasetDataCmd datasetDataCmd;

  @Override
  public DatasetDataListVo uploadDatasetFile(Long datasetId, DatasetFileUploadDto dto) {
    DatasetData data = datasetDataCmd.uploadDatasetData(datasetId, dto.getFile());
    return DatasetDataAssembler.toDataListVo(data);
  }

  @Override
  public List<SyncDataVo> syncDatasetData(Long datasetId, List<Long> dataIds) {
    List<SyncDataResult> results = datasetDataCmd.syncDatasetData(datasetId, dataIds);
    return results.stream().map(DatasetDataAssembler::toSyncDataVo)
        .collect(Collectors.toList());
  }

  @Override
  public void batchDeleteData(Long datasetId, List<Long> dataIds) {
    datasetDataCmd.batchDeleteData(datasetId, dataIds);
  }

  @Override
  public PageResult<DatasetDataListVo> listData(Long datasetId, DatasetDataFindDto dto) {
    GenericSpecification<DatasetData> spec = DatasetDataAssembler.getSpecification(dto);
    spec.getCriteria().add(SearchCriteria.equal("datasetId", datasetId));
    Page<DatasetData> page = datasetDataQuery.find(spec, dto.tranPage(),
        dto.fullTextSearch, getMatchSearchFields(dto.getClass()));
    return buildVoPageResult(page, DatasetDataAssembler::toDataListVo);
  }

  @Override
  public DatasourceTableDataPreviewVo previewDatasourceData(Long datasetId, String tableName,
      Integer pageNo, Integer pageSize) {
    TableDataResult result = datasetDataQuery.previewDatasourceData(
        datasetId, tableName, pageNo, pageSize);
    return DatasetDataAssembler.toTableDataPreviewVo(result);
  }
}
