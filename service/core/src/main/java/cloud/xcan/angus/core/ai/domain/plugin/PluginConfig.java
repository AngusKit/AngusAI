package cloud.xcan.angus.core.ai.domain.plugin;

import com.fasterxml.jackson.annotation.JsonInclude;
import java.io.Serializable;
import java.util.List;
import java.util.Map;
import lombok.Data;

/**
 * 插件配置
 */
@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class PluginConfig implements Serializable {

  /**
   * API配置
   */
  private ApiConfig api;

  /**
   * 认证配置
   */
  private AuthConfig auth;

  /**
   * 执行配置
   */
  private ExecutionConfig execution;

  /**
   * UI配置
   */
  private UiConfig ui;

  /**
   * 依赖配置
   */
  private List<Dependency> dependencies;

  /**
   * 环境变量
   */
  private Map<String, String> environment;

  /**
   * 自定义配置
   */
  private Map<String, Object> custom;

  @Data
  public static class ApiConfig {
    /**
     * 基础URL
     */
    private String baseUrl;

    /**
     * API端点列表
     */
    private List<Endpoint> endpoints;

    /**
     * 请求头
     */
    private Map<String, String> headers;

    /**
     * 超时时间（毫秒）
     */
    private Integer timeout;

    /**
     * 重试次数
     */
    private Integer retries;
  }

  @Data
  public static class Endpoint {
    /**
     * 端点名称
     */
    private String name;

    /**
     * HTTP方法
     */
    private String method;

    /**
     * 路径
     */
    private String path;

    /**
     * 描述
     */
    private String description;

    /**
     * 参数定义
     */
    private List<Parameter> parameters;

    /**
     * 请求体schema
     */
    private Map<String, Object> requestSchema;

    /**
     * 响应schema
     */
    private Map<String, Object> responseSchema;
  }

  @Data
  public static class Parameter {
    /**
     * 参数名
     */
    private String name;

    /**
     * 参数类型
     */
    private String type;

    /**
     * 是否必填
     */
    private Boolean required;

    /**
     * 默认值
     */
    private Object defaultValue;

    /**
     * 描述
     */
    private String description;

    /**
     * 枚举值
     */
    private List<String> enumValues;
  }

  @Data
  public static class AuthConfig {
    /**
     * 认证类型
     */
    private String type;

    /**
     * API Key配置
     */
    private ApiKeyAuth apiKey;

    /**
     * OAuth配置
     */
    private OAuthAuth oauth;

    /**
     * Basic认证
     */
    private BasicAuth basic;
  }

  @Data
  public static class ApiKeyAuth {
    private String key;
    private String header;
    private String prefix;
  }

  @Data
  public static class OAuthAuth {
    private String authUrl;
    private String tokenUrl;
    private String clientId;
    private String clientSecret;
    private List<String> scopes;
  }

  @Data
  public static class BasicAuth {
    private String username;
    private String password;
  }

  @Data
  public static class ExecutionConfig {
    /**
     * 执行模式
     */
    private String mode;

    /**
     * 最大执行时间（秒）
     */
    private Integer maxExecutionTime;

    /**
     * 内存限制（MB）
     */
    private Integer memoryLimit;

    /**
     * 并发限制
     */
    private Integer concurrencyLimit;
  }

  @Data
  public static class UiConfig {
    /**
     * 显示名称
     */
    private String displayName;

    /**
     * 图标
     */
    private String icon;

    /**
     * 颜色
     */
    private String color;

    /**
     * 配置表单
     */
    private List<FormField> configForm;
  }

  @Data
  public static class FormField {
    private String name;
    private String label;
    private String type;
    private Boolean required;
    private Object defaultValue;
    private String placeholder;
    private String helpText;
  }

  @Data
  public static class Dependency {
    /**
     * 依赖名称
     */
    private String name;

    /**
     * 依赖版本
     */
    private String version;

    /**
     * 是否可选
     */
    private Boolean optional;
  }
}
