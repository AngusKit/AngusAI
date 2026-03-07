package cloud.xcan.agentx.core.guardrail;

/**
 * 输入护栏 SPI — 处理用户输入
 */
public interface InputGuardrail {

  /**
   * @return 护栏唯一标识
   */
  String getId();

  /**
   * 检查输入是否合规
   *
   * @param input 用户输入
   * @return 检查结果
   */
  GuardrailResult check(String input);
}
