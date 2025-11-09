package cloud.xcan.angus.core.ai.application.cmd.dataset;

import cloud.xcan.angus.core.ai.domain.dataset.DatasetData;
import cloud.xcan.angus.core.ai.domain.dataset.SyncDataResult;
import java.util.List;
import org.springframework.web.multipart.MultipartFile;

public interface DatasetDataCmd {

  /**
   * 上传数据文件到数据集
   */
  DatasetData uploadDatasetData(Long datasetId, MultipartFile file);

  /**
   * 同步文件数据到关系数据库或同步表信息
   */
  List<SyncDataResult> syncDatasetData(Long datasetId, List<Long> dataIds);

  /**
   * 批量删除文件或表
   */
  void batchDeleteData(Long id,List<Long> dataIds);

}
