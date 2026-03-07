package cloud.xcan.agentx.core.guardrail;

/**
 * 输出护栏 SPI — 处理 Agent 输出
 */
public interface OutputGuardrail {

  /**
   * @return 护栏唯一标识
   */
  String getId();

  /**
   * 检查输出是否合规
   *
   * @param output Agent 输出
   * @return 检查结果
   */
  GuardrailResult check(String output);
}
