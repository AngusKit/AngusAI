package cloud.xcan.angus.core.ai.application.converter;

import static cloud.xcan.angus.core.ai.infra.util.CommonUtils.calculateContentHash;
import static cloud.xcan.angus.core.ai.infra.util.CommonUtils.calculateDatasetType;
import static cloud.xcan.angus.spec.utils.FileNameSecurityUtil.sanitizeFileName;
import static org.apache.commons.lang3.ObjectUtils.isNotEmpty;

import cloud.xcan.angus.api.storage.file.vo.FileUploadVo;
import cloud.xcan.angus.core.ai.domain.dataset.DatasetData;
import cloud.xcan.angus.core.ai.domain.dataset.DatasetDataStatus;
import cloud.xcan.angus.core.ai.domain.dataset.DatasetDataType;
import org.jetbrains.annotations.NotNull;
import org.springframework.web.multipart.MultipartFile;

public class DatasetDataConverter {

  public static @NotNull DatasetData toDatasetData(
      Long datasetId, MultipartFile file, FileUploadVo uploadResult) {
    String safeFileName = isNotEmpty(file.getOriginalFilename())
        ? sanitizeFileName(file.getOriginalFilename())
        : String.valueOf(System.currentTimeMillis());
    DatasetData data = new DatasetData();
    data.setDatasetId(datasetId);
    data.setName(safeFileName);
    data.setType(calculateDatasetType(file.getOriginalFilename(), DatasetDataType.CSV));
    data.setStatus(DatasetDataStatus.PENDING);
    data.setDataCount(0L);
    data.setDataSize(file.getSize());
    data.setFilePath(uploadResult.getUrl());
    data.setContentHash(calculateContentHash(file));
    return data;
  }

  public static @NotNull DatasetData toTableDatasetData(
      Long datasetId, String tableName, Long rowCount, Long tableSize) {
    DatasetData data = new DatasetData();
    data.setDatasetId(datasetId);
    data.setName(tableName);
    data.setType(DatasetDataType.TABLE);
    data.setStatus(DatasetDataStatus.COMPLETED);
    data.setDataCount(rowCount != null ? rowCount : 0L);
    data.setDataSize(tableSize != null ? tableSize : 0L);
    data.setFilePath(null); // 表不需要文件路径
    data.setContentHash(null); // 表不需要内容哈希
    return data;
  }

  public static void updateTableDatasetData(
      DatasetData tableData, Long rowCount, Long tableSize) {
    tableData.setDataCount(rowCount != null ? rowCount : 0L);
    tableData.setDataSize(tableSize != null ? tableSize : 0L);
    tableData.setStatus(DatasetDataStatus.COMPLETED);
  }

}
