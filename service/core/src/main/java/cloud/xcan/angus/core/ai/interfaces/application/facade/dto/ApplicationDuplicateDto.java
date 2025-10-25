package cloud.xcan.angus.core.ai.interfaces.application.facade.dto;

import cloud.xcan.angus.core.ai.domain.Constants;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
@Schema(description = "复制应用请求参数")
public class ApplicationDuplicateDto {

  @Size(max = Constants.APPLICATION_NAME_MAX_LENGTH)
  @Schema(description = "新应用名称", example = "我的智能助手副本")
  private String name;
}
