package com.agentx.core.memory;

import dev.langchain4j.data.message.AiMessage;
import dev.langchain4j.data.message.ChatMessage;
import dev.langchain4j.data.message.SystemMessage;
import dev.langchain4j.data.message.UserMessage;
import dev.langchain4j.memory.ChatMemory;
import dev.langchain4j.model.chat.ChatModel;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * 摘要记忆 — 超出窗口时将旧消息压缩为摘要，保留上下文。
 * <p>
 * 需要 ChatModel 参与摘要生成。
 * </p>
 */
@Slf4j
@RequiredArgsConstructor
public class SummarizingChatMemory implements ChatMemory {

  /** Default summary prompt, overridable via memory.summaryPrompt config */
  public static final String DEFAULT_SUMMARY_PROMPT = """
      You are a professional dialogue memory compressor. Your task is to distill lengthy AI conversation history into a structured summary so that follow-up conversations can restore context with minimal tokens.

      ## Core Principles

      1. **Zero information loss**: All key information affecting the flow of subsequent dialogue must be preserved
      2. **Maximum brevity**: Remove all greetings, repetition, exploratory content and redundant phrasing
      3. **Structured output**: Use a fixed format for easy parsing by machines and humans

      ## Summarization Rules

      ### Must Keep
      - User's **core objectives** and **final requirements**
      - All **key decisions** and **conclusions** already made
      - Important **technical details** (code snippets, configs, architecture choices, file paths, etc.)
      - **Outstanding tasks** and **blockers** not yet resolved
      - **Preferences and constraints** explicitly stated by the user
      - Condensed versions of **important deliverables** (code, solutions, lists, etc.) produced in the conversation

      ### Must Remove
      - Social exchanges (greetings, thanks, acknowledgments)
      - Rejected or abandoned approaches (unless needed to understand the final decision)
      - Repeated questions and repeated answers
      - AI's reasoning process and intermediate deductions (keep conclusions only)
      - Formatting filler and transition phrases

      ## Output Format

      Output the summary strictly in this structure:

      ```
      ## 📌 Conversation Theme
      [One sentence describing the core theme of this conversation]

      ## 🎯 User Goals
      - [Goal 1]
      - [Goal 2]

      ## ✅ Confirmed Items
      - [Decision/conclusion 1]
      - [Decision/conclusion 2]

      ## 📝 Key Details
      - [Technical details, code snippets, configs, etc.]
      - [Important context]

      ## ⏳ Todo/Open
      - [Unfinished tasks]
      - [Questions awaiting clarification]

      ## ⚙️ User Preferences/Constraints
      - [Preference 1]
      - [Constraint 1]

      ## 💾 Important Deliverables (if any)
      [Condensed code/solutions/lists]
      ```

      ## Notes

      - If a section has no relevant content, omit it entirely; do not write "none"
      - Code snippets: keep only core logic (≤10 lines); use pseudocode or bullet points for longer snippets
      - The summary should be **15%~25%** of the original conversation's token count
      - Stay factual; do not add information not present in the original dialogue

      ---

      Raw conversation to summarize:

      {{messages}}
      """;

  private final Object id;
  private final int maxMessages;
  private final String summaryPrompt;
  private final ChatModel chatModel;
  private final dev.langchain4j.store.memory.chat.ChatMemoryStore store;

  @Override
  public Object id() {
    return id;
  }

  @Override
  public void add(ChatMessage message) {
    List<ChatMessage> current = new ArrayList<>(store.getMessages(id));
    current.add(message);

    while (current.size() > maxMessages) {
      // 摘要最旧的一对或多条消息（至少 2 条以形成对话）
      int toSummarize = Math.min(current.size() - maxMessages + 1,
          Math.max(2, current.size() / 2));
      List<ChatMessage> oldest = current.subList(0, toSummarize);
      String summary = summarize(oldest);
      if (summary != null && !summary.isBlank()) {
        List<ChatMessage> rest = new ArrayList<>(current.subList(toSummarize, current.size()));
        current.clear();
        current.add(SystemMessage.from(summary));
        current.addAll(rest);
      } else {
        // 摘要失败则直接丢弃最旧消息
        current.remove(0);
      }
    }

    store.updateMessages(id, List.copyOf(current));
  }

  @Override
  public List<ChatMessage> messages() {
    return store.getMessages(id);
  }

  @Override
  public void clear() {
    store.deleteMessages(id);
  }

  private String summarize(List<ChatMessage> messages) {
    try {
      String formatted = messages.stream()
          .map(this::formatMessage)
          .collect(Collectors.joining("\n"));
      String prompt = summaryPrompt.replace("{{messages}}", formatted);
      return chatModel.chat(UserMessage.from(prompt)).aiMessage().text();
    } catch (Exception e) {
      log.warn("Summarization failed, evicting messages instead", e);
      return null;
    }
  }

  private String formatMessage(ChatMessage m) {
    if (m instanceof UserMessage) {
      return "User: " + ((UserMessage) m).singleText();
    }
    if (m instanceof AiMessage) {
      return "Assistant: " + ((AiMessage) m).text();
    }
    if (m instanceof SystemMessage) {
      return "System: " + ((SystemMessage) m).text();
    }
    return m.toString();
  }
}
