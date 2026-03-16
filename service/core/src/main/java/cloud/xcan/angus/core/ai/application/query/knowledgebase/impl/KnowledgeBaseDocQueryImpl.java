package cloud.xcan.angus.core.ai.application.query.knowledgebase.impl;

import cloud.xcan.angus.core.ai.application.query.knowledgebase.KnowledgeBaseDocQuery;
import cloud.xcan.angus.core.ai.application.query.knowledgebase.KnowledgeBaseDocStats;
import cloud.xcan.angus.core.ai.domain.knowledgebase.KnowledgeBaseDoc;
import cloud.xcan.angus.core.ai.domain.knowledgebase.KnowledgeBaseDocChunkRepo;
import cloud.xcan.angus.core.ai.domain.knowledgebase.KnowledgeBaseDocRepo;
import cloud.xcan.angus.core.ai.domain.knowledgebase.KnowledgeBaseDocSearchRepo;
import cloud.xcan.angus.core.ai.domain.knowledgebase.KnowledgeBaseDocSearchResult;
import cloud.xcan.angus.core.biz.BizTemplate;
import cloud.xcan.angus.core.jpa.criteria.GenericSpecification;
import cloud.xcan.angus.remote.message.http.ResourceNotFound;
import jakarta.annotation.Resource;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
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
            .orElseThrow(() -> ResourceNotFound.of("文档「{0}」不存在", new Object[]{id}));
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
  public Map<Long, KnowledgeBaseDocStats> getStatsByKnowledgeBaseIds(List<Long> knowledgeBaseIds) {
    return new BizTemplate<Map<Long, KnowledgeBaseDocStats>>() {
      @Override
      protected Map<Long, KnowledgeBaseDocStats> process() {
        if (knowledgeBaseIds == null || knowledgeBaseIds.isEmpty()) {
          return new HashMap<>();
        }
        List<Object[]> rows = knowledgeBaseDocRepo.getStatsByKnowledgeBaseIds(knowledgeBaseIds);
        Map<Long, KnowledgeBaseDocStats> result = new HashMap<>();
        for (Object[] row : rows) {
          Long kbId = row[0] == null ? null : ((Number) row[0]).longValue();
          if (kbId == null) {
            continue;
          }
          int docCount = row[1] == null ? 0 : ((Number) row[1]).intValue();
          int activeCount = row[2] == null ? 0 : ((Number) row[2]).intValue();
          long totalSize = row[3] == null ? 0L : ((Number) row[3]).longValue();
          int totalChunks = row[4] == null ? 0 : ((Number) row[4]).intValue();
          result.put(kbId,
              new KnowledgeBaseDocStats(kbId, docCount, activeCount, totalSize, totalChunks));
        }
        return result;
      }
    }.execute();
  }

  @Override
  public boolean existsByKnowledgeBaseIdAndName(Long knowledgeBaseId, String fileName) {
    return knowledgeBaseDocRepo.existsByKnowledgeBaseIdAndName(knowledgeBaseId, fileName);
  }

  @Override
  public List<Object[]> countByKnowledgeBaseIds(List<Long> knowledgeBaseIds) {
    if (knowledgeBaseIds == null || knowledgeBaseIds.isEmpty()) {
      return List.of();
    }
    Map<Long, KnowledgeBaseDocStats> statsMap = getStatsByKnowledgeBaseIds(knowledgeBaseIds);
    return statsMap.entrySet().stream()
        .map(e -> new Object[]{e.getKey(), (long) e.getValue().getDocumentsCount()})
        .toList();
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
