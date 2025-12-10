package cloud.xcan.angus.core.ai.application.cmd.dataset.impl;

import static cloud.xcan.angus.core.ai.application.converter.DatasetDataConverter.toDatasetData;
import static cloud.xcan.angus.core.ai.application.converter.DatasetDataConverter.toTableDatasetData;
import static cloud.xcan.angus.core.ai.application.converter.DatasetDataConverter.updateTableDatasetData;
import static cloud.xcan.angus.core.ai.domain.Constants.DATASET_UPLOAD_BIZ_KEY;
import static cloud.xcan.angus.core.ai.infra.util.CommonUtils.calculateDatasetType;
import static cloud.xcan.angus.spec.utils.FileNameSecurityUtil.sanitizeFileName;

import cloud.xcan.angus.api.storage.file.FileRemote;
import cloud.xcan.angus.api.storage.file.vo.FileUploadVo;
import cloud.xcan.angus.core.ai.application.cmd.dataset.DatasetDataCmd;
import cloud.xcan.angus.core.ai.application.query.dataset.DatasetQuery;
import cloud.xcan.angus.core.ai.domain.dataset.Dataset;
import cloud.xcan.angus.core.ai.domain.dataset.DatasetData;
import cloud.xcan.angus.core.ai.domain.dataset.DatasetDataRepo;
import cloud.xcan.angus.core.ai.domain.dataset.DatasetDataStatus;
import cloud.xcan.angus.core.ai.domain.dataset.DatasetDataType;
import cloud.xcan.angus.core.ai.domain.dataset.DatasourceConfig;
import cloud.xcan.angus.core.ai.domain.dataset.SyncDataResult;
import cloud.xcan.angus.core.ai.infra.util.DatasourceUtils;
import cloud.xcan.angus.core.ai.infra.util.DatasourceUtils.DatabaseMetadataResult;
import cloud.xcan.angus.core.biz.BizTemplate;
import cloud.xcan.angus.core.biz.cmd.CommCmd;
import cloud.xcan.angus.core.jpa.repository.BaseRepository;
import cloud.xcan.angus.remote.message.BizException;
import cloud.xcan.angus.remote.message.ProtocolException;
import cloud.xcan.angus.remote.message.http.ResourceExisted;
import cloud.xcan.angus.spec.annotations.DoInFuture;
import cloud.xcan.angus.spec.utils.ObjectUtils;
import jakarta.annotation.Resource;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.autoconfigure.web.servlet.MultipartProperties;
import org.springframework.lang.Nullable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

@DoInFuture("添加权限校验")
@Slf4j
@Service
public class DatasetDataCmdImpl extends CommCmd<DatasetData, Long> implements DatasetDataCmd {

  @Resource
  private DatasetDataRepo datasetDataRepo;

  @Resource
  private DatasetQuery datasetQuery;

  @Resource
  private FileRemote fileRemote;

  @Resource
  private MultipartProperties multipartProperties;

  @Override
  @Transactional
  public DatasetData uploadDatasetData(Long datasetId, MultipartFile file) {
    return new BizTemplate<DatasetData>() {
      Dataset datasetDb;

      @Override
      protected void checkParams() {
        // 检查数据集是否存在
        datasetDb = datasetQuery.findAndCheck(datasetId);

        // 检查文件格式
        String fileName = file.getOriginalFilename();
        if (calculateDatasetType(fileName, null) == null) {
          throw ProtocolException.of(String.format("不支持的文件格式：%s", fileName));
        }

        // 检查文件大小限制
        long maxFileSize = multipartProperties.getMaxFileSize().toBytes();
        if (file.getSize() > maxFileSize) {
          throw ProtocolException.of(String.format("文件[%s]超过大小限制，最大允许上传%s",
              fileName, multipartProperties.getMaxFileSize().toString()));
        }

        // 检查名称是否已存在
        String safeFileName = sanitizeFileName(fileName);
        if (datasetDataRepo.existsByDatasetIdAndName(datasetId, safeFileName)) {
          throw ResourceExisted.of("文件名称「{0}」已存在", new Object[]{fileName});
        }
      }

      @Override
      protected DatasetData process() {
        // TODO: 启动异步处理任务（包括数据解析并入库）

        // 上传文件到文件存储服务
        List<FileUploadVo> uploadResult = fileRemote.upload(
            new MultipartFile[]{file}, null, DATASET_UPLOAD_BIZ_KEY,
            null, null, false).orElseContentThrow();

        DatasetData data = toDatasetData(datasetId, file, uploadResult.get(0));
        insert(data);
        return data;
      }
    }.execute();
  }

  @Override
  @Transactional
  public List<SyncDataResult> syncDatasetData(Long datasetId, List<Long> dataIds) {
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
          // 同步表和统计信息
          return syncDatasourceTables(datasetId, datasetDb.getConfig());
        } else {
          List<DatasetData> data = ObjectUtils.isEmpty(dataIds)
              ? datasetDataRepo.findByDatasetId(datasetId)
              : datasetDataRepo.findByDatasetIdAndIdIn(datasetId, dataIds);
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
  public void batchDeleteData(Long id, @Nullable List<Long> dataIds) {
    new BizTemplate<Void>() {
      @Override
      protected Void process() {
        if (ObjectUtils.isEmpty(dataIds)) {
          datasetDataRepo.deleteById(id);
        } else {
          datasetDataRepo.deleteByDatasetIdAndIdIn(id, dataIds);
        }
        return null;
      }
    }.execute();
  }

  /**
   * 同步数据源表信息
   *
   * @param datasetId 数据集ID
   * @param config    数据源配置
   * @return 同步结果列表
   */
  private List<SyncDataResult> syncDatasourceTables(Long datasetId, DatasourceConfig config) {
    List<SyncDataResult> results = new ArrayList<>();

    // 验证数据源配置
    if (config == null || !config.isValid()) {
      throw BizException.of("数据源配置无效，无法同步表信息");
    }

    // 获取数据库元信息
    DatabaseMetadataResult metadataResult = DatasourceUtils.getDatabaseMetadata(config);
    if (!metadataResult.isSuccess()) {
      throw BizException.of("获取数据库元信息失败: " + metadataResult.getMessage());
    }

    List<String> tableNames = metadataResult.getTableNames();
    if (tableNames == null || tableNames.isEmpty()) {
      log.warn("数据集 {} 的数据源中没有找到表", datasetId);
      return results;
    }

    Map<String, Long> tableRowCounts = metadataResult.getTableRowCounts();
    Map<String, Long> tableSizes = metadataResult.getTableSizes();

    // 获取现有的表数据，用于判断是新增还是更新
    List<DatasetData> existingTables = datasetDataRepo.findByDatasetId(datasetId);
    Map<String, DatasetData> existingTableMap = new java.util.HashMap<>();
    for (DatasetData existing : existingTables) {
      if (existing.getType() == DatasetDataType.TABLE) {
        existingTableMap.put(existing.getName(), existing);
      }
    }

    // 准备批量操作的数据
    List<DatasetData> tablesToInsert = new ArrayList<>();
    List<DatasetData> tablesToUpdate = new ArrayList<>();
    List<Long> tableIdsToDelete = new ArrayList<>();

    // 收集需要新增和更新的表信息
    for (String tableName : tableNames) {
      DatasetData tableData = existingTableMap.get(tableName);
      Long rowCount =
          tableRowCounts != null ? tableRowCounts.getOrDefault(tableName, 0L) : 0L;
      Long tableSize = tableSizes != null ? tableSizes.getOrDefault(tableName, 0L) : 0L;

      if (tableData == null) {
        // 准备新增的表数据
        tableData = toTableDatasetData(datasetId, tableName, rowCount, tableSize);
        tablesToInsert.add(tableData);
      } else {
        // 准备更新的表数据
        updateTableDatasetData(tableData, rowCount, tableSize);
        tablesToUpdate.add(tableData);
      }
    }

    // 收集需要删除的表ID（数据源中不再存在的表）
    for (Map.Entry<String, DatasetData> entry : existingTableMap.entrySet()) {
      String tableName = entry.getKey();
      if (!tableNames.contains(tableName)) {
        tableIdsToDelete.add(entry.getValue().getId());
      }
    }

    // 批量插入新表
    if (!tablesToInsert.isEmpty()) {
      try {
        batchInsert(tablesToInsert);
        log.info("批量新增表数据: datasetId={}, count={}", datasetId, tablesToInsert.size());
        for (DatasetData tableData : tablesToInsert) {
          SyncDataResult result = new SyncDataResult();
          result.setName(tableData.getName());
          result.setStatus(DatasetDataStatus.COMPLETED);
          results.add(result);
        }
      } catch (Exception e) {
        log.error("批量新增表数据失败", e);
        for (DatasetData tableData : tablesToInsert) {
          SyncDataResult result = new SyncDataResult();
          result.setName(tableData.getName());
          result.setStatus(DatasetDataStatus.FAILED);
          result.setFailedReason("批量新增失败: " + e.getMessage());
          results.add(result);
        }
      }
    }

    // 批量更新现有表
    if (!tablesToUpdate.isEmpty()) {
      try {
        datasetDataRepo.saveAll(tablesToUpdate);
        log.info("批量更新表数据: datasetId={}, count={}", datasetId, tablesToUpdate.size());
        for (DatasetData tableData : tablesToUpdate) {
          SyncDataResult result = new SyncDataResult();
          result.setName(tableData.getName());
          result.setStatus(DatasetDataStatus.COMPLETED);
          results.add(result);
        }
      } catch (Exception e) {
        log.error("批量更新表数据失败", e);
        for (DatasetData tableData : tablesToUpdate) {
          SyncDataResult result = new SyncDataResult();
          result.setName(tableData.getName());
          result.setStatus(DatasetDataStatus.FAILED);
          result.setFailedReason("批量更新失败: " + e.getMessage());
          results.add(result);
        }
      }
    }

    // 批量删除不存在的表
    if (!tableIdsToDelete.isEmpty()) {
      try {
        datasetDataRepo.deleteByDatasetIdAndIdIn(datasetId, tableIdsToDelete);
        log.info("批量删除表数据: datasetId={}, count={}", datasetId, tableIdsToDelete.size());
        // 获取被删除的表名用于返回结果
        for (Map.Entry<String, DatasetData> entry : existingTableMap.entrySet()) {
          if (tableIdsToDelete.contains(entry.getValue().getId())) {
            SyncDataResult result = new SyncDataResult();
            result.setName(entry.getKey());
            result.setStatus(DatasetDataStatus.COMPLETED);
            result.setFailedReason("表在数据源中已不存在，已删除");
            results.add(result);
          }
        }
      } catch (Exception e) {
        log.error("批量删除表数据失败", e);
        for (Map.Entry<String, DatasetData> entry : existingTableMap.entrySet()) {
          if (tableIdsToDelete.contains(entry.getValue().getId())) {
            SyncDataResult result = new SyncDataResult();
            result.setName(entry.getKey());
            result.setStatus(DatasetDataStatus.FAILED);
            result.setFailedReason("批量删除失败: " + e.getMessage());
            results.add(result);
          }
        }
      }
    }

    return results;
  }

  @Override
  protected BaseRepository<DatasetData, Long> getRepository() {
    return datasetDataRepo;
  }
}
