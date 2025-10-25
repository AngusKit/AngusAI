package cloud.xcan.angus.core.ai.domain.knowledgebase;

import cloud.xcan.angus.spec.experimental.EndpointRegister;
import cloud.xcan.angus.spec.locale.EnumMessage;

@EndpointRegister
public enum DocumentType implements EnumMessage<String> {
  TXT, // 文本文件
  PDF, // PDF文件
  DOCX, // Word文档
  MD, // Markdown文件
  HTML; // HTML文件

  public String getValue() {
    return this.name();
  }
}
