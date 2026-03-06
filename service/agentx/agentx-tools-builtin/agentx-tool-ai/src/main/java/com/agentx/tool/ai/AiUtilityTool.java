package com.agentx.tool.ai;

import com.agentx.core.model.ModelRegistry;
import dev.langchain4j.agent.tool.P;
import dev.langchain4j.agent.tool.Tool;
import dev.langchain4j.data.message.UserMessage;
import dev.langchain4j.model.chat.ChatModel;
import lombok.extern.slf4j.Slf4j;

/**
 * AI 辅助工具 — 利用 LLM 提供摘要、翻译、信息抽取等能力
 */
@Slf4j
public class AiUtilityTool {

  private final ModelRegistry modelRegistry;

  public AiUtilityTool(ModelRegistry modelRegistry) {
    this.modelRegistry = modelRegistry;
  }

  @Tool("Summarize a long text into a concise summary")
  public String summarize(@P("The text content to summarize") String text) {
    log.info("AI summarize: {} chars", text.length());
    return callLlm("Please provide a concise summary of the following text:\n\n" + text);
  }

  @Tool("Translate text from one language to another")
  public String translate(
      @P("The text to translate") String text,
      @P("The target language (e.g., 'English', 'Chinese', 'Japanese')") String targetLanguage) {
    log.info("AI translate to {}: {} chars", targetLanguage, text.length());
    return callLlm("Translate the following text to " + targetLanguage + ". "
        + "Only return the translated text, nothing else.\n\n" + text);
  }

  @Tool("Extract structured key information from unstructured text")
  public String extractInfo(
      @P("The text to extract information from") String text,
      @P("Description of what to extract (e.g., 'names and dates', 'email addresses', 'key metrics')") String extractionTarget) {
    log.info("AI extract '{}' from {} chars", extractionTarget, text.length());
    return callLlm("Extract " + extractionTarget + " from the following text. "
        + "Return results in a structured format:\n\n" + text);
  }

  @Tool("Classify text into predefined categories")
  public String classify(
      @P("The text to classify") String text,
      @P("Comma-separated list of possible categories") String categories) {
    log.info("AI classify into [{}]: {} chars", categories, text.length());
    return callLlm("Classify the following text into one of these categories: " + categories
        + ". Only return the category name.\n\n" + text);
  }

  @Tool("Analyze the sentiment of a given text")
  public String analyzeSentiment(@P("The text to analyze sentiment for") String text) {
    log.info("AI sentiment analysis: {} chars", text.length());
    return callLlm("Analyze the sentiment of the following text. "
        + "Return one of: POSITIVE, NEGATIVE, NEUTRAL, and a brief explanation.\n\n" + text);
  }

  private String callLlm(String prompt) {
    try {
      // Try all common providers in order
      for (String provider : new String[]{"openai", "anthropic", "gemini", "qwen", "zhipu",
          "deepseek", "ollama"}) {
        var modelOpt = modelRegistry.getDefaultChatModel(provider);
        if (modelOpt.isPresent()) {
          ChatModel model = modelOpt.get();
          return model.chat(UserMessage.from(prompt)).aiMessage().text();
        }
      }
      return "Error: No model provider available. Please configure at least one model.";
    } catch (Exception e) {
      log.error("AI utility call failed: {}", e.getMessage());
      return "AI processing failed: " + e.getMessage();
    }
  }
}
