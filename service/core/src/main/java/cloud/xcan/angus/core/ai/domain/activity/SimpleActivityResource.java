package cloud.xcan.angus.core.ai.domain.activity;

import cloud.xcan.angus.api.commonlink.CombinedTargetType;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.Accessors;

@Setter
@Getter
@Accessors(chain = true)
public class SimpleActivityResource implements ActivityResource {

  private CombinedTargetType targetType;

  private Long id;

  private String name;

  private Long parentId;

  private Long projectId;

}
