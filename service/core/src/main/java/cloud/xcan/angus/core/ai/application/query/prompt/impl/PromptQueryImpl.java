package cloud.xcan.angus.core.ai.application.query.prompt.impl;

import static cloud.xcan.angus.core.jpa.criteria.CriteriaUtils.findFirstValueAndRemove;
import static cloud.xcan.angus.spec.principal.PrincipalContext.getUserId;

import cloud.xcan.angus.core.ai.application.query.prompt.PromptQuery;
import cloud.xcan.angus.core.ai.domain.prompt.Prompt;
import cloud.xcan.angus.core.ai.domain.prompt.PromptCategory;
import cloud.xcan.angus.core.ai.domain.prompt.PromptCategoryRepo;
import cloud.xcan.angus.core.ai.domain.prompt.PromptFavoritesRepo;
import cloud.xcan.angus.core.ai.domain.prompt.PromptRepo;
import cloud.xcan.angus.core.ai.domain.prompt.PromptSearchRepo;
import cloud.xcan.angus.core.biz.BizTemplate;
import cloud.xcan.angus.core.jpa.criteria.GenericSpecification;
import cloud.xcan.angus.remote.message.http.ResourceNotFound;
import cloud.xcan.angus.remote.search.SearchCriteria;
import jakarta.annotation.Resource;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

/**
 * 提示词查询服务实现
 */
@Service
public class PromptQueryImpl implements PromptQuery {

  @Resource
  private PromptRepo promptRepo;

  @Resource
  private PromptSearchRepo promptSearchRepo;

  @Resource
  private PromptFavoritesRepo promptFavoritesRepo;

  @Resource
  private PromptCategoryRepo promptCategoryRepo;

  @Override
  public Prompt findAndCheck(Long id) {
    return new BizTemplate<Prompt>() {
      @Override
      protected Prompt process() {
        Prompt prompt = promptRepo.findById(id)
            .orElseThrow(() -> ResourceNotFound.of("提示词「{0}」未找到", new Object[]{id}));

        // 设置系统标志
        setIsSystemFlag(List.of(prompt));

        // 设置收藏数量
        setFavoritesCount(List.of(prompt));

        // 设置当前用户是否收藏
        setIsFavoriteFlag(List.of(prompt));
        return prompt;
      }
    }.execute();
  }

  @Override
  public Page<Prompt> find(GenericSpecification<Prompt> spec, PageRequest pageable,
      boolean fullTextSearch, String[] match) {
    return new BizTemplate<Page<Prompt>>() {
      @Override
      protected Page<Prompt> process() {
        // 查询收藏的提示词
        if (!assembleFavoriteCriteria()) {
          return Page.empty();
        }

        Page<Prompt> page = fullTextSearch
            ? promptSearchRepo.find(spec.getCriteria(), pageable, Prompt.class, match)
            : promptRepo.findAll(spec, pageable);

        // 设置系统标志
        setIsSystemFlag(page.getContent());

        // 设置收藏数量
        setFavoritesCount(page.getContent());

        // 设置当前用户是否收藏
        setIsFavoriteFlag(page.getContent());
        return page;
      }

      /**
       * 只有查询收藏且有收藏记录时组装查询条件
       *
       * @return 是否执行后续查询
       */
      private boolean assembleFavoriteCriteria() {
        String isFavorite = findFirstValueAndRemove(spec.getCriteria(), "isFavorite");
        if (Boolean.parseBoolean(isFavorite)) {
          Set<Long> favoritePromptIds = promptFavoritesRepo.findAllIdByCreatedBy(getUserId());
          if (!favoritePromptIds.isEmpty()) {
            spec.getCriteria().add(SearchCriteria.in("id", favoritePromptIds));
            return true;
          }
          // 查询收藏却没有收藏记录
          return false;
        }
        return true;
      }
    }.execute();
  }

  @Override
  public boolean existsByTitle(String title) {
    return promptRepo.existsByTitle(title);
  }

  @Override
  public boolean existsByTitleAndIdNot(String title, Long id) {
    return promptRepo.existsByTitleAndIdNot(title, id);
  }

  @Override
  public void setIsSystemFlag(List<Prompt> prompts) {
    List<Long> categoryIds = prompts.stream().map(Prompt::getCategoryId)
        .collect(Collectors.toList());
    Map<Long, Boolean> categoryIsSystemMap = promptCategoryRepo.findAllById(categoryIds).stream()
        .collect(Collectors.toMap(PromptCategory::getId, PromptCategory::getIsSystem));
    prompts.forEach(prompt -> {
      prompt.setIsSystem(categoryIsSystemMap.getOrDefault(prompt.getCategoryId(), false));
    });
  }

  @Override
  public void setFavoritesCount(List<Prompt> prompts) {
    if (prompts == null || prompts.isEmpty()) {
      return;
    }

    // 收集所有提示词ID
    List<Long> promptIds = new ArrayList<>();
    for (Prompt prompt : prompts) {
      if (prompt != null && prompt.getId() != null) {
        promptIds.add(prompt.getId());
      }
    }

    if (promptIds.isEmpty()) {
      // 如果没有有效的ID，将所有提示词的收藏数设置为0
      for (Prompt prompt : prompts) {
        if (prompt != null) {
          prompt.setFavorites(0L);
        }
      }
      return;
    }

    // 批量查询收藏数量
    List<Object[]> rows = promptFavoritesRepo.countByPromptIds(promptIds);
    Map<Long, Long> favoritesCountMap = new HashMap<>();
    if (rows != null) {
      for (Object[] row : rows) {
        if (row == null || row.length < 2) {
          continue;
        }
        Long promptId = ((Number) row[0]).longValue();
        Long count = ((Number) row[1]).longValue();
        favoritesCountMap.put(promptId, count);
      }
    }
    // 设置收藏数量到每个提示词对象
    for (Prompt prompt : prompts) {
      if (prompt != null && prompt.getId() != null) {
        Long count = favoritesCountMap.getOrDefault(prompt.getId(), 0L);
        prompt.setFavorites(count);
      }
    }
  }

  @Override
  public void setIsFavoriteFlag(List<Prompt> prompts) {
    if (prompts == null || prompts.isEmpty()) {
      return;
    }

    // 获取当前用户收藏的所有提示词ID集合
    Set<Long> favoritePromptIds = promptFavoritesRepo.findAllIdByCreatedBy(getUserId());

    // 设置每个提示词的收藏标志
    for (Prompt prompt : prompts) {
      if (prompt != null && prompt.getId() != null) {
        boolean isFavorite = favoritePromptIds.contains(prompt.getId());
        prompt.setIsFavorite(isFavorite);
      } else if (prompt != null) {
        // 如果提示词ID为空，设置为false
        prompt.setIsFavorite(false);
      }
    }
  }
}
