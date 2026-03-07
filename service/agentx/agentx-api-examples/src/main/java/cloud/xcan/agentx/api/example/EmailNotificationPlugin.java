package cloud.xcan.agentx.api.example;

import cloud.xcan.agentx.core.plugin.AgentXPlugin;
import cloud.xcan.agentx.core.plugin.PluginContext;
import cloud.xcan.agentx.core.plugin.PluginDescriptor;
import cloud.xcan.agentx.core.tool.ToolDescriptor;
import dev.langchain4j.skills.DefaultSkill;
import java.util.List;
import java.util.Map;
import lombok.extern.slf4j.Slf4j;

/**
 * 邮件通知插件 — 使 Agent 具备发送邮件的能力。
 * <p>
 * 应用场景：客服 Agent 自动发送工单通知；日程提醒 Agent。
 * </p>
 */
@Slf4j
public class EmailNotificationPlugin implements AgentXPlugin {

  @Override
  public PluginDescriptor getDescriptor() {
    return PluginDescriptor.builder()
        .id("email-notification-plugin")
        .name("邮件通知插件")
        .version("1.0.0")
        .description("使 Agent 具备发送邮件通知的能力")
        .author("AgentX Team")
        .extensionPoints(List.of("tool", "skill"))
        .config(Map.of(
            "smtpHost", "smtp.example.com",
            "smtpPort", 587,
            "fromAddress", "agent@example.com"
        ))
        .build();
  }

  @Override
  public void init(PluginContext context) {
    String smtpHost = context.getConfig("smtpHost", String.class);
    String fromAddress = context.getConfig("fromAddress", String.class);

    // 注册发送邮件工具
    context.registerTool(ToolDescriptor.builder()
        .id("send-email-tool")
        .name("发送邮件")
        .description("发送邮件通知。参数：to（收件人）, subject（主题）, body（正文）")
        .category("notification")
        .source(ToolDescriptor.ToolSource.SPI)
        .executor(params -> {
          String to = (String) params.getOrDefault("to", "");
          String subject = (String) params.getOrDefault("subject", "");
          String body = (String) params.getOrDefault("body", "");
          log.info("Sending email from {} to {}: {}", fromAddress, to, subject);
          // 实际实现应通过 JavaMail/Spring Mail 发送
          return String.format("{\"status\":\"sent\",\"to\":\"%s\",\"subject\":\"%s\"}", to,
              subject);
        })
        .build());

    // 注册邮件通知技能（LangChain4j Skill）
    context.registerSkill(DefaultSkill.builder()
        .name("email-notification-skill")
        .description("发送邮件通知给指定用户")
        .content("你具备发送邮件的能力。使用 send-email-tool 工具可发送邮件。\n" +
            "发送前请确认收件人、主题和正文内容。注意不要发送垃圾邮件。")
        .build());

    log.info("EmailNotificationPlugin initialized — smtp={}, from={}", smtpHost, fromAddress);
  }

  @Override
  public void start() {
    log.info("EmailNotificationPlugin started");
  }

  @Override
  public void stop() {
    log.info("EmailNotificationPlugin stopped");
  }
}
