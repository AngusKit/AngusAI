package cloud.xcan.angus.core.ai.interfaces.chat.facade.dto;

import static cloud.xcan.angus.spec.experimental.BizConstant.MAX_NAME_LENGTH;

import cloud.xcan.angus.core.ai.domain.chat.SessionConfig;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import org.hibernate.validator.constraints.Length;

@Data
@Schema(description = "更新会话请求")
public class SessionUpdateDto {

  @Schema(description = "会话标题")
  @Length(max = MAX_NAME_LENGTH)
  private String title;

  @Schema(description = "会话配置")
  private SessionConfig config;

}
