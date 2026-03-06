package com.agentx.model.openai;

import com.agentx.core.model.ModelConfigDefinition;
import com.agentx.core.model.ModelFactory;
import dev.langchain4j.model.chat.ChatModel;
import dev.langchain4j.model.chat.StreamingChatModel;
import dev.langchain4j.model.embedding.EmbeddingModel;
import dev.langchain4j.model.openai.OpenAiChatModel;
import dev.langchain4j.model.openai.OpenAiStreamingChatModel;
import dev.langchain4j.model.openai.OpenAiEmbeddingModel;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

/**
 * OpenAI 模型工厂 — 实现 ModelFactory SPI，根据数据库配置创建模型实例
 */
@Slf4j
@Component
public class OpenAiModelFactory implements ModelFactory {

  @Override
  public String getProvider() {
    return "openai";
  }

  @Override
  public ChatModel createChatModel(ModelConfigDefinition config) {
    log.info("Creating OpenAI chat model: {}", config.getModelName());
    var builder = OpenAiChatModel.builder()
        .apiKey(config.getApiKey())
        .modelName(config.getModelName())
        .temperature(config.getTemperature());
    if (config.getBaseUrl() != null) {
      builder.baseUrl(config.getBaseUrl());
    }
    if (config.getMaxTokens() != null) {
      builder.maxTokens(config.getMaxTokens());
    }
    return builder.build();
  }

  @Override
  public StreamingChatModel createStreamingChatModel(ModelConfigDefinition config) {
    log.info("Creating OpenAI streaming chat model: {}", config.getModelName());
    var builder = OpenAiStreamingChatModel.builder()
        .apiKey(config.getApiKey())
        .modelName(config.getModelName())
        .temperature(config.getTemperature());
    if (config.getBaseUrl() != null) {
      builder.baseUrl(config.getBaseUrl());
    }
    return builder.build();
  }

  @Override
  public EmbeddingModel createEmbeddingModel(ModelConfigDefinition config) {
    String embeddingModel = config.getEmbeddingModelName() != null
        ? config.getEmbeddingModelName() : "text-embedding-3-small";
    log.info("Creating OpenAI embedding model: {}", embeddingModel);
    var builder = OpenAiEmbeddingModel.builder()
        .apiKey(config.getApiKey())
        .modelName(embeddingModel);
    if (config.getBaseUrl() != null) {
      builder.baseUrl(config.getBaseUrl());
    }
    return builder.build();
  }
}
