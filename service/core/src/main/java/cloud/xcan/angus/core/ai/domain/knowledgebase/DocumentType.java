package cloud.xcan.angus.core.ai.domain.knowledgebase;

public enum DocumentType {
  TXT, // 文本文件
  PDF, // PDF文件
  DOCX, // Word文档
  MARKDOWN, // Markdown文件
  HTML, // HTML文件
  JSON, // JSON文件
  XML; // XML文件

  public String getValue() {
    return this.name();
  }
}
