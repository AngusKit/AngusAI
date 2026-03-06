package com.agentx.core.model;

import dev.langchain4j.model.chat.ChatModel;
import dev.langchain4j.model.chat.StreamingChatModel;
import dev.langchain4j.model.embedding.EmbeddingModel;

/**
 * 模型工厂 SPI — 根据 ModelConfigDefinition 创建具体的 LangChain4j 模型实例。
 * <p>
 * 每个模型提供商（OpenAI、Anthropic、Ollama 等）各自实现此接口。
 * </p>
 */
public interface ModelFactory {

  /**
   * 该工厂支持的 provider 名称（如 "openai"、"anthropic"、"ollama"）
   */
  String getProvider();

  /**
   * 根据配置创建 ChatModel
   */
  ChatModel createChatModel(ModelConfigDefinition config);

  /**
   * 根据配置创建 StreamingChatModel
   */
  StreamingChatModel createStreamingChatModel(ModelConfigDefinition config);

  /**
   * 根据配置创建 EmbeddingModel（可返回 null 表示不支持）
   */
  default EmbeddingModel createEmbeddingModel(ModelConfigDefinition config) {
    return null;
  }
}
