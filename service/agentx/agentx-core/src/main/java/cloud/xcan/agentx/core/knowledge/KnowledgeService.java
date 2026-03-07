package cloud.xcan.agentx.core.knowledge;

import cloud.xcan.agentx.core.knowledge.splitter.DocumentSplitter;
import dev.langchain4j.data.segment.TextSegment;
import dev.langchain4j.model.embedding.EmbeddingModel;
import dev.langchain4j.store.embedding.EmbeddingStore;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * 知识库服务 — 文档导入、分块、向量化、存储
 */
@Slf4j
@RequiredArgsConstructor
public class KnowledgeService {

  private final EmbeddingModel embeddingModel;
  private final EmbeddingStore<TextSegment> embeddingStore;

  /**
   * 导入文档到知识库
   */
  public int ingestDocument(String text, int chunkSize, int overlap) {
    List<String> chunks = DocumentSplitter.fixedSize(text, chunkSize, overlap);
    log.info("Document split into {} chunks", chunks.size());

    List<TextSegment> segments = chunks.stream()
        .map(TextSegment::from)
        .toList();

    var embeddings = embeddingModel.embedAll(segments).content();
    embeddingStore.addAll(embeddings, segments);

    log.info("Stored {} embeddings", embeddings.size());
    return embeddings.size();
  }

  /**
   * 导入 Markdown 文档
   */
  public int ingestMarkdown(String markdownText) {
    List<String> chunks = DocumentSplitter.byMarkdownHeaders(markdownText);
    log.info("Markdown split into {} sections", chunks.size());

    List<TextSegment> segments = chunks.stream()
        .map(TextSegment::from)
        .toList();

    var embeddings = embeddingModel.embedAll(segments).content();
    embeddingStore.addAll(embeddings, segments);

    return embeddings.size();
  }
}
