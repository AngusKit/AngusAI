package com.agentx.starter;

import com.agentx.core.model.ModelFactory;
import com.agentx.model.anthropic.AnthropicAutoConfiguration.AnthropicModelFactory;
import com.agentx.model.deepseek.DeepSeekAutoConfiguration;
import com.agentx.model.gemini.GeminiAutoConfiguration;
import com.agentx.model.ollama.OllamaAutoConfiguration.OllamaModelFactory;
import com.agentx.model.openai.OpenAiModelFactory;
import com.agentx.model.qwen.QwenAutoConfiguration;
import com.agentx.model.zhipu.ZhipuAutoConfiguration;
import org.springframework.boot.autoconfigure.condition.ConditionalOnClass;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * AgentX 模型提供商 Bean 集中注册 — 基于 classpath 条件按需加载
 */
@Configuration
public class AgentXModelProvidersConfiguration {

  @Configuration
  @ConditionalOnClass(name = "com.agentx.model.openai.OpenAiAutoConfiguration")
  static class OpenAiConfig {

    @Bean
    public ModelFactory openAiModelFactory() {
      return new OpenAiModelFactory();
    }
  }

  @Configuration
  @ConditionalOnClass(name = "com.agentx.model.anthropic.AnthropicAutoConfiguration")
  static class AnthropicConfig {

    @Bean
    public ModelFactory anthropicModelFactory() {
      return new AnthropicModelFactory();
    }
  }

  @Configuration
  @ConditionalOnClass(name = "com.agentx.model.ollama.OllamaAutoConfiguration")
  static class OllamaConfig {

    @Bean
    public ModelFactory ollamaModelFactory() {
      return new OllamaModelFactory();
    }
  }

  @Configuration
  @ConditionalOnClass(name = "com.agentx.model.gemini.GeminiAutoConfiguration")
  static class GeminiConfig {

    @Bean
    public ModelFactory geminiModelFactory() {
      return new GeminiAutoConfiguration.GeminiModelFactory();
    }
  }

  @Configuration
  @ConditionalOnClass(name = "com.agentx.model.qwen.QwenAutoConfiguration")
  static class QwenConfig {

    @Bean
    public ModelFactory qwenModelFactory() {
      return new QwenAutoConfiguration.QwenModelFactory();
    }
  }

  @Configuration
  @ConditionalOnClass(name = "com.agentx.model.zhipu.ZhipuAutoConfiguration")
  static class ZhipuConfig {

    @Bean
    public ModelFactory zhipuModelFactory() {
      return new ZhipuAutoConfiguration.ZhipuModelFactory();
    }
  }

  @Configuration
  @ConditionalOnClass(name = "com.agentx.model.deepseek.DeepSeekAutoConfiguration")
  static class DeepSeekConfig {

    @Bean
    public ModelFactory deepSeekModelFactory() {
      return new DeepSeekAutoConfiguration.DeepSeekModelFactory();
    }
  }
}
