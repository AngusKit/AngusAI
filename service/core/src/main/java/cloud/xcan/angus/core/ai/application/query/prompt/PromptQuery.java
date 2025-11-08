package cloud.xcan.angus.core.ai.application.query.prompt;

import cloud.xcan.angus.core.ai.domain.prompt.Prompt;
import cloud.xcan.angus.core.jpa.criteria.GenericSpecification;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;

public interface PromptQuery {

  /**
   * 根据ID查询提示词
   */
  Prompt findAndCheck(Long id);

  /**
   * 查询提示词列表
   */
  Page<Prompt> find(GenericSpecification<Prompt> spec, PageRequest pageable,
      boolean fullTextSearch, String[] match);

  /**
   * 检查标题是否存在
   */
  boolean existsByTitle(String title);

  /**
   * 检查标题是否存在（排除指定ID）
   */
  boolean existsByTitleAndIdNot(String title, Long id);

  void setIsSystemFlag(List<Prompt> prompts);

  /**
   * 设置提示词数量
   */
  void setFavoritesCount(List<Prompt> prompts);

  /**
   * 设置当前用户是否收藏标志
   */
  void setIsFavoriteFlag(List<Prompt> prompts);

}
