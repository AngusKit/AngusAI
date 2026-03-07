package cloud.xcan.agentx.model.zhipu;

import cloud.xcan.agentx.core.model.ModelConfigDefinition;
import cloud.xcan.agentx.core.model.ModelFactory;
import cloud.xcan.agentx.core.model.ModelProvider;
import dev.langchain4j.model.chat.ChatModel;
import dev.langchain4j.model.chat.StreamingChatModel;
import dev.langchain4j.model.embedding.EmbeddingModel;
import dev.langchain4j.model.openai.OpenAiChatModel;
import dev.langchain4j.model.openai.OpenAiEmbeddingModel;
import dev.langchain4j.model.openai.OpenAiStreamingChatModel;
import lombok.extern.slf4j.Slf4j;

/**
 * 智谱 AI (Zhipu) 模块自动配置 — 通过 OpenAI 兼容接口实现。
 */
public class  ZhipuAutoConfiguration {

  private static final String DEFAULT_BASE_URL = "https://open.bigmodel.cn/api/paas/v4";

  @Slf4j
  public static class ZhipuModelFactory implements ModelFactory {

    @Override
    public ModelProvider getProvider() {
      return ModelProvider.ZHIPU;
    }

    @Override
    public ChatModel createChatModel(ModelConfigDefinition config) {
      log.info("Creating Zhipu chat model: {}", config.getModelName());
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
      log.info("Creating Zhipu streaming chat model: {}", config.getModelName());
      String baseUrl = config.getBaseUrl() != null ? config.getBaseUrl() : DEFAULT_BASE_URL;
      return OpenAiStreamingChatModel.builder()
          .baseUrl(baseUrl)
          .apiKey(config.getApiKey())
          .modelName(config.getModelName())
          .temperature(config.getTemperature())
          .build();
    }

    @Override
    public EmbeddingModel createEmbeddingModel(ModelConfigDefinition config) {
      String embeddingModel = config.getEmbeddingModelName() != null
          ? config.getEmbeddingModelName() : "embedding-3";
      log.info("Creating Zhipu embedding model: {}", embeddingModel);
      String baseUrl = config.getBaseUrl() != null ? config.getBaseUrl() : DEFAULT_BASE_URL;
      return OpenAiEmbeddingModel.builder()
          .baseUrl(baseUrl)
          .apiKey(config.getApiKey())
          .modelName(embeddingModel)
          .build();
    }
  }
}
