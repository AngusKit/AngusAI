package cloud.xcan.angus.core.ai.interfaces.dataset.facade.internal.assembler;

import static cloud.xcan.angus.core.ai.infra.util.CommonUtils.formatFileSize;
import static cloud.xcan.angus.spec.utils.ObjectUtils.isNull;

import cloud.xcan.angus.core.ai.domain.dataset.Dataset;
import cloud.xcan.angus.core.ai.domain.dataset.DatasourceConfig;
import cloud.xcan.angus.core.ai.infra.util.DatasourceUtils.ConnectionTestResult;
import cloud.xcan.angus.core.ai.interfaces.dataset.facade.dto.DataSourceUpdateDto;
import cloud.xcan.angus.core.ai.interfaces.dataset.facade.dto.DatasetCreateDto;
import cloud.xcan.angus.core.ai.interfaces.dataset.facade.dto.DatasetFindDto;
import cloud.xcan.angus.core.ai.interfaces.dataset.facade.dto.DatasetUpdateDto;
import cloud.xcan.angus.core.ai.interfaces.dataset.facade.dto.DatasourceConnectionTestDto;
import cloud.xcan.angus.core.ai.interfaces.dataset.facade.vo.DatasetDataStatsVo;
import cloud.xcan.angus.core.ai.interfaces.dataset.facade.vo.DatasetDetailVo;
import cloud.xcan.angus.core.ai.interfaces.dataset.facade.vo.DatasetListVo;
import cloud.xcan.angus.core.ai.interfaces.dataset.facade.vo.DatasourceConfigVo;
import cloud.xcan.angus.core.ai.interfaces.dataset.facade.vo.DatasourceConnectionTestVo;
import cloud.xcan.angus.core.jpa.criteria.GenericSpecification;
import cloud.xcan.angus.core.jpa.criteria.SearchCriteriaBuilder;
import cloud.xcan.angus.remote.search.SearchCriteria;
import java.util.Set;

public class DatasetAssembler {

  public static Dataset toCreateDomain(DatasetCreateDto dto) {
    Dataset dataset = new Dataset();
    dataset.setName(dto.getName());
    dataset.setDescription(dto.getDescription());
    dataset.setType(dto.getType());
    dataset.setVisibility(dto.getVisibility());
    dataset.setTags(dto.getTags());

    // 设置默认图标和颜色
    dataset.setIcon(dto.getIcon());
    dataset.setIconBg(dto.getIconBg());

    // 设置默认状态
    dataset.setEnabled(true);
    return dataset;
  }

  public static Dataset toUpdateDomain(Long id, DatasetUpdateDto dto) {
    Dataset dataset = new Dataset();
    dataset.setId(id);
    dataset.setName(dto.getName());
    dataset.setDescription(dto.getDescription());
    dataset.setVisibility(dto.getVisibility());
    dataset.setTags(dto.getTags());

    // 设置默认图标和颜色
    dataset.setIcon(dto.getIcon());
    dataset.setIconBg(dto.getIconBg());
    return dataset;
  }

  public static DatasourceConfig toDatasourceConfig(DataSourceUpdateDto vo) {
    DatasourceConfig config = new DatasourceConfig();
    config.setDatabaseType(vo.getDatabaseType());
    config.setDatabase(vo.getDatabase());
    config.setJdbcUrl(vo.getJdbcUrl());
    config.setHost(vo.getHost());
    config.setPort(vo.getPort());
    config.setUsername(vo.getUsername());
    config.setPassword(vo.getPassword());
    return config;
  }

  public static DatasourceConfigVo toDatasourceConfigVo(DatasourceConfig config) {
    DatasourceConfigVo vo = new DatasourceConfigVo();
    if (isNull(config)){
      return vo;
    }
    vo.setName(config.getName());
    vo.setDatabaseType(config.getDatabaseType());
    vo.setDatabase(config.getDatabase());
    vo.setJdbcUrl(config.getJdbcUrl());
    vo.setHost(config.getHost());
    vo.setPort(config.getPort());
    vo.setUsername(config.getUsername());
    // vo.setPassword(config.getPassword()); // 脱敏
    return vo;
  }

  public static DatasourceConfig toDatasourceConfig(DatasourceConnectionTestDto vo) {
    DatasourceConfig config = new DatasourceConfig();
    config.setDatabaseType(vo.getDatabaseType());
    config.setDatabase(vo.getDatabase());
    config.setJdbcUrl(vo.getJdbcUrl());
    config.setHost(vo.getHost());
    config.setPort(vo.getPort());
    config.setUsername(vo.getUsername());
    config.setPassword(vo.getPassword());
    return config;
  }

  public static DatasourceConnectionTestVo toConnectionTestResultVo(ConnectionTestResult result) {
    DatasourceConnectionTestVo vo = new DatasourceConnectionTestVo();
    vo.setSuccess(result.isSuccess());
    vo.setMessage(result.getMessage());
    vo.setDetails(result.getDetails());
    return vo;
  }

  public static DatasetDetailVo toDetailVo(Dataset dataset) {
    DatasetDetailVo vo = new DatasetDetailVo();
    vo.setId(dataset.getId());
    vo.setName(dataset.getName());
    vo.setDescription(dataset.getDescription());
    vo.setType(dataset.getType());
    vo.setEnabled(dataset.getEnabled());
    vo.setVisibility(dataset.getVisibility());
    vo.setIcon(dataset.getIcon());
    vo.setIconBg(dataset.getIconBg());
    vo.setTags(dataset.getTags());

    // 设置数据源配置
    vo.setDatasourceConfig(toDatasourceConfigVo(dataset.getConfig()));

    // 设置统计信息
    vo.setDataStatistics(toDatasetDataStatisticsVo(dataset));

    // 设置审计信息
    vo.setTenantId(dataset.getTenantId());
    vo.setCreatedBy(dataset.getCreatedBy());
    vo.setCreatedDate(dataset.getCreatedDate());
    vo.setModifiedBy(dataset.getModifiedBy());
    vo.setModifiedDate(dataset.getModifiedDate());
    return vo;
  }

  public static DatasetListVo toListVo(Dataset dataset) {
    DatasetListVo vo = new DatasetListVo();
    vo.setId(dataset.getId());
    vo.setName(dataset.getName());
    vo.setDescription(dataset.getDescription());
    vo.setType(dataset.getType());
    vo.setEnabled(dataset.getEnabled());
    vo.setVisibility(dataset.getVisibility());
    vo.setIcon(dataset.getIcon());
    vo.setIconBg(dataset.getIconBg());
    vo.setTags(dataset.getTags());

    // 设置统计信息
    vo.setDataStatistics(toDatasetDataStatisticsVo(dataset));

    // 设置审计信息
    vo.setTenantId(dataset.getTenantId());
    vo.setCreatedBy(dataset.getCreatedBy());
    vo.setCreatedDate(dataset.getCreatedDate());
    vo.setModifiedBy(dataset.getModifiedBy());
    vo.setModifiedDate(dataset.getModifiedDate());
    return vo;
  }

  public static DatasetDataStatsVo toDatasetDataStatisticsVo(Dataset dataset) {
    DatasetDataStatsVo vo = new DatasetDataStatsVo();
    vo.setTotalFilesOrTables(dataset.getTotalFilesOrTables());
    vo.setTotalRecords(dataset.getTotalRecords());
    vo.setTotalRecordsSize(formatFileSize(dataset.getTotalRecordsSize()));
    vo.setUsedStoreSize(formatFileSize(dataset.getUsedStoreSize()));
    return vo;
  }

  public static GenericSpecification<Dataset> getSpecification(DatasetFindDto dto) {
    // Build the final filters
    Set<SearchCriteria> filters = new SearchCriteriaBuilder<>(dto)
        .rangeSearchFields("id", "createdDate", "modifiedDate")
        .orderByFields("id", "name", "type", "status", "createdDate", "modifiedDate")
        .matchSearchFields("name", "description")
        .inAndNotFields("type", "status", "createdBy")
        .build();
    return new GenericSpecification<>(filters);
  }

}
