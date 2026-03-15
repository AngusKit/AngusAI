package cloud.xcan.angus.core.ai.infra.agent;

import java.util.concurrent.Executor;
import java.util.concurrent.ExecutorService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;

/**
 * SSE 流式对话线程池配置
 * <p>
 * 用于统一管理 SseEmitter 流式对话任务，避免为每次对话创建新线程。
 * </p>
 */
@Configuration
public class AgentChatSseEmitterConfiguration {

  /**
   * 线程池核心线程数，按并发对话量经验值
   */
  private static final int CORE_POOL_SIZE = 16;

  /**
   * 线程池最大线程数
   */
  private static final int MAX_POOL_SIZE = 64;

  /**
   * 队列容量
   */
  private static final int QUEUE_CAPACITY = 256;

  /**
   * 线程名前缀
   */
  private static final String THREAD_NAME_PREFIX = "sse-chat-";

  /**
   * 同步对话超时执行用线程池（用于带超时的 submit + get）
   */
  @Bean(name = "syncChatExecutor")
  public ExecutorService syncChatExecutor() {
    ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
    executor.setCorePoolSize(8);
    executor.setMaxPoolSize(32);
    executor.setQueueCapacity(128);
    executor.setThreadNamePrefix("sync-chat-");
    executor.setWaitForTasksToCompleteOnShutdown(true);
    executor.setAwaitTerminationSeconds(30);
    executor.initialize();
    return executor.getThreadPoolExecutor();
  }

  /**
   * SseEmitter 对话专用线程池
   */
  @Bean(name = "sseEmitterChatExecutor")
  public Executor sseEmitterChatExecutor() {
    ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
    executor.setCorePoolSize(CORE_POOL_SIZE);
    executor.setMaxPoolSize(MAX_POOL_SIZE);
    executor.setQueueCapacity(QUEUE_CAPACITY);
    executor.setThreadNamePrefix(THREAD_NAME_PREFIX);
    executor.setWaitForTasksToCompleteOnShutdown(true);
    executor.setAwaitTerminationSeconds(30);
    executor.initialize();
    return executor;
  }
//
//  /**
//   * SSE 流式接口专用 Filter：禁用响应缓冲，确保 token 实时到达客户端
//   */
//  @Bean
//  public FilterRegistrationBean<SseStreamBufferFilter> sseStreamBufferFilter() {
//    FilterRegistrationBean<SseStreamBufferFilter> registration = new FilterRegistrationBean<>();
//    registration.setFilter(new SseStreamBufferFilter());
//    registration.addUrlPatterns("/api/v1/agents/chat/stream");
//    registration.setOrder(Ordered.HIGHEST_PRECEDENCE);
//    registration.setAsyncSupported(true);
//    return registration;
//  }
}
