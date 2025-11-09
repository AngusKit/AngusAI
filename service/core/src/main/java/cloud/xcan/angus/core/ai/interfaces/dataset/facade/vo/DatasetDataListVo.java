package cloud.xcan.angus.core.ai.interfaces.dataset.facade.vo;

import cloud.xcan.angus.core.ai.domain.dataset.DatasetDataStatus;
import cloud.xcan.angus.core.ai.domain.dataset.DatasetDataType;
import cloud.xcan.angus.remote.vo.TenantAuditingVo;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(callSuper = true)
@Data
@Schema(description = "数据集数据列表项响应")
public class DatasetDataListVo extends TenantAuditingVo {

  @Schema(description = "数据ID")
  private Long id;

  @Schema(description = "数据集数据名称")
  private String name;

  @Schema(description = "数据类型")
  private DatasetDataType type;

  @Schema(description = "状态")
  private DatasetDataStatus status;

  @Schema(description = "数据记录数")
  private Long dataCount;

  @Schema(description = "数据大小")
  private String dataSize;

  @Schema(description = "文件存储URL路径", example = "https://example.com/file.pdf")
  private String filePath;

  @Schema(description = "文件内容哈希编码", example = "3c9b5de3b42eeba213989e92713baa1653dc675cd38c89a2eaa2c64cb8e27f7a")
  private String contentHash;

}
