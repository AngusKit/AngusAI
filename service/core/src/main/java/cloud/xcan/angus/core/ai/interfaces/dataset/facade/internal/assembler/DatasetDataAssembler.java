package cloud.xcan.angus.core.ai.interfaces.dataset.facade.internal.assembler;

import static cloud.xcan.angus.core.ai.infra.util.CommonUtils.formatFileSize;

import cloud.xcan.angus.core.ai.domain.dataset.DatasetData;
import cloud.xcan.angus.core.ai.domain.dataset.SyncDataResult;
import cloud.xcan.angus.core.ai.infra.util.DatasourceUtils.TableDataResult;
import cloud.xcan.angus.core.ai.interfaces.dataset.facade.dto.DatasetDataFindDto;
import cloud.xcan.angus.core.ai.interfaces.dataset.facade.vo.DatasetDataListVo;
import cloud.xcan.angus.core.ai.interfaces.dataset.facade.vo.DatasourceTableDataPreviewVo;
import cloud.xcan.angus.core.ai.interfaces.dataset.facade.vo.SyncDataVo;
import cloud.xcan.angus.core.jpa.criteria.GenericSpecification;
import cloud.xcan.angus.core.jpa.criteria.SearchCriteriaBuilder;
import cloud.xcan.angus.remote.search.SearchCriteria;
import java.util.Set;

public class DatasetDataAssembler {

  public static SyncDataVo toSyncDataVo(SyncDataResult syncFileResult) {
    SyncDataVo vo = new SyncDataVo();
    vo.setName(vo.getName());
    vo.setStatus(syncFileResult.getStatus());
    vo.setFailedReason(syncFileResult.getFailedReason());
    return vo;
  }

  public static DatasetDataListVo toDataListVo(DatasetData data) {
    DatasetDataListVo vo = new DatasetDataListVo();
    vo.setId(data.getId());
    vo.setName(data.getName());
    vo.setType(data.getType());
    vo.setStatus(data.getStatus());

    // 设置统计信息
    vo.setDataCount(data.getDataCount());
    vo.setDataSize(formatFileSize(data.getDataSize()));

    // 设置文件信息
    vo.setFilePath(data.getFilePath());
    vo.setContentHash(data.getContentHash());

    // 设置审计信息
    vo.setTenantId(data.getTenantId());
    vo.setCreatedBy(data.getCreatedBy());
    vo.setCreatedDate(data.getCreatedDate());
    vo.setModifiedBy(data.getModifiedBy());
    vo.setModifiedDate(data.getModifiedDate());
    return vo;
  }

  public static DatasourceTableDataPreviewVo toTableDataPreviewVo(TableDataResult result) {
    DatasourceTableDataPreviewVo vo = new DatasourceTableDataPreviewVo();
    vo.setSuccess(result.isSuccess());
    vo.setMessage(result.getMessage());
    vo.setDetails(result.getDetails());
    vo.setColumns(result.getColumns());
    vo.setData(result.getData());
    vo.setTotal(result.getTotal());
    return vo;
  }

  public static GenericSpecification<DatasetData> getSpecification(DatasetDataFindDto dto) {
    // Build the final filters
    Set<SearchCriteria> filters = new SearchCriteriaBuilder<>(dto)
        .rangeSearchFields("id", "createdDate", "modifiedDate")
        .orderByFields("id", "name", "type", "size", "createdDate", "modifiedDate")
        .matchSearchFields("name", "description")
        .inAndNotFields("type", "status", "createdBy")
        .build();
    return new GenericSpecification<>(filters);
  }

}
