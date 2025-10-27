package cloud.xcan.angus.core.ai.infra.ai.model;

import java.util.EnumSet;
import java.util.Set;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

/**
 * 模型特性检测器 - 根据截图信息实现模型特性判断
 */
@Component
@Slf4j
public class ModelFeatureDetector {

  /**
   * 检测模型提供商支持的特性
   */
  public Set<ModelFeature> detectFeatures(ModelProvider provider, ModelType modelType) {
    EnumSet<ModelFeature> features = EnumSet.noneOf(ModelFeature.class);

    switch (provider) {
      case OPENAI:
        features.addAll(getOpenAIFeatures(modelType));
        break;
      case ANTHROPIC:
        features.addAll(getAnthropicFeatures(modelType));
        break;
      case AZURE_OPENAI:
        features.addAll(getAzureOpenAIFeatures(modelType));
        break;
      case GOOGLE_VERTEXAI:
        features.addAll(getGoogleVertexAIFeatures(modelType));
        break;
      case AMAZON_BEDROCK:
        features.addAll(getAmazonBedrockFeatures(modelType));
        break;
      case OLLAMA:
        features.addAll(getOllamaFeatures(modelType));
        break;
      case HUGGINGFACE:
        features.addAll(getHuggingFaceFeatures(modelType));
        break;
      case MISTRAL_AI:
        features.addAll(getMistralAIFeatures(modelType));
        break;
      case DEEPSEEK:
        features.addAll(getDeepSeekFeatures(modelType));
        break;
      case MOONSHOT_AI:
        features.addAll(getMoonshotAIFeatures(modelType));
        break;
      case ZHIPU_AI:
        features.addAll(getZhipuAIFeatures(modelType));
        break;
      case MINIMAX:
        features.addAll(getMiniMaxFeatures(modelType));
        break;
      case GROQ:
        features.addAll(getGroqFeatures(modelType));
        break;
      case NVIDIA:
        features.addAll(getNvidiaFeatures(modelType));
        break;
      case OCI_GENAI:
        features.addAll(getOCIGenAIFeatures(modelType));
        break;
      case PERPLEXITY:
        features.addAll(getPerplexityFeatures(modelType));
        break;
      case QIANFAN:
        features.addAll(getQianFanFeatures(modelType));
        break;
      case STABILITY:
        features.addAll(getStabilityFeatures(modelType));
        break;
      case ONNX_TRANSFORMERS:
        features.addAll(getONNXTransformersFeatures(modelType));
        break;
      case POSTGRESML:
        features.addAll(getPostgresMLFeatures(modelType));
        break;
      case LOCAL:
        features.addAll(getLocalFeatures(modelType));
        break;
      case CUSTOM:
        features.addAll(getCustomFeatures(modelType));
        break;
      default:
        log.warn("未知的模型提供商: {}", provider);
    }
    return features;
  }

  /**
   * OpenAI特性
   */
  private Set<ModelFeature> getOpenAIFeatures(ModelType modelType) {
    EnumSet<ModelFeature> features = EnumSet.of(
        ModelFeature.TOOLS_FUNCTIONS,
        ModelFeature.STREAMING,
        ModelFeature.RETRY,
        ModelFeature.OBSERVABILITY,
        ModelFeature.OPENAI_API_COMPATIBLE
    );

    switch (modelType) {
      case CHAT:
        features.add(ModelFeature.MULTIMODALITY);
        features.add(ModelFeature.BUILT_IN_JSON);
        break;
      case IMAGE:
        // OpenAI 支持 ImageModel
        features.add(ModelFeature.MULTIMODALITY);
        break;
      case AUDIO:
        // OpenAI 支持 AudioModel
        features.add(ModelFeature.MULTIMODALITY);
        break;
      case EMBEDDING:
        // EmbeddingModel 支持14种提供商
        break;
      case MODERATION:
        // OpenAI 支持 ModerationModel
        break;
    }
    return features;
  }

  /**
   * Anthropic特性
   */
  private Set<ModelFeature> getAnthropicFeatures(ModelType modelType) {
    EnumSet<ModelFeature> features = EnumSet.of(
        ModelFeature.TOOLS_FUNCTIONS,
        ModelFeature.STREAMING,
        ModelFeature.RETRY,
        ModelFeature.OBSERVABILITY
    );

    switch (modelType) {
      case CHAT:
        features.add(ModelFeature.MULTIMODALITY);
        features.add(ModelFeature.BUILT_IN_JSON);
        break;
      case IMAGE:
        // ImageModel 只支持 Azure OpenAI、OpenAI、Stability、ZhiPuAI、QianFan
        break;
      case AUDIO:
        // AudioModel 只支持 OpenAI
        break;
      case EMBEDDING:
        // EmbeddingModel 支持14种提供商
        break;
      case MODERATION:
        // ModerationModel 只支持 OpenAI 和 Mistral AI
        break;
    }
    return features;
  }

  /**
   * Azure OpenAI特性
   */
  private Set<ModelFeature> getAzureOpenAIFeatures(ModelType modelType) {
    EnumSet<ModelFeature> features = EnumSet.of(
        ModelFeature.TOOLS_FUNCTIONS,
        ModelFeature.STREAMING,
        ModelFeature.RETRY,
        ModelFeature.OBSERVABILITY,
        ModelFeature.OPENAI_API_COMPATIBLE
    );

    switch (modelType) {
      case CHAT:
        features.add(ModelFeature.MULTIMODALITY);
        features.add(ModelFeature.BUILT_IN_JSON);
        break;
      case IMAGE:
        // Azure OpenAI 支持 ImageModel
        features.add(ModelFeature.MULTIMODALITY);
        break;
      case AUDIO:
        features.add(ModelFeature.MULTIMODALITY);
        break;
      case EMBEDDING:
        // EmbeddingModel 支持14种提供商
        break;
      case MODERATION:
        // ModerationModel 只支持 OpenAI 和 Mistral AI
        break;
    }
    return features;
  }

  /**
   * Google VertexAI特性
   */
  private Set<ModelFeature> getGoogleVertexAIFeatures(ModelType modelType) {
    EnumSet<ModelFeature> features = EnumSet.of(
        ModelFeature.TOOLS_FUNCTIONS,
        ModelFeature.STREAMING,
        ModelFeature.RETRY,
        ModelFeature.OBSERVABILITY
    );

    switch (modelType) {
      case CHAT:
        features.add(ModelFeature.MULTIMODALITY);
        features.add(ModelFeature.BUILT_IN_JSON);
        break;
      case IMAGE:
        // ImageModel 只支持 Azure OpenAI、OpenAI、Stability、ZhiPuAI、QianFan
        features.add(ModelFeature.MULTIMODALITY);
        break;
      case AUDIO:
        features.add(ModelFeature.MULTIMODALITY);
        break;
      case EMBEDDING:
        // EmbeddingModel 支持14种提供商
        break;
      case MODERATION:
        // ModerationModel 只支持 OpenAI 和 Mistral AI
        break;
    }
    return features;
  }

  /**
   * Amazon Bedrock特性
   */
  private Set<ModelFeature> getAmazonBedrockFeatures(ModelType modelType) {
    EnumSet<ModelFeature> features = EnumSet.of(
        ModelFeature.TOOLS_FUNCTIONS,
        ModelFeature.STREAMING,
        ModelFeature.RETRY,
        ModelFeature.OBSERVABILITY
    );

    switch (modelType) {
      case CHAT:
        features.add(ModelFeature.MULTIMODALITY);
        features.add(ModelFeature.BUILT_IN_JSON);
        break;
      case IMAGE:
        // ImageModel 只支持 Azure OpenAI、OpenAI、Stability、ZhiPuAI、QianFan
        features.add(ModelFeature.MULTIMODALITY);
        break;
      case AUDIO:
        features.add(ModelFeature.MULTIMODALITY);
        break;
      case EMBEDDING:
        // EmbeddingModel 支持14种提供商
        break;
      case MODERATION:
        // ModerationModel 只支持 OpenAI 和 Mistral AI
        break;
    }
    return features;
  }

  /**
   * Ollama特性
   */
  private Set<ModelFeature> getOllamaFeatures(ModelType modelType) {
    EnumSet<ModelFeature> features = EnumSet.of(
        ModelFeature.TOOLS_FUNCTIONS,
        ModelFeature.STREAMING,
        ModelFeature.RETRY,
        ModelFeature.OBSERVABILITY,
        ModelFeature.LOCAL
    );

    switch (modelType) {
      case CHAT:
        features.add(ModelFeature.MULTIMODALITY);
        break;
      case IMAGE:
        // ImageModel 只支持 Azure OpenAI、OpenAI、Stability、ZhiPuAI、QianFan
        features.add(ModelFeature.MULTIMODALITY);
        break;
      case AUDIO:
        // AudioModel 只支持 OpenAI
        break;
      case EMBEDDING:
        // EmbeddingModel 支持14种提供商
        break;
      case MODERATION:
        // ModerationModel 只支持 OpenAI 和 Mistral AI
        break;
    }
    return features;
  }

  /**
   * HuggingFace特性
   */
  private Set<ModelFeature> getHuggingFaceFeatures(ModelType modelType) {
    EnumSet<ModelFeature> features = EnumSet.of(ModelFeature.LOCAL);

    switch (modelType) {
      case CHAT:
        break;
      case IMAGE:
        break;
      case AUDIO:
        // AudioModel 只支持 OpenAI
        break;
      case EMBEDDING:
        // EmbeddingModel 支持14种提供商
        break;
      case MODERATION:
        // ModerationModel 只支持 OpenAI 和 Mistral AI
        break;
    }
    return features;
  }

  /**
   * Mistral AI特性
   */
  private Set<ModelFeature> getMistralAIFeatures(ModelType modelType) {
    EnumSet<ModelFeature> features = EnumSet.of(
        ModelFeature.TOOLS_FUNCTIONS,
        ModelFeature.STREAMING,
        ModelFeature.RETRY,
        ModelFeature.OBSERVABILITY
    );

    switch (modelType) {
      case CHAT:
        features.add(ModelFeature.MULTIMODALITY);
        break;
      case IMAGE:
        // ImageModel 只支持 Azure OpenAI、OpenAI、Stability、ZhiPuAI、QianFan
        features.add(ModelFeature.MULTIMODALITY);
        break;
      case AUDIO:
        features.add(ModelFeature.MULTIMODALITY);
        break;
      case EMBEDDING:
        // EmbeddingModel 支持14种提供商
        break;
      case MODERATION:
        // Mistral AI 支持 ModerationModel
        break;
    }
    return features;
  }

  /**
   * DeepSeek特性
   */
  private Set<ModelFeature> getDeepSeekFeatures(ModelType modelType) {
    EnumSet<ModelFeature> features = EnumSet.of(
        ModelFeature.TOOLS_FUNCTIONS,
        ModelFeature.STREAMING,
        ModelFeature.RETRY,
        ModelFeature.OBSERVABILITY,
        ModelFeature.OPENAI_API_COMPATIBLE
    );

    switch (modelType) {
      case CHAT:
        break;
      case IMAGE:
        break;
      case AUDIO:
        // AudioModel 只支持 OpenAI
        break;
      case EMBEDDING:
        // EmbeddingModel 支持14种提供商
        break;
      case MODERATION:
        // ModerationModel 只支持 OpenAI 和 Mistral AI
        break;
    }
    return features;
  }

  /**
   * Moonshot AI特性
   */
  private Set<ModelFeature> getMoonshotAIFeatures(ModelType modelType) {
    EnumSet<ModelFeature> features = EnumSet.of(
        ModelFeature.TOOLS_FUNCTIONS,
        ModelFeature.STREAMING,
        ModelFeature.RETRY,
        ModelFeature.OBSERVABILITY
    );

    switch (modelType) {
      case CHAT:
        break;
      case IMAGE:
        break;
      case AUDIO:
        // AudioModel 只支持 OpenAI
        break;
      case EMBEDDING:
        // EmbeddingModel 支持14种提供商
        break;
      case MODERATION:
        // ModerationModel 只支持 OpenAI 和 Mistral AI
        break;
    }
    return features;
  }

  /**
   * 智谱AI特性
   */
  private Set<ModelFeature> getZhipuAIFeatures(ModelType modelType) {
    EnumSet<ModelFeature> features = EnumSet.of(
        ModelFeature.TOOLS_FUNCTIONS,
        ModelFeature.STREAMING,
        ModelFeature.RETRY,
        ModelFeature.OBSERVABILITY
    );

    switch (modelType) {
      case CHAT:
        features.add(ModelFeature.MULTIMODALITY);
        break;
      case IMAGE:
        // 智谱AI 支持 ImageModel
        features.add(ModelFeature.MULTIMODALITY);
        break;
      case AUDIO:
        // AudioModel 只支持 OpenAI
        break;
      case EMBEDDING:
        // EmbeddingModel 支持14种提供商
        break;
      case MODERATION:
        // ModerationModel 只支持 OpenAI 和 Mistral AI
        break;
    }
    return features;
  }

  /**
   * MiniMax特性
   */
  private Set<ModelFeature> getMiniMaxFeatures(ModelType modelType) {
    EnumSet<ModelFeature> features = EnumSet.of(
        ModelFeature.TOOLS_FUNCTIONS,
        ModelFeature.STREAMING,
        ModelFeature.RETRY,
        ModelFeature.OBSERVABILITY
    );

    switch (modelType) {
      case CHAT:
        break;
      case IMAGE:
        break;
      case AUDIO:
        // AudioModel 只支持 OpenAI
        break;
      case EMBEDDING:
        // EmbeddingModel 支持14种提供商
        break;
      case MODERATION:
        // ModerationModel 只支持 OpenAI 和 Mistral AI
        break;
    }
    return features;
  }

  /**
   * Groq特性
   */
  private Set<ModelFeature> getGroqFeatures(ModelType modelType) {
    EnumSet<ModelFeature> features = EnumSet.of(
        ModelFeature.TOOLS_FUNCTIONS,
        ModelFeature.STREAMING,
        ModelFeature.RETRY,
        ModelFeature.OBSERVABILITY,
        ModelFeature.OPENAI_API_COMPATIBLE
    );

    switch (modelType) {
      case CHAT:
        features.add(ModelFeature.MULTIMODALITY);
        break;
      case IMAGE:
        // ImageModel 只支持 Azure OpenAI、OpenAI、Stability、ZhiPuAI、QianFan
        features.add(ModelFeature.MULTIMODALITY);
        break;
      case AUDIO:
        // AudioModel 只支持 OpenAI
        break;
      case EMBEDDING:
        // EmbeddingModel 支持14种提供商
        break;
      case MODERATION:
        // ModerationModel 只支持 OpenAI 和 Mistral AI
        break;
    }
    return features;
  }

  /**
   * NVIDIA特性
   */
  private Set<ModelFeature> getNvidiaFeatures(ModelType modelType) {
    EnumSet<ModelFeature> features = EnumSet.of(
        ModelFeature.TOOLS_FUNCTIONS,
        ModelFeature.STREAMING,
        ModelFeature.RETRY,
        ModelFeature.OBSERVABILITY,
        ModelFeature.OPENAI_API_COMPATIBLE
    );

    switch (modelType) {
      case CHAT:
        features.add(ModelFeature.MULTIMODALITY);
        break;
      case IMAGE:
        // ImageModel 只支持 Azure OpenAI、OpenAI、Stability、ZhiPuAI、QianFan
        features.add(ModelFeature.MULTIMODALITY);
        break;
      case AUDIO:
        // AudioModel 只支持 OpenAI
        break;
      case EMBEDDING:
        // EmbeddingModel 支持14种提供商
        break;
      case MODERATION:
        // ModerationModel 只支持 OpenAI 和 Mistral AI
        break;
    }
    return features;
  }

  /**
   * OCI GenAI特性
   */
  private Set<ModelFeature> getOCIGenAIFeatures(ModelType modelType) {
    EnumSet<ModelFeature> features = EnumSet.of(
        ModelFeature.OBSERVABILITY
    );

    switch (modelType) {
      case CHAT:
        break;
      case IMAGE:
        break;
      case AUDIO:
        // AudioModel 只支持 OpenAI
        break;
      case EMBEDDING:
        // EmbeddingModel 支持14种提供商
        break;
      case MODERATION:
        // ModerationModel 只支持 OpenAI 和 Mistral AI
        break;
    }
    return features;
  }

  /**
   * Perplexity特性
   */
  private Set<ModelFeature> getPerplexityFeatures(ModelType modelType) {
    EnumSet<ModelFeature> features = EnumSet.of(
        ModelFeature.STREAMING,
        ModelFeature.RETRY,
        ModelFeature.OBSERVABILITY,
        ModelFeature.OPENAI_API_COMPATIBLE
    );

    switch (modelType) {
      case CHAT:
        break;
      case IMAGE:
        break;
      case AUDIO:
        // AudioModel 只支持 OpenAI
        break;
      case EMBEDDING:
        // EmbeddingModel 支持14种提供商
        break;
      case MODERATION:
        // ModerationModel 只支持 OpenAI 和 Mistral AI
        break;
    }
    return features;
  }

  /**
   * 千帆特性
   */
  private Set<ModelFeature> getQianFanFeatures(ModelType modelType) {
    EnumSet<ModelFeature> features = EnumSet.of(
        ModelFeature.STREAMING,
        ModelFeature.RETRY,
        ModelFeature.OBSERVABILITY
    );

    switch (modelType) {
      case CHAT:
        break;
      case IMAGE:
        // 千帆 支持 ImageModel
        features.add(ModelFeature.MULTIMODALITY);
        break;
      case AUDIO:
        // AudioModel 只支持 OpenAI
        break;
      case EMBEDDING:
        // EmbeddingModel 支持14种提供商
        break;
      case MODERATION:
        // ModerationModel 只支持 OpenAI 和 Mistral AI
        break;
    }
    return features;
  }

  /**
   * Stability AI特性
   */
  private Set<ModelFeature> getStabilityFeatures(ModelType modelType) {
    EnumSet<ModelFeature> features = EnumSet.noneOf(ModelFeature.class);

    switch (modelType) {
      case IMAGE:
        // Stability AI 支持 ImageModel
        features.add(ModelFeature.MULTIMODALITY);
        break;
      default:
        break;
    }
    return features;
  }

  /**
   * ONNX Transformers特性
   */
  private Set<ModelFeature> getONNXTransformersFeatures(ModelType modelType) {
    EnumSet<ModelFeature> features = EnumSet.of(ModelFeature.LOCAL);

    switch (modelType) {
      case EMBEDDING:
        // EmbeddingModel 支持14种提供商
        break;
      default:
        break;
    }
    return features;
  }

  /**
   * PostgresML特性
   */
  private Set<ModelFeature> getPostgresMLFeatures(ModelType modelType) {
    EnumSet<ModelFeature> features = EnumSet.of(ModelFeature.LOCAL);

    switch (modelType) {
      case EMBEDDING:
        // EmbeddingModel 支持14种提供商
        break;
      default:
        break;
    }
    return features;
  }

  /**
   * 本地部署特性
   */
  private Set<ModelFeature> getLocalFeatures(ModelType modelType) {
    EnumSet<ModelFeature> features = EnumSet.of(ModelFeature.LOCAL);

    switch (modelType) {
      case CHAT:
        break;
      case IMAGE:
        break;
      case AUDIO:
        // AudioModel 只支持 OpenAI
        break;
      case EMBEDDING:
        // EmbeddingModel 支持14种提供商
        break;
      case MODERATION:
        // ModerationModel 只支持 OpenAI 和 Mistral AI
        break;
    }
    return features;
  }

  /**
   * 自定义特性
   */
  private Set<ModelFeature> getCustomFeatures(ModelType modelType) {
    EnumSet<ModelFeature> features = EnumSet.noneOf(ModelFeature.class);

    switch (modelType) {
      case CHAT:
        break;
      case IMAGE:
        break;
      case AUDIO:
        // AudioModel 只支持 OpenAI
        break;
      case EMBEDDING:
        // EmbeddingModel 支持14种提供商
        break;
      case MODERATION:
        // ModerationModel 只支持 OpenAI 和 Mistral AI
        break;
    }
    return features;
  }

  /**
   * 检测是否支持特定特性
   */
  public boolean supportsFeature(ModelProvider provider, ModelType modelType,
      ModelFeature feature) {
    Set<ModelFeature> features = detectFeatures(provider, modelType);
    return features.contains(feature);
  }

  /**
   * 检测是否支持多模态类型
   */
  public boolean supportsMultimodalityType(ModelProvider provider, ModelType modelType,
      String multimodalityType) {
    // 根据截图信息实现多模态类型检测
    return switch (provider) {
      case OPENAI -> switch (modelType) {
        case CHAT -> Set.of("text", "image", "audio").contains(multimodalityType);
        case IMAGE -> "image".equals(multimodalityType);
        case AUDIO -> Set.of("audio", "text").contains(multimodalityType);
        default -> false;
      };
      case ANTHROPIC -> switch (modelType) {
        case CHAT -> Set.of("text", "pdf", "image").contains(multimodalityType);
        case IMAGE -> "image".equals(multimodalityType);
        default -> false;
      };
      case GOOGLE_VERTEXAI -> switch (modelType) {
        case CHAT -> Set.of("text", "pdf", "image", "audio", "video").contains(multimodalityType);
        case IMAGE -> "image".equals(multimodalityType);
        case AUDIO -> Set.of("audio", "text").contains(multimodalityType);
        default -> false;
      };
      case AMAZON_BEDROCK -> switch (modelType) {
        case CHAT -> Set.of("text", "image", "video", "docs").contains(multimodalityType);
        case IMAGE -> "image".equals(multimodalityType);
        case AUDIO -> Set.of("audio", "text").contains(multimodalityType);
        default -> false;
      };
      case OLLAMA -> switch (modelType) {
        case CHAT -> Set.of("text", "image").contains(multimodalityType);
        case IMAGE -> "image".equals(multimodalityType);
        default -> false;
      };
      case MISTRAL_AI -> switch (modelType) {
        case CHAT -> Set.of("text", "image", "audio").contains(multimodalityType);
        case IMAGE -> "image".equals(multimodalityType);
        case AUDIO -> Set.of("audio", "text").contains(multimodalityType);
        default -> false;
      };
      case ZHIPU_AI -> switch (modelType) {
        case CHAT -> Set.of("text", "image", "docs").contains(multimodalityType);
        case IMAGE -> "image".equals(multimodalityType);
        default -> false;
      };
      default -> false;
    };
  }
}
