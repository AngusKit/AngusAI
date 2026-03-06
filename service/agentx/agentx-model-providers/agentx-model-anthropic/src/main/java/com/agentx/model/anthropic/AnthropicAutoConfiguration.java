package com.agentx.model.anthropic;

import com.agentx.core.model.ModelConfigDefinition;
import com.agentx.core.model.ModelFactory;
import dev.langchain4j.model.anthropic.AnthropicChatModel;
import dev.langchain4j.model.anthropic.AnthropicStreamingChatModel;
import dev.langchain4j.model.chat.ChatModel;
import dev.langchain4j.model.chat.StreamingChatModel;
import dev.langchain4j.model.embedding.EmbeddingModel;
import lombok.extern.slf4j.Slf4j;

/**
 * Anthropic 模块自动配置 — 提供 AnthropicModelFactory 组件。
 * <p>
 * 模型配置由 {@link com.agentx.core.model.ModelConfigProvider} 从数据库等外部源加载。
 * </p>
 */
public class AnthropicAutoConfiguration {

  @Slf4j
  public static class AnthropicModelFactory implements ModelFactory {

    @Override
    public String getProvider() {
      return "anthropic";
    }

    @Override
    public ChatModel createChatModel(ModelConfigDefinition config) {
      log.info("Creating Anthropic chat model: {}", config.getModelName());
      return AnthropicChatModel.builder()
          .apiKey(config.getApiKey())
          .modelName(config.getModelName())
          .temperature(config.getTemperature())
          .maxTokens(config.getMaxTokens() != null ? config.getMaxTokens() : 4096)
          .build();
    }

    @Override
    public StreamingChatModel createStreamingChatModel(ModelConfigDefinition config) {
      log.info("Creating Anthropic streaming chat model: {}", config.getModelName());
      return AnthropicStreamingChatModel.builder()
          .apiKey(config.getApiKey())
          .modelName(config.getModelName())
          .temperature(config.getTemperature())
          .maxTokens(config.getMaxTokens() != null ? config.getMaxTokens() : 4096)
          .build();
    }

    @Override
    public EmbeddingModel createEmbeddingModel(ModelConfigDefinition config) {
      // Anthropic 目前不提供独立的 Embedding API
      return null;
    }
  }
}
