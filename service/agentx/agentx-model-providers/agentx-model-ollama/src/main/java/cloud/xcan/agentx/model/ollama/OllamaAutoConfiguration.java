package cloud.xcan.agentx.model.ollama;

import cloud.xcan.core.model.ModelConfigDefinition;
import cloud.xcan.core.model.ModelFactory;
import cloud.xcan.core.model.ModelProvider;
import dev.langchain4j.model.chat.ChatModel;
import dev.langchain4j.model.chat.StreamingChatModel;
import dev.langchain4j.model.embedding.EmbeddingModel;
import dev.langchain4j.model.ollama.OllamaChatModel;
import dev.langchain4j.model.ollama.OllamaEmbeddingModel;
import dev.langchain4j.model.ollama.OllamaStreamingChatModel;
import lombok.extern.slf4j.Slf4j;
import cloud.xcan.core.model.ModelConfigProvider;

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
      return OllamaChatModel.builder()
          .baseUrl(baseUrl)
          .modelName(config.getModelName())
          .temperature(config.getTemperature())
          .build();
    }

    @Override
    public StreamingChatModel createStreamingChatModel(ModelConfigDefinition config) {
      String baseUrl = config.getBaseUrl() != null ? config.getBaseUrl() : "http://localhost:11434";
      log.info("Creating Ollama streaming chat model: {} at {}", config.getModelName(), baseUrl);
      return OllamaStreamingChatModel.builder()
          .baseUrl(baseUrl)
          .modelName(config.getModelName())
          .temperature(config.getTemperature())
          .build();
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
