package cloud.xcan.angus.core.ai.application.cmd.prompt.impl;

import static cloud.xcan.angus.spec.utils.ObjectUtils.nullSafe;

import cloud.xcan.angus.core.ai.application.cmd.prompt.PromptCategoryCmd;
import cloud.xcan.angus.core.ai.application.query.prompt.PromptCategoryQuery;
import cloud.xcan.angus.core.ai.domain.prompt.PromptCategory;
import cloud.xcan.angus.core.ai.domain.prompt.PromptCategoryRepo;
import cloud.xcan.angus.core.ai.domain.prompt.PromptRepo;
import cloud.xcan.angus.core.biz.BizTemplate;
import cloud.xcan.angus.core.biz.cmd.CommCmd;
import cloud.xcan.angus.core.jpa.repository.BaseRepository;
import cloud.xcan.angus.core.utils.CoreUtils;
import cloud.xcan.angus.remote.message.ProtocolException;
import cloud.xcan.angus.remote.message.http.ResourceExisted;
import cloud.xcan.angus.remote.message.http.ResourceNotFound;
import jakarta.annotation.Resource;
import java.util.List;
import java.util.Objects;
import org.springframework.stereotype.Service;

/**
 * 提示词分类命令服务实现
 */
@Service
public class PromptCategoryCmdImpl extends CommCmd<PromptCategory, Long>
    implements PromptCategoryCmd {

  @Resource
  private PromptCategoryRepo promptCategoryRepo;

  @Resource
  private PromptCategoryQuery promptCategoryQuery;

  @Resource
  private PromptRepo promptRepo;

  @Override
  public PromptCategory create(PromptCategory category) {
    return new BizTemplate<PromptCategory>() {
      @Override
      protected void checkParams() {
        // 检查同级下是否存在同名分类
        boolean exists = promptCategoryRepo.existsByNameAndParentId(
            category.getName(), category.getParentId());
        if (exists) {
          throw ResourceExisted.of("分类名称「{0}」已存在", new Object[]{category.getName()});
        }

        // 如果指定了父分类，检查父分类是否存在
        if (category.getParentId() != null) {
          promptCategoryRepo.findById(category.getParentId())
              .orElseThrow(() -> ResourceNotFound.of("父分类不存在", new Object[]{}));
        }

        // 检查层级深度：最多支持三级
        int newCategoryLevel = promptCategoryQuery.calculateCategoryLevel(category.getParentId());
        if (newCategoryLevel > 3) {
          throw ProtocolException.of("分类层级最多支持三级，无法创建", new Object[]{});
        }

        // TODO 限制每个用户总共最多500个分组
      }

      @Override
      protected PromptCategory process() {
        // 设置排序顺序（放在最后）
        Integer maxOrder = promptCategoryRepo.findMaxOrderByParentId(category.getParentId());
        category.setOrderNum(maxOrder != null ? maxOrder + 1 : 0);

        insert(category);
        return category;
      }
    }.execute();
  }

  @Override
  public PromptCategory update(PromptCategory category) {
    return new BizTemplate<PromptCategory>() {
      PromptCategory categoryDb;

      @Override
      protected void checkParams() {
        // 检查分类是否存在
        categoryDb = promptCategoryQuery.findAndCheck(category.getId());

        // 系统分类不允许修改名称
        if (categoryDb.getIsSystem()) {
          throw ProtocolException.of("系统分类不允许修改", new Object[]{});
        }

        // 检查同级下是否存在同名分类（排除自己）
        String actualName = nullSafe(category.getName(), categoryDb.getName());
        Long actualParentId = nullSafe(category.getParentId(), categoryDb.getParentId());
        boolean exists = promptCategoryRepo.existsByNameAndParentIdAndIdNot(
            actualName, actualParentId, category.getId());
        if (exists) {
          throw ResourceExisted.of("分类名称「{0}」已存在", new Object[]{actualName});
        }

        // 如果指定了父分类，检查父分类是否存在且不是自己或自己的子分类
        if (category.getParentId() != null) {
          promptCategoryRepo.findById(category.getParentId())
              .orElseThrow(() -> ResourceNotFound.of("父分类不存在", new Object[]{}));

          // TODO: 检查是否形成循环引用（需要遍历父分类链）
        }
      }

      @Override
      protected PromptCategory process() {
        CoreUtils.copyPropertiesIgnoreNull(category, categoryDb);

        // 如果父分类发生变化，重新计算排序
        if (category.getParentId() != null
            && !Objects.equals(categoryDb.getParentId(), category.getParentId())) {
          Integer maxOrder = promptCategoryRepo.findMaxOrderByParentId(category.getParentId());
          categoryDb.setOrderNum(maxOrder != null ? maxOrder + 1 : 0);
        }

        promptCategoryRepo.save(categoryDb);
        return categoryDb;
      }
    }.execute();
  }

  @Override
  public PromptCategory updateOrder(Long id, Integer newPosition) {
    return new BizTemplate<PromptCategory>() {
      PromptCategory categoryDb;

      @Override
      protected void checkParams() {
        // 检查分类是否存在
        categoryDb = promptCategoryQuery.findAndCheck(id);

        // 检查位置是否有效
        if (newPosition == null || newPosition < 0) {
          throw ProtocolException.of("排序位置无效", new Object[]{});
        }
      }

      @Override
      protected PromptCategory process() {
        Integer oldPosition = categoryDb.getOrderNum();
        Long parentId = categoryDb.getParentId();

        if (Objects.equals(oldPosition, newPosition)) {
          return null; // 位置未变化，无需处理
        }

        // 获取同级所有分类
        List<PromptCategory> siblings = promptCategoryRepo.findByParentIdOrderByOrderNum(parentId);

        // 调整排序
        if (newPosition > oldPosition) {
          // 向后移动：将中间的分类前移
          for (PromptCategory sibling : siblings) {
            if (sibling.getOrderNum() > oldPosition && sibling.getOrderNum() <= newPosition) {
              sibling.setOrderNum(sibling.getOrderNum() - 1);
              promptCategoryRepo.save(sibling);
            }
          }
        } else {
          // 向前移动：将中间的分类后移
          for (PromptCategory sibling : siblings) {
            if (sibling.getOrderNum() >= newPosition && sibling.getOrderNum() < oldPosition) {
              sibling.setOrderNum(sibling.getOrderNum() + 1);
              promptCategoryRepo.save(sibling);
            }
          }
        }

        // 更新当前分类的位置
        categoryDb.setOrderNum(newPosition);
        promptCategoryRepo.save(categoryDb);
        return categoryDb;
      }
    }.execute();
  }

  @Override
  public void delete(Long id) {
    new BizTemplate<Void>() {
      PromptCategory categoryDb;

      @Override
      protected void checkParams() {
        // 检查分类是否存在
        categoryDb = promptCategoryQuery.findAndCheck(id);

        // 系统分类不允许删除
        if (categoryDb.getIsSystem()) {
          throw ProtocolException.of("系统分类不允许删除", new Object[]{});
        }

        // 检查是否有子分类
        long childCount = promptCategoryRepo.countByParentId(id);
        if (childCount > 0) {
          throw ProtocolException.of("分类下存在子分类，无法删除", new Object[]{});
        }

        // 检查是否有关联的提示词
        long promptCount = promptRepo.countByCategoryId(id);
        if (promptCount > 0) {
          throw ProtocolException.of("分类下存在提示词，无法删除", new Object[]{});
        }
      }

      @Override
      protected Void process() {
        promptCategoryRepo.deleteById(id);
        return null;
      }
    }.execute();
  }

  @Override
  public void batchDelete(Long[] ids) {
    new BizTemplate<Void>() {
      @Override
      protected Void process() {
        for (Long id : ids) {
          delete(id);
        }
        return null;
      }
    }.execute();
  }

  @Override
  protected BaseRepository<PromptCategory, Long> getRepository() {
    return this.promptCategoryRepo;
  }
}
