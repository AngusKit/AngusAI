package cloud.xcan.angus.core.ai.interfaces.knowledgebase.facade;

import cloud.xcan.angus.core.ai.domain.Visibility;
import cloud.xcan.angus.core.ai.interfaces.knowledgebase.facade.dto.KnowledgeBaseCreateDto;
import cloud.xcan.angus.core.ai.interfaces.knowledgebase.facade.dto.KnowledgeBaseFindDto;
import cloud.xcan.angus.core.ai.interfaces.knowledgebase.facade.dto.KnowledgeBaseToggleDto;
import cloud.xcan.angus.core.ai.interfaces.knowledgebase.facade.dto.KnowledgeBaseUpdateDto;
import cloud.xcan.angus.core.ai.interfaces.knowledgebase.facade.vo.KnowledgeBaseDetailVo;
import cloud.xcan.angus.core.ai.interfaces.knowledgebase.facade.vo.KnowledgeBaseListVo;
import cloud.xcan.angus.remote.PageResult;

public interface KnowledgeBaseFacade {

  /**
   * 创建知识库
   */
  KnowledgeBaseDetailVo create(KnowledgeBaseCreateDto dto);

  /**
   * 更新知识库
   */
  KnowledgeBaseDetailVo update(Long id, KnowledgeBaseUpdateDto dto);

  /**
   * 修改知识库状态
   */
  KnowledgeBaseDetailVo toggle(Long id, KnowledgeBaseToggleDto dto);

  /**
   * 修改知识库可见性
   */
  KnowledgeBaseDetailVo modifyVisibility(Long id, Visibility visibility);

  /**
   * 删除知识库
   */
  void delete(Long id);

  /**
   * 获取知识库详情
   */
  KnowledgeBaseDetailVo getDetail(Long id);

  /**
   * 获取知识库列表
   */
  PageResult<KnowledgeBaseListVo> list(KnowledgeBaseFindDto dto);

}
