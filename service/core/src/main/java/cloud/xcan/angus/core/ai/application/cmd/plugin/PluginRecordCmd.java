package cloud.xcan.angus.core.ai.application.cmd.plugin;

import cloud.xcan.angus.core.ai.domain.plugin.PluginRecordType;

public interface PluginRecordCmd {

  // Helper to persist plugin event record
  void recordPluginEvent(Long pluginId, PluginRecordType type);
}
