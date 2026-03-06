package cloud.xcan.agentx.model.gemini;

import cloud.xcan.core.model.ModelConfigDefinition;
import cloud.xcan.core.model.ModelFactory;
import dev.langchain4j.model.chat.ChatModel;
import dev.langchain4j.model.chat.StreamingChatModel;
import dev.langchain4j.model.embedding.EmbeddingModel;
import dev.langchain4j.model.googleai.GoogleAiGeminiChatModel;
import dev.langchain4j.model.googleai.GoogleAiGeminiStreamingChatModel;
import lombok.extern.slf4j.Slf4j;

/**
 * Google Gemini 模块自动配置 — 提供 GeminiModelFactory 组件。
 */
public class GeminiAutoConfiguration {

  @Slf4j
  public static class GeminiModelFactory implements ModelFactory {

    @Override
    public String getProvider() {
      return "gemini";
    }

    @Override
    public ChatModel createChatModel(ModelConfigDefinition config) {
      log.info("Creating Gemini chat model: {}", config.getModelName());
      return GoogleAiGeminiChatModel.builder()
          .apiKey(config.getApiKey())
          .modelName(config.getModelName())
          .temperature(config.getTemperature())
          .maxOutputTokens(config.getMaxTokens() != null ? config.getMaxTokens() : 4096)
          .build();
    }

    @Override
    public StreamingChatModel createStreamingChatModel(ModelConfigDefinition config) {
      log.info("Creating Gemini streaming chat model: {}", config.getModelName());
      return GoogleAiGeminiStreamingChatModel.builder()
          .apiKey(config.getApiKey())
          .modelName(config.getModelName())
          .temperature(config.getTemperature())
          .maxOutputTokens(config.getMaxTokens() != null ? config.getMaxTokens() : 4096)
          .build();
    }

    @Override
    public EmbeddingModel createEmbeddingModel(ModelConfigDefinition config) {
      // Gemini Embedding 通过独立 API 调用，暂不支持
      return null;
    }
  }
}
