package cloud.xcan.core.knowledge;

import cloud.xcan.core.knowledge.retriever.CompositeContentRetriever;
import cloud.xcan.core.model.ModelProvider;
import cloud.xcan.core.model.ModelRegistry;
import cloud.xcan.core.vectorstore.VectorStoreRegistry;
import dev.langchain4j.data.segment.TextSegment;
import dev.langchain4j.model.embedding.EmbeddingModel;
import dev.langchain4j.rag.content.retriever.ContentRetriever;
import dev.langchain4j.rag.content.retriever.EmbeddingStoreContentRetriever;
import dev.langchain4j.store.embedding.EmbeddingStore;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * ContentRetriever 工厂 — 根据 knowledgeBaseIds 创建 RAG 检索器。
 * <p>
 * 约定：knowledgeBaseId 与 VectorStoreConfigProvider 中的配置 ID 对应， 即知识库 ID 作为向量存储配置 ID 使用。
 * </p>
 */
@Slf4j
@RequiredArgsConstructor
public class ContentRetrieverFactory {

  private final VectorStoreRegistry vectorStoreRegistry;
  private final ModelRegistry modelRegistry;

  /**
   * 根据知识库 ID 列表创建 ContentRetriever。
   *
   * @param knowledgeBaseIds  知识库 ID 列表（对应向量存储配置 ID）
   * @param embeddingProvider 用于检索的 Embedding 模型 provider（如 "openai"）
   * @param topK              每个知识库检索数量
   * @return ContentRetriever，若无法创建则返回 empty
   */
  public Optional<ContentRetriever> createContentRetriever(
      List<String> knowledgeBaseIds, ModelProvider embeddingProvider, int topK) {
    if (knowledgeBaseIds == null || knowledgeBaseIds.isEmpty()) {
      return Optional.empty();
    }

    EmbeddingModel embeddingModel = getEmbeddingModel(embeddingProvider);
    if (embeddingModel == null) {
      log.warn("No embedding model for provider: {}, RAG disabled", embeddingProvider);
      return Optional.empty();
    }

    List<ContentRetriever> retrievers = new ArrayList<>();
    for (String kbId : knowledgeBaseIds) {
      try {
        EmbeddingStore<TextSegment> store = vectorStoreRegistry.getStore(kbId);
        ContentRetriever retriever = EmbeddingStoreContentRetriever.builder()
            .embeddingStore(store)
            .embeddingModel(embeddingModel)
            .maxResults(topK)
            .build();
        retrievers.add(retriever);
      } catch (Exception e) {
        log.warn("Failed to create retriever for knowledge base {}: {}", kbId, e.getMessage());
      }
    }

    if (retrievers.isEmpty()) {
      return Optional.empty();
    }
    ContentRetriever composite = retrievers.size() == 1
        ? retrievers.get(0)
        : new CompositeContentRetriever(retrievers);
    return Optional.of(composite);
  }

  private EmbeddingModel getEmbeddingModel(ModelProvider provider) {
    return modelRegistry.getDefaultEmbeddingModel(provider).orElse(null);
  }
}
