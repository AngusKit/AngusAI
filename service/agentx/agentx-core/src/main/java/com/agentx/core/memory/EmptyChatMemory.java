package com.agentx.core.memory;

import dev.langchain4j.data.message.ChatMessage;
import dev.langchain4j.memory.ChatMemory;
import java.util.Collections;
import java.util.List;
import lombok.RequiredArgsConstructor;

/**
 * 空记忆实现 — NONE 策略使用，不保留任何消息。
 * <p>
 * add() 为无操作，messages() 始终返回空列表，对业务调用不产生影响。
 * </p>
 */
@RequiredArgsConstructor
public class EmptyChatMemory implements ChatMemory {

  private final Object id;

  @Override
  public Object id() {
    return id;
  }

  @Override
  public void add(ChatMessage message) {
    // NONE 策略：不保留记忆，add 为无操作
  }

  @Override
  public List<ChatMessage> messages() {
    return Collections.emptyList();
  }

  @Override
  public void clear() {
    // 无存储，无需清除
  }
}
