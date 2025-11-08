package cloud.xcan.angus.core.ai.interfaces.knowledgebase.facade.vo;

import io.swagger.v3.oas.annotations.media.Schema;
import java.util.List;
import lombok.Data;

@Data
@Schema(description = "知识库统计响应")
public class KnowledgeBaseStatisticsVo {

  @Schema(description = "总体统计")
  private Overview overview;

  @Schema(description = "近一月趋势")
  private Overview lastMonthGrowthTrend;

  @Schema(description = "使用率排行")
  private List<TopKnowledgeBase> topKnowledgeBases;

  @Schema(description = "查询趋势")
  private List<QueryTrend> queryTrend;

  @Data
  @Schema(description = "总体统计")
  public static class Overview {

    @Schema(description = "总知识库数")
    private Long totalKnowledgeBases;

    @Schema(description = "活跃（被引用）知识库数")
    private Long activeKnowledgeBases;

    @Schema(description = "总文件数")
    private Long totalFiles;

    @Schema(description = "活跃（被引用）文件数")
    private Long activeFiles;

    @Schema(description = "总分段数", example = "120")
    private Integer totalChunks;

    @Schema(description = "平均分段大小", example = "512")
    private Integer avgChunkSize;

    @Schema(description = "总查询次数")
    private Long totalQueryCount;

    @Schema(description = "今日查询次数")
    private Long todayQueryCount;

    @Schema(description = "已使用存储空间大小")
    private String usedStoreSize;

    @Schema(description = "授权的存储空间大小，自定义数据源返回空")
    private String totalStoreSize;

    @Schema(description = "已使用存储空间占比，自定义数据源返回空")
    private String usedStoreRate;
  }

  @Data
  @Schema(description = "使用率排行")
  public static class TopKnowledgeBase {

    @Schema(description = "知识库ID")
    private Long id;

    @Schema(description = "知识库名称")
    private String name;

    @Schema(description = "查询次数")
    private Long queryCount;

    @Schema(description = "文件数")
    private Long fileCount;

    @Schema(description = "分段数")
    private Long chunkCount;
  }

  @Data
  @Schema(description = "查询趋势")
  public static class QueryTrend {

    @Schema(description = "时间戳")
    private Long timestamp;

    @Schema(description = "日期")
    private String date;

    @Schema(description = "总查询次数")
    private Long totalQueries;

    @Schema(description = "平均响应时间（毫秒）")
    private Long avgResponseTime;

    @Schema(description = "错误数")
    private Long errors;

    @Schema(description = "错误率（百分比）")
    private Double errorRate;
  }
}
