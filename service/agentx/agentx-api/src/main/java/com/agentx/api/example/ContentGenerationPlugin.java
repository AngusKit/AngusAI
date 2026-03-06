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
 * 内容生成插件 — 使 Agent 具备多种内容创作能力。
 * <p>
 * 应用场景：内容营销 Agent、社交媒体管理 Agent、文案写作 Agent。 参考竞品：Jasper AI、Copy.ai、Coze 内容模板。
 * </p>
 */
@Slf4j
public class ContentGenerationPlugin implements AgentXPlugin {

  @Override
  public PluginDescriptor getDescriptor() {
    return PluginDescriptor.builder()
        .id("content-generation-plugin")
        .name("内容生成插件")
        .version("1.0.0")
        .description("提供多种内容创作能力：文章、摘要、翻译、改写")
        .author("AgentX Team")
        .extensionPoints(List.of("tool", "skill"))
        .config(Map.of(
            "defaultLanguage", "zh-CN",
            "maxOutputLength", 4000
        ))
        .build();
  }

  @Override
  public void init(PluginContext context) {
    // 摘要工具
    context.registerTool(ToolDescriptor.builder()
        .id("text-summarize-tool")
        .name("文本摘要")
        .description("对长文本生成摘要。参数：text（原始文本）, maxLength（摘要最大长度）")
        .category("content")
        .source(ToolDescriptor.ToolSource.SPI)
        .executor(params -> {
          String text = (String) params.getOrDefault("text", "");
          int len = text.length();
          log.info("Summarizing text of {} chars", len);
          return String.format("{\"originalLength\":%d,\"summary\":\"[文本摘要]\"}", len);
        })
        .build());

    // 翻译工具
    context.registerTool(ToolDescriptor.builder()
        .id("text-translate-tool")
        .name("文本翻译")
        .description("翻译文本。参数：text（原始文本）, sourceLang（源语言）, targetLang（目标语言）")
        .category("content")
        .source(ToolDescriptor.ToolSource.SPI)
        .executor(params -> {
          String text = (String) params.getOrDefault("text", "");
          String target = (String) params.getOrDefault("targetLang", "en");
          log.info("Translating text to {}", target);
          return String.format("{\"targetLang\":\"%s\",\"translation\":\"[翻译结果]\"}", target);
        })
        .build());

    // 内容创作技能
    context.registerSkill(SkillDefinition.builder()
        .id("content-creation-skill")
        .name("内容创作技能")
        .description("多种内容创作能力：文章、摘要、翻译")
        .category("communication")
        .toolIds(List.of("text-summarize-tool", "text-translate-tool"))
        .promptFragment("你具备内容创作能力：\n" +
            "1. 文章写作 — 根据主题写作结构化文章\n" +
            "2. 文本摘要 — 长文本自动摘要\n" +
            "3. 翻译 — 多语言翻译\n" +
            "4. 改写 — 调整文风和语气\n" +
            "创作时注意：保持内容原创性、事实准确性、语言流畅性。")
        .build());

    log.info("ContentGenerationPlugin initialized");
  }

  @Override
  public void start() {
    log.info("ContentGenerationPlugin started");
  }

  @Override
  public void stop() {
    log.info("ContentGenerationPlugin stopped");
  }
}
