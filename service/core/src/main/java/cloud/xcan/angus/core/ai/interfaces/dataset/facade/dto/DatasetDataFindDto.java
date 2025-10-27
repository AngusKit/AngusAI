package cloud.xcan.angus.core.ai.interfaces.dataset.facade.dto;

import cloud.xcan.angus.core.ai.domain.dataset.DatasetDataStatus;
import cloud.xcan.angus.core.ai.domain.dataset.DatasetDataType;
import cloud.xcan.angus.remote.PageQuery;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
@Schema(description = "查询数据集请求参数")
public class DatasetDataFindDto extends PageQuery {

  @Schema(description = "数据ID")
  private Long id;

  @Schema(description = "数据名称（文件名或表名）")
  private String name;

  @Schema(description = "数据类型筛选")
  private DatasetDataType type;

  @Schema(description = "数据处理状态筛选")
  private DatasetDataStatus status;

  @Schema(description = "数据大小")
  private Long dataSize;

  @Schema(description = "所属租户ID", example = "1")
  private Long tenantId;

  @Schema(description = "排序字段", example = "lastModifiedDate", allowableValues = {"name", "type",
      "size", "createdDate", "lastModifiedDate"})
  private String orderBy = "lastModifiedDate";

}
