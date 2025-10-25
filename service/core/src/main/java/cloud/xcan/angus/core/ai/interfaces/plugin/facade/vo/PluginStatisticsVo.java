package cloud.xcan.angus.core.ai.interfaces.plugin.facade.vo;

import io.swagger.v3.oas.annotations.media.Schema;
import java.util.List;
import lombok.Data;

@Data
@Schema(description = "插件统计数据")
public class PluginStatisticsVo {

  @Schema(description = "总插件数")
  private Long totalPlugins;

  @Schema(description = "我的插件数")
  private Long myPlugins;

  @Schema(description = "已安装插件数")
  private Long installedPlugins;

  @Schema(description = "收藏插件数")
  private Long favoritePlugins;

  @Schema(description = "公开插件数")
  private Long publicPlugins;

  @Schema(description = "总安装数")
  private Long totalInstalls;

  @Schema(description = "总使用数")
  private Long totalUsages;

  @Schema(description = "分类统计")
  private List<CategoryStats> categoryStats;

  @Schema(description = "使用趋势")
  private List<UsageTrend> usageTrend;

  @Schema(description = "热门插件")
  private List<TrendingPlugin> trendingPlugins;

  @Data
  @Schema(description = "分类统计")
  public static class CategoryStats {

    @Schema(description = "分类ID")
    private String categoryId;

    @Schema(description = "分类名称")
    private String categoryName;

    @Schema(description = "插件数量")
    private Long count;

    @Schema(description = "安装数量")
    private Long installCount;
  }

  @Data
  @Schema(description = "使用趋势")
  public static class UsageTrend {

    @Schema(description = "日期")
    private String date;

    @Schema(description = "使用次数")
    private Long count;

    @Schema(description = "安装次数")
    private Long installCount;
  }

  @Data
  @Schema(description = "热门插件")
  public static class TrendingPlugin {

    @Schema(description = "插件ID")
    private Long id;

    @Schema(description = "插件名称")
    private String name;

    @Schema(description = "插件图标")
    private String icon;

    @Schema(description = "安装次数")
    private Long installCount;

    @Schema(description = "评分")
    private Double rating;
  }
}
