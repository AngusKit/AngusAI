package cloud.xcan.angus.core.ai.application.cmd.apis;

import cloud.xcan.angus.core.ai.domain.apis.ConflictStrategy;
import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.security.SecurityScheme;
import java.util.Collection;
import java.util.Map;

public interface ApiComponentCmd {

  void replaceByOpenApi(Long collectionId, Components components,
      ConflictStrategy conflictStrategy);

  void replaceSecuritiesComponent(Long collectionId, Map<String, SecurityScheme> securities);

  void deleteByCollectionIdAndRefIn(Long collectionId, Collection<String> refs);

}
