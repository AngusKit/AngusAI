package com.agentx.core.tool;

import jakarta.annotation.PostConstruct;
import java.lang.reflect.Method;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.ApplicationContext;

/**
 * 工具自动扫描器 — 扫描 @AgentTool 注解自动注册
 */
@Slf4j
@RequiredArgsConstructor
public class ToolScanner {

  private final ApplicationContext applicationContext;
  private final ToolRegistry toolRegistry;

  @PostConstruct
  public void scan() {
    Map<String, Object> beans = applicationContext.getBeansOfType(Object.class);
    for (Map.Entry<String, Object> entry : beans.entrySet()) {
      Object bean = entry.getValue();
      for (Method method : bean.getClass().getMethods()) {
        AgentTool annotation = method.getAnnotation(AgentTool.class);
        if (annotation != null) {
          String toolId = annotation.id();
          String toolName = annotation.name().isEmpty() ? method.getName() : annotation.name();

          ToolDescriptor descriptor = ToolDescriptor.builder()
              .id(toolId)
              .name(toolName)
              .description(annotation.description())
              .category(annotation.category())
              .source(ToolDescriptor.ToolSource.BUILTIN)
              .instance(bean)
              .executor(params -> {
                try {
                  Object result = method.invoke(bean, params);
                  return result != null ? result.toString() : "";
                } catch (Exception e) {
                  throw new RuntimeException("Tool execution failed: " + toolId, e);
                }
              })
              .build();

          toolRegistry.register(descriptor);
          log.debug("Auto-registered tool from @AgentTool: {}", toolId);
        }
      }
    }
  }
}
