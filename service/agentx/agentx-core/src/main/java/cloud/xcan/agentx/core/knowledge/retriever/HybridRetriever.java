package cloud.xcan.agentx.core.knowledge.retriever;

import dev.langchain4j.rag.content.Content;
import dev.langchain4j.rag.content.retriever.ContentRetriever;
import dev.langchain4j.rag.query.Query;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import lombok.Builder;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * 混合检索器 — 向量语义检索 + BM25 全文检索 + 融合打分
 */
@Slf4j
@RequiredArgsConstructor
@Builder
public class HybridRetriever implements ContentRetriever {

  private final ContentRetriever vectorRetriever;
  private final ContentRetriever fullTextRetriever;

  /**
   * 向量检索权重 (0-1)
   */
  @Builder.Default
  private final double vectorWeight = 0.7;

  /**
   * 全文检索权重 (0-1)
   */
  @Builder.Default
  private final double fullTextWeight = 0.3;

  @Override
  public List<Content> retrieve(Query query) {
    log.debug("Hybrid retrieval: query='{}'", query.text());

    // 并行执行两种检索
    List<Content> vectorResults =
        vectorRetriever != null ? vectorRetriever.retrieve(query) : List.of();
    List<Content> fullTextResults =
        fullTextRetriever != null ? fullTextRetriever.retrieve(query) : List.of();

    // RRF (Reciprocal Rank Fusion) 融合
    Map<String, Double> scores = new LinkedHashMap<>();
    Map<String, Content> contentMap = new LinkedHashMap<>();

    for (int i = 0; i < vectorResults.size(); i++) {
      Content c = vectorResults.get(i);
      String key = c.textSegment().text();
      scores.merge(key, vectorWeight / (i + 1), Double::sum);
      contentMap.putIfAbsent(key, c);
    }

    for (int i = 0; i < fullTextResults.size(); i++) {
      Content c = fullTextResults.get(i);
      String key = c.textSegment().text();
      scores.merge(key, fullTextWeight / (i + 1), Double::sum);
      contentMap.putIfAbsent(key, c);
    }

    return scores.entrySet().stream()
        .sorted(Map.Entry.<String, Double>comparingByValue().reversed())
        .map(e -> contentMap.get(e.getKey()))
        .collect(Collectors.toList());
  }
}
