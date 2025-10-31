package cloud.xcan.angus.core.ai.interfaces.plugin.facade.vo;

import cloud.xcan.angus.core.ai.domain.plugin.PluginStatistics.CategoryStats;
import cloud.xcan.angus.core.ai.domain.plugin.PluginStatistics.TrendingPlugin;
import cloud.xcan.angus.core.ai.domain.plugin.PluginStatistics.LastMonthGrowthTrend;
import io.swagger.v3.oas.annotations.media.Schema;
import java.util.List;
import lombok.Data;

@Data
@Schema(description = "插件统计数据")
public class PluginStatisticsVo {

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

  @Schema(description = "近一月趋势")
  private LastMonthGrowthTrend lastMonthGrowthTrend;

  @Schema(description = "热门插件")
  private List<TrendingPlugin> trendingPlugins;

}
