package cloud.xcan.angus.core.ai.interfaces.apis.facade.vo;

import cloud.xcan.angus.core.ai.infra.ai.vector.VectorStoreType;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.models.PathItem.HttpMethod;
import java.util.List;
import lombok.Data;

@Data
@Schema(description = "向量存储源统计信息")
public class ApiCollectionStatisticsVo {

  @Schema(description = "总体统计")
  private Overview overview;

  @Schema(description = "近一月趋势")
  private Overview lastMonthGrowthTrend;

  @Schema(description = "使用率排行")
  private List<TopStore> topStores;

  @Schema(description = "性能趋势")
  private List<PerformanceTrend> performanceTrend;

  @Data
  @Schema(description = "总体统计")
  public static class Overview {
    @Schema(description = "接口集总数")
    private Integer apiCollectionCount;

    @Schema(description = "接口总数")
    private Integer apiTotalCount;

    @Schema(description = "已启用接口总数")
    private Integer enabledApiCount;

    @Schema(description = "总调用次数")
    private Integer totalCallCount;

    @Schema(description = "今日调用次数")
    private Integer todayCallCount;
  }

  @Data
  @Schema(description = "使用率排行")
  public static class TopStore {
    @Schema(description = "端点ID")
    private Long id;

    @Schema(description = "端点名称")
    private String name;

    @Schema(description = "请求方式")
    private HttpMethod type;

    @Schema(description = "调用次数")
    private Long callCount;

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

    @Schema(description = "总调用次数")
    private Long totalCalls;

    @Schema(description = "平均响应时间（毫秒）")
    private Long avgResponseTime;

    @Schema(description = "错误数）")
    private Long errors;

    @Schema(description = "错误率（百分比）")
    private Double errorRate;
  }
}

