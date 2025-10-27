package cloud.xcan.angus.core.ai.infra.ai.model;

import cloud.xcan.angus.spec.experimental.EndpointRegister;
import cloud.xcan.angus.spec.locale.EnumMessage;

@EndpointRegister
public enum ModelProvider implements EnumMessage<String> {
  // 主要提供商
  OPENAI,                    // OpenAI
  ANTHROPIC,                 // Anthropic Claude
  AZURE_OPENAI,             // Azure OpenAI
  GOOGLE_VERTEXAI,          // Google VertexAI Gemini
  AMAZON_BEDROCK,           // Amazon Bedrock

  // 开源和本地模型
  OLLAMA,                   // Ollama
  HUGGINGFACE,              // HuggingFace
  ONNX_TRANSFORMERS,        // ONNX Transformers
  POSTGRESML,               // PostgresML

  // 专业AI公司
  MISTRAL_AI,               // Mistral AI
  DEEPSEEK,                 // DeepSeek
  MOONSHOT_AI,              // Moonshot AI
  ZHIPU_AI,                 // 智谱AI
  MINIMAX,                  // MiniMax

  // 云服务提供商
  GROQ,                     // Groq
  NVIDIA,                   // NVIDIA
  OCI_GENAI,                // OCI GenAI/Cohere
  PERPLEXITY,               // Perplexity
  QIANFAN,                  // 千帆
  STABILITY,                // Stability AI

  // 其他
  LOCAL,                    // 本地部署
  CUSTOM;                   // 自定义

  public String getValue() {
    return this.name();
  }
}
