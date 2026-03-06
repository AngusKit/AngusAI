package cloud.xcan.agentx.infrastructure.memory;

import dev.langchain4j.data.message.ChatMessage;
import dev.langchain4j.data.message.ChatMessageDeserializer;
import dev.langchain4j.data.message.ChatMessageSerializer;
import dev.langchain4j.store.memory.chat.ChatMemoryStore;
import java.util.Collections;
import java.util.List;
import javax.sql.DataSource;
import org.springframework.jdbc.core.JdbcTemplate;

/**
 * 基于 JDBC 的 ChatMemoryStore — 持久化到数据库。
 * <p>
 * 表结构需预先创建：
 * <pre>
 * CREATE TABLE chat_memory (
 *   memory_id VARCHAR(255) PRIMARY KEY,
 *   content TEXT,
 *   updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
 * );
 * </pre>
 * </p>
 */
public class JdbcChatMemoryStore implements ChatMemoryStore {

  private static final String TABLE = "chat_memory";

  private final JdbcTemplate jdbc;

  public JdbcChatMemoryStore(DataSource dataSource) {
    this.jdbc = new JdbcTemplate(dataSource);
  }

  @Override
  public List<ChatMessage> getMessages(Object memoryId) {
    String id = toKey(memoryId);
    try {
      String json = jdbc.queryForObject(
          "SELECT content FROM " + TABLE + " WHERE memory_id = ?",
          String.class, id);
      if (json == null || json.isBlank()) {
        return List.of();
      }
      return ChatMessageDeserializer.messagesFromJson(json);
    } catch (org.springframework.dao.EmptyResultDataAccessException e) {
      return List.of();
    } catch (Exception e) {
      return Collections.emptyList();
    }
  }

  @Override
  public void updateMessages(Object memoryId, List<ChatMessage> messages) {
    String id = toKey(memoryId);
    String json = messages.isEmpty() ? null : ChatMessageSerializer.messagesToJson(messages);
    int updated = jdbc.update(
        "UPDATE " + TABLE + " SET content = ?, updated_at = CURRENT_TIMESTAMP WHERE memory_id = ?",
        json, id);
    if (updated == 0) {
      jdbc.update("INSERT INTO " + TABLE + " (memory_id, content) VALUES (?, ?)", id, json);
    }
  }

  @Override
  public void deleteMessages(Object memoryId) {
    jdbc.update("DELETE FROM " + TABLE + " WHERE memory_id = ?", toKey(memoryId));
  }

  private static String toKey(Object memoryId) {
    return memoryId != null ? memoryId.toString() : "";
  }
}
