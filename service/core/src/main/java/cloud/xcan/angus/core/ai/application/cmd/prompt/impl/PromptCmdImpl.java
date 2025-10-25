package cloud.xcan.angus.core.ai.application.cmd.prompt.impl;

import cloud.xcan.angus.core.ai.application.cmd.prompt.PromptCmd;
import cloud.xcan.angus.core.ai.application.query.prompt.PromptCategoryQuery;
import cloud.xcan.angus.core.ai.application.query.prompt.PromptQuery;
import cloud.xcan.angus.core.ai.domain.prompt.Prompt;
import cloud.xcan.angus.core.ai.domain.prompt.PromptRepo;
import cloud.xcan.angus.core.biz.Biz;
import cloud.xcan.angus.core.biz.BizTemplate;
import cloud.xcan.angus.core.biz.cmd.CommCmd;
import cloud.xcan.angus.core.jpa.repository.BaseRepository;
import cloud.xcan.angus.core.utils.CoreUtils;
import cloud.xcan.angus.remote.message.http.ResourceExisted;
import cloud.xcan.angus.remote.message.http.ResourceNotFound;
import cloud.xcan.angus.spec.annotations.DoInFuture;
import cloud.xcan.angus.spec.utils.ObjectUtils;
import jakarta.annotation.Resource;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@DoInFuture("添加权限校验")
@Component
@Biz
public class PromptCmdImpl extends CommCmd<Prompt, Long> implements PromptCmd {

  @Resource
  private PromptRepo promptRepo;

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

        // 如果指定了分类，检查分类是否存在
        if (prompt.getCategoryId() != null && !promptCategoryQuery.exists(prompt.getCategoryId())) {
          throw ResourceNotFound.of("分类不存在", new Object[]{});
        }
      }

      @Override
      protected Prompt process() {
        insert0(prompt);
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
        promptDb = promptQuery.findById(prompt.getId());
        if (promptDb == null) {
          throw ResourceNotFound.of("提示词不存在", new Object[]{});
        }

        // 检查是否为系统模板
        if (promptDb.getIsSystem()) {
          throw ResourceExisted.of("系统模板不可编辑", new Object[]{});
        }

        // 检查标题是否已存在（排除当前提示词）
        if (ObjectUtils.isNotEmpty(prompt.getTitle())
            && promptQuery.existsByTitleAndIdNot(prompt.getTitle(), promptDb.getId())) {
          throw ResourceExisted.of("提示词标题「{0}」已存在", new Object[]{prompt.getTitle()});
        }

        // 如果更新了分类，检查新分类是否存在
        if (prompt.getCategoryId() != null && !promptCategoryQuery.exists(prompt.getCategoryId())) {
          throw ResourceNotFound.of("分类不存在", new Object[]{});
        }
      }

      @Override
      protected Prompt process() {
        CoreUtils.copyPropertiesIgnoreNull(prompt, promptDb);
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
        promptDb = promptQuery.findById(id);
        if (promptDb == null) {
          throw ResourceNotFound.of("提示词不存在", new Object[]{});
        }

        // 检查是否为系统模板
        if (promptDb.getIsSystem()) {
          throw ResourceExisted.of("系统模板不可删除", new Object[]{});
        }
      }

      @Override
      protected Void process() {
        promptRepo.deleteById(id);
        return null;
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
        promptDb = promptQuery.findById(id);
        if (promptDb == null) {
          throw ResourceNotFound.of("提示词不存在", new Object[]{});
        }
      }

      @Override
      protected Prompt process() {
        promptDb.setIsFavorite(isFavorite);
        return promptRepo.save(promptDb);
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
        sourcePrompt = promptQuery.findById(id);
        if (sourcePrompt == null) {
          throw ResourceNotFound.of("提示词不存在", new Object[]{});
        }
      }

      @Override
      protected Prompt process() {
        Prompt newPrompt = new Prompt();
        CoreUtils.copyPropertiesIgnoreNull(sourcePrompt, newPrompt);
        newPrompt.setId(null);
        newPrompt.setTitle(ObjectUtils.isEmpty(title) ? sourcePrompt.getTitle() + "的副本" : title);
        newPrompt.setUsageCount(0L);
        newPrompt.setIsFavorite(false);
        newPrompt.setIsSystem(false);
        insert0(newPrompt);
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
        promptDb = promptQuery.findById(id);
        if (promptDb == null) {
          throw ResourceNotFound.of("提示词不存在", new Object[]{});
        }
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
  public Prompt archive(Long id) {
    return new BizTemplate<Prompt>() {
      Prompt promptDb;

      @Override
      protected void checkParams() {
        promptDb = promptQuery.findById(id);
        if (promptDb == null) {
          throw ResourceNotFound.of("提示词不存在", new Object[]{});
        }
      }

      @Override
      protected Prompt process() {
        promptDb.setArchived(true);
        promptDb.setArchivedAt(System.currentTimeMillis());
        return promptRepo.save(promptDb);
      }
    }.execute();
  }

  @Override
  @Transactional
  public Prompt unarchive(Long id) {
    return new BizTemplate<Prompt>() {
      Prompt promptDb;

      @Override
      protected void checkParams() {
        promptDb = promptQuery.findById(id);
        if (promptDb == null) {
          throw ResourceNotFound.of("提示词不存在", new Object[]{});
        }
      }

      @Override
      protected Prompt process() {
        promptDb.setArchived(false);
        promptDb.setArchivedAt(null);
        return promptRepo.save(promptDb);
      }
    }.execute();
  }

  @Override
  protected BaseRepository<Prompt, Long> getRepository() {
    return promptRepo;
  }
}
