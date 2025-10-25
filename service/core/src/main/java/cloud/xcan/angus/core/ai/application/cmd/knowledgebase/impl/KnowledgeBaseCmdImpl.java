package cloud.xcan.angus.core.ai.application.cmd.knowledgebase.impl;

import cloud.xcan.angus.core.ai.application.cmd.knowledgebase.KnowledgeBaseCmd;
import cloud.xcan.angus.core.ai.application.query.knowledgebase.KnowledgeBaseQuery;
import cloud.xcan.angus.core.ai.domain.knowledgebase.DocumentVisibility;
import cloud.xcan.angus.core.ai.domain.knowledgebase.KnowledgeBase;
import cloud.xcan.angus.core.ai.domain.knowledgebase.KnowledgeBaseRepo;
import cloud.xcan.angus.core.biz.Biz;
import cloud.xcan.angus.core.biz.BizTemplate;
import cloud.xcan.angus.core.biz.cmd.CommCmd;
import cloud.xcan.angus.core.jpa.repository.BaseRepository;
import cloud.xcan.angus.core.utils.CoreUtils;
import cloud.xcan.angus.remote.message.http.ResourceExisted;
import jakarta.annotation.Resource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Biz
public class KnowledgeBaseCmdImpl extends CommCmd<KnowledgeBase, Long> implements KnowledgeBaseCmd {

  @Resource
  private KnowledgeBaseRepo knowledgeBaseRepo;

  @Resource
  private KnowledgeBaseQuery knowledgeBaseQuery;

  @Override
  @Transactional
  public KnowledgeBase create(KnowledgeBase knowledgeBase) {
    return new BizTemplate<KnowledgeBase>() {
      @Override
      protected void checkParams() {
        // 检查名称是否重复
        KnowledgeBase existing = knowledgeBaseRepo.findByName(knowledgeBase.getName());
        if (existing != null) {
          throw ResourceExisted.of("知识库名称「{0}」已存在", new Object[]{knowledgeBase.getName()});
        }
      }

      @Override
      protected KnowledgeBase process() {
        insert0(knowledgeBase);
        return knowledgeBase;
      }
    }.execute();
  }

  @Override
  @Transactional
  public KnowledgeBase update(KnowledgeBase knowledgeBase) {
    return new BizTemplate<KnowledgeBase>() {
      KnowledgeBase knowledgeBaseDb;

      @Override
      protected void checkParams() {
        // 获取源知识库并检查是否存在
        knowledgeBaseDb = knowledgeBaseQuery.findAndCheck(knowledgeBase.getId());

        // 检查名称是否重复（如果修改了名称）
        if (knowledgeBase.getName() != null && !knowledgeBase.getName()
            .equals(knowledgeBaseDb.getName())) {
          KnowledgeBase nameExists = knowledgeBaseRepo.findByName(knowledgeBase.getName());
          if (nameExists != null) {
            throw ResourceExisted.of("知识库「{0}」已存在", new Object[]{knowledgeBase.getName()});
          }
        }
      }

      @Override
      protected KnowledgeBase process() {
        CoreUtils.copyPropertiesIgnoreNull(knowledgeBase, knowledgeBaseDb);
        return knowledgeBaseRepo.save(knowledgeBaseDb);
      }
    }.execute();
  }

  @Override
  @Transactional
  public KnowledgeBase toggle(Long id, Boolean enabled) {
    return new BizTemplate<KnowledgeBase>() {
      KnowledgeBase knowledgeBaseDb;

      @Override
      protected void checkParams() {
        // 获取源知识库并检查是否存在
        knowledgeBaseDb = knowledgeBaseQuery.findAndCheck(id);
      }

      @Override
      protected KnowledgeBase process() {
        knowledgeBaseDb.setEnabled(enabled);
        return knowledgeBaseRepo.save(knowledgeBaseDb);
      }
    }.execute();
  }

  @Override
  @Transactional
  public KnowledgeBase modifyVisibility(Long id, DocumentVisibility visibility) {
    return new BizTemplate<KnowledgeBase>() {
      KnowledgeBase knowledgeBaseDb;

      @Override
      protected void checkParams() {
        // 获取源知识库并检查是否存在
        knowledgeBaseDb = knowledgeBaseQuery.findAndCheck(id);
      }

      @Override
      protected KnowledgeBase process() {
        knowledgeBaseDb.setVisibility(visibility);
        return knowledgeBaseRepo.save(knowledgeBaseDb);
      }
    }.execute();
  }

  @Override
  @Transactional
  public void delete(Long id) {
    new BizTemplate<Void>() {
      @Override
      protected Void process() {
        knowledgeBaseRepo.deleteById(id);
        return null;
      }
    }.execute();
  }

  @Override
  protected BaseRepository<KnowledgeBase, Long> getRepository() {
    return this.knowledgeBaseRepo;
  }
}
