package com.agentx.starter;

import com.agentx.core.model.ModelRegistry;
import com.agentx.tool.ai.AiUtilityTool;
import com.agentx.tool.code.CodeExecutorTool;
import com.agentx.tool.database.DatabaseQueryTool;
import com.agentx.tool.file.FileOperationTool;
import com.agentx.tool.http.HttpRequestTool;
import com.agentx.tool.notify.NotificationTool;
import com.agentx.tool.search.WebSearchTool;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnClass;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * AgentX 内置工具 Bean 集中注册 — 基于 classpath 条件按需加载
 */
@Configuration
public class AgentXToolsConfiguration {

  @Configuration
  @ConditionalOnClass(name = "com.agentx.tool.http.HttpRequestTool")
  static class HttpToolConfig {

    @Bean
    public HttpRequestTool httpRequestTool() {
      return new HttpRequestTool();
    }
  }

  @Configuration
  @ConditionalOnClass(name = "com.agentx.tool.code.CodeExecutorTool")
  static class CodeToolConfig {

    @Bean
    public CodeExecutorTool codeExecutorTool() {
      return new CodeExecutorTool();
    }
  }

  @Configuration
  @ConditionalOnClass(name = "com.agentx.tool.search.WebSearchTool")
  static class SearchToolConfig {

    @Bean
    public WebSearchTool webSearchTool() {
      return new WebSearchTool();
    }
  }

  @Configuration
  @ConditionalOnClass(name = "com.agentx.tool.database.DatabaseQueryTool")
  static class DatabaseToolConfig {

    @Bean
    public DatabaseQueryTool databaseQueryTool(javax.sql.DataSource dataSource) {
      return new DatabaseQueryTool(dataSource);
    }
  }

  @Configuration
  @ConditionalOnClass(name = "com.agentx.tool.file.FileOperationTool")
  static class FileToolConfig {

    @Bean
    public FileOperationTool fileOperationTool(
        @Value("${agentx.tool.file.sandbox-dir:#{systemProperties['java.io.tmpdir'] + '/agentx-files'}}") String sandboxDir) {
      return new FileOperationTool(sandboxDir);
    }
  }

  @Configuration
  @ConditionalOnClass(name = "com.agentx.tool.notify.NotificationTool")
  static class NotifyToolConfig {

    @Bean
    public NotificationTool notificationTool() {
      return new NotificationTool();
    }
  }

  @Configuration
  @ConditionalOnClass(name = "com.agentx.tool.ai.AiUtilityTool")
  static class AiToolConfig {

    @Bean
    public AiUtilityTool aiUtilityTool(ModelRegistry modelRegistry) {
      return new AiUtilityTool(modelRegistry);
    }
  }
}
