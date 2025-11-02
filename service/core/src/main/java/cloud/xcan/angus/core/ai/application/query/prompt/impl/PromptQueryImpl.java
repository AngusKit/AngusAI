package cloud.xcan.angus.core.ai.application.query.prompt.impl;

import static cloud.xcan.angus.core.jpa.criteria.CriteriaUtils.findFirstValueAndRemove;
import static cloud.xcan.angus.spec.principal.PrincipalContext.getUserId;

import cloud.xcan.angus.core.ai.application.query.prompt.PromptQuery;
import cloud.xcan.angus.core.ai.domain.prompt.Prompt;
import cloud.xcan.angus.core.ai.domain.prompt.PromptFavoritesRepo;
import cloud.xcan.angus.core.ai.domain.prompt.PromptRepo;
import cloud.xcan.angus.core.ai.domain.prompt.PromptSearchRepo;
import cloud.xcan.angus.core.biz.BizTemplate;
import cloud.xcan.angus.core.jpa.criteria.GenericSpecification;
import cloud.xcan.angus.remote.message.http.ResourceNotFound;
import cloud.xcan.angus.remote.search.SearchCriteria;
import jakarta.annotation.Resource;
import java.util.Set;
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

  @Override
  public Prompt findAndCheck(Long id) {
    return new BizTemplate<Prompt>() {
      @Override
      protected Prompt process() {
        return promptRepo.findById(id)
            .orElseThrow(() -> ResourceNotFound.of("提示词未找到", new Object[]{}));
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
        assembleFavoriteCriteria();

        return fullTextSearch
            ? promptSearchRepo.find(spec.getCriteria(), pageable, Prompt.class, match)
            : promptRepo.findAll(spec, pageable);
      }

      private void assembleFavoriteCriteria() {
        String isFavorite = findFirstValueAndRemove(spec.getCriteria(), "isFavorite");
        if (Boolean.parseBoolean(isFavorite)) {
          Set<Long> favoritePromptIds = promptFavoritesRepo.findAllIdByCreatedBy(getUserId());
          if (!favoritePromptIds.isEmpty()) {
            spec.getCriteria().add(SearchCriteria.in("id", favoritePromptIds));
          }
        }
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
}
