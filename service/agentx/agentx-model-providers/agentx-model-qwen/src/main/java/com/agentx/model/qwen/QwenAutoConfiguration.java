package com.agentx.model.qwen;

import com.agentx.core.model.ModelConfigDefinition;
import com.agentx.core.model.ModelFactory;
import dev.langchain4j.model.chat.ChatModel;
import dev.langchain4j.model.chat.StreamingChatModel;
import dev.langchain4j.model.embedding.EmbeddingModel;
import dev.langchain4j.model.openai.OpenAiChatModel;
import dev.langchain4j.model.openai.OpenAiEmbeddingModel;
import dev.langchain4j.model.openai.OpenAiStreamingChatModel;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Configuration;
import org.springframework.stereotype.Component;

/**
 * 通义千问 (Qwen) 模块自动配置 — 通过 DashScope OpenAI 兼容接口实现。
 */
@Configuration
public class QwenAutoConfiguration {

  private static final String DEFAULT_BASE_URL = "https://dashscope.aliyuncs.com/compatible-mode/v1";

  @Slf4j
  @Component
  public static class QwenModelFactory implements ModelFactory {

    @Override
    public String getProvider() {
      return "qwen";
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
      return builder.build();
    }

    @Override
    public StreamingChatModel createStreamingChatModel(ModelConfigDefinition config) {
      log.info("Creating Qwen streaming chat model: {}", config.getModelName());
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
