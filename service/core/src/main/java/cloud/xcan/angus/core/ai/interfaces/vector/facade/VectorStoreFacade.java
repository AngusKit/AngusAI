package cloud.xcan.angus.core.ai.interfaces.vector.facade;

import cloud.xcan.angus.core.ai.interfaces.vector.facade.dto.ConnectionTestDto;
import cloud.xcan.angus.core.ai.interfaces.vector.facade.dto.SyncDto;
import cloud.xcan.angus.core.ai.interfaces.vector.facade.dto.VectorStoreCreateDto;
import cloud.xcan.angus.core.ai.interfaces.vector.facade.dto.VectorStoreFindDto;
import cloud.xcan.angus.core.ai.interfaces.vector.facade.dto.VectorStoreUpdateDto;
import cloud.xcan.angus.core.ai.interfaces.vector.facade.vo.ConnectionTestVo;
import cloud.xcan.angus.core.ai.interfaces.vector.facade.vo.SyncTaskVo;
import cloud.xcan.angus.core.ai.interfaces.vector.facade.vo.VectorStoreListVo;
import cloud.xcan.angus.core.ai.interfaces.vector.facade.vo.VectorStoreStatisticsVo;
import cloud.xcan.angus.core.ai.interfaces.vector.facade.vo.VectorStoreVo;
import cloud.xcan.angus.remote.PageResult;

/**
 * 向量存储源门面服务接口
 */
public interface VectorStoreFacade {

  /**
   * 创建向量存储源
   */
  VectorStoreVo create(VectorStoreCreateDto dto);

  /**
   * 更新向量存储源
   */
  VectorStoreVo update(Long id, VectorStoreUpdateDto dto);

  /**
   * 删除向量存储源
   */
  void delete(Long id, Boolean force);

  /**
   * 切换启用状态
   */
  VectorStoreVo toggleEnabled(Long id, Boolean enabled);

  /**
   * 连接测试
   */
  ConnectionTestVo testConnection(Long id, ConnectionTestDto dto);

  /**
   * 获取存储源详情
   */
  VectorStoreVo getDetail(Long id);

  /**
   * 获取存储源列表
   */
  PageResult<VectorStoreListVo> list(VectorStoreFindDto dto);

  /**
   * 获取统计信息
   */
  VectorStoreStatisticsVo getStatistics();
}
