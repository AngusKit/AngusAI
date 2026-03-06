package com.agentx.core.workflow.dsl;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.dataformat.yaml.YAMLFactory;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Map;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

/**
 * 工作流 DSL 解析器 — JSON / YAML 双格式支持
 */
@Slf4j
@Component
public class WorkflowDslParser {

  private final ObjectMapper jsonMapper;
  private final ObjectMapper yamlMapper;

  public WorkflowDslParser() {
    this.jsonMapper = new ObjectMapper();
    this.jsonMapper.findAndRegisterModules();
    this.yamlMapper = new ObjectMapper(new YAMLFactory());
    this.yamlMapper.findAndRegisterModules();
  }

  public WorkflowDefinition parseJson(String json) throws IOException {
    return extractWorkflow(jsonMapper.readValue(json, Map.class));
  }

  public WorkflowDefinition parseYaml(String yaml) throws IOException {
    return extractWorkflow(yamlMapper.readValue(yaml, Map.class));
  }

  public WorkflowDefinition parseFile(Path path) throws IOException {
    String fileName = path.getFileName().toString().toLowerCase();
    try (InputStream is = Files.newInputStream(path)) {
      Map<String, Object> raw;
      if (fileName.endsWith(".yaml") || fileName.endsWith(".yml")) {
        raw = yamlMapper.readValue(is, Map.class);
      } else {
        raw = jsonMapper.readValue(is, Map.class);
      }
      return extractWorkflow(raw);
    }
  }

  @SuppressWarnings("unchecked")
  private WorkflowDefinition extractWorkflow(Map<String, Object> raw) throws IOException {
    Object workflowObj = raw.getOrDefault("workflow", raw);
    String json = jsonMapper.writeValueAsString(workflowObj);
    return jsonMapper.readValue(json, WorkflowDefinition.class);
  }

  public String toJson(WorkflowDefinition definition) throws IOException {
    return jsonMapper.writerWithDefaultPrettyPrinter().writeValueAsString(
        Map.of("workflow", definition));
  }

  public String toYaml(WorkflowDefinition definition) throws IOException {
    return yamlMapper.writerWithDefaultPrettyPrinter().writeValueAsString(
        Map.of("workflow", definition));
  }
}
