package cloud.xcan.angus.core.ai.interfaces.apis;

import cloud.xcan.angus.core.ai.interfaces.apis.facade.ApiSchemaFacade;
import cloud.xcan.angus.core.ai.interfaces.apis.facade.vo.ApiSchemaVo;
import cloud.xcan.angus.remote.ApiLocaleResult;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.servers.Server;
import jakarta.annotation.Resource;
import jakarta.validation.Valid;
import java.util.List;
import java.util.Map;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "接口集设置", description = "接口集安全方案和服务器管理")
@Validated
@RestController
@RequestMapping("/api/v1/api-collections")
public class ApiSchemaRest {

  @Resource
  private ApiSchemaFacade apiSchemaFacade;

  @Operation(operationId = "apiServersUpdate", summary = "更新接口集服务器", description = "更新接口集服务器信息")
  @ApiResponses({
      @ApiResponse(responseCode = "200", description = "更新成功")
  })
  @PutMapping("/{collectionId}/servers")
  public ApiLocaleResult<ApiSchemaVo> updateServers(
      @Parameter(description = "接口集ID", required = true) @PathVariable Long collectionId,
      @Valid @RequestBody List<Server> servers) {
    return ApiLocaleResult.success(apiSchemaFacade.updateServers(collectionId, servers));
  }

  @Operation(operationId = "apiSecuritiesUpdate", summary = "更新接口集安全方案", description = "更新接口集安全方案信息")
  @ApiResponses({
      @ApiResponse(responseCode = "200", description = "更新成功")
  })
  @PutMapping("/{collectionId}/securities")
  public ApiLocaleResult<ApiSchemaVo> updateSecurities(
      @Parameter(description = "接口集ID", required = true) @PathVariable Long collectionId,
      @Valid @RequestBody Map<String, SecurityScheme> securities) {
    return ApiLocaleResult.success(apiSchemaFacade.updateSecurities(collectionId, securities));
  }

}
