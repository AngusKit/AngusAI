package cloud.xcan.angus.core.ai.application.query.prompt.impl;

import cloud.xcan.angus.core.ai.application.query.prompt.PromptQuery;
import cloud.xcan.angus.core.ai.domain.prompt.Prompt;
import cloud.xcan.angus.core.ai.domain.prompt.PromptRepo;
import cloud.xcan.angus.core.ai.domain.prompt.PromptStatus;
import cloud.xcan.angus.core.ai.interfaces.prompt.facade.dto.PromptFindDto;
import cloud.xcan.angus.spec.utils.ObjectUtils;
import jakarta.annotation.Resource;
import jakarta.persistence.EntityManager;
import jakarta.persistence.TypedQuery;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

/**
 * 提示词查询服务实现
 */
@Service
public class PromptQueryImpl implements PromptQuery {

  @Resource
  private PromptRepo promptRepo;

  @Resource
  private EntityManager entityManager;

  @Override
  public Prompt findById(Long id) {
    if (id == null) {
      return null;
    }
    Optional<Prompt> optional = promptRepo.findById(id);
    return optional.orElse(null);
  }

  @Override
  public List<Prompt> findByIds(List<Long> ids) {
    if (ids == null || ids.isEmpty()) {
      return new ArrayList<>();
    }
    return promptRepo.findAllById(ids);
  }

  @Override
  public Page<Prompt> findByConditions(PromptFindDto dto) {
    CriteriaBuilder cb = entityManager.getCriteriaBuilder();
    CriteriaQuery<Prompt> cq = cb.createQuery(Prompt.class);
    Root<Prompt> root = cq.from(Prompt.class);

    List<Predicate> predicates = buildPredicates(dto, cb, root);
    cq.where(predicates.toArray(new Predicate[0]));

    // 排序
    if (ObjectUtils.isNotEmpty(dto.getSortBy())) {
      if ("desc".equalsIgnoreCase(dto.getSortOrder())) {
        cq.orderBy(cb.desc(root.get(dto.getSortBy())));
      } else {
        cq.orderBy(cb.asc(root.get(dto.getSortBy())));
      }
    } else {
      cq.orderBy(cb.desc(root.get("updatedAt")));
    }

    // 分页查询
    TypedQuery<Prompt> query = entityManager.createQuery(cq);
    int page = dto.getPage() != null ? dto.getPage() : 0;
    int size = dto.getSize() != null ? dto.getSize() : 20;
    query.setFirstResult(page * size);
    query.setMaxResults(size);

    List<Prompt> results = query.getResultList();

    // 统计总数
    CriteriaQuery<Long> countQuery = cb.createQuery(Long.class);
    Root<Prompt> countRoot = countQuery.from(Prompt.class);
    countQuery.select(cb.count(countRoot));
    countQuery.where(buildPredicates(dto, cb, countRoot).toArray(new Predicate[0]));
    Long total = entityManager.createQuery(countQuery).getSingleResult();

    return new PageImpl<>(results, PageRequest.of(page, size), total);
  }

  @Override
  public List<Prompt> findByCategoryId(Long categoryId) {
    if (categoryId == null) {
      return new ArrayList<>();
    }
    return promptRepo.findByCategoryId(categoryId);
  }

  @Override
  public List<Prompt> findByStatus(PromptStatus status) {
    if (status == null) {
      return new ArrayList<>();
    }
    return promptRepo.findByStatus(status);
  }

  @Override
  public List<Prompt> findFavorites(Long userId) {
    if (userId == null) {
      return new ArrayList<>();
    }
    return promptRepo.findByIsFavoriteAndCreatedBy(true, userId);
  }

  @Override
  public List<Prompt> findPublic() {
    return promptRepo.findByIsPublic(true);
  }

  @Override
  public List<Prompt> findByCreatedBy(Long userId) {
    if (userId == null) {
      return new ArrayList<>();
    }
    return promptRepo.findByCreatedBy(userId);
  }

  @Override
  public List<Prompt> findTrending(int limit) {
    PageRequest pageRequest = PageRequest.of(0, limit, Sort.by(Sort.Direction.DESC, "useCount"));
    return promptRepo.findAll(pageRequest).getContent();
  }

  @Override
  public boolean existsByTitle(String title) {
    if (ObjectUtils.isEmpty(title)) {
      return false;
    }
    return promptRepo.existsByTitle(title);
  }

  @Override
  public boolean existsByTitleAndIdNot(String title, Long id) {
    if (ObjectUtils.isEmpty(title) || id == null) {
      return false;
    }
    return promptRepo.existsByTitleAndIdNot(title, id);
  }

  @Override
  public long countByStatus(PromptStatus status) {
    if (status == null) {
      return 0;
    }
    return promptRepo.countByStatus(status);
  }

  @Override
  public long countByCategoryId(Long categoryId) {
    if (categoryId == null) {
      return 0;
    }
    return promptRepo.countByCategoryId(categoryId);
  }

  /**
   * 构建查询条件
   */
  private List<Predicate> buildPredicates(PromptFindDto dto, CriteriaBuilder cb, Root<Prompt> root) {
    List<Predicate> predicates = new ArrayList<>();

    // 关键词搜索
    if (ObjectUtils.isNotEmpty(dto.getKeyword())) {
      String keyword = "%" + dto.getKeyword() + "%";
      Predicate titleLike = cb.like(root.get("title"), keyword);
      Predicate descLike = cb.like(root.get("description"), keyword);
      predicates.add(cb.or(titleLike, descLike));
    }

    // 分类筛选
    if (dto.getCategoryId() != null) {
      predicates.add(cb.equal(root.get("categoryId"), dto.getCategoryId()));
    }

    // 状态筛选
    if (dto.getStatus() != null) {
      predicates.add(cb.equal(root.get("status"), dto.getStatus()));
    }

    // 是否收藏
    if (dto.getIsFavorite() != null) {
      predicates.add(cb.equal(root.get("isFavorite"), dto.getIsFavorite()));
    }

    // 是否公开
    if (dto.getIsPublic() != null) {
      predicates.add(cb.equal(root.get("isPublic"), dto.getIsPublic()));
    }

    // 是否系统模板
    if (dto.getIsSystem() != null) {
      predicates.add(cb.equal(root.get("isSystem"), dto.getIsSystem()));
    }

    // 创建者筛选
    if (dto.getCreatedBy() != null) {
      predicates.add(cb.equal(root.get("createdBy"), dto.getCreatedBy()));
    }

    // 标签筛选（TODO: 需要实现 JSON 数组查询）
    // if (dto.getTags() != null && !dto.getTags().isEmpty()) {
    //   predicates.add(...);
    // }

    return predicates;
  }

}
