package cloud.xcan.angus.core.ai.application.cmd.plugin.impl;

import cloud.xcan.angus.core.ai.application.cmd.plugin.PluginRecordCmd;
import cloud.xcan.angus.core.ai.domain.plugin.PluginRecord;
import cloud.xcan.angus.core.ai.domain.plugin.PluginRecordRepo;
import cloud.xcan.angus.core.ai.domain.plugin.PluginRecordType;
import cloud.xcan.angus.core.biz.cmd.CommCmd;
import cloud.xcan.angus.core.jpa.repository.BaseRepository;
import jakarta.annotation.Resource;
import org.springframework.stereotype.Service;

@Service
public class PluginRecordCmdImpl extends CommCmd<PluginRecord, Long> implements PluginRecordCmd {

  @Resource
  private PluginRecordRepo pluginRecordRepo;

  // Helper to persist plugin event record
  @Override
  public void recordPluginEvent(Long pluginId, PluginRecordType type) {
    try {
      PluginRecord record = new PluginRecord()
          .setPluginId(pluginId)
          .setType(type);
      insert(record);
    } catch (Exception ignore) {
      // 不影响主流程
    }
  }

  @Override
  public void deleteByPluginId(Long id) {
    pluginRecordRepo.deleteByPluginId(id);
  }

  @Override
  protected BaseRepository<PluginRecord, Long> getRepository() {
    return pluginRecordRepo;
  }
}
