package cloud.xcan.angus.core.ai.application.cmd.vector;

import cloud.xcan.agentx.core.vectorstore.VectorStoreConfigDefinition;
import cloud.xcan.angus.core.ai.domain.vector.VectorStore;

/**
 * 向量存储源命令服务
 */
public interface VectorStoreCmd {

  /**
   * 创建向量存储源
   */
  VectorStore create(VectorStore vectorStore);

  /**
   * 更新向量存储源
   */
  VectorStore update(VectorStore vectorStore);

  /**
   * 切换启用状态
   */
  VectorStore toggleEnabled(Long id, Boolean enabled);

  /**
   * 连接测试
   */
  VectorStore testConnection(Long id, Integer timeout, VectorStoreConfigDefinition config);

  /**
   * 删除向量存储源
   */
  void delete(Long id, Boolean force);

}
