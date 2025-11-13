package cloud.xcan.angus.core.ai.interfaces.apis.facade;

import cloud.xcan.angus.core.ai.interfaces.apis.facade.vo.ApiSchemaVo;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.servers.Server;
import java.util.List;
import java.util.Map;

public interface ApiSchemaFacade {

  ApiSchemaVo updateServers(Long collectionId, List<Server> servers);

  ApiSchemaVo updateSecurities(Long collectionId, Map<String, SecurityScheme> securities);

}
