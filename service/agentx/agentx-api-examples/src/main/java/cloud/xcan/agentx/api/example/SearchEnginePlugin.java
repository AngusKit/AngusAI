package cloud.xcan.agentx.api.example;

import cloud.xcan.core.plugin.AgentXPlugin;
import cloud.xcan.core.plugin.PluginContext;
import cloud.xcan.core.plugin.PluginDescriptor;
import cloud.xcan.core.tool.ToolDescriptor;
import dev.langchain4j.skills.DefaultSkill;
import java.util.List;
import java.util.Map;
import lombok.extern.slf4j.Slf4j;

/**
 * 搜索引擎插件 — 使 Agent 具备多来源搜索能力。
 * <p>
 * 应用场景：研究助手 Agent（参考 Perplexity），内容创作 Agent。
 * </p>
 */
@Slf4j
public class SearchEnginePlugin implements AgentXPlugin {

  @Override
  public PluginDescriptor getDescriptor() {
    return PluginDescriptor.builder()
        .id("search-engine-plugin")
        .name("搜索引擎插件")
        .version("1.0.0")
        .description("提供多来源搜索能力：网页搜索、新闻搜索、学术搜索")
        .author("AgentX Team")
        .extensionPoints(List.of("tool", "skill"))
        .config(Map.of(
            "searchApiKey", "your-search-api-key",
            "searchEngine", "google",
            "maxResults", 10
        ))
        .build();
  }

  @Override
  public void init(PluginContext context) {
    Integer maxResults = context.getConfig("maxResults", Integer.class);
    if (maxResults == null) {
      maxResults = 10;
    }
    final int limit = maxResults;

    // 网页搜索工具
    context.registerTool(ToolDescriptor.builder()
        .id("web-search-tool")
        .name("网页搜索")
        .description("搜索互联网获取相关网页。参数：query（搜索关键词）")
        .category("search")
        .source(ToolDescriptor.ToolSource.SPI)
        .executor(params -> {
          String query = (String) params.getOrDefault("query", "");
          log.info("Web search: {} (limit: {})", query, limit);
          return String.format(
              "{\"query\":\"%s\",\"results\":[{\"title\":\"示例结果\",\"url\":\"https://example.com\",\"snippet\":\"相关内容...\"}]}",
              query);
        })
        .build());

    // 新闻搜索工具
    context.registerTool(ToolDescriptor.builder()
        .id("news-search-tool")
        .name("新闻搜索")
        .description("搜索最近的新闻报道。参数：query（搜索关键词）")
        .category("search")
        .source(ToolDescriptor.ToolSource.SPI)
        .executor(params -> {
          String query = (String) params.getOrDefault("query", "");
          log.info("News search: {}", query);
          return String.format(
              "{\"query\":\"%s\",\"news\":[{\"title\":\"新闻标题\",\"source\":\"示例新闻源\",\"date\":\"2024-01-01\"}]}",
              query);
        })
        .build());

    // 搜索技能（LangChain4j Skill）
    context.registerSkill(DefaultSkill.builder()
        .name("search-engine-skill")
        .description("多来源搜索：网页、新闻")
        .content("你具备多来源搜索能力。使用 web-search-tool、news-search-tool：\n" +
            "1. 网页搜索 — 搜索互联网上的网页内容\n" +
            "2. 新闻搜索 — 搜索最近的新闻报道\n" +
            "根据用户问题选择合适的搜索来源。搜索后综合多个结果给出回答，并标注信息来源。")
        .build());

    log.info("SearchEnginePlugin initialized");
  }

  @Override
  public void start() {
    log.info("SearchEnginePlugin started");
  }

  @Override
  public void stop() {
    log.info("SearchEnginePlugin stopped");
  }
}
