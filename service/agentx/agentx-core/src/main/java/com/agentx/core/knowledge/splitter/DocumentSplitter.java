package com.agentx.core.knowledge.splitter;

import lombok.Builder;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;

/**
 * 文档分块器 — 支持多种分块策略
 */
public class DocumentSplitter {

  /**
   * 固定大小分块
   */
  public static List<String> fixedSize(String text, int chunkSize, int overlap) {
    List<String> chunks = new ArrayList<>();
    int start = 0;
    while (start < text.length()) {
      int end = Math.min(start + chunkSize, text.length());
      chunks.add(text.substring(start, end));
      start = end - overlap;
        if (start >= text.length()) {
            break;
        }
    }
    return chunks;
  }

  /**
   * 递归字符分块 — 按分隔符层级递归分割
   */
  public static List<String> recursive(String text, int chunkSize, List<String> separators) {
    if (separators == null || separators.isEmpty()) {
      return fixedSize(text, chunkSize, 0);
    }

    List<String> chunks = new ArrayList<>();
    String separator = separators.get(0);
    String[] parts = text.split(java.util.regex.Pattern.quote(separator), -1);

    StringBuilder current = new StringBuilder();
    for (String part : parts) {
      if (current.length() + part.length() + separator.length() > chunkSize && !current.isEmpty()) {
        chunks.add(current.toString().trim());
        current = new StringBuilder();
      }
      if (!current.isEmpty()) {
        current.append(separator);
      }
      current.append(part);
    }
    if (!current.isEmpty()) {
      chunks.add(current.toString().trim());
    }

    // 对超长 chunk 递归使用下一级分隔符
    if (separators.size() > 1) {
      List<String> refined = new ArrayList<>();
      for (String chunk : chunks) {
        if (chunk.length() > chunkSize) {
          refined.addAll(recursive(chunk, chunkSize, separators.subList(1, separators.size())));
        } else {
          refined.add(chunk);
        }
      }
      return refined;
    }

    return chunks;
  }

  /**
   * 按标题分块（Markdown）
   */
  public static List<String> byMarkdownHeaders(String text) {
    List<String> chunks = new ArrayList<>();
    String[] lines = text.split("\n");
    StringBuilder current = new StringBuilder();

    for (String line : lines) {
      if (line.startsWith("#") && !current.isEmpty()) {
        chunks.add(current.toString().trim());
        current = new StringBuilder();
      }
      current.append(line).append("\n");
    }
    if (!current.isEmpty()) {
      chunks.add(current.toString().trim());
    }
    return chunks;
  }
}
