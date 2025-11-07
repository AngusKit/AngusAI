package cloud.xcan.angus.core.ai.application.cmd.prompt.impl;

import static cloud.xcan.angus.core.ai.application.converter.PromptConverter.toDuplicatePrompt;
import static cloud.xcan.angus.spec.principal.PrincipalContext.getUserId;

import cloud.xcan.angus.core.ai.application.cmd.prompt.PromptCmd;
import cloud.xcan.angus.core.ai.application.cmd.prompt.PromptFavoritesCmd;
import cloud.xcan.angus.core.ai.application.query.prompt.PromptCategoryQuery;
import cloud.xcan.angus.core.ai.application.query.prompt.PromptQuery;
import cloud.xcan.angus.core.ai.domain.prompt.Prompt;
import cloud.xcan.angus.core.ai.domain.prompt.PromptCategory;
import cloud.xcan.angus.core.ai.domain.prompt.PromptFavorites;
import cloud.xcan.angus.core.ai.domain.prompt.PromptRepo;
import cloud.xcan.angus.core.biz.BizTemplate;
import cloud.xcan.angus.core.biz.cmd.CommCmd;
import cloud.xcan.angus.core.jpa.repository.BaseRepository;
import cloud.xcan.angus.remote.message.ProtocolException;
import cloud.xcan.angus.remote.message.http.ResourceExisted;
import cloud.xcan.angus.remote.message.http.ResourceNotFound;
import cloud.xcan.angus.spec.annotations.DoInFuture;
import cloud.xcan.angus.spec.utils.ObjectUtils;
import jakarta.annotation.Resource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@DoInFuture("添加权限校验")
@Service
public class PromptCmdImpl extends CommCmd<Prompt, Long> implements PromptCmd {

  @Resource
  private PromptRepo promptRepo;

  @Resource
  private PromptFavoritesCmd promptFavoritesCmd;

  @Resource
  private PromptQuery promptQuery;

  @Resource
  private PromptCategoryQuery promptCategoryQuery;

  @Override
  @Transactional
  public Prompt create(Prompt prompt) {
    return new BizTemplate<Prompt>() {
      @Override
      protected void checkParams() {
        // 检查标题是否已存在
        if (promptQuery.existsByTitle(prompt.getTitle())) {
          throw ResourceExisted.of("提示词标题「{0}」已存在", new Object[]{prompt.getTitle()});
        }

        // 检查分类是否存在，且不是系统分组
        PromptCategory category = promptCategoryQuery.findAndCheck(prompt.getCategoryId());
        if (category.getIsSystem()){
          throw ProtocolException.of("不允许添加提示词到系统分组", new Object[]{});
        }

        // TODO 限制每个租户总共最多创建2000个提示词
      }

      @Override
      protected Prompt process() {
        insert(prompt);
        return prompt;
      }
    }.execute();
  }

  @Override
  @Transactional
  public Prompt update(Prompt prompt) {
    return new BizTemplate<Prompt>() {
      Prompt promptDb;

      @Override
      protected void checkParams() {
        // 获取提示词并验证是否存在
        promptDb = promptQuery.findAndCheck(prompt.getId());

        // 如果更新了分类，检查新分类是否存在
        if (prompt.getCategoryId() != null) {
          PromptCategory category = promptCategoryQuery.findAndCheck(prompt.getCategoryId());
          if (category.getIsSystem()){
            throw ProtocolException.of("不允许添加提示词到系统分组", new Object[]{});
          }
        }

        // 检查标题是否已存在（排除当前提示词）
        if (ObjectUtils.isNotEmpty(prompt.getTitle())
            && promptQuery.existsByTitleAndIdNot(prompt.getTitle(), promptDb.getId())) {
          throw ResourceExisted.of("提示词标题「{0}」已存在", new Object[]{prompt.getTitle()});
        }
      }

      @Override
      protected Prompt process() {
        update(prompt, promptDb);
        return promptDb;
      }
    }.execute();
  }

  @Override
  @Transactional
  public Prompt toggleFavorite(Long id, Boolean isFavorite) {
    return new BizTemplate<Prompt>() {
      Prompt promptDb;

      @Override
      protected void checkParams() {
        // 获取提示词并验证是否存在
        promptDb = promptQuery.findAndCheck(id);
      }

      @Override
      protected Prompt process() {
        if (isFavorite) {
          PromptFavorites favorites = new PromptFavorites();
          favorites.setPromptId(id);
          promptFavoritesCmd.addFavorites(favorites);
        } else {
          promptFavoritesCmd.deleteByPromptIdAndCreatedBy(id, getUserId());
        }

        promptDb.setIsFavorite(isFavorite);
        return promptDb;
      }
    }.execute();
  }

  @Override
  @Transactional
  public Prompt duplicate(Long id, String title) {
    return new BizTemplate<Prompt>() {
      Prompt sourcePrompt;

      @Override
      protected void checkParams() {
        // 获取提示词并验证是否存在
        sourcePrompt = promptQuery.findAndCheck(id);

        // 检查分类是否存在，且不是系统分组
        PromptCategory category = promptCategoryQuery.findAndCheck(sourcePrompt.getCategoryId());
        if (category.getIsSystem()){
          throw ProtocolException.of("不允许复制系统分组", new Object[]{});
        }
      }

      @Override
      protected Prompt process() {
        Prompt newPrompt = toDuplicatePrompt(title, sourcePrompt);
        insert(newPrompt);
        return newPrompt;
      }
    }.execute();
  }

  @Override
  @Transactional
  public Prompt use(Long id) {
    return new BizTemplate<Prompt>() {
      Prompt promptDb;

      @Override
      protected void checkParams() {
        // 获取提示词并验证是否存在
        promptDb = promptQuery.findAndCheck(id);
      }

      @Override
      protected Prompt process() {
        promptDb.setUsageCount(promptDb.getUsageCount() + 1);
        return promptRepo.save(promptDb);
      }
    }.execute();
  }

  @Override
  @Transactional
  public void delete(Long id) {
    new BizTemplate<Void>() {
      Prompt promptDb;

      @Override
      protected void checkParams() {
        // 获取提示词并验证是否存在
        promptDb = promptQuery.findAndCheck(id);

        // 检查是否为系统模板
        // 检查分类是否存在，且不是系统分组
        PromptCategory category = promptCategoryQuery.findAndCheck(promptDb.getCategoryId());
        if (category.getIsSystem()){
          throw ProtocolException.of("不允许系统分组", new Object[]{});
        }
      }

      @Override
      protected Void process() {
        promptRepo.deleteById(id);
        promptFavoritesCmd.deleteByPromptId(id);
        return null;
      }
    }.execute();
  }

  @Override
  protected BaseRepository<Prompt, Long> getRepository() {
    return promptRepo;
  }
}
