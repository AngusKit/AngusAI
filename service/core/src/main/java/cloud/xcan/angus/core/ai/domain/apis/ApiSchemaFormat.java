package cloud.xcan.angus.core.ai.domain.apis;

public enum ApiSchemaFormat {
  yaml, json;

  public boolean isYaml() {
    return this.equals(yaml);
  }
}
