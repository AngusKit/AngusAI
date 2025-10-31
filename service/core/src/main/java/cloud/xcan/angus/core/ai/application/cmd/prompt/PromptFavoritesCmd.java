package cloud.xcan.angus.core.ai.application.cmd.prompt;

import cloud.xcan.angus.core.ai.domain.prompt.PromptFavorites;

public interface PromptFavoritesCmd {

  void addFavorites(PromptFavorites favorites);

  void deleteByPromptIdAndCreatedBy(Long id, Long userId);

  void deleteByPromptId(Long id);
}
