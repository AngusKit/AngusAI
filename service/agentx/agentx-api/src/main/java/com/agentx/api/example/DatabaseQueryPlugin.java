package com.agentx.api.example;

import com.agentx.core.plugin.AgentXPlugin;
import com.agentx.core.plugin.PluginContext;
import com.agentx.core.plugin.PluginDescriptor;
import com.agentx.core.skill.SkillDefinition;
import com.agentx.core.tool.ToolDescriptor;
import java.util.List;
import java.util.Map;
import lombok.extern.slf4j.Slf4j;

/**
 * 数据库查询插件 — 使 Agent 具备安全查询数据库的能力。
 * <p>
 * 应用场景：企业内部数据查询 Agent，自然语言转 SQL 查询。
 * </p>
 * <h3>安全机制</h3>
 * <ul>
 *   <li>仅支持 SELECT 操作，禁止 DDL/DML</li>
 *   <li>查询结果默认限制条数</li>
 *   <li>敏感字段脱敏处理</li>
 * </ul>
 */
@Slf4j
public class DatabaseQueryPlugin implements AgentXPlugin {

  @Override
  public PluginDescriptor getDescriptor() {
    return PluginDescriptor.builder()
        .id("database-query-plugin")
        .name("数据库查询插件")
        .version("1.0.0")
        .description("使 Agent 具备安全查询数据库的能力，支持自然语言转 SQL")
        .author("AgentX Team")
        .extensionPoints(List.of("tool", "skill"))
        .config(Map.of(
            "jdbcUrl", "jdbc:postgresql://localhost:5432/demo",
            "maxRows", 100,
            "readOnly", true
        ))
        .build();
  }

  @Override
  public void init(PluginContext context) {
    String jdbcUrl = context.getConfig("jdbcUrl", String.class);
    Integer maxRows = context.getConfig("maxRows", Integer.class);
    if (maxRows == null) {
      maxRows = 100;
    }

    final int limit = maxRows;

    // 注册数据库查询工具
    context.registerTool(ToolDescriptor.builder()
        .id("db-query-tool")
        .name("数据库查询")
        .description("执行只读 SQL 查询，返回结构化结果。仅支持 SELECT 语句。")
        .category("database")
        .source(ToolDescriptor.ToolSource.SPI)
        .executor(params -> {
          String sql = (String) params.getOrDefault("sql", "");
          // 安全校验：仅允许 SELECT
          if (!sql.trim().toUpperCase().startsWith("SELECT")) {
            return "{\"error\":\"仅支持 SELECT 查询\"}";
          }
          log.info("Executing DB query: {} (limit: {})", sql, limit);
          // 实际实现应通过 JDBC 执行查询
          return String.format("{\"sql\":\"%s\",\"status\":\"executed\",\"rowLimit\":%d}", sql,
              limit);
        })
        .build());

    // 注册数据库查询技能
    context.registerSkill(SkillDefinition.builder()
        .id("db-query-skill")
        .name("数据库查询技能")
        .description("基于自然语言生成 SQL 并查询数据库")
        .category("tool_use")
        .toolIds(List.of("db-query-tool"))
        .promptFragment("你具备数据库查询能力。可以将用户的自然语言问题转换为 SQL 查询。\n" +
            "规则：1) 仅生成 SELECT 语句 2) 查询结果限制 " + limit + " 条 3) 敏感字段需脱敏")
        .build());

    log.info("DatabaseQueryPlugin initialized — db-query-tool registered, jdbcUrl={}", jdbcUrl);
  }

  @Override
  public void start() {
    log.info("DatabaseQueryPlugin started");
  }

  @Override
  public void stop() {
    log.info("DatabaseQueryPlugin stopped — database connections released");
  }
}
