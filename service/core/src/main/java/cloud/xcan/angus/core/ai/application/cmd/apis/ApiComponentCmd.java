package cloud.xcan.angus.core.ai.application.cmd.apis;

import cloud.xcan.angus.core.ai.domain.apis.ConflictStrategy;
import io.swagger.v3.oas.models.Components;
import java.util.Collection;

public interface ApiComponentCmd {

  void replaceByOpenApi(Long collectionId, Components components,
      ConflictStrategy conflictStrategy);

  void deleteByCollectionIdAndRefIn(Long collectionId, Collection<String> refs);
}
