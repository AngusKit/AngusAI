package cloud.xcan.angus.core.ai.interfaces.vector.facade.dto;

import cloud.xcan.angus.core.ai.infra.ai.vector.VectorStoreConfig;
import cloud.xcan.angus.core.ai.infra.ai.vector.VectorStoreType;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.media.Schema.RequiredMode;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import org.hibernate.validator.constraints.Length;

@Data
@Schema(description = "创建向量存储源请求参数")
public class VectorStoreCreateDto {

  @NotBlank
  @Length(max = 100)
  @Schema(description = "存储源名称", requiredMode = RequiredMode.REQUIRED)
  private String name;

  @NotNull
  @Schema(description = "数据库类型", requiredMode = RequiredMode.REQUIRED)
  private VectorStoreType type;

  @Length(max = 500)
  @Schema(description = "描述")
  private String description;

  // TODO 在接口实现处加入一次运行时校验（例如校验已存在集合/索引的维度与请求一致），并在失败时返回可读的错误提示
  @NotNull
  @Min(1)
  @Max(4096)
  @Schema(
      description = """
          向量维度。必须与所用嵌入模型输出维度一致，否则入库/检索会失败。
          常见示例：
          - 1536：OpenAI text-embedding-3-large/ada-002 等
          - 1024：部分 MiniLM/Cohere 模型
          - 768：BERT/MPNet/BGE-large 等
          - 512：E5-base/BGE-base 等
          - 384：all-MiniLM-L6-v2/E5-small 等
          不同存储会据此建索引/集合：Elasticsearch/OpenSearch dense_vector.dims、Milvus/Qdrant/Weaviate/Pinecone 的集合 schema、PGVector 列维度等。""",
      requiredMode = RequiredMode.REQUIRED,
      example = "1536",
      minimum = "1",
      maximum = "4096")
  private Integer dimension;

  @NotNull
  @Valid
  @Schema(description = "配置信息", requiredMode = RequiredMode.REQUIRED)
  private VectorStoreConfig config;

}
