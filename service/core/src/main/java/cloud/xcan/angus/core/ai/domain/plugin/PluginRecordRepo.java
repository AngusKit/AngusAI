package cloud.xcan.angus.core.ai.domain.plugin;

import cloud.xcan.angus.core.jpa.repository.BaseRepository;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.NoRepositoryBean;

@NoRepositoryBean
public interface PluginRecordRepo extends BaseRepository<PluginRecord, Long> {

  List<PluginRecord> findByPluginId(Long pluginId);

  List<PluginRecord> findByPluginIdAndType(Long pluginId, PluginRecordType type);

  @Query("select count(r) from PluginRecord r where r.type = ?1 and r.createdDate between ?2 and ?3")
  Long countByTypeBetween(PluginRecordType type, LocalDateTime start, LocalDateTime end);

  @Query("select count(r) from PluginRecord r where r.type = ?1")
  Long countByType(PluginRecordType type);

  @Query("select count(r) from PluginRecord r where r.pluginId = ?1 and r.type = ?2")
  Long countByPluginIdAndType(Long pluginId, PluginRecordType type);

  @Modifying
  void deleteByPluginId(Long id);
}
