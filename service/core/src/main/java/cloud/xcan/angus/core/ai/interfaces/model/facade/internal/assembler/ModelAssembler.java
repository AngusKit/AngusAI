package cloud.xcan.angus.core.ai.interfaces.model.facade.internal.assembler;

import cloud.xcan.angus.core.ai.domain.model.Model;
import cloud.xcan.angus.core.ai.infra.ai.model.ModelConfig;
import cloud.xcan.angus.core.ai.infra.ai.model.ModelProvider;
import cloud.xcan.angus.core.ai.infra.ai.model.ModelType;
import cloud.xcan.angus.core.ai.interfaces.model.facade.dto.ModelCreateDto;
import cloud.xcan.angus.core.ai.interfaces.model.facade.dto.ModelFindDto;
import cloud.xcan.angus.core.ai.interfaces.model.facade.dto.ModelUpdateDto;
import cloud.xcan.angus.core.ai.interfaces.model.facade.vo.ModelDetailVo;
import cloud.xcan.angus.core.ai.interfaces.model.facade.vo.ModelListVo;
import cloud.xcan.angus.core.jpa.criteria.GenericSpecification;
import org.springframework.stereotype.Component;

@Component
public class ModelAssembler {

  /**
   * 创建DTO转领域对象
   */
  public static Model toDomain(ModelCreateDto dto) {
    Model model = new Model();
    model.setName(dto.getName());
    model.setDescription(dto.getDescription());
    model.setType(dto.getType());
    model.setProvider(dto.getProvider());
    model.setVersion(dto.getVersion());
    model.setApiEndpoint(dto.getApiEndpoint());
    model.setApiKey(dto.getApiKey());

    // 设置默认图标和颜色
    model.setIcon(getDefaultIcon(dto.getType()));
    model.setIconBg(getDefaultIconBg(dto.getProvider()));
    model.setIconColor(getDefaultIconColor(dto.getProvider()));

    // 设置默认状态
    model.setStatus(dto.getAutoDeploy() ?
        cloud.xcan.angus.core.ai.domain.model.ModelStatus.DEPLOYING :
        cloud.xcan.angus.core.ai.domain.model.ModelStatus.STOPPED);

    // 创建配置对象
    ModelConfig config = new ModelConfig();
    config.setApiEndpoint(dto.getApiEndpoint());
    config.setApiKey(dto.getApiKey());
    config.setParameters(dto.getParameters());
    config.setDeployment(dto.getDeployment());
    config.setLimits(dto.getLimits());
    model.setConfig(config);

    return model;
  }

  /**
   * 更新DTO转领域对象
   */
  public static Model updateDomain(Long id, ModelUpdateDto dto) {
    Model model = new Model();
    model.setId(id);
    model.setName(dto.getName());
    model.setDescription(dto.getDescription());
    model.setType(dto.getType());
    model.setProvider(dto.getProvider());
    model.setVersion(dto.getVersion());
    model.setApiEndpoint(dto.getApiEndpoint());
    model.setApiKey(dto.getApiKey());

    // 创建配置对象
    ModelConfig config = new ModelConfig();
    config.setApiEndpoint(dto.getApiEndpoint());
    config.setApiKey(dto.getApiKey());
    config.setParameters(dto.getParameters());
    config.setDeployment(dto.getDeployment());
    config.setLimits(dto.getLimits());
    model.setConfig(config);

    return model;
  }

  /**
   * 领域对象转详情VO
   */
  public static ModelDetailVo toDetailVo(Model model) {
    ModelDetailVo vo = new ModelDetailVo();
    vo.setId(model.getId());
    vo.setName(model.getName());
    vo.setDescription(model.getDescription());
    vo.setType(model.getType());
    vo.setIcon(model.getIcon());
    vo.setIconBg(model.getIconBg());
    vo.setIconColor(model.getIconColor());
    vo.setProvider(model.getProvider());
    vo.setVersion(model.getVersion());
    vo.setStatus(model.getStatus());
    vo.setStatusColor(getStatusColor(model.getStatus()));
    vo.setConfig(model.getConfig());

    // 设置性能指标
    vo.setPerformance(buildPerformance(model));

    // 设置资源使用
    vo.setResources(buildResources(model));

    // 设置统计数据
    vo.setStats(buildStats(model));

    vo.setDeployed(model.getDeployed());
    vo.setDeployedAt(model.getDeployedAt());
    vo.setLastCallAt(model.getLastCallAt());
    vo.setCreatedDate(model.getCreatedDate());
    vo.setModifiedDate(model.getModifiedDate());

    return vo;
  }

  /**
   * 领域对象转列表VO
   */
  public static ModelListVo toListVo(Model model) {
    ModelListVo vo = new ModelListVo();
    vo.setId(model.getId());
    vo.setName(model.getName());
    vo.setDescription(model.getDescription());
    vo.setType(model.getType());
    vo.setIcon(model.getIcon());
    vo.setIconBg(model.getIconBg());
    vo.setIconColor(model.getIconColor());
    vo.setProvider(model.getProvider());
    vo.setVersion(model.getVersion());
    vo.setStatus(model.getStatus());
    vo.setStatusColor(getStatusColor(model.getStatus()));

    // 设置性能指标
    vo.setPerformance(buildPerformance(model));

    // 设置资源使用
    vo.setResources(buildResources(model));

    vo.setCalls(formatCalls(model.getTotalCalls()));
    vo.setCallsCount(model.getTotalCalls());
    vo.setCost(formatCost(model.getTotalCost()));
    vo.setDeployed(model.getDeployed());
    vo.setDeployedAt(model.getDeployedAt());
    vo.setCreatedDate(model.getCreatedDate());
    vo.setModifiedDate(model.getModifiedDate());

    return vo;
  }

  /**
   * 构建查询条件
   */
  public static GenericSpecification<Model> getSpecification(ModelFindDto dto) {
    GenericSpecification<Model> spec = new GenericSpecification<>();

    if (dto.getType() != null) {
      spec.addEqual("type", dto.getType());
    }

    if (dto.getProvider() != null) {
      spec.addEqual("provider", dto.getProvider());
    }

    if (dto.getStatus() != null) {
      spec.addEqual("status", dto.getStatus());
    }

    return spec;
  }

  /**
   * 获取默认图标
   */
  private static String getDefaultIcon(ModelType type) {
    switch (type) {
      case LANGUAGE:
        return "💬";
      case IMAGE:
        return "🖼️";
      case VIDEO:
        return "🎥";
      case CODE:
        return "💻";
      case AUDIO:
        return "🎵";
      case EMBEDDING:
        return "🔗";
      case MULTIMODAL:
        return "🌟";
      default:
        return "🤖";
    }
  }

  /**
   * 获取默认图标背景色
   */
  private static String getDefaultIconBg(ModelProvider provider) {
    switch (provider) {
      case OPENAI:
        return "#10A37F";
      case ANTHROPIC:
        return "#D97706";
      case GOOGLE:
        return "#4285F4";
      case BAIDU:
        return "#2932E1";
      case ALIBABA:
        return "#FF6900";
      case TENCENT:
        return "#00D4AA";
      case HUAWEI:
        return "#FF6B35";
      default:
        return "#6B7280";
    }
  }

  /**
   * 获取默认图标颜色
   */
  private static String getDefaultIconColor(ModelProvider provider) {
    return "#FFFFFF";
  }

  /**
   * 获取状态颜色
   */
  private static String getStatusColor(cloud.xcan.angus.core.ai.domain.model.ModelStatus status) {
    switch (status) {
      case RUNNING:
        return "#10B981";
      case DEPLOYING:
        return "#F59E0B";
      case STOPPED:
        return "#6B7280";
      case ERROR:
        return "#EF4444";
      default:
        return "#6B7280";
    }
  }

  /**
   * 构建性能指标
   */
  private static Object buildPerformance(Model model) {
    return new Object() {
      public String latency = model.getLatency();
      public Double latencyMs = model.getLatencyMs();
      public String throughput = model.getThroughput();
      public Double throughputRaw = model.getThroughputRaw();
      public String accuracy = model.getAccuracy();
      public Double accuracyPercent = model.getAccuracyPercent();
    };
  }

  /**
   * 构建资源使用
   */
  private static Object buildResources(Model model) {
    return new Object() {
      public String cpu = model.getCpu();
      public Double cpuPercent = model.getCpuPercent();
      public String memory = model.getMemory();
      public Long memoryBytes = model.getMemoryBytes();
      public String gpu = model.getGpu();
      public Double gpuPercent = model.getGpuPercent();
    };
  }

  /**
   * 构建统计数据
   */
  private static Object buildStats(Model model) {
    return new Object() {
      public Long totalCalls = model.getTotalCalls();
      public Long successfulCalls = model.getSuccessfulCalls();
      public Long failedCalls = model.getFailedCalls();
      public Long totalTokens = model.getTotalTokens();
      public Double totalCost = model.getTotalCost();
      public Double avgResponseTime = model.getAvgResponseTime();
      public Double successRate = model.getSuccessRate();
      public Long last24HoursCalls = model.getLast24HoursCalls();
    };
  }

  /**
   * 格式化调用次数
   */
  private static String formatCalls(Long calls) {
    if (calls == null || calls == 0) {
      return "0";
    }
    if (calls < 1000) {
      return calls.toString();
    } else if (calls < 1000000) {
      return String.format("%.1fK", calls / 1000.0);
    } else {
      return String.format("%.1fM", calls / 1000000.0);
    }
  }

  /**
   * 格式化成本
   */
  private static String formatCost(Double cost) {
    if (cost == null || cost == 0) {
      return "¥0";
    }
    return String.format("¥%.2f", cost);
  }
}
