package cloud.xcan.agentx.model.deepseek;

import cloud.xcan.core.model.ModelConfigDefinition;
import cloud.xcan.core.model.ModelFactory;
import cloud.xcan.core.model.ModelProvider;
import dev.langchain4j.model.chat.ChatModel;
import dev.langchain4j.model.chat.StreamingChatModel;
import dev.langchain4j.model.openai.OpenAiChatModel;
import dev.langchain4j.model.openai.OpenAiStreamingChatModel;
import lombok.extern.slf4j.Slf4j;

/**
 * DeepSeek 模块自动配置 — 通过 OpenAI 兼容接口实现。
 */
public class DeepSeekAutoConfiguration {

  private static final String DEFAULT_BASE_URL = "https://api.deepseek.com";

  @Slf4j
  public static class DeepSeekModelFactory implements ModelFactory {

    @Override
    public ModelProvider getProvider() {
      return ModelProvider.DEEPSEEK;
    }

    @Override
    public ChatModel createChatModel(ModelConfigDefinition config) {
      log.info("Creating DeepSeek chat model: {}", config.getModelName());
      String baseUrl = config.getBaseUrl() != null ? config.getBaseUrl() : DEFAULT_BASE_URL;
      var builder = OpenAiChatModel.builder()
          .baseUrl(baseUrl)
          .apiKey(config.getApiKey())
          .modelName(config.getModelName())
          .temperature(config.getTemperature());
      if (config.getMaxTokens() != null) {
        builder.maxTokens(config.getMaxTokens());
      }
      return builder.build();
    }

    @Override
    public StreamingChatModel createStreamingChatModel(ModelConfigDefinition config) {
      log.info("Creating DeepSeek streaming chat model: {}", config.getModelName());
      String baseUrl = config.getBaseUrl() != null ? config.getBaseUrl() : DEFAULT_BASE_URL;
      return OpenAiStreamingChatModel.builder()
          .baseUrl(baseUrl)
          .apiKey(config.getApiKey())
          .modelName(config.getModelName())
          .temperature(config.getTemperature())
          .build();
    }
  }
}
