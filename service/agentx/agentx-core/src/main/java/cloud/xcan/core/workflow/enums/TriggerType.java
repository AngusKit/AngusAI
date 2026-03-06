package cloud.xcan.core.workflow.enums;

/**
 * 工作流触发类型
 */
public enum TriggerType {
  MANUAL,
  WEBHOOK,
  CRON,
  MQ_EVENT,
  SAAS_EVENT
}
