package com.agentx.model.openai;

import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;

/**
 * OpenAI 模块自动配置 — 注册 OpenAiModelFactory 组件。
 * <p>
 * 模型配置不再从 application.yml 读取，而是由 {@link com.agentx.core.model.ModelConfigProvider} 从数据库等外部源加载，通过
 * {@link com.agentx.core.model.ModelRegistry} 统一管理。
 * </p>
 */
@Configuration
@ComponentScan(basePackageClasses = OpenAiAutoConfiguration.class)
public class OpenAiAutoConfiguration {

}
