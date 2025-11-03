package cloud.xcan.angus.core.ai.domain.plugin;

import io.swagger.v3.oas.annotations.media.Schema;
import java.util.List;
import lombok.Data;

@Data
@Schema(description = "插件统计数据")
public class PluginStatistics {

  @Schema(description = "总插件数")
  private Long totalPlugins;

  @Schema(description = "总可用插件数")
  private Long totalAvailablePlugins;

  @Schema(description = "我的插件数")
  private Long myPlugins;

  @Schema(description = "已安装插件数")
  private Long installedPlugins;

  @Schema(description = "总下载插件数")
  private Long downloadPlugins;

  @Schema(description = "总访问插件数")
  private Long visitsPlugins;

  @Schema(description = "公开插件数")
  private Long publicPlugins;

  @Schema(description = "总安装数")
  private Long totalInstalls;

  @Schema(description = "总使用数")
  private Long totalUsages;

  @Schema(description = "总评级数")
  private Long totalRatings;

  @Schema(description = "分类统计")
  private List<CategoryStats> categoryStats;

  @Schema(description = "近一月增长趋势")
  private LastMonthGrowthTrend lastMonthGrowthTrend;

  @Schema(description = "热门插件")
  private List<TrendingPlugin> trendingPlugins;

  @Data
  @Schema(description = "分类统计")
  public static class CategoryStats {

    @Schema(description = "分类")
    private PluginCategory category;

    @Schema(description = "插件数量")
    private Long count;

    @Schema(description = "安装数量")
    private Long installCount;
  }

  @Data
  @Schema(description = "近一月增长趋势")
  public static class LastMonthGrowthTrend {

    @Schema(description = "新增可用插件数")
    private Long availablePluginsAdded;

    @Schema(description = "新增安装插件数")
    private Long installedPluginsAdded;

    @Schema(description = "新增下载数")
    private Long downloadsAdded;

    @Schema(description = "新增访问数")
    private Long visitsAdded;

    @Schema(description = "新增评分数")
    private Long ratingsAdded;
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
