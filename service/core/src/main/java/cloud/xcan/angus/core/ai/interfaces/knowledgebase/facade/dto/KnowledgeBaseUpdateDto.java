package cloud.xcan.angus.core.ai.interfaces.knowledgebase.facade.dto;

import cloud.xcan.angus.core.ai.domain.Constants;
import cloud.xcan.angus.core.ai.domain.knowledgebase.DocumentVisibility;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Size;
import java.util.List;
import lombok.Data;

@Data
@Schema(description = "更新知识库请求参数")
public class KnowledgeBaseUpdateDto {

  @Size(max = Constants.KNOWLEDGE_BASE_NAME_MAX_LENGTH)
  @Schema(description = "知识库名称", example = "产品文档库")
  private String name;

  @Schema(description = "图标", example = "📚")
  private String icon;

  @Schema(description = "背景色", example = "bg-blue-100")
  private String iconBg;

  @Size(max = Constants.KNOWLEDGE_BASE_DESCRIPTION_MAX_LENGTH)
  @Schema(description = "描述", example = "存储产品相关文档和资料")
  private String description;

  @Schema(description = "可见性", example = "PRIVATE")
  private DocumentVisibility visibility;

  @Size(max = Constants.KNOWLEDGE_BASE_TAGS_MAX_COUNT)
  @Schema(description = "标签", example = "[\"产品\", \"文档\"]")
  private List<String> tags;

  @Valid
  @Schema(description = "配置信息")
  private KnowledgeBaseConfigDto config;
}
