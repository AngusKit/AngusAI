package cloud.xcan.agentx.model.qwen;

import cloud.xcan.agentx.core.model.ModelConfigDefinition;
import cloud.xcan.agentx.core.model.ModelFactory;
import cloud.xcan.agentx.core.model.ModelProvider;
import dev.langchain4j.model.chat.ChatModel;
import dev.langchain4j.model.chat.StreamingChatModel;
import dev.langchain4j.model.embedding.EmbeddingModel;
import dev.langchain4j.model.openai.OpenAiChatModel;
import dev.langchain4j.model.openai.OpenAiEmbeddingModel;
import dev.langchain4j.model.openai.OpenAiStreamingChatModel;
import java.time.Duration;
import lombok.extern.slf4j.Slf4j;

/**
 * 通义千问 (Qwen) 模块自动配置 — 通过 DashScope OpenAI 兼容接口实现。
 */
public class QwenAutoConfiguration {

  private static final String DEFAULT_BASE_URL = "https://dashscope.aliyuncs.com/compatible-mode/v1";

  @Slf4j
  public static class QwenModelFactory implements ModelFactory {

    @Override
    public ModelProvider getProvider() {
      return ModelProvider.QWEN;
    }

    @Override
    public ChatModel createChatModel(ModelConfigDefinition config) {
      log.info("Creating Qwen chat model: {}", config.getModelName());
      String baseUrl = config.getBaseUrl() != null ? config.getBaseUrl() : DEFAULT_BASE_URL;
      var builder = OpenAiChatModel.builder()
          .baseUrl(baseUrl)
          .apiKey(config.getApiKey())
          .modelName(config.getModelName())
          .temperature(config.getTemperature());
      if (config.getMaxTokens() != null) {
        builder.maxTokens(config.getMaxTokens());
      }
      if (config.getTopP() != null) {
        builder.topP(config.getTopP());
      }
      if (config.getFrequencyPenalty() != null) {
        builder.frequencyPenalty(config.getFrequencyPenalty());
      }
      if (config.getPresencePenalty() != null) {
        builder.presencePenalty(config.getPresencePenalty());
      }
      if (config.getTimeoutSeconds() != null && config.getTimeoutSeconds() > 0) {
        builder.timeout(Duration.ofSeconds(config.getTimeoutSeconds()));
      }
      return builder.build();
    }

    @Override
    public StreamingChatModel createStreamingChatModel(ModelConfigDefinition config) {
      log.info("Creating Qwen streaming chat model: {}", config.getModelName());
      String baseUrl = config.getBaseUrl() != null ? config.getBaseUrl() : DEFAULT_BASE_URL;
      var streamBuilder = OpenAiStreamingChatModel.builder()
          .baseUrl(baseUrl)
          .apiKey(config.getApiKey())
          .modelName(config.getModelName())
          .temperature(config.getTemperature());
      if (config.getMaxTokens() != null) {
        streamBuilder.maxTokens(config.getMaxTokens());
      }
      if (config.getTopP() != null) {
        streamBuilder.topP(config.getTopP());
      }
      if (config.getFrequencyPenalty() != null) {
        streamBuilder.frequencyPenalty(config.getFrequencyPenalty());
      }
      if (config.getPresencePenalty() != null) {
        streamBuilder.presencePenalty(config.getPresencePenalty());
      }
      if (config.getTimeoutSeconds() != null && config.getTimeoutSeconds() > 0) {
        streamBuilder.timeout(Duration.ofSeconds(config.getTimeoutSeconds()));
      }
      return streamBuilder.build();
    }

    @Override
    public EmbeddingModel createEmbeddingModel(ModelConfigDefinition config) {
      String embeddingModel = config.getEmbeddingModelName() != null
          ? config.getEmbeddingModelName() : "text-embedding-v3";
      log.info("Creating Qwen embedding model: {}", embeddingModel);
      String baseUrl = config.getBaseUrl() != null ? config.getBaseUrl() : DEFAULT_BASE_URL;
      return OpenAiEmbeddingModel.builder()
          .baseUrl(baseUrl)
          .apiKey(config.getApiKey())
          .modelName(embeddingModel)
          .build();
    }
  }
}
