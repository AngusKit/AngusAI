package cloud.xcan.angus.core.ai.domain.workflow;

import java.util.List;
import java.util.Map;
import lombok.Data;

@Data
public class WorkflowConfig {

  // 流程定义
  private List<WorkflowNode> nodes;
  private List<WorkflowEdge> edges;

  // 运行配置
  private Integer maxExecutionTime = 300; // 最大执行时间（秒）
  private Boolean retryOnError = false; // 错误时重试
  private Integer maxRetries = 3; // 最大重试次数

  // 触发配置
  private List<TriggerConfig> triggers;

  // 变量定义
  private List<VariableConfig> variables;

  // 执行配置
  private ExecutionConfig execution;

  // 监控配置
  private MonitoringConfig monitoring;

  // 安全配置
  private SecurityConfig security;

  // 资源限制
  private ResourceConfig resources;

  // 错误处理
  private ErrorHandlingConfig errorHandling;

  // 日志配置
  private LoggingConfig logging;

  // 通知配置
  private NotificationConfig notification;

  @Data
  public static class WorkflowNode {
    private String id;
    private String type;
    private NodePosition position;
    private NodeData data;
    private NodeStyle style;
  }

  @Data
  public static class NodePosition {
    private Double x;
    private Double y;
  }

  @Data
  public static class NodeData {
    private String label;
    private Map<String, Object> config;
  }

  @Data
  public static class NodeStyle {
    private String background;
    private String color;
    private String border;
    private String borderRadius;
    private String padding;
  }

  @Data
  public static class WorkflowEdge {
    private String id;
    private String source;
    private String target;
    private String sourceHandle;
    private String targetHandle;
    private String type = "default";
    private Boolean animated = false;
    private String label;
    private EdgeStyle style;
  }

  @Data
  public static class EdgeStyle {
    private String stroke;
    private Integer strokeWidth;
  }

  @Data
  public static class TriggerConfig {
    private String type; // manual, schedule, webhook, event
    private Map<String, Object> config;
  }

  @Data
  public static class VariableConfig {
    private String name;
    private String type; // string, number, boolean, object, array
    private Object defaultValue;
    private Boolean required = false;
    private String description;
  }

  @Data
  public static class ExecutionConfig {
    private String mode; // sync, async
    private Integer timeout = 300;
    private Boolean parallel = false;
    private Integer maxConcurrency = 10;
  }

  @Data
  public static class MonitoringConfig {
    private Boolean enabled = true;
    private List<String> metrics;
    private Map<String, Object> alerts;
  }

  @Data
  public static class SecurityConfig {
    private String accessControl = "private";
    private List<String> permissions;
    private Map<String, Object> encryption;
  }

  @Data
  public static class ResourceConfig {
    private Long memoryLimit;
    private Long cpuLimit;
    private Long storageLimit;
    private Long networkLimit;
  }

  @Data
  public static class ErrorHandlingConfig {
    private String strategy; // stop, continue, retry
    private Integer maxRetries = 3;
    private List<String> retryableErrors;
    private Map<String, Object> fallbackActions;
  }

  @Data
  public static class LoggingConfig {
    private Boolean enabled = true;
    private String level = "INFO";
    private List<String> loggers;
    private Map<String, Object> retention;
  }

  @Data
  public static class NotificationConfig {
    private Boolean enabled = false;
    private List<String> channels;
    private Map<String, Object> templates;
  }
}
