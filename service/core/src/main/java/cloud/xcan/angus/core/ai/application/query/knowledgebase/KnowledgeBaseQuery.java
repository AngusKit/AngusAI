package cloud.xcan.angus.core.ai.application.query.knowledgebase;

import cloud.xcan.angus.core.ai.domain.knowledgebase.KnowledgeBase;
import cloud.xcan.angus.core.jpa.criteria.GenericSpecification;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;

public interface KnowledgeBaseQuery {

  /**
   * 查询知识库并检查是否存在
   */
  KnowledgeBase findAndCheck(Long id);

  /**
   * 查询知识库列表
   */
  Page<KnowledgeBase> find(GenericSpecification<KnowledgeBase> spec, PageRequest pageable,
      boolean fullTextSearch, String[] match);

}
