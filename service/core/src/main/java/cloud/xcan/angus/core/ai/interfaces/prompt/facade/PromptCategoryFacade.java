package cloud.xcan.angus.core.ai.interfaces.prompt.facade;

import cloud.xcan.angus.core.ai.interfaces.prompt.facade.dto.PromptCategoryCreateDto;
import cloud.xcan.angus.core.ai.interfaces.prompt.facade.dto.PromptCategoryUpdateDto;
import cloud.xcan.angus.core.ai.interfaces.prompt.facade.vo.PromptCategoryVo;

import java.util.List;

/**
 * 提示词分类门面服务
 */
public interface PromptCategoryFacade {

  /**
   * 创建分类
   *
   * @param dto 创建DTO
   * @return 分类视图对象
   */
  PromptCategoryVo create(PromptCategoryCreateDto dto);

  /**
   * 更新分类
   *
   * @param id  分类ID
   * @param dto 更新DTO
   * @return 分类视图对象
   */
  PromptCategoryVo update(Long id, PromptCategoryUpdateDto dto);

  /**
   * 删除分类
   *
   * @param id 分类ID
   */
  void delete(Long id);

  /**
   * 获取分类详情
   *
   * @param id 分类ID
   * @return 分类视图对象
   */
  PromptCategoryVo getDetail(Long id);

  /**
   * 获取分类树
   *
   * @return 分类树
   */
  List<PromptCategoryVo> getTree();

  /**
   * 调整分类顺序
   *
   * @param id          分类ID
   * @param newPosition 新位置
   * @return 分类视图对象
   */
  PromptCategoryVo updateOrder(Long id, Integer newPosition);

  /**
   * 批量删除分类
   *
   * @param ids 分类ID数组
   */
  void batchDelete(Long[] ids);

}
