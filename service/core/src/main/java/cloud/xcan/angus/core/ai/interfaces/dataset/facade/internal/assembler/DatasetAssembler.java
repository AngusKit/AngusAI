package cloud.xcan.angus.core.ai.interfaces.dataset.facade.internal.assembler;

import cloud.xcan.angus.core.ai.domain.dataset.Dataset;
import cloud.xcan.angus.core.ai.domain.dataset.DatasetConfig;
import cloud.xcan.angus.core.ai.domain.dataset.DatasetStatus;
import cloud.xcan.angus.core.ai.domain.dataset.DatasetType;
import cloud.xcan.angus.core.ai.domain.dataset.Visibility;
import cloud.xcan.angus.core.ai.interfaces.dataset.facade.dto.DatasetCreateDto;
import cloud.xcan.angus.core.ai.interfaces.dataset.facade.dto.DatasetFindDto;
import cloud.xcan.angus.core.ai.interfaces.dataset.facade.dto.DatasetUpdateDto;
import cloud.xcan.angus.core.ai.interfaces.dataset.facade.vo.DatasetDetailVo;
import cloud.xcan.angus.core.ai.interfaces.dataset.facade.vo.DatasetListVo;
import cloud.xcan.angus.core.jpa.criteria.GenericSpecification;
import org.springframework.stereotype.Component;

@Component
public class DatasetAssembler {

  /**
   * 创建DTO转领域对象
   */
  public static Dataset toDomain(DatasetCreateDto dto) {
    Dataset dataset = new Dataset();
    dataset.setName(dto.getName());
    dataset.setDescription(dto.getDescription());
    dataset.setType(dto.getType());
    dataset.setVisibility(dto.getVisibility());
    dataset.setTags(dto.getTags());
    
    // 设置默认图标和颜色
    dataset.setIcon(getDefaultIcon(dto.getType()));
    dataset.setIconBg(getDefaultIconBg(dto.getType()));
    
    // 设置默认状态
    dataset.setStatus(DatasetStatus.PREPARING);
    
    // 创建配置对象
    DatasetConfig config = new DatasetConfig();
    config.setTextConfig(dto.getConfig());
    config.setTableConfig(dto.getConfig());
    config.setDataSourceConfig(dto.getConfig());
    dataset.setConfig(config);
    
    return dataset;
  }

  /**
   * 更新DTO转领域对象
   */
  public static Dataset updateDomain(Long id, DatasetUpdateDto dto) {
    Dataset dataset = new Dataset();
    dataset.setId(id);
    dataset.setName(dto.getName());
    dataset.setDescription(dto.getDescription());
    dataset.setIcon(dto.getIcon());
    dataset.setIconBg(dto.getIconBg());
    dataset.setVisibility(dto.getVisibility());
    dataset.setTags(dto.getTags());
    
    return dataset;
  }

  /**
   * 领域对象转详情VO
   */
  public static DatasetDetailVo toDetailVo(Dataset dataset) {
    DatasetDetailVo vo = new DatasetDetailVo();
    vo.setId(dataset.getId());
    vo.setName(dataset.getName());
    vo.setDescription(dataset.getDescription());
    vo.setIcon(dataset.getIcon());
    vo.setIconBg(dataset.getIconBg());
    vo.setType(dataset.getType());
    vo.setDataCount(dataset.getDataCount());
    vo.setSize(dataset.getSize());
    vo.setStatus(dataset.getStatus().name());
    vo.setStatusColor(getStatusColor(dataset.getStatus()));
    vo.setVisibility(dataset.getVisibility());
    vo.setCreatedDate(dataset.getCreatedDate());
    vo.setLastModifiedDate(dataset.getLastModifiedDate());
    vo.setCreatedBy(dataset.getCreatedBy());
    vo.setTags(dataset.getTags());
    vo.setConfig(dataset.getConfig());
    
    // 设置统计信息
    vo.setStats(buildStats(dataset));
    
    return vo;
  }

  /**
   * 领域对象转列表VO
   */
  public static DatasetListVo toListVo(Dataset dataset) {
    DatasetListVo vo = new DatasetListVo();
    vo.setId(dataset.getId());
    vo.setName(dataset.getName());
    vo.setDescription(dataset.getDescription());
    vo.setIcon(dataset.getIcon());
    vo.setIconBg(dataset.getIconBg());
    vo.setType(dataset.getType());
    vo.setDataCount(dataset.getDataCount());
    vo.setSize(dataset.getSize());
    vo.setStatus(dataset.getStatus().name());
    vo.setStatusColor(getStatusColor(dataset.getStatus()));
    vo.setVisibility(dataset.getVisibility());
    vo.setCreatedDate(dataset.getCreatedDate());
    vo.setLastModifiedDate(dataset.getLastModifiedDate());
    vo.setUpdateTime(formatUpdateTime(dataset.getLastModifiedDate()));
    vo.setCreatedBy(dataset.getCreatedBy());
    vo.setTags(dataset.getTags());
    
    // 设置统计信息
    vo.setStats(buildStats(dataset));
    
    return vo;
  }

  /**
   * 构建查询条件
   */
  public static GenericSpecification<Dataset> getSpecification(DatasetFindDto dto) {
    GenericSpecification<Dataset> spec = new GenericSpecification<>();
    
    if (dto.getType() != null) {
      spec.addEqual("type", DatasetType.valueOf(dto.getType()));
    }
    
    if (dto.getStatus() != null) {
      spec.addEqual("status", DatasetStatus.valueOf(dto.getStatus()));
    }
    
    if (dto.getVisibility() != null) {
      spec.addEqual("visibility", dto.getVisibility());
    }
    
    return spec;
  }

  /**
   * 获取默认图标
   */
  private static String getDefaultIcon(DatasetType type) {
    switch (type) {
      case TEXT:
        return "📄";
      case TABLE:
        return "📊";
      case DATASOURCE:
        return "🔗";
      default:
        return "📁";
    }
  }

  /**
   * 获取默认图标背景色
   */
  private static String getDefaultIconBg(DatasetType type) {
    switch (type) {
      case TEXT:
        return "bg-green-500";
      case TABLE:
        return "bg-blue-500";
      case DATASOURCE:
        return "bg-purple-500";
      default:
        return "bg-gray-500";
    }
  }

  /**
   * 获取状态颜色
   */
  private static String getStatusColor(DatasetStatus status) {
    switch (status) {
      case ACTIVE:
        return "text-green-600";
      case INACTIVE:
        return "text-gray-600";
      case PREPARING:
        return "text-yellow-600";
      default:
        return "text-gray-600";
    }
  }

  /**
   * 构建统计信息
   */
  private static Object buildStats(Dataset dataset) {
    return new Object() {
      public Long totalRecords = dataset.getTotalRecords();
      public Integer columns = dataset.getColumns();
      public Integer dataSources = dataset.getDataSources();
      public Long totalSize = dataset.getTotalSize();
      public Long lastUpdateTime = dataset.getLastUpdateTime();
    };
  }

  /**
   * 格式化更新时间
   */
  private static String formatUpdateTime(java.time.LocalDateTime dateTime) {
    if (dateTime == null) {
      return "";
    }
    return dateTime.toLocalDate().toString();
  }
}
