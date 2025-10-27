package cloud.xcan.angus.core.ai.infra.ai.vector;

import java.util.Map;

/**
 * 向量存储库接口
 * <p>
 * 定义了向量数据库的基本操作接口，包括文档的增删改查和相似性搜索
 */
public interface VectorStore {

  /**
   * 添加文档到向量存储库
   *
   * @param id       文档唯一标识符
   * @param vector   文档的向量表示
   * @param metadata 文档的元数据信息
   */
  void addDocument(String id, float[] vector, Map<String, Object> metadata);

  /**
   * 更新向量存储库中的文档
   *
   * @param id       文档唯一标识符
   * @param vector   更新后的向量表示
   * @param metadata 更新后的元数据信息
   */
  void updateDocument(String id, float[] vector, Map<String, Object> metadata);

  /**
   * 从向量存储库中删除文档
   *
   * @param id 要删除的文档唯一标识符
   */
  void deleteDocument(String id);

  /**
   * 执行相似性搜索
   *
   * @param queryVector 查询向量
   * @param topK        返回最相似的前K个结果
   * @return 搜索结果，包含相似文档的ID和相似度分数
   */
  Map<String, Object> searchSimilar(float[] queryVector, int topK);

  /**
   * 检查向量存储库是否已连接
   *
   * @return true 如果已连接，false 如果未连接
   */
  boolean isConnected();

  /**
   * 关闭向量存储库连接 释放相关资源
   */
  void close();
}
