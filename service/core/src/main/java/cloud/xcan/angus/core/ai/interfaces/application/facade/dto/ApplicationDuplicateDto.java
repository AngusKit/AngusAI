package cloud.xcan.angus.core.ai.interfaces.application.facade.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
@Schema(description = "复制应用请求参数")
public class ApplicationDuplicateDto {

  @Size(max = 50, message = "应用名称不能超过50个字符")
  @Schema(description = "新应用名称", example = "我的智能助手副本")
  private String name;
}
