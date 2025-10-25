package cloud.xcan.angus.core.ai.application.query.knowledgebase;

import cloud.xcan.angus.core.ai.domain.knowledgebase.KnowledgeBaseDoc;
import cloud.xcan.angus.core.ai.domain.knowledgebase.KnowledgeBaseDocSearchResult;
import cloud.xcan.angus.core.jpa.criteria.GenericSpecification;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;

public interface KnowledgeBaseDocQuery {

  /**
   * 查询应用并检查是否存在
   */
  KnowledgeBaseDoc findAndCheck(Long id);

  /**
   * 查询文档列表
   */
  Page<KnowledgeBaseDoc> find(GenericSpecification<KnowledgeBaseDoc> spec, PageRequest pageable,
      boolean fullTextSearch, String[] match);

  /**
   * 搜索文档
   */
  List<KnowledgeBaseDocSearchResult> searchDocuments(Long knowledgeBaseId, String keyword,
      Integer limit, Double threshold);
}
