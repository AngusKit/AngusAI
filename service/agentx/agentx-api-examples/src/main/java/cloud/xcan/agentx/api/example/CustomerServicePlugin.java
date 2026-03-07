package cloud.xcan.agentx.api.example;

import cloud.xcan.agentx.core.guardrail.GuardrailResult;
import cloud.xcan.agentx.core.guardrail.OutputGuardrail;
import cloud.xcan.agentx.core.plugin.AgentXPlugin;
import cloud.xcan.agentx.core.plugin.PluginContext;
import cloud.xcan.agentx.core.plugin.PluginDescriptor;
import cloud.xcan.agentx.core.tool.ToolDescriptor;
import dev.langchain4j.skills.DefaultSkill;
import java.util.List;
import java.util.Map;
import lombok.extern.slf4j.Slf4j;

/**
 * 客户服务插件 — 提供完整的客服场景能力（工单管理 + FAQ + 情绪分析）。
 * <p>
 * 应用场景：智能客服系统，集成工单创建、FAQ 知识库检索和用户情绪检测。 参考竞品：Coze 客服模板、Dify 客服应用。
 * </p>
 */
@Slf4j
public class CustomerServicePlugin implements AgentXPlugin {

  @Override
  public PluginDescriptor getDescriptor() {
    return PluginDescriptor.builder()
        .id("customer-service-plugin")
        .name("智能客服插件")
        .version("1.0.0")
        .description("提供完整的客服场景能力：工单管理、FAQ、情绪分析")
        .author("AgentX Team")
        .extensionPoints(List.of("tool", "skill", "guardrail"))
        .config(Map.of(
            "ticketApiUrl", "https://api.example.com/tickets",
            "escalateThreshold", "angry"
        ))
        .build();
  }

  @Override
  public void init(PluginContext context) {
    String ticketApiUrl = context.getConfig("ticketApiUrl", String.class);

    // 工单创建工具
    context.registerTool(ToolDescriptor.builder()
        .id("create-ticket-tool")
        .name("创建工单")
        .description(
            "创建客服工单。参数：title（标题）, description（描述）, priority（优先级：low/medium/high）")
        .category("customer-service")
        .source(ToolDescriptor.ToolSource.SPI)
        .executor(params -> {
          String title = (String) params.getOrDefault("title", "");
          String priority = (String) params.getOrDefault("priority", "medium");
          log.info("Creating ticket: {} (priority: {})", title, priority);
          return String.format(
              "{\"ticketId\":\"TK-%d\",\"title\":\"%s\",\"priority\":\"%s\",\"status\":\"created\"}",
              System.currentTimeMillis() % 100000, title, priority);
        })
        .build());

    // 工单查询工具
    context.registerTool(ToolDescriptor.builder()
        .id("query-ticket-tool")
        .name("查询工单")
        .description("查询工单状态。参数：ticketId（工单号）")
        .category("customer-service")
        .source(ToolDescriptor.ToolSource.SPI)
        .executor(params -> {
          String ticketId = (String) params.getOrDefault("ticketId", "");
          log.info("Querying ticket: {}", ticketId);
          return String.format(
              "{\"ticketId\":\"%s\",\"status\":\"processing\",\"assignee\":\"agent-01\"}",
              ticketId);
        })
        .build());

    // 情绪检测输出护栏
    context.registerOutputGuardrail(new OutputGuardrail() {
      @Override
      public String getId() {
        return "sentiment-escalation";
      }

      @Override
      public GuardrailResult check(String output) {
        // 简单检测：如果输出包含转人工关键词，则标记
        if (output.contains("无法解决") || output.contains("转人工")) {
          return GuardrailResult.builder()
              .passed(true)
              .reason("建议转接人工客服")
              .build();
        }
        return GuardrailResult.builder().passed(true).build();
      }
    });

    // 客服技能（LangChain4j Skill）
    context.registerSkill(DefaultSkill.builder()
        .name("customer-service-skill")
        .description("处理客户咨询、创建工单、查询工单状态")
        .content(
            "你是一名专业客服助手。使用 create-ticket-tool、query-ticket-tool 等工具。工作流程：\n" +
                "1. 理解客户问题，尝试直接回答\n" +
                "2. 无法回答时查询知识库\n" +
                "3. 需要跟进时创建工单\n" +
                "4. 客户情绪激动时安抚并建议转人工\n" +
                "始终保持礼貌、专业、有同理心。")
        .build());

    log.info("CustomerServicePlugin initialized — ticketApi={}", ticketApiUrl);
  }

  @Override
  public void start() {
    log.info("CustomerServicePlugin started");
  }

  @Override
  public void stop() {
    log.info("CustomerServicePlugin stopped");
  }
}
