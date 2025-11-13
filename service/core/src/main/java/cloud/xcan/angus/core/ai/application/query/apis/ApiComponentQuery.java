package cloud.xcan.angus.core.ai.application.query.apis;

import cloud.xcan.angus.core.ai.domain.apis.ApiComponent;
import cloud.xcan.angus.core.ai.domain.apis.ApiComponentType;
import java.util.List;

public interface ApiComponentQuery {

  List<ApiComponent> findByCollectionIdAndType(Long collectionId, ApiComponentType type);
}
