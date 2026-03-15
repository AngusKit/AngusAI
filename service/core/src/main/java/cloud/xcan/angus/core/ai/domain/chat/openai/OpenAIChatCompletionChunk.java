package cloud.xcan.angus.core.ai.domain.chat.openai;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * OpenAI Chat Completions 流式 Chunk（兼容 OpenAI SSE 格式）
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class OpenAIChatCompletionChunk {

  private String id;

  @JsonProperty("session_id")
  private String sessionId;

  @Builder.Default
  private String object = "chat.completion.chunk";
  private Long created;
  private String model;
  private List<ChunkChoice> choices;

  @Data
  @NoArgsConstructor
  @AllArgsConstructor
  public static class ChunkChoice {

    private Integer index;

    private OpenAIChatCompletionsResponse.Delta delta;

    @JsonProperty("finish_reason")
    private String finishReason;
  }
}
