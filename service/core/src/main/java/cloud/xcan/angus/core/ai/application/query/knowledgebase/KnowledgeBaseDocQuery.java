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

  /**
   * 检查知识库下是否存在同名文件
   */
  boolean existsByKnowledgeBaseIdAndName(Long knowledgeBaseId, String fileName);

  /**
   * 批量根据知识库ID统计文档数 返回 List<Object[]> [knowledgeBaseId, docCount]
   */
  List<Object[]> countByKnowledgeBaseIds(List<Long> knowledgeBaseIds);

  /**
   * 批量根据知识库ID统计文档数据（文档数、已启用数、总大小、分段数）
   *
   * @param knowledgeBaseIds 知识库ID列表
   * @return 知识库ID -> 统计信息 的映射
   */
  java.util.Map<Long, KnowledgeBaseDocStats> getStatsByKnowledgeBaseIds(List<Long> knowledgeBaseIds);

  /**
   * 统计存储总大小
   */
  Long sumTotalStoreSize();

  /**
   * 统计平均块大小
   */
  Double getAvgChunkSize();

  /**
   * 统计活跃块数
   */
  Long countTotalChunks();

  /**
   * 统计活跃文件数
   */
  Long countActiveFiles();

  /**
   * 统计总文件数
   */
  Long countTotalFiles();

}
