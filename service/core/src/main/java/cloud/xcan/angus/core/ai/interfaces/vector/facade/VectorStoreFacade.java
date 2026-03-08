package cloud.xcan.angus.core.ai.interfaces.vector.facade;

import cloud.xcan.agentx.core.vectorstore.VectorStoreType;
import cloud.xcan.angus.core.ai.interfaces.vector.facade.dto.VectorStoreConnectionTestDto;
import cloud.xcan.angus.core.ai.interfaces.vector.facade.dto.VectorStoreCreateDto;
import cloud.xcan.angus.core.ai.interfaces.vector.facade.dto.VectorStoreFindDto;
import cloud.xcan.angus.core.ai.interfaces.vector.facade.dto.VectorStoreUpdateDto;
import cloud.xcan.angus.core.ai.interfaces.vector.facade.vo.ConnectionTestVo;
import cloud.xcan.angus.core.ai.interfaces.vector.facade.vo.VectorStoreStatisticsVo;
import cloud.xcan.angus.core.ai.interfaces.vector.facade.vo.VectorStoreVo;
import cloud.xcan.angus.remote.PageResult;
import cloud.xcan.angus.remote.dto.SimpleStatisticsDto;
import java.util.List;

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
  ConnectionTestVo testConnection(Long id, VectorStoreConnectionTestDto dto);

  /**
   * 获取存储源详情
   */
  VectorStoreVo getDetail(Long id);

  /**
   * 获取存储源列表
   */
  PageResult<VectorStoreVo> list(VectorStoreFindDto dto);

  /**
   * 获取支持的向量存储类型
   * <p>
   * 基于当前运行时已注册的 VectorStoreFactory 返回支持的类型列表。
   * </p>
   */
  List<VectorStoreType> getSupportedTypes();

  /**
   * 获取统计信息
   */
  VectorStoreStatisticsVo getStatistics(SimpleStatisticsDto dto);

}
