package cloud.xcan.angus.core.ai.interfaces.setting.facade.dto;

import cloud.xcan.angus.core.ai.domain.setting.apikey.ApiKeyStatus;
import cloud.xcan.angus.remote.PageQuery;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 查询API密钥DTO
 */
@Data
@EqualsAndHashCode(callSuper = true)
@Schema(description = "查询API密钥请求")
public class ApiKeyFindDto extends PageQuery {

  @Schema(description = "状态筛选")
  private ApiKeyStatus status;

  @Schema(description = "排序字段", example = "createdAt")
  private String orderBy = "createdAt";

  @Schema(description = "排序方式", example = "desc")
  private String orderSort = "desc";
}
