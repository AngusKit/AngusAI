package cloud.xcan.agentx.starter;

import cloud.xcan.core.model.ModelFactory;
import cloud.xcan.agentx.model.anthropic.AnthropicAutoConfiguration.AnthropicModelFactory;
import cloud.xcan.agentx.model.deepseek.DeepSeekAutoConfiguration;
import cloud.xcan.agentx.model.gemini.GeminiAutoConfiguration;
import cloud.xcan.agentx.model.ollama.OllamaAutoConfiguration.OllamaModelFactory;
import cloud.xcan.agentx.model.openai.OpenAiAutoConfiguration.OpenAiModelFactory;
import cloud.xcan.agentx.model.qwen.QwenAutoConfiguration;
import cloud.xcan.agentx.model.zhipu.ZhipuAutoConfiguration;
import org.springframework.boot.autoconfigure.condition.ConditionalOnClass;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * AgentX 模型提供商 Bean 集中注册 — 基于 classpath 条件按需加载
 */
@Configuration
public class ModelProvidersConfiguration {

  @Configuration
  @ConditionalOnClass(name = "cloud.xcan.agentx.model.openai.OpenAiAutoConfiguration")
  static class OpenAiConfig {

    @Bean
    public ModelFactory openAiModelFactory() {
      return new OpenAiModelFactory();
    }
  }

  @Configuration
  @ConditionalOnClass(name = "cloud.xcan.agentx.model.anthropic.AnthropicAutoConfiguration")
  static class AnthropicConfig {

    @Bean
    public ModelFactory anthropicModelFactory() {
      return new AnthropicModelFactory();
    }
  }

  @Configuration
  @ConditionalOnClass(name = "cloud.xcan.agentx.model.ollama.OllamaAutoConfiguration")
  static class OllamaConfig {

    @Bean
    public ModelFactory ollamaModelFactory() {
      return new OllamaModelFactory();
    }
  }

  @Configuration
  @ConditionalOnClass(name = "cloud.xcan.agentx.model.gemini.GeminiAutoConfiguration")
  static class GeminiConfig {

    @Bean
    public ModelFactory geminiModelFactory() {
      return new GeminiAutoConfiguration.GeminiModelFactory();
    }
  }

  @Configuration
  @ConditionalOnClass(name = "cloud.xcan.agentx.model.qwen.QwenAutoConfiguration")
  static class QwenConfig {

    @Bean
    public ModelFactory qwenModelFactory() {
      return new QwenAutoConfiguration.QwenModelFactory();
    }
  }

  @Configuration
  @ConditionalOnClass(name = "cloud.xcan.agentx.model.zhipu.ZhipuAutoConfiguration")
  static class ZhipuConfig {

    @Bean
    public ModelFactory zhipuModelFactory() {
      return new ZhipuAutoConfiguration.ZhipuModelFactory();
    }
  }

  @Configuration
  @ConditionalOnClass(name = "cloud.xcan.agentx.model.deepseek.DeepSeekAutoConfiguration")
  static class DeepSeekConfig {

    @Bean
    public ModelFactory deepSeekModelFactory() {
      return new DeepSeekAutoConfiguration.DeepSeekModelFactory();
    }
  }
}
