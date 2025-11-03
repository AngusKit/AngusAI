package cloud.xcan.angus.core.ai.application.cmd.knowledgebase;

import cloud.xcan.angus.core.ai.domain.Visibility;
import cloud.xcan.angus.core.ai.domain.knowledgebase.KnowledgeBase;

public interface KnowledgeBaseCmd {

  /**
   * 创建知识库
   */
  KnowledgeBase create(KnowledgeBase knowledgeBase);

  /**
   * 更新知识库
   */
  KnowledgeBase update(KnowledgeBase knowledgeBase);

  /**
   * 修改知识库状态
   */
  KnowledgeBase toggle(Long id, Boolean enabled);

  /**
   * 修改知识库可见性
   */
  KnowledgeBase modifyVisibility(Long id, Visibility visibility);

  /**
   * 删除知识库
   */
  void delete(Long id);

}
