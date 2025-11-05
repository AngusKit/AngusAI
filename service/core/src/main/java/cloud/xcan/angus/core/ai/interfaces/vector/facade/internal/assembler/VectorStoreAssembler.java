package cloud.xcan.angus.core.ai.interfaces.vector.facade.internal.assembler;

import cloud.xcan.angus.core.ai.domain.vector.VectorStore;
import cloud.xcan.angus.core.ai.infra.ai.vector.VectorStoreType;
import cloud.xcan.angus.core.ai.interfaces.vector.facade.dto.VectorStoreCreateDto;
import cloud.xcan.angus.core.ai.interfaces.vector.facade.dto.VectorStoreFindDto;
import cloud.xcan.angus.core.ai.interfaces.vector.facade.dto.VectorStoreUpdateDto;
import cloud.xcan.angus.core.ai.interfaces.vector.facade.vo.ConnectionTestVo;
import cloud.xcan.angus.core.ai.interfaces.vector.facade.vo.VectorStoreListVo;
import cloud.xcan.angus.core.ai.interfaces.vector.facade.vo.VectorStoreVo;
import cloud.xcan.angus.core.jpa.criteria.GenericSpecification;
import cloud.xcan.angus.core.jpa.criteria.SearchCriteriaBuilder;
import cloud.xcan.angus.remote.search.SearchCriteria;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.Map;
import java.util.Set;

public class VectorStoreAssembler {

  private static final DateTimeFormatter DATE_TIME_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");

  /**
   * 获取类型标签和图标
   */
  private static Map<String, String> getTypeInfo(VectorStoreType type) {
    Map<String, String> info = new HashMap<>();
    if (type == null) {
      info.put("label", "");
      info.put("icon", "");
      return info;
    }
    
    // 根据类型返回标签和图标
    switch (type) {
      case PINECONE:
        info.put("label", "Pinecone");
        info.put("icon", "🌲");
        break;
      case QDRANT:
        info.put("label", "Qdrant");
        info.put("icon", "⚡");
        break;
      case WEAVIATE:
        info.put("label", "Weaviate");
        info.put("icon", "🕸️");
        break;
      case MILVUS:
        info.put("label", "Milvus");
        info.put("icon", "🦅");
        break;
      case CHROMA:
        info.put("label", "Chroma");
        info.put("icon", "🎨");
        break;
      case ELASTICSEARCH:
        info.put("label", "Elasticsearch");
        info.put("icon", "🔍");
        break;
      case PGVECTOR:
        info.put("label", "PGvector");
        info.put("icon", "🐘");
        break;
      case MONGODB_ATLAS:
        info.put("label", "MongoDB Atlas");
        info.put("icon", "🍃");
        break;
      case REDIS:
        info.put("label", "Redis");
        info.put("icon", "🔴");
        break;
      default:
        info.put("label", type.getDisplayName());
        info.put("icon", "📊");
    }
    return info;
  }

  /**
   * 获取状态标签和颜色
   */
  private static Map<String, String> getStatusInfo(String status) {
    Map<String, String> info = new HashMap<>();
    if (status == null) {
      info.put("label", "");
      info.put("color", "");
      return info;
    }
    
    switch (status) {
      case "connected":
        info.put("label", "已连接");
        info.put("color", "green");
        break;
      case "disconnected":
        info.put("label", "未连接");
        info.put("color", "red");
        break;
      case "testing":
        info.put("label", "测试中");
        info.put("color", "yellow");
        break;
      default:
        info.put("label", status);
        info.put("color", "gray");
    }
    return info;
  }

  /**
   * 格式化时间戳
   */
  private static String formatTimestamp(Long timestamp) {
    if (timestamp == null) {
      return null;
    }
    LocalDateTime dateTime = LocalDateTime.ofEpochSecond(timestamp / 1000, 0,
        ZoneId.systemDefault().getRules().getOffset(LocalDateTime.now()));
    return dateTime.format(DATE_TIME_FORMATTER);
  }

  /**
   * 脱敏配置信息
   */
  private static Map<String, String> maskConfig(Map<String, String> config) {
    if (config == null) {
      return null;
    }
    Map<String, String> masked = new HashMap<>(config);
    // 对敏感字段进行脱敏
    String[] sensitiveKeys = {"password", "apiKey", "token", "secret", "authToken"};
    for (String key : sensitiveKeys) {
      if (masked.containsKey(key)) {
        String value = masked.get(key);
        if (value != null && value.length() > 4) {
          masked.put(key, value.substring(0, 4) + "****");
        }
      }
    }
    return masked;
  }

  public static VectorStore toCreateDomain(VectorStoreCreateDto dto) {
    VectorStore vectorStore = new VectorStore();
    vectorStore.setName(dto.getName());
    vectorStore.setType(dto.getType());
    vectorStore.setDescription(dto.getDescription());
    vectorStore.setEndpoint(dto.getEndpoint());
    vectorStore.setDimension(dto.getDimension());
    vectorStore.setConfig(dto.getConfig());
    vectorStore.setEnabled(dto.getEnabled() != null ? dto.getEnabled() : true);
    vectorStore.setAutoSync(dto.getAutoSync() != null ? dto.getAutoSync() : false);
    vectorStore.setSyncInterval(dto.getSyncInterval() != null ? dto.getSyncInterval() : 60);
    return vectorStore;
  }

  public static VectorStore toUpdateDomain(Long id, VectorStoreUpdateDto dto) {
    VectorStore vectorStore = new VectorStore();
    vectorStore.setId(id);
    vectorStore.setName(dto.getName());
    vectorStore.setDescription(dto.getDescription());
    vectorStore.setEndpoint(dto.getEndpoint());
    vectorStore.setDimension(dto.getDimension());
    vectorStore.setConfig(dto.getConfig());
    vectorStore.setEnabled(dto.getEnabled());
    vectorStore.setAutoSync(dto.getAutoSync());
    vectorStore.setSyncInterval(dto.getSyncInterval());
    return vectorStore;
  }

  public static VectorStoreVo toVo(VectorStore vectorStore) {
    if (vectorStore == null) {
      return null;
    }
    VectorStoreVo vo = new VectorStoreVo();
    vo.setId(vectorStore.getId());
    vo.setName(vectorStore.getName());
    vo.setType(vectorStore.getType());
    
    Map<String, String> typeInfo = getTypeInfo(vectorStore.getType());
    vo.setTypeLabel(typeInfo.get("label"));
    vo.setTypeIcon(typeInfo.get("icon"));
    
    vo.setDescription(vectorStore.getDescription());
    vo.setEndpoint(vectorStore.getEndpoint());
    vo.setStatus(vectorStore.getStatus());
    
    Map<String, String> statusInfo = getStatusInfo(vectorStore.getStatus());
    vo.setStatusLabel(statusInfo.get("label"));
    vo.setStatusColor(statusInfo.get("color"));
    
    vo.setEnabled(vectorStore.getEnabled());
    vo.setDimension(vectorStore.getDimension());
    vo.setIndexCount(vectorStore.getIndexCount());
    
    if (vectorStore.getCreatedDate() != null) {
      Long timestamp = vectorStore.getCreatedDate().atZone(ZoneId.systemDefault()).toInstant().toEpochMilli();
      vo.setCreatedTimestamp(timestamp);
      vo.setCreatedTime(formatTimestamp(timestamp));
    }
    
    if (vectorStore.getLastSyncTime() != null) {
      vo.setLastSyncTimestamp(vectorStore.getLastSyncTime());
      vo.setLastSync(formatTimestamp(vectorStore.getLastSyncTime()));
    }
    
    vo.setConfig(maskConfig(vectorStore.getConfig()));
    vo.setPerformance(vectorStore.getPerformance());
    vo.setAutoSync(vectorStore.getAutoSync());
    vo.setSyncInterval(vectorStore.getSyncInterval());
    
    return vo;
  }

  public static VectorStoreListVo toListVo(VectorStore vectorStore) {
    if (vectorStore == null) {
      return null;
    }
    VectorStoreListVo vo = new VectorStoreListVo();
    vo.setId(vectorStore.getId());
    vo.setName(vectorStore.getName());
    vo.setType(vectorStore.getType());
    
    Map<String, String> typeInfo = getTypeInfo(vectorStore.getType());
    vo.setTypeLabel(typeInfo.get("label"));
    vo.setTypeIcon(typeInfo.get("icon"));
    
    vo.setDescription(vectorStore.getDescription());
    vo.setEndpoint(vectorStore.getEndpoint());
    vo.setStatus(vectorStore.getStatus());
    
    Map<String, String> statusInfo = getStatusInfo(vectorStore.getStatus());
    vo.setStatusLabel(statusInfo.get("label"));
    vo.setStatusColor(statusInfo.get("color"));
    
    vo.setEnabled(vectorStore.getEnabled());
    vo.setDimension(vectorStore.getDimension());
    vo.setIndexCount(vectorStore.getIndexCount());
    
    if (vectorStore.getCreatedDate() != null) {
      Long timestamp = vectorStore.getCreatedDate().atZone(ZoneId.systemDefault()).toInstant().toEpochMilli();
      vo.setCreatedTimestamp(timestamp);
      vo.setCreatedTime(formatTimestamp(timestamp));
    }
    
    if (vectorStore.getLastSyncTime() != null) {
      vo.setLastSyncTimestamp(vectorStore.getLastSyncTime());
      vo.setLastSync(formatTimestamp(vectorStore.getLastSyncTime()));
    }
    
    vo.setConfig(maskConfig(vectorStore.getConfig()));
    vo.setPerformance(vectorStore.getPerformance());
    
    return vo;
  }

  public static ConnectionTestVo toConnectionTestVo(VectorStore vectorStore, boolean success, 
      ConnectionTestVo.TestDetails testDetails, ConnectionTestVo.ErrorInfo error) {
    ConnectionTestVo vo = new ConnectionTestVo();
    vo.setSuccess(success);
    vo.setStatus(vectorStore.getStatus());
    vo.setTestDetails(testDetails);
    vo.setError(error);
    return vo;
  }

  public static GenericSpecification<VectorStore> getSpecification(VectorStoreFindDto dto) {
    Set<SearchCriteria> filters = new SearchCriteriaBuilder<>(dto)
        .rangeSearchFields("id", "createdDate")
        .matchSearchFields("name", "description", "endpoint")
        .inAndNotFields("type", "status", "enabled")
        .orderByFields("id", "name", "createdDate", "lastSyncTime", "indexCount")
        .build();
    return new GenericSpecification<>(filters);
  }
}

