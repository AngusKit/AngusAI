package cloud.xcan.angus.core.ai.application.query.prompt;

import cloud.xcan.angus.core.ai.domain.prompt.Prompt;
import cloud.xcan.angus.core.ai.domain.prompt.PromptStatus;
import cloud.xcan.angus.core.jpa.criteria.GenericSpecification;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;

public interface PromptQuery {

  /**
   * 查询提示词列表
   */
  Page<Prompt> find(GenericSpecification<Prompt> spec, PageRequest pageable,
      boolean fullTextSearch, String[] match);

  /**
   * 根据ID查询提示词
   */
  Prompt findById(Long id);

  /**
   * 检查标题是否存在
   */
  boolean existsByTitle(String title);

  /**
   * 检查标题是否存在（排除指定ID）
   */
  boolean existsByTitleAndIdNot(String title, Long id);

  /**
   * 统计用户创建的提示词数量
   */
  long countByCreatedBy(Long createdBy);

  /**
   * 统计指定状态的提示词数量
   */
  long countByStatus(PromptStatus status);

  /**
   * 统计指定分类的提示词数量
   */
  long countByCategoryId(Long categoryId);

  /**
   * 统计公开的提示词数量
   */
  long countByIsPublic(Boolean isPublic);

  /**
   * 查询最近创建的提示词
   */
  Page<Prompt> findRecentPrompts(PageRequest pageable);

  /**
   * 查询热门提示词
   */
  Page<Prompt> findTrendingPrompts(PageRequest pageable);

  /**
   * 查询收藏的提示词
   */
  Page<Prompt> findFavoritePrompts(Long userId, PageRequest pageable);

}
