package cloud.xcan.angus.core.ai.application.converter;

import static cloud.xcan.angus.spec.experimental.BizConstant.MAX_OPENAPI_DOC_DESC_LENGTH;
import static cloud.xcan.angus.spec.experimental.BizConstant.MAX_OPENAPI_SUMMARY_LENGTH;
import static cloud.xcan.angus.spec.principal.PrincipalContext.getUserId;
import static cloud.xcan.angus.spec.utils.ObjectUtils.lengthSafe;
import static cloud.xcan.angus.spec.utils.ObjectUtils.nullSafe;
import static cloud.xcan.angus.spec.utils.ObjectUtils.stringSafe;
import static java.util.Objects.nonNull;

import cloud.xcan.angus.core.ai.domain.apis.ApiCollection;
import cloud.xcan.angus.core.ai.domain.apis.ApiEndpoint;
import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.Operation;
import io.swagger.v3.oas.models.PathItem.HttpMethod;

public class ApiEndpointConverter {

  public static ApiEndpoint toSchemaApiEndpoint(Operation operation) {
    return new ApiEndpoint()
        .setMethod(HttpMethod.valueOf(operation.method.toUpperCase()))
        // Fix:: Uri cannot be a null value, must be safe to ""
        .setPath(nullSafe(operation.endpoint, ""))
        .setTags(operation.getTags())
        .setName(lengthSafe(nullSafe(operation.getSummary(),
            stringSafe(operation.getDescription())), MAX_OPENAPI_SUMMARY_LENGTH))
        .setDescription(lengthSafe(operation.getDescription(), MAX_OPENAPI_DOC_DESC_LENGTH))
        //.setExternalDocs(operation.getExternalDocs())
        .setOperationId(operation.getOperationId())
        .setParameters(operation.getParameters())
        .setRequestBody(operation.getRequestBody())
        .setResponses(nonNull(operation.getResponses()) ? operation.getResponses() : null)
        //.setDeprecated(nullSafe(operation.getDeprecated(), false))
        //.setSecurity(operation.getSecurity())
        //.setServers(operation.getServers())
        //.setExtensions(operation.getExtensions())
        .setSchemaHash(operation.hashCode());
  }

  public static void assembleSchemaToUpdateApis(ApiEndpoint apisDb, ApiEndpoint openApis) {
    // Note:: Will not modify currentServer and authentication.
    apisDb.setTags(openApis.getTags())
        .setName(stringSafe(openApis.getName()))
        .setDescription(openApis.getDescription())
        //.setExternalDocs(openApis.getExternalDocs())
        .setOperationId(openApis.getOperationId())
        .setParameters(openApis.getParameters())
        .setRequestBody(openApis.getRequestBody())
        .setResponses(openApis.getResponses())
        //.setDeprecated(isNull(apisDb.getDeprecated()) ? nullSafe(openApis.getDeprecated(), false) : apisDb.getDeprecated())
        //.setSecurity(openApis.getSecurity())
        //.setCurrentServer(null) <- NOOP
        //.setServers(openApis.getServers())
        //.setExtensions(openApis.getExtensions())
        .setSchemaHash(openApis.getSchemaHash());
    //.setAuthentication(null) <- NOOP
  }
}
