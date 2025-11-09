package cloud.xcan.angus.core.ai.application.query.knowledgebase.impl;

import cloud.xcan.angus.core.ai.application.query.knowledgebase.KnowledgeBaseDocQuery;
import cloud.xcan.angus.core.ai.domain.knowledgebase.KnowledgeBaseDoc;
import cloud.xcan.angus.core.ai.domain.knowledgebase.KnowledgeBaseDocChunkRepo;
import cloud.xcan.angus.core.ai.domain.knowledgebase.KnowledgeBaseDocRepo;
import cloud.xcan.angus.core.ai.domain.knowledgebase.KnowledgeBaseDocSearchRepo;
import cloud.xcan.angus.core.ai.domain.knowledgebase.KnowledgeBaseDocSearchResult;
import cloud.xcan.angus.core.biz.BizTemplate;
import cloud.xcan.angus.core.jpa.criteria.GenericSpecification;
import cloud.xcan.angus.remote.message.http.ResourceNotFound;
import jakarta.annotation.Resource;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

@Service
public class KnowledgeBaseDocQueryImpl implements KnowledgeBaseDocQuery {

  @Resource
  private KnowledgeBaseDocRepo knowledgeBaseDocRepo;

  @Resource
  private KnowledgeBaseDocSearchRepo knowledgeBaseDocSearchRepo;

  @Resource
  private KnowledgeBaseDocChunkRepo knowledgeBaseDocChunkRepo;

  @Override
  public KnowledgeBaseDoc findAndCheck(Long id) {
    return new BizTemplate<KnowledgeBaseDoc>() {
      @Override
      protected KnowledgeBaseDoc process() {
        return knowledgeBaseDocRepo.findById(id)
            .orElseThrow(() -> ResourceNotFound.of("文档不存在", new Object[]{}));
      }
    }.execute();
  }

  @Override
  public Page<KnowledgeBaseDoc> find(GenericSpecification<KnowledgeBaseDoc> spec,
      PageRequest pageable, boolean fullTextSearch, String[] match) {
    return new BizTemplate<Page<KnowledgeBaseDoc>>() {
      @Override
      protected Page<KnowledgeBaseDoc> process() {
        return fullTextSearch
            ? knowledgeBaseDocSearchRepo.find(spec.getCriteria(), pageable,
            KnowledgeBaseDoc.class, match)
            : knowledgeBaseDocRepo.findAll(spec, pageable);
      }
    }.execute();
  }

  @Override
  public List<KnowledgeBaseDocSearchResult> searchDocuments(
      Long knowledgeBaseId, String keyword, Integer limit, Double threshold) {
    return new BizTemplate<List<KnowledgeBaseDocSearchResult>>() {
      @Override
      protected List<KnowledgeBaseDocSearchResult> process() {
        // TODO: 实现向量搜索
        // 这里应该调用向量搜索服务，根据查询内容找到相似的分段
        // 暂时返回空列表
        return List.of();
      }
    }.execute();
  }

  @Override
  public boolean existsByKnowledgeBaseIdAndName(Long knowledgeBaseId, String fileName) {
    return knowledgeBaseDocRepo.existsByKnowledgeBaseIdAndName(knowledgeBaseId, fileName);
  }

  @Override
  public List<Object[]> countByKnowledgeBaseIds(List<Long> knowledgeBaseIds) {
    return List.of();
  }

  @Override
  public Long sumTotalStoreSize() {
    return knowledgeBaseDocRepo.sumTotalStoreSize();
  }

  @Override
  public Double getAvgChunkSize() {
    return knowledgeBaseDocChunkRepo.getAvgChunkSize();
  }

  @Override
  public Long countTotalChunks() {
    return knowledgeBaseDocChunkRepo.countTotalChunks();
  }

  @Override
  public Long countActiveFiles() {
    return knowledgeBaseDocRepo.countActiveFiles();
  }

  @Override
  public Long countTotalFiles() {
    return knowledgeBaseDocRepo.countTotalFiles();
  }
}
