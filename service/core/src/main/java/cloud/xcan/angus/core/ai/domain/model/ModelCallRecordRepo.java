package cloud.xcan.angus.core.ai.domain.model;

import cloud.xcan.angus.core.jpa.repository.BaseRepository;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.NoRepositoryBean;

@NoRepositoryBean
public interface ModelCallRecordRepo extends BaseRepository<ModelCallRecord, Long> {

  List<ModelCallRecord> findByModelId(Long modelId);

  @Query("select count(r) from ModelCallRecord r where r.modelId = ?1")
  Long countByModelId(Long modelId);

  @Query("select count(r) from ModelCallRecord r where r.modelId = ?1 and r.success = true")
  Long countSuccessByModelId(Long modelId);

  @Query("select count(r) from ModelCallRecord r where r.modelId = ?1 and r.success = false")
  Long countFailedByModelId(Long modelId);

  @Query("select coalesce(sum(r.tokens),0) from ModelCallRecord r where r.modelId = ?1")
  Long sumTokensByModelId(Long modelId);

  @Query("select coalesce(sum(r.cost),0) from ModelCallRecord r where r.modelId = ?1")
  Double sumCostByModelId(Long modelId);

  @Query("select coalesce(avg(r.responseTimeMs),0) from ModelCallRecord r where r.modelId = ?1")
  Double avgResponseTimeByModelId(Long modelId);

  @Query("select count(r) from ModelCallRecord r where r.modelId = ?1 and r.createdDate >= ?2")
  Long countLast24hByModelId(Long modelId, LocalDateTime since);
}

