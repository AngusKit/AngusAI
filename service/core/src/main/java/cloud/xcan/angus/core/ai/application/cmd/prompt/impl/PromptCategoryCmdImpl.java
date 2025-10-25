package cloud.xcan.angus.core.ai.application.cmd.prompt.impl;

import cloud.xcan.angus.core.ai.application.cmd.prompt.PromptCategoryCmd;
import cloud.xcan.angus.core.ai.domain.prompt.PromptCategory;
import cloud.xcan.angus.core.ai.domain.prompt.PromptCategoryRepo;
import cloud.xcan.angus.core.ai.domain.prompt.PromptRepo;
import cloud.xcan.angus.infra.ServiceInfrastructure;
import cloud.xcan.angus.infra.bizcomponent.BizTemplate;
import cloud.xcan.angus.infra.bizcomponent.CmdParams;
import cloud.xcan.angus.infra.exception.ServiceException;
import jakarta.annotation.Resource;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.List;
import java.util.Objects;

/**
 * 提示词分类命令服务实现
 */
@Service
public class PromptCategoryCmdImpl extends ServiceInfrastructure implements PromptCategoryCmd {

  @Resource
  private PromptCategoryRepo promptCategoryRepo;

  @Resource
  private PromptRepo promptRepo;

  @Resource
  private BizTemplate bizTemplate;

  @Override
  public PromptCategory create(String name, String description, String icon, String color, Long parentId) {
    return bizTemplate.execute(
        new CmdParams<PromptCategory>()
            .setCheckParamsHandler(params -> {
              if (!StringUtils.hasText(name)) {
                throw ServiceException.with("prompt.category.name.required");
              }
              if (name.length() > 50) {
                throw ServiceException.with("prompt.category.name.too.long");
              }

              // 检查同级下是否存在同名分类
              boolean exists = promptCategoryRepo.existsByNameAndParentId(name, parentId);
              if (exists) {
                throw ServiceException.with("prompt.category.name.duplicate");
              }

              // 如果指定了父分类，检查父分类是否存在
              if (parentId != null) {
                PromptCategory parent = promptCategoryRepo.findById(parentId);
                if (parent == null) {
                  throw ServiceException.with("prompt.category.parent.not.found");
                }
              }
            })
            .setProcessHandler(params -> {
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
            })
    );
  }

  @Override
  public PromptCategory update(Long id, String name, String description, String icon, String color, Long parentId) {
    return bizTemplate.execute(
        new CmdParams<PromptCategory>()
            .setCheckParamsHandler(params -> {
              if (id == null) {
                throw ServiceException.with("prompt.category.id.required");
              }
              if (!StringUtils.hasText(name)) {
                throw ServiceException.with("prompt.category.name.required");
              }
              if (name.length() > 50) {
                throw ServiceException.with("prompt.category.name.too.long");
              }

              // 检查分类是否存在
              PromptCategory existing = promptCategoryRepo.findById(id);
              if (existing == null) {
                throw ServiceException.with("prompt.category.not.found");
              }

              // 系统分类不允许修改名称
              if (existing.getIsSystem() && !Objects.equals(existing.getName(), name)) {
                throw ServiceException.with("prompt.category.system.cannot.rename");
              }

              // 检查同级下是否存在同名分类（排除自己）
              boolean exists = promptCategoryRepo.existsByNameAndParentIdAndIdNot(name, parentId, id);
              if (exists) {
                throw ServiceException.with("prompt.category.name.duplicate");
              }

              // 如果指定了父分类，检查父分类是否存在且不是自己或自己的子分类
              if (parentId != null) {
                if (Objects.equals(parentId, id)) {
                  throw ServiceException.with("prompt.category.cannot.be.own.parent");
                }
                PromptCategory parent = promptCategoryRepo.findById(parentId);
                if (parent == null) {
                  throw ServiceException.with("prompt.category.parent.not.found");
                }
                // TODO: 检查是否形成循环引用（需要遍历父分类链）
              }
            })
            .setProcessHandler(params -> {
              PromptCategory category = promptCategoryRepo.findById(id);
              category.setName(name);
              category.setDescription(description);
              category.setIcon(icon);
              category.setColor(color);

              // 如果父分类发生变化，重新计算排序
              if (!Objects.equals(category.getParentId(), parentId)) {
                category.setParentId(parentId);
                Integer maxOrder = promptCategoryRepo.findMaxOrderByParentId(parentId);
                category.setOrderNum(maxOrder != null ? maxOrder + 1 : 0);
              }

              promptCategoryRepo.save(category);
              return category;
            })
    );
  }

  @Override
  public void delete(Long id) {
    bizTemplate.execute(
        new CmdParams<Void>()
            .setCheckParamsHandler(params -> {
              if (id == null) {
                throw ServiceException.with("prompt.category.id.required");
              }

              PromptCategory category = promptCategoryRepo.findById(id);
              if (category == null) {
                throw ServiceException.with("prompt.category.not.found");
              }

              // 系统分类不允许删除
              if (category.getIsSystem()) {
                throw ServiceException.with("prompt.category.system.cannot.delete");
              }

              // 检查是否有子分类
              long childCount = promptCategoryRepo.countByParentId(id);
              if (childCount > 0) {
                throw ServiceException.with("prompt.category.has.children");
              }

              // 检查是否有关联的提示词
              long promptCount = promptRepo.countByCategoryId(id);
              if (promptCount > 0) {
                throw ServiceException.with("prompt.category.has.prompts");
              }
            })
            .setProcessHandler(params -> {
              promptCategoryRepo.deleteById(id);
              return null;
            })
    );
  }

  @Override
  public void updateOrder(Long id, Integer newPosition) {
    bizTemplate.execute(
        new CmdParams<Void>()
            .setCheckParamsHandler(params -> {
              if (id == null) {
                throw ServiceException.with("prompt.category.id.required");
              }
              if (newPosition == null || newPosition < 0) {
                throw ServiceException.with("prompt.category.order.invalid");
              }

              PromptCategory category = promptCategoryRepo.findById(id);
              if (category == null) {
                throw ServiceException.with("prompt.category.not.found");
              }
            })
            .setProcessHandler(params -> {
              PromptCategory category = promptCategoryRepo.findById(id);
              Integer oldPosition = category.getOrderNum();
              Long parentId = category.getParentId();

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
              category.setOrderNum(newPosition);
              promptCategoryRepo.save(category);

              return null;
            })
    );
  }

  @Override
  public void batchDelete(Long[] ids) {
    bizTemplate.execute(
        new CmdParams<Void>()
            .setCheckParamsHandler(params -> {
              if (ids == null || ids.length == 0) {
                throw ServiceException.with("prompt.category.ids.required");
              }
            })
            .setProcessHandler(params -> {
              for (Long id : ids) {
                try {
                  delete(id);
                } catch (ServiceException e) {
                  // 记录失败的ID，继续处理其他分类
                  // TODO: 收集错误信息并返回
                }
              }
              return null;
            })
    );
  }

}
