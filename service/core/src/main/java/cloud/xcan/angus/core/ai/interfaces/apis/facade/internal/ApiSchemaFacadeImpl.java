package cloud.xcan.angus.core.ai.interfaces.apis.facade.internal;

import cloud.xcan.angus.core.ai.application.cmd.apis.ApiSchemaCmd;
import cloud.xcan.angus.core.ai.domain.apis.ApiSchema;
import cloud.xcan.angus.core.ai.interfaces.apis.facade.ApiSchemaFacade;
import cloud.xcan.angus.core.ai.interfaces.apis.facade.internal.assembler.ApiSchemaAssembler;
import cloud.xcan.angus.core.ai.interfaces.apis.facade.vo.ApiSchemaVo;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.servers.Server;
import jakarta.annotation.Resource;
import java.util.List;
import java.util.Map;
import org.springframework.stereotype.Component;

@Component
public class ApiSchemaFacadeImpl implements ApiSchemaFacade {

  @Resource
  private ApiSchemaCmd apiSchemeCmd;

  @Override
  public ApiSchemaVo updateServers(Long collectionId, List<Server> servers) {
    ApiSchema apiSchema = apiSchemeCmd.updateServers(collectionId, servers);
    return ApiSchemaAssembler.toVo(apiSchema);
  }

  @Override
  public ApiSchemaVo updateSecurities(Long collectionId, Map<String, SecurityScheme> securities) {
    ApiSchema apiSchema = apiSchemeCmd.updateSecurities(collectionId, securities);
    return ApiSchemaAssembler.toVo(apiSchema);
  }
}
