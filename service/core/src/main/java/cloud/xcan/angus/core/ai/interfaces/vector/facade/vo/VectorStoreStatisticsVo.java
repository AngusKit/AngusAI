package cloud.xcan.angus.core.ai.interfaces.vector.facade.vo;

import cloud.xcan.agentx.core.vectorstore.VectorStoreType;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer;
import io.swagger.v3.oas.annotations.media.Schema;
import java.util.List;
import lombok.Data;

@Data
@Schema(description = "向量存储源统计信息")
public class VectorStoreStatisticsVo {

  @Schema(description = "总体统计")
  private Overview overview;

  @Schema(description = "近一月趋势")
  private Overview lastMonthGrowthTrend;

  @Schema(description = "类型分布")
  private List<TypeDistribution> typeDistribution;

  @Schema(description = "使用率排行")
  private List<TopStore> topStores;

  @Schema(description = "性能趋势")
  private List<PerformanceTrend> performanceTrend;

  @Data
  @Schema(description = "总体统计")
  public static class Overview {

    @Schema(description = "存储源总数")
    private Long totalStores;

    @Schema(description = "已连接数")
    private Long connectedStores;

    @Schema(description = "向量总数")
    private Long totalVectors;

    @Schema(description = "今日查询数")
    private Long todayQueries;
  }

  @Data
  @Schema(description = "类型分布")
  public static class TypeDistribution {

    @Schema(description = "类型（如 PGVECTOR、MILVUS）")
    @JsonSerialize(using = ToStringSerializer.class)
    private VectorStoreType type;

    @Schema(description = "数量")
    private Long count;

    @Schema(description = "百分比")
    private Double percentage;
  }

  @Data
  @Schema(description = "使用率排行")
  public static class TopStore {

    @Schema(description = "存储源ID")
    private Long id;

    @Schema(description = "名称")
    private String name;

    @Schema(description = "类型（如 PGVECTOR、MILVUS）")
    @JsonSerialize(using = ToStringSerializer.class)
    private VectorStoreType type;

    @Schema(description = "查询次数")
    private Long queryCount;

    @Schema(description = "索引数量")
    private Long indexCount;

    @Schema(description = "平均响应时间（毫秒）")
    private Long avgResponseTime;
  }

  @Data
  @Schema(description = "性能趋势")
  public static class PerformanceTrend {

    @Schema(description = "时间戳")
    private Long timestamp;

    @Schema(description = "日期")
    private String date;

    @Schema(description = "总查询数")
    private Long totalQueries;

    @Schema(description = "平均响应时间（毫秒）")
    private Long avgResponseTime;

    @Schema(description = "错误率（百分比）")
    private Double errorRate;
  }
}

