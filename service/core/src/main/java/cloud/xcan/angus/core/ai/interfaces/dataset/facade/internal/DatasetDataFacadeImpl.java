package cloud.xcan.angus.core.ai.interfaces.dataset.facade.internal;

import static cloud.xcan.angus.core.jpa.criteria.SearchCriteriaBuilder.getMatchSearchFields;
import static cloud.xcan.angus.core.utils.CoreUtils.buildVoPageResult;

import cloud.xcan.angus.api.commonlink.FullResourceType;
import cloud.xcan.angus.core.ai.application.cmd.activity.ActivityCmd;
import cloud.xcan.angus.core.ai.application.cmd.dataset.DatasetDataCmd;
import cloud.xcan.angus.core.ai.application.query.dataset.DatasetDataQuery;
import cloud.xcan.angus.core.ai.application.query.dataset.DatasetQuery;
import cloud.xcan.angus.core.ai.domain.activity.ActivityActions;
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

  @Resource
  private DatasetQuery datasetQuery;

  @Resource
  private ActivityCmd activityCmd;

  @Override
  public DatasetDataListVo uploadDatasetFile(Long datasetId, DatasetFileUploadDto dto) {
    DatasetData data = datasetDataCmd.uploadDatasetData(datasetId, dto.getFile());
    activityCmd.recordActivity(FullResourceType.DATASET_DATA, data.getId(), data.getName(),
        ActivityActions.ACTIVITY_DATASET_DATA_UPLOADED);
    return DatasetDataAssembler.toDataListVo(data);
  }

  @Override
  public List<SyncDataVo> syncDatasetData(Long datasetId, List<Long> dataIds) {
    List<SyncDataResult> results = datasetDataCmd.syncDatasetData(datasetId, dataIds);
    if (!results.isEmpty()) {
      var dataset = datasetQuery.findAndCheck(datasetId);
      activityCmd.recordActivity(FullResourceType.DATASET_DATA, datasetId, dataset.getName(),
          ActivityActions.ACTIVITY_DATASET_DATA_SYNCED);
    }
    return results.stream().map(DatasetDataAssembler::toSyncDataVo)
        .collect(Collectors.toList());
  }

  @Override
  public void batchDeleteData(Long datasetId, List<Long> dataIds) {
    var dataset = datasetQuery.findAndCheck(datasetId);
    datasetDataCmd.batchDeleteData(datasetId, dataIds);
    activityCmd.recordActivity(FullResourceType.DATASET_DATA, datasetId, dataset.getName(),
        ActivityActions.ACTIVITY_DATASET_DATA_BATCH_DELETED);
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
