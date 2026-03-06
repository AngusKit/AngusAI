package com.agentx.api.example;

import com.agentx.core.plugin.AgentXPlugin;
import com.agentx.core.plugin.PluginContext;
import com.agentx.core.plugin.PluginDescriptor;
import dev.langchain4j.skills.DefaultSkill;
import com.agentx.core.tool.ToolDescriptor;
import java.util.List;
import java.util.Map;
import lombok.extern.slf4j.Slf4j;

/**
 * 文件操作插件 — 使 Agent 具备读取、分析文件的能力。
 * <p>
 * 应用场景：文档分析 Agent，合同审查 Agent，报告生成 Agent。
 * </p>
 * <h3>安全机制</h3>
 * <ul>
 *   <li>仅允许读取操作，不支持写入或删除</li>
 *   <li>限制可访问的文件目录范围</li>
 *   <li>文件大小限制</li>
 * </ul>
 */
@Slf4j
public class FileOperationPlugin implements AgentXPlugin {

  @Override
  public PluginDescriptor getDescriptor() {
    return PluginDescriptor.builder()
        .id("file-operation-plugin")
        .name("文件操作插件")
        .version("1.0.0")
        .description("使 Agent 具备安全读取和分析文件的能力")
        .author("AgentX Team")
        .extensionPoints(List.of("tool", "skill"))
        .config(Map.of(
            "basePath", "/data/uploads",
            "maxFileSizeMB", 10,
            "allowedExtensions", "txt,csv,json,md,pdf"
        ))
        .build();
  }

  @Override
  public void init(PluginContext context) {
    String basePath = context.getConfig("basePath", String.class);
    if (basePath == null) {
      basePath = "/data/uploads";
    }

    final String allowedBase = basePath;

    // 注册文件读取工具
    context.registerTool(ToolDescriptor.builder()
        .id("file-read-tool")
        .name("文件读取")
        .description("读取指定文件的内容。参数：filePath（相对路径）")
        .category("file")
        .source(ToolDescriptor.ToolSource.SPI)
        .executor(params -> {
          String filePath = (String) params.getOrDefault("filePath", "");
          // 路径安全校验：防止目录穿越
          if (filePath.contains("..")) {
            return "{\"error\":\"路径不允许包含 ..\"}";
          }
          log.info("Reading file: {}/{}", allowedBase, filePath);
          // 实际实现应使用文件 I/O
          return String.format("{\"file\":\"%s\",\"status\":\"read\",\"content\":\"[文件内容]\"}",
              filePath);
        })
        .build());

    // 注册文件列表工具
    context.registerTool(ToolDescriptor.builder()
        .id("file-list-tool")
        .name("文件列表")
        .description("列出指定目录下的文件。参数：directory（相对路径）")
        .category("file")
        .source(ToolDescriptor.ToolSource.SPI)
        .executor(params -> {
          String dir = (String) params.getOrDefault("directory", "");
          if (dir.contains("..")) {
            return "{\"error\":\"路径不允许包含 ..\"}";
          }
          log.info("Listing files in: {}/{}", allowedBase, dir);
          return String.format("{\"directory\":\"%s\",\"files\":[\"example.txt\",\"data.csv\"]}",
              dir);
        })
        .build());

    // 注册文件操作技能（LangChain4j Skill）
    context.registerSkill(DefaultSkill.builder()
        .name("file-operation-skill")
        .description("读取和分析文件内容")
        .content("你具备文件读取和分析能力。使用 file-read-tool、file-list-tool 可列出目录和读取文件。\n" +
            "注意：仅支持只读操作，文件路径不允许包含 '..'。")
        .build());

    log.info("FileOperationPlugin initialized — basePath={}", allowedBase);
  }

  @Override
  public void start() {
    log.info("FileOperationPlugin started");
  }

  @Override
  public void stop() {
    log.info("FileOperationPlugin stopped");
  }
}
