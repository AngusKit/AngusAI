package cloud.xcan.angus.core.ai.application.converter;

import static cloud.xcan.angus.spec.utils.ObjectUtils.isEmpty;

import cloud.xcan.angus.core.ai.domain.prompt.Prompt;
import org.jetbrains.annotations.NotNull;

public class PromptConverter {

  public static @NotNull Prompt toDuplicatePrompt(String title, Prompt sourcePrompt) {
    Prompt newPrompt = new Prompt();
    newPrompt.setId(null);
    newPrompt.setTitle(isEmpty(title) ? sourcePrompt.getTitle() + "的副本" : title);
    newPrompt.setContent(sourcePrompt.getContent());
    newPrompt.setCategoryId(sourcePrompt.getCategoryId());
    newPrompt.setTags(sourcePrompt.getTags());
    newPrompt.setUsageCount(0L);
    return newPrompt;
  }

}
