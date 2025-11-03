package cloud.xcan.angus.core.ai.application.cmd.prompt.impl;

import cloud.xcan.angus.core.ai.application.cmd.prompt.PromptFavoritesCmd;
import cloud.xcan.angus.core.ai.domain.prompt.PromptFavorites;
import cloud.xcan.angus.core.ai.domain.prompt.PromptFavoritesRepo;
import cloud.xcan.angus.core.biz.cmd.CommCmd;
import cloud.xcan.angus.core.jpa.repository.BaseRepository;
import jakarta.annotation.Resource;
import org.springframework.stereotype.Service;

@Service
public class PromptFavoritesCmdImpl extends CommCmd<PromptFavorites, Long> implements
    PromptFavoritesCmd {

  @Resource
  private PromptFavoritesRepo promptFavoritesRepo;

  @Override
  public void addFavorites(PromptFavorites favorites) {
    insert(favorites);
  }

  @Override
  public void deleteByPromptIdAndCreatedBy(Long id, Long userId) {
    promptFavoritesRepo.deleteByPromptIdAndCreatedBy(id, userId);
  }

  @Override
  public void deleteByPromptId(Long id) {
    promptFavoritesRepo.deleteByPromptId(id);
  }

  @Override
  protected BaseRepository<PromptFavorites, Long> getRepository() {
    return promptFavoritesRepo;
  }
}
