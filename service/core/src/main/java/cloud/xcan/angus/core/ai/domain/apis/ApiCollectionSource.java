package cloud.xcan.angus.core.ai.domain.apis;

/**
 * 接口集来源枚举
 */
public enum ApiCollectionSource {
  OPENAPI("OpenAPI 3.0"),
  SWAGGER("Swagger 2.0"),
  POSTMAN("Postman Collection"),
  MANUAL("手动创建");

  private final String displayName;

  ApiCollectionSource(String displayName) {
    this.displayName = displayName;
  }

  public String getDisplayName() {
    return displayName;
  }
}

