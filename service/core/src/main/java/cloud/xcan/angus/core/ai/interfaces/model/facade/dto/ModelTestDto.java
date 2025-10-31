package cloud.xcan.angus.core.ai.interfaces.model.facade.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotEmpty;
import lombok.Data;
import org.hibernate.validator.constraints.Length;

@Data
@Schema(description = "测试模型请求参数")
public class ModelTestDto {

  @NotEmpty
  @Length(max = 1000)
  @Schema(description = "测试提示词", example = "你好，请介绍一下自己")
  private String testPrompt;
}
