package cloud.xcan.agentx.core.agent.definition;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.dataformat.yaml.YAMLFactory;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import lombok.extern.slf4j.Slf4j;

/**
 * Agent 定义解析器 — 支持 JSON 和 YAML
 */
@Slf4j
public class AgentDefinitionParser {

  private final ObjectMapper jsonMapper;
  private final ObjectMapper yamlMapper;

  public AgentDefinitionParser() {
    this.jsonMapper = new ObjectMapper();
    this.jsonMapper.findAndRegisterModules();
    this.yamlMapper = new ObjectMapper(new YAMLFactory());
    this.yamlMapper.findAndRegisterModules();
  }

  public AgentDefinition parseJson(String json) throws IOException {
    return jsonMapper.readValue(json, AgentDefinition.class);
  }

  public AgentDefinition parseYaml(String yaml) throws IOException {
    return yamlMapper.readValue(yaml, AgentDefinition.class);
  }

  public AgentDefinition parseFile(Path path) throws IOException {
    String fileName = path.getFileName().toString().toLowerCase();
    try (InputStream is = Files.newInputStream(path)) {
      if (fileName.endsWith(".yaml") || fileName.endsWith(".yml")) {
        return yamlMapper.readValue(is, AgentDefinition.class);
      } else {
        return jsonMapper.readValue(is, AgentDefinition.class);
      }
    }
  }

  public String toJson(AgentDefinition definition) throws IOException {
    return jsonMapper.writerWithDefaultPrettyPrinter().writeValueAsString(definition);
  }

  public String toYaml(AgentDefinition definition) throws IOException {
    return yamlMapper.writerWithDefaultPrettyPrinter().writeValueAsString(definition);
  }
}
