package cloud.xcan.core.knowledge.retriever;

import dev.langchain4j.rag.content.Content;
import dev.langchain4j.rag.content.retriever.ContentRetriever;
import dev.langchain4j.rag.query.Query;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * 复合检索器 — 合并多个 ContentRetriever 的检索结果，去重并按相关性排序。
 */
@Slf4j
@RequiredArgsConstructor
public class CompositeContentRetriever implements ContentRetriever {

  private final List<ContentRetriever> retrievers;

  @Override
  public List<Content> retrieve(Query query) {
    if (retrievers == null || retrievers.isEmpty()) {
      return List.of();
    }
    Map<String, Content> contentMap = new LinkedHashMap<>();
    Map<String, Double> scores = new LinkedHashMap<>();

    for (ContentRetriever retriever : retrievers) {
      try {
        List<Content> results = retriever.retrieve(query);
        for (int i = 0; i < results.size(); i++) {
          Content c = results.get(i);
          String key = c.textSegment().text();
          double weight = 1.0 / (i + 1);
          scores.merge(key, weight, Double::sum);
          contentMap.putIfAbsent(key, c);
        }
      } catch (Exception e) {
        log.warn("Retriever failed: {}", e.getMessage());
      }
    }

    return scores.entrySet().stream()
        .sorted(Map.Entry.<String, Double>comparingByValue().reversed())
        .map(e -> contentMap.get(e.getKey()))
        .collect(Collectors.toList());
  }
}
