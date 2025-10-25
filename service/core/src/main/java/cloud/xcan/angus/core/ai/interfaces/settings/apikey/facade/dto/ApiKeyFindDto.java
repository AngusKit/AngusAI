package cloud.xcan.angus.core.ai.interfaces.settings.apikey.facade.dto;

import cloud.xcan.angus.core.ai.domain.settings.apikey.ApiKeyStatus;
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

  @Schema(description = "搜索关键词（密钥名称）")
  private String keyword;

  @Schema(description = "状态筛选")
  private ApiKeyStatus status;

  @Schema(description = "排序字段", example = "createdAt")
  private String orderBy = "createdAt";

  @Schema(description = "排序方式", example = "desc")
  private String orderSort = "desc";
}
