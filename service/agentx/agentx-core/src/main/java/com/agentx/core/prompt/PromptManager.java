package com.agentx.core.prompt;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

/**
 * 提示词管理器 — 模板库、版本管理、变量渲染
 */
@Slf4j
@Component
public class PromptManager {

  private static final Pattern VARIABLE_PATTERN = Pattern.compile("\\{\\{(\\w+)}}");

  /**
   * promptId → version list
   */
  private final Map<String, List<PromptTemplate>> templates = new ConcurrentHashMap<>();

  /**
   * 保存模板（自动版本化）
   */
  public PromptTemplate save(String id, String name, String category, String content,
      Map<String, String> variables, String tenantId) {
    List<PromptTemplate> versions = templates.computeIfAbsent(id, k -> new ArrayList<>());
    int nextVersion = versions.size() + 1;

    PromptTemplate template = PromptTemplate.builder()
        .id(id)
        .name(name)
        .category(category)
        .content(content)
        .version(nextVersion)
        .variables(variables)
        .tenantId(tenantId)
        .createdAt(Instant.now())
        .updatedAt(Instant.now())
        .build();

    versions.add(template);
    log.info("Prompt template saved: {} v{}", id, nextVersion);
    return template;
  }

  /**
   * 获取最新版本
   */
  public Optional<PromptTemplate> getLatest(String id) {
    List<PromptTemplate> versions = templates.get(id);
    return versions != null && !versions.isEmpty() ?
        Optional.of(versions.get(versions.size() - 1)) : Optional.empty();
  }

  /**
   * 获取指定版本
   */
  public Optional<PromptTemplate> getVersion(String id, int version) {
    List<PromptTemplate> versions = templates.get(id);
    if (versions == null || version < 1 || version > versions.size()) {
      return Optional.empty();
    }
    return Optional.of(versions.get(version - 1));
  }

  /**
   * 渲染模板 — 替换 {{variable}} 占位符
   */
  public String render(String templateContent, Map<String, String> variables) {
    Matcher matcher = VARIABLE_PATTERN.matcher(templateContent);
    StringBuilder sb = new StringBuilder();
    while (matcher.find()) {
      String varName = matcher.group(1);
      String value = variables.getOrDefault(varName, "{{" + varName + "}}");
      matcher.appendReplacement(sb, Matcher.quoteReplacement(value));
    }
    matcher.appendTail(sb);
    return sb.toString();
  }

  /**
   * 列出所有模板
   */
  public List<PromptTemplate> listAll() {
    return templates.values().stream()
        .filter(v -> !v.isEmpty())
        .map(v -> v.get(v.size() - 1))
        .toList();
  }
}
