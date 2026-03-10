package cloud.xcan.agentx.model.ollama;

import cloud.xcan.agentx.core.model.ModelConfigDefinition;
import cloud.xcan.agentx.core.model.ModelConfigProvider;
import cloud.xcan.agentx.core.model.ModelFactory;
import cloud.xcan.agentx.core.model.ModelProvider;
import dev.langchain4j.model.chat.ChatModel;
import dev.langchain4j.model.chat.StreamingChatModel;
import dev.langchain4j.model.embedding.EmbeddingModel;
import dev.langchain4j.model.ollama.OllamaChatModel;
import dev.langchain4j.model.ollama.OllamaEmbeddingModel;
import dev.langchain4j.model.ollama.OllamaStreamingChatModel;
import java.time.Duration;
import lombok.extern.slf4j.Slf4j;

/**
 * Ollama 模块自动配置 — 提供 OllamaModelFactory 组件。
 * <p>
 * 模型配置由 {@link ModelConfigProvider} 从数据库等外部源加载。
 * </p>
 */
public class OllamaAutoConfiguration {

  @Slf4j
  public static class OllamaModelFactory implements ModelFactory {

    @Override
    public ModelProvider getProvider() {
      return ModelProvider.OLLAMA;
    }

    @Override
    public ChatModel createChatModel(ModelConfigDefinition config) {
      String baseUrl = config.getBaseUrl() != null ? config.getBaseUrl() : "http://localhost:11434";
      log.info("Creating Ollama chat model: {} at {}", config.getModelName(), baseUrl);
      var builder = OllamaChatModel.builder()
          .baseUrl(baseUrl)
          .modelName(config.getModelName())
          .temperature(config.getTemperature());
      if (config.getTopP() != null) {
        builder.topP(config.getTopP());
      }
      if (config.getTimeoutSeconds() != null && config.getTimeoutSeconds() > 0) {
        builder.timeout(Duration.ofSeconds(config.getTimeoutSeconds()));
      }
      return builder.build();
    }

    @Override
    public StreamingChatModel createStreamingChatModel(ModelConfigDefinition config) {
      String baseUrl = config.getBaseUrl() != null ? config.getBaseUrl() : "http://localhost:11434";
      log.info("Creating Ollama streaming chat model: {} at {}", config.getModelName(), baseUrl);
      var streamBuilder = OllamaStreamingChatModel.builder()
          .baseUrl(baseUrl)
          .modelName(config.getModelName())
          .temperature(config.getTemperature());
      if (config.getTopP() != null) {
        streamBuilder.topP(config.getTopP());
      }
      if (config.getTimeoutSeconds() != null && config.getTimeoutSeconds() > 0) {
        streamBuilder.timeout(Duration.ofSeconds(config.getTimeoutSeconds()));
      }
      return streamBuilder.build();
    }

    @Override
    public EmbeddingModel createEmbeddingModel(ModelConfigDefinition config) {
      String baseUrl = config.getBaseUrl() != null ? config.getBaseUrl() : "http://localhost:11434";
      String embeddingModel = config.getEmbeddingModelName() != null
          ? config.getEmbeddingModelName() : config.getModelName();
      log.info("Creating Ollama embedding model: {} at {}", embeddingModel, baseUrl);
      return OllamaEmbeddingModel.builder()
          .baseUrl(baseUrl)
          .modelName(embeddingModel)
          .build();
    }
  }
}
