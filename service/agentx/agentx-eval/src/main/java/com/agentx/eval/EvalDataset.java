package com.agentx.eval;

import java.util.List;
import lombok.Data;

/**
 * 评估数据集 —— 包含多条测试用例
 */
@Data
public class EvalDataset {

  private String name;
  private String description;
  private List<EvalCase> cases;

  @Data
  public static class EvalCase {

    private String id;
    private String input;
    private String expectedOutput;
    private String category;
  }
}
