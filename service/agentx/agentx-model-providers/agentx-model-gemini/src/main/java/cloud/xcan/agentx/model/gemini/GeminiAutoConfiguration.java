package cloud.xcan.agentx.model.gemini;

import cloud.xcan.agentx.core.model.ModelConfigDefinition;
import cloud.xcan.agentx.core.model.ModelFactory;
import cloud.xcan.agentx.core.model.ModelProvider;
import dev.langchain4j.model.chat.ChatModel;
import dev.langchain4j.model.chat.StreamingChatModel;
import dev.langchain4j.model.embedding.EmbeddingModel;
import dev.langchain4j.model.googleai.GoogleAiGeminiChatModel;
import dev.langchain4j.model.googleai.GoogleAiGeminiStreamingChatModel;
import java.time.Duration;
import lombok.extern.slf4j.Slf4j;

/**
 * Google Gemini 模块自动配置 — 提供 GeminiModelFactory 组件。
 */
public class GeminiAutoConfiguration {

  @Slf4j
  public static class GeminiModelFactory implements ModelFactory {

    @Override
    public ModelProvider getProvider() {
      return ModelProvider.GEMINI;
    }

    @Override
    public ChatModel createChatModel(ModelConfigDefinition config) {
      log.info("Creating Gemini chat model: {}", config.getModelName());
      var builder = GoogleAiGeminiChatModel.builder()
          .apiKey(config.getApiKey())
          .modelName(config.getModelName())
          .temperature(config.getTemperature())
          .maxOutputTokens(config.getMaxTokens() != null ? config.getMaxTokens() : 4096);
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
      log.info("Creating Gemini streaming chat model: {}", config.getModelName());
      var streamBuilder = GoogleAiGeminiStreamingChatModel.builder()
          .apiKey(config.getApiKey())
          .modelName(config.getModelName())
          .temperature(config.getTemperature())
          .maxOutputTokens(config.getMaxTokens() != null ? config.getMaxTokens() : 4096);
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
      // Gemini Embedding 通过独立 API 调用，暂不支持
      return null;
    }
  }
}
