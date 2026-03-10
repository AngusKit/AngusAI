package cloud.xcan.angus.core.ai.application.converter;

import static cloud.xcan.angus.spec.experimental.BizConstant.MAX_OPENAPI_DOC_DESC_LENGTH;
import static cloud.xcan.angus.spec.experimental.BizConstant.MAX_OPENAPI_SUMMARY_LENGTH;
import static cloud.xcan.angus.spec.utils.ObjectUtils.isNotEmpty;
import static cloud.xcan.angus.spec.utils.ObjectUtils.isNull;
import static cloud.xcan.angus.spec.utils.ObjectUtils.lengthSafe;
import static cloud.xcan.angus.spec.utils.ObjectUtils.nullSafe;
import static cloud.xcan.angus.spec.utils.ObjectUtils.stringSafe;
import static io.swagger.v3.oas.models.PathItem.HttpMethod.DELETE;
import static io.swagger.v3.oas.models.PathItem.HttpMethod.GET;
import static io.swagger.v3.oas.models.PathItem.HttpMethod.HEAD;
import static io.swagger.v3.oas.models.PathItem.HttpMethod.OPTIONS;
import static io.swagger.v3.oas.models.PathItem.HttpMethod.PATCH;
import static io.swagger.v3.oas.models.PathItem.HttpMethod.POST;
import static io.swagger.v3.oas.models.PathItem.HttpMethod.PUT;
import static io.swagger.v3.oas.models.PathItem.HttpMethod.TRACE;
import static java.util.Objects.nonNull;

import cloud.xcan.angus.core.ai.domain.apis.ApiEndpoint;
import io.swagger.v3.oas.models.Operation;
import io.swagger.v3.oas.models.PathItem;
import io.swagger.v3.oas.models.PathItem.HttpMethod;
import io.swagger.v3.oas.models.Paths;
import io.swagger.v3.oas.models.responses.ApiResponses;
import java.util.List;
import java.util.Map;

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
        .setDeprecated(nullSafe(operation.getDeprecated(), false))
        //.setExternalDocs(operation.getExternalDocs())
        .setOperationId(operation.getOperationId())
        .setParameters(operation.getParameters())
        .setRequestBody(operation.getRequestBody())
        .setResponses(nonNull(operation.getResponses()) ? operation.getResponses() : null)
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
        .setDeprecated(isNull(apisDb.getDeprecated()) ? nullSafe(openApis.getDeprecated(), false)
            : apisDb.getDeprecated())
        .setParameters(openApis.getParameters())
        .setRequestBody(openApis.getRequestBody())
        .setResponses(openApis.getResponses())
        //.setSecurity(openApis.getSecurity())
        //.setCurrentServer(null) <- NOOP
        //.setServers(openApis.getServers())
        //.setExtensions(openApis.getExtensions())
        .setSchemaHash(openApis.getSchemaHash());
    //.setAuthentication(null) <- NOOP
  }


  public static Paths toPaths(Map<String, List<ApiEndpoint>> apisMap) {
    Paths paths = new Paths();
    for (String path : apisMap.keySet()) {
      List<ApiEndpoint> methodOperations = apisMap.get(path);
      paths.put(path, toPathItem(methodOperations));
    }
    return paths;
  }

  public static PathItem toPathItem(List<ApiEndpoint> methodOperations) {
    PathItem pathItem = new PathItem();
    for (ApiEndpoint apis : methodOperations) {
      HttpMethod method = apis.getMethod();
      if (GET.equals(method)) {
        pathItem.setGet(toOperations(apis));
      }
      if (HEAD.equals(method)) {
        pathItem.setHead(toOperations(apis));
      }
      if (POST.equals(method)) {
        pathItem.setPost(toOperations(apis));
      }
      if (PUT.equals(method)) {
        pathItem.setPut(toOperations(apis));
      }
      if (PATCH.equals(method)) {
        pathItem.setPatch(toOperations(apis));
      }
      if (DELETE.equals(method)) {
        pathItem.setDelete(toOperations(apis));
      }
      if (OPTIONS.equals(method)) {
        pathItem.setOptions(toOperations(apis));
      }
      if (TRACE.equals(method)) {
        pathItem.setTrace(toOperations(apis));
      }
    }
    return pathItem;
  }

  public static Operation toOperations(ApiEndpoint apis) {
    ApiResponses responses = new ApiResponses();
    if (isNotEmpty(apis.getResponses())) {
      responses.putAll(apis.getResponses());
    }
    return new Operation().tags(apis.getTags())
        .summary(apis.getName())
        .description(apis.getDescription())
        .externalDocs(apis.getExternalDocs())
        .operationId(apis.getOperationId())
        .parameters(apis.getParameters())
        .requestBody(apis.getRequestBody())
        .responses(responses)
        //.callbacks(apis.getCallbacks())
        .deprecated(apis.getDeprecated())
        .security(apis.getSecurity());
  }
}
