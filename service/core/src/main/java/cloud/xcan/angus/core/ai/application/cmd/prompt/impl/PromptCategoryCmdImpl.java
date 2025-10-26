package cloud.xcan.angus.core.ai.application.cmd.prompt.impl;

import cloud.xcan.angus.core.ai.application.cmd.prompt.PromptCategoryCmd;
import cloud.xcan.angus.core.ai.domain.prompt.PromptCategory;
import cloud.xcan.angus.core.ai.domain.prompt.PromptCategoryRepo;
import cloud.xcan.angus.core.ai.domain.prompt.PromptRepo;
import cloud.xcan.angus.core.biz.Biz;
import cloud.xcan.angus.core.biz.BizTemplate;
import cloud.xcan.angus.remote.message.http.ResourceExisted;
import cloud.xcan.angus.remote.message.http.ResourceNotFound;
import jakarta.annotation.Resource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import java.util.List;
import java.util.Objects;

/**
 * 提示词分类命令服务实现
 */
@Component
@Biz
public class PromptCategoryCmdImpl implements PromptCategoryCmd {

  @Resource
  private PromptCategoryRepo promptCategoryRepo;

  @Resource
  private PromptRepo promptRepo;

  @Override
  public PromptCategory create(String name, String description, String icon, String color, Long parentId) {
    return new BizTemplate<PromptCategory>() {
      @Override
      protected void checkParams() {
              if (!StringUtils.hasText(name)) {
          throw ResourceNotFound.of("分类名称不能为空", new Object[]{});
              }
              if (name.length() > 50) {
          throw ResourceExisted.of("分类名称长度不能超过50个字符", new Object[]{});
              }

              // 检查同级下是否存在同名分类
              boolean exists = promptCategoryRepo.existsByNameAndParentId(name, parentId);
              if (exists) {
          throw ResourceExisted.of("分类名称「{0}」已存在", new Object[]{name});
              }

              // 如果指定了父分类，检查父分类是否存在
              if (parentId != null) {
          PromptCategory parent = promptCategoryRepo.findById(parentId).orElse(null);
                if (parent == null) {
            throw ResourceNotFound.of("父分类不存在", new Object[]{});
          }
                }
              }

      @Override
      protected PromptCategory process() {
              PromptCategory category = new PromptCategory();
              category.setName(name);
              category.setDescription(description);
              category.setIcon(icon);
              category.setColor(color);
              category.setParentId(parentId);
              category.setIsSystem(false);

              // 设置排序顺序（放在最后）
              Integer maxOrder = promptCategoryRepo.findMaxOrderByParentId(parentId);
              category.setOrderNum(maxOrder != null ? maxOrder + 1 : 0);

              promptCategoryRepo.save(category);
              return category;
      }
    }.execute();
  }

  @Override
  public PromptCategory update(Long id, String name, String description, String icon, String color, Long parentId) {
    return new BizTemplate<PromptCategory>() {
      PromptCategory categoryDb;

      @Override
      protected void checkParams() {
              if (id == null) {
          throw ResourceNotFound.of("分类ID不能为空", new Object[]{});
              }
              if (!StringUtils.hasText(name)) {
          throw ResourceNotFound.of("分类名称不能为空", new Object[]{});
              }
              if (name.length() > 50) {
          throw ResourceExisted.of("分类名称长度不能超过50个字符", new Object[]{});
              }

              // 检查分类是否存在
        categoryDb = promptCategoryRepo.findById(id).orElse(null);
        if (categoryDb == null) {
          throw ResourceNotFound.of("分类不存在", new Object[]{});
              }

              // 系统分类不允许修改名称
        if (categoryDb.getIsSystem() && !Objects.equals(categoryDb.getName(), name)) {
          throw ResourceExisted.of("系统分类不允许修改名称", new Object[]{});
              }

              // 检查同级下是否存在同名分类（排除自己）
              boolean exists = promptCategoryRepo.existsByNameAndParentIdAndIdNot(name, parentId, id);
              if (exists) {
          throw ResourceExisted.of("分类名称「{0}」已存在", new Object[]{name});
              }

              // 如果指定了父分类，检查父分类是否存在且不是自己或自己的子分类
              if (parentId != null) {
                if (Objects.equals(parentId, id)) {
            throw ResourceExisted.of("分类不能作为自己的父分类", new Object[]{});
                }
          PromptCategory parent = promptCategoryRepo.findById(parentId).orElse(null);
                if (parent == null) {
            throw ResourceNotFound.of("父分类不存在", new Object[]{});
                }
                // TODO: 检查是否形成循环引用（需要遍历父分类链）
              }
  }

  @Override
      protected PromptCategory process() {
        categoryDb.setName(name);
        categoryDb.setDescription(description);
        categoryDb.setIcon(icon);
        categoryDb.setColor(color);

        // 如果父分类发生变化，重新计算排序
        if (!Objects.equals(categoryDb.getParentId(), parentId)) {
          categoryDb.setParentId(parentId);
          Integer maxOrder = promptCategoryRepo.findMaxOrderByParentId(parentId);
          categoryDb.setOrderNum(maxOrder != null ? maxOrder + 1 : 0);
        }

        return promptCategoryRepo.save(categoryDb);
      }
    }.execute();
  }

  @Override
  public void updateOrder(Long id, Integer newPosition) {
    new BizTemplate<Void>() {
      PromptCategory categoryDb;

      @Override
      protected void checkParams() {
              if (id == null) {
          throw ResourceNotFound.of("分类ID不能为空", new Object[]{});
              }
              if (newPosition == null || newPosition < 0) {
          throw ResourceExisted.of("排序位置无效", new Object[]{});
        }

        categoryDb = promptCategoryRepo.findById(id).orElse(null);
        if (categoryDb == null) {
          throw ResourceNotFound.of("分类不存在", new Object[]{});
        }
      }

      @Override
      protected Void process() {
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

              return null;
      }
    }.execute();
  }

  @Override
  public void delete(Long id) {
    new BizTemplate<Void>() {
      PromptCategory categoryDb;

      @Override
      protected void checkParams() {
        if (id == null) {
          throw ResourceNotFound.of("分类ID不能为空", new Object[]{});
        }

        categoryDb = promptCategoryRepo.findById(id).orElse(null);
        if (categoryDb == null) {
          throw ResourceNotFound.of("分类不存在", new Object[]{});
        }

        // 系统分类不允许删除
        if (categoryDb.getIsSystem()) {
          throw ResourceExisted.of("系统分类不允许删除", new Object[]{});
        }

        // 检查是否有子分类
        long childCount = promptCategoryRepo.countByParentId(id);
        if (childCount > 0) {
          throw ResourceExisted.of("分类下存在子分类，无法删除", new Object[]{});
        }

        // 检查是否有关联的提示词
        long promptCount = promptRepo.countByCategoryId(id);
        if (promptCount > 0) {
          throw ResourceExisted.of("分类下存在提示词，无法删除", new Object[]{});
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
      protected void checkParams() {
              if (ids == null || ids.length == 0) {
          throw ResourceNotFound.of("分类ID列表不能为空", new Object[]{});
        }
              }

      @Override
      protected Void process() {
              for (Long id : ids) {
                try {
                  delete(id);
          } catch (Exception e) {
                  // 记录失败的ID，继续处理其他分类
                  // TODO: 收集错误信息并返回
                }
              }
              return null;
      }
    }.execute();
  }

}
