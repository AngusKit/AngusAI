package cloud.xcan.angus.core.ai.infra.agent;

import cloud.xcan.angus.core.ai.application.cmd.chat.MessageCmd;
import cloud.xcan.angus.core.ai.domain.chat.Message;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicBoolean;
import lombok.AllArgsConstructor;
import lombok.Data;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

/**
 * 流式任务注册表：messageId -> (SseEmitter, 可取消上下文)
 * 用于 stopGeneration 时真正取消流并保存已生成内容
 */
@Component
public class ActiveStreamRegistry {

  private final ConcurrentHashMap<Long, StreamContext> active = new ConcurrentHashMap<>();

  @Data
  @AllArgsConstructor
  public static class StreamContext {

    private SseEmitter emitter;
    private AtomicBoolean cancelled;
    private StringBuilder fullContent;
    private Message assistantMessage;
    private MessageCmd messageCmd;
  }

  public void register(Long messageId, StreamContext ctx) {
    active.put(messageId, ctx);
  }

  public StreamContext get(Long messageId) {
    return active.get(messageId);
  }

  public StreamContext remove(Long messageId) {
    return active.remove(messageId);
  }
}
