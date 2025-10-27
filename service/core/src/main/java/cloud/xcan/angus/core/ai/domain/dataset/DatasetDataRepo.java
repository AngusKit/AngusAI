package cloud.xcan.angus.core.ai.domain.dataset;

import cloud.xcan.angus.core.jpa.repository.BaseRepository;
import java.util.List;
import org.springframework.data.repository.NoRepositoryBean;

@NoRepositoryBean
public interface DatasetDataRepo extends BaseRepository<DatasetData, Long> {

  List<DatasetData> findByDatasetId(Long datasetId);

  List<DatasetData> findByDatasetIdAndNameIn(Long datasetId, List<String> names);

  void deleteByIdAndNameIn(Long id, List<String> names);

}
