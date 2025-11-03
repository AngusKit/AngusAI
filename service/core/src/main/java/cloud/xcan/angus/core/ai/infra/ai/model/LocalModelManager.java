package cloud.xcan.angus.core.ai.infra.ai.model;

import java.io.IOException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

@Component
@Slf4j
public class LocalModelManager {

  /**
   * 启动本地模型进程或通过 Ollama 管理模型实例。
   */
  public synchronized Object startLocalModel(Long modelId, ModelConfig config) throws IOException {

    return null;
  }

  /**
   * 停止本地模型进程，优先尝试优雅退出；若是 Ollama 管理的实例，则使用 ollamaStopCommand（或默认 ollama stop）。
   */
  public synchronized void stopLocalModel(Long modelId, boolean graceful) {

  }

  /**
   * 重启本地模型进程或通过 Ollama 管理模型实例。
   */
  public void restartLocalModel(Long id, ModelConfig config) {

  }
}
