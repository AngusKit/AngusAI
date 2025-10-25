package cloud.xcan.angus.core.ai.interfaces.dataset.facade.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import org.hibernate.validator.constraints.Length;

@Data
@Schema(description = "数据上传请求参数")
public class DataUploadDto {

  @Schema(description = "文件上传（文本/CSV/Excel）")
  private String file;

  @Schema(description = "直接粘贴的文本数据")
  private String data;

  @Schema(description = "是否追加（默认false，覆盖）", example = "false")
  private Boolean append = false;
}
