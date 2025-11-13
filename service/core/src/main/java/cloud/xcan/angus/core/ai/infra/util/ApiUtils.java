package cloud.xcan.angus.core.ai.infra.util;

import static cloud.xcan.angus.core.ai.domain.Constants.EXPORT_OPENAPI_DIR;
import static cloud.xcan.angus.core.ai.domain.Constants.IMPORT_OPENAPI_DIR;
import static cloud.xcan.angus.core.ai.domain.Constants.IMPORT_POSTMAN_DIR;
import static cloud.xcan.angus.core.biz.ProtocolAssert.assertTrue;
import static cloud.xcan.angus.core.utils.CoreUtils.randomUUID;
import static cloud.xcan.angus.spec.principal.PrincipalContext.getTenantId;
import static cloud.xcan.angus.spec.utils.ObjectUtils.nullSafe;
import static java.util.Objects.nonNull;
import static org.apache.commons.lang3.ObjectUtils.isNotEmpty;

import cloud.xcan.angus.core.ai.domain.apis.ApiCollectionSource;
import cloud.xcan.angus.core.utils.SpringAppDirUtils;
import io.swagger.parser.OpenAPIParser;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.parser.core.models.AuthorizationValue;
import io.swagger.v3.parser.core.models.ParseOptions;
import io.swagger.v3.parser.core.models.SwaggerParseResult;
import java.io.File;
import java.util.List;

public class ApiUtils {
  /**
   * Detail OpenApi validation
   * <p>
   * - <a>https://validator.swagger.io/#/</a> -
   * <a>https://github.com/swagger-api/validator-badge.git</>
   */
  public static OpenAPI checkAndParseOpenApi(String content, List<AuthorizationValue> auth,
      ParseOptions options) {
    // Parse OpenAPI
    SwaggerParseResult result = new OpenAPIParser().readContents(content, auth, options);

    // Note:: The resolution of result. getMessages () may also be successful if it is not empty, such as the exception information in converting Swagger 2 to OpenAPI 3
    String parseError = nonNull(result.getOpenAPI()) && isNotEmpty(result.getMessages())
        ? result.getMessages().get(0) : "Parsing OpenAPI error";
    assertTrue(nonNull(result.getOpenAPI()), "解析OpenAPI错误：{0}", parseError);

    // Return the parsed POJO
    return result.getOpenAPI();
  }

  /**
   * Creates a temporary directory path for API import operations.
   * <p>
   * Generates tenant-specific temporary directories for different import sources.
   * <p>
   * Supports OpenAPI and Postman import sources with separate directory structures.
   * <p>
   *
   * @param sourceType the type of API import source (OPENAPI or POSTMAN)
   * @param fileName   optional file name to include in the path
   * @return the created temporary directory for import operations
   */
  public static File getImportTmpPath(ApiCollectionSource sourceType, String fileName) {
    String tmpPath;
    SpringAppDirUtils utils = new SpringAppDirUtils();

    // Build path based on import source type
    if (sourceType.equals(ApiCollectionSource.OPENAPI)) {
      // Create OpenAPI-specific import directory
      tmpPath = utils.getTmpDir() + IMPORT_OPENAPI_DIR + getTenantId()
          + File.separator + randomUUID() + File.separator + nullSafe(fileName, "");
    } else /*if (sourceType.equals(ApiImportSource.POSTMAN))*/ {
      // Create Postman-specific import directory
      tmpPath = utils.getTmpDir() + IMPORT_POSTMAN_DIR + getTenantId()
          + File.separator + randomUUID() + File.separator + nullSafe(fileName, "");
    }

    // Create directory and return file object
    File file = new File(tmpPath);
    file.mkdirs();
    return file;
  }

  /**
   * Creates a temporary path for API export operations.
   * <p>
   * Generates tenant-specific temporary paths for export processing.
   * <p>
   * Handles both directory and file path creation based on the provided file name.
   * <p>
   * @param fileName optional file name to include in the path
   * @return the created temporary path for export operations
   */
  public static File getExportTmpPath(String fileName) {
    SpringAppDirUtils utils = new SpringAppDirUtils();

    // Build export path with tenant isolation and unique identifier
    String tmpPath = utils.getTmpDir() + EXPORT_OPENAPI_DIR + getTenantId()
        + File.separator + randomUUID() + File.separator + nullSafe(fileName, "");

    // Create file object and ensure parent directory exists
    File file = new File(tmpPath);
    if (file.isDirectory()) {
      // Create directory if path represents a directory
      file.mkdirs();
    } else {
      // Create parent directory if path represents a file
      file.getParentFile().mkdirs();
    }
    return file;
  }

}
