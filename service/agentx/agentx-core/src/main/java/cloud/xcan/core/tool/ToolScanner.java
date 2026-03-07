package cloud.xcan.core.tool;

import dev.langchain4j.agent.tool.Tool;
import jakarta.annotation.PostConstruct;
import java.lang.reflect.Method;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.ApplicationContext;

/**
 * 工具自动扫描器 — 扫描 LangChain4j {@link Tool} 注解的 Bean 并注册到 ToolRegistry。
 * <p>
 * 使用 Spring Bean 名称作为工具 ID，Agent 的 toolIds 配置需与 Bean 名称对应（如 webSearchTool、httpRequestTool）。 一个 Bean
 * 可包含多个 @Tool 方法，LangChain4j 会自动提取。
 * </p>
 */
@Slf4j
@RequiredArgsConstructor
public class ToolScanner {

  private final ApplicationContext applicationContext;
  private final ToolRegistry toolRegistry;

  @PostConstruct
  public void scan() {
    Map<String, Object> beans = applicationContext.getBeansOfType(Object.class);
    Set<Object> registered = new HashSet<>();

    for (Map.Entry<String, Object> entry : beans.entrySet()) {
      String beanName = entry.getKey();
      Object bean = entry.getValue();

      if (registered.contains(bean)) {
        continue;
      }

      if (hasToolMethods(bean.getClass())) {
        ToolDescriptor descriptor = ToolDescriptor.builder()
            .id(beanName)
            .name(beanName)
            .description("LangChain4j @Tool bean: " + bean.getClass().getSimpleName())
            .source(ToolDescriptor.ToolSource.BUILTIN)
            .instance(bean)
            .build();

        toolRegistry.register(descriptor);
        registered.add(bean);
        log.debug("Auto-registered @Tool bean: {} ({})", beanName, bean.getClass().getSimpleName());
      }
    }
  }

  private static boolean hasToolMethods(Class<?> clazz) {
    for (Method method : clazz.getDeclaredMethods()) {
      if (method.isAnnotationPresent(Tool.class)) {
        return true;
      }
    }
    return false;
  }
}
