package cloud.xcan.angus.core.ai.application.cmd.prompt;

import cloud.xcan.angus.core.ai.domain.prompt.Prompt;

public interface PromptCmd {

  /**
   * 创建提示词
   */
  Prompt create(Prompt prompt);

  /**
   * 更新提示词
   */
  Prompt update(Prompt prompt);

  /**
   * 删除提示词
   */
  void delete(Long id);

  /**
   * 收藏/取消收藏
   */
  Prompt toggleFavorite(Long id, Boolean isFavorite);

  /**
   * 复制提示词
   */
  Prompt duplicate(Long id, String title);

  /**
   * 标记使用
   */
  Prompt use(Long id);

  /**
   * 归档提示词
   */
  Prompt archive(Long id);

  /**
   * 取消归档
   */
  Prompt unarchive(Long id);

}
