package cloud.xcan.angus.core.ai.application.query.knowledgebase.impl;

import cloud.xcan.angus.core.ai.application.query.knowledgebase.KnowledgeBaseQuery;
import cloud.xcan.angus.core.ai.domain.knowledgebase.KnowledgeBase;
import cloud.xcan.angus.core.ai.domain.knowledgebase.KnowledgeBaseRepo;
import cloud.xcan.angus.core.ai.domain.knowledgebase.KnowledgeBaseSearchRepo;
import cloud.xcan.angus.core.biz.BizTemplate;
import cloud.xcan.angus.core.jpa.criteria.GenericSpecification;
import cloud.xcan.angus.remote.message.http.ResourceNotFound;
import jakarta.annotation.Resource;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

@Service
public class KnowledgeBaseQueryImpl implements KnowledgeBaseQuery {

  @Resource
  private KnowledgeBaseRepo knowledgeBaseRepo;

  @Resource
  private KnowledgeBaseSearchRepo knowledgeBaseSearchRepo;

  @Override
  public KnowledgeBase findAndCheck(Long id) {
    return new BizTemplate<KnowledgeBase>() {
      @Override
      protected KnowledgeBase process() {
        return knowledgeBaseRepo.findById(id)
            .orElseThrow(() -> ResourceNotFound.of("知识库不存在", new Object[]{}));
      }
    }.execute();
  }

  @Override
  public Page<KnowledgeBase> find(GenericSpecification<KnowledgeBase> spec, PageRequest pageable,
      boolean fullTextSearch, String[] match) {
    return new BizTemplate<Page<KnowledgeBase>>() {
      @Override
      protected Page<KnowledgeBase> process() {
        return fullTextSearch
            ? knowledgeBaseSearchRepo.find(spec.getCriteria(), pageable, KnowledgeBase.class, match)
            : knowledgeBaseRepo.findAll(spec, pageable);
      }
    }.execute();
  }

  @Override
  public Long countTotalKnowledgeBases() {
    return knowledgeBaseRepo.countTotalKnowledgeBases();
  }

  @Override
  public Long countActiveKnowledgeBases() {
    return knowledgeBaseRepo.countActiveKnowledgeBases();
  }

  @Override
  public Map<Long, KnowledgeBase> findByIds(List<Long> knowledgeBaseIds) {
    if (knowledgeBaseIds == null || knowledgeBaseIds.isEmpty()) {
      return new HashMap<>();
    }
    List<KnowledgeBase> knowledgeBases = knowledgeBaseRepo.findAllById(knowledgeBaseIds);
    return knowledgeBases.stream()
        .collect(Collectors.toMap(KnowledgeBase::getId, kb -> kb));
  }
}
