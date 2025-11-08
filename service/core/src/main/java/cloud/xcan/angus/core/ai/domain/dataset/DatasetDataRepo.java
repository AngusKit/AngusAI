package cloud.xcan.angus.core.ai.domain.dataset;

import cloud.xcan.angus.core.jpa.repository.BaseRepository;
import java.util.List;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.NoRepositoryBean;
import org.springframework.data.repository.query.Param;

@NoRepositoryBean
public interface DatasetDataRepo extends BaseRepository<DatasetData, Long> {

  List<DatasetData> findByDatasetId(Long datasetId);

  List<DatasetData> findByDatasetIdAndNameIn(Long datasetId, List<String> names);

  void deleteByIdAndNameIn(Long id, List<String> names);

  /**
   * 统计总文件或表数
   */
  @Query("SELECT COUNT(dd) FROM DatasetData dd")
  Long countTotalFilesOrTables();

  /**
   * 统计总记录数
   */
  @Query("SELECT COALESCE(SUM(dd.dataCount), 0) FROM DatasetData dd")
  Long sumTotalRecords();

  /**
   * 统计记录总大小（字节）
   */
  @Query("SELECT COALESCE(SUM(dd.dataSize), 0) FROM DatasetData dd")
  Long sumTotalRecordsSize();

  /**
   * 批量统计数据集的文件或表数量 返回 List<Object[]>，其中 [0]=datasetId (Long), [1]=count (Long)
   */
  @Query("SELECT dd.datasetId, COUNT(dd) FROM DatasetData dd WHERE dd.datasetId IN :datasetIds GROUP BY dd.datasetId")
  List<Object[]> countByDatasetIds(@Param("datasetIds") List<Long> datasetIds);

  /**
   * 批量统计数据集的记录数 返回 List<Object[]>，其中 [0]=datasetId (Long), [1]=totalRecords (Long)
   */
  @Query("SELECT dd.datasetId, COALESCE(SUM(dd.dataCount), 0) FROM DatasetData dd " +
      "WHERE dd.datasetId IN :datasetIds GROUP BY dd.datasetId")
  List<Object[]> sumRecordsByDatasetIds(@Param("datasetIds") List<Long> datasetIds);

}
