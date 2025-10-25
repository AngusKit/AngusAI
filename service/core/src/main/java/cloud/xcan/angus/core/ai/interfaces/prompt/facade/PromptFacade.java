package cloud.xcan.angus.core.ai.interfaces.prompt.facade;

import cloud.xcan.angus.core.ai.interfaces.prompt.facade.dto.PromptCreateDto;
import cloud.xcan.angus.core.ai.interfaces.prompt.facade.dto.PromptFindDto;
import cloud.xcan.angus.core.ai.interfaces.prompt.facade.dto.PromptUpdateDto;
import cloud.xcan.angus.core.ai.interfaces.prompt.facade.vo.PromptDetailVo;
import cloud.xcan.angus.core.ai.interfaces.prompt.facade.vo.PromptListVo;
import cloud.xcan.angus.remote.PageResult;

public interface PromptFacade {

  /**
   * 创建提示词
   */
  PromptDetailVo create(PromptCreateDto dto);

  /**
   * 更新提示词
   */
  PromptDetailVo update(Long id, PromptUpdateDto dto);

  /**
   * 删除提示词
   */
  void delete(Long id);

  /**
   * 获取提示词详情
   */
  PromptDetailVo getDetail(Long id);

  /**
   * 获取提示词列表
   */
  PageResult<PromptListVo> list(PromptFindDto dto);

  /**
   * 收藏/取消收藏
   */
  PromptDetailVo toggleFavorite(Long id, Boolean isFavorite);

  /**
   * 复制提示词
   */
  PromptDetailVo duplicate(Long id, String title);

  /**
   * 标记使用
   */
  PromptDetailVo use(Long id);

}
