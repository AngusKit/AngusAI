package cloud.xcan.angus.core.ai.application.converter;

import static cloud.xcan.angus.core.ai.infra.util.CommonUtils.calculateContentHash;
import static cloud.xcan.angus.core.ai.infra.util.CommonUtils.calculateDatasetType;
import static cloud.xcan.angus.spec.utils.FileNameSecurityUtil.sanitizeFileName;
import static cloud.xcan.angus.spec.utils.ObjectUtils.stringSafe;
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

}
