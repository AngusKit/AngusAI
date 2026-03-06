package cloud.xcan.core.workflow.validation;

import java.util.ArrayList;
import java.util.List;
import lombok.Data;

/**
 * 工作流验证结果
 */
@Data
public class ValidationResult {

  private final List<ValidationIssue> issues = new ArrayList<>();

  public boolean isValid() {
    return issues.stream().noneMatch(i -> i.getSeverity() == ValidationIssue.Severity.ERROR);
  }

  public void addError(String nodeId, String code, String message) {
    issues.add(ValidationIssue.builder()
        .severity(ValidationIssue.Severity.ERROR)
        .nodeId(nodeId).code(code).message(message).build());
  }

  public void addWarning(String nodeId, String code, String message) {
    issues.add(ValidationIssue.builder()
        .severity(ValidationIssue.Severity.WARNING)
        .nodeId(nodeId).code(code).message(message).build());
  }

  public void addInfo(String nodeId, String code, String message) {
    issues.add(ValidationIssue.builder()
        .severity(ValidationIssue.Severity.INFO)
        .nodeId(nodeId).code(code).message(message).build());
  }

  public List<ValidationIssue> getErrors() {
    return issues.stream()
        .filter(i -> i.getSeverity() == ValidationIssue.Severity.ERROR).toList();
  }

  public List<ValidationIssue> getWarnings() {
    return issues.stream()
        .filter(i -> i.getSeverity() == ValidationIssue.Severity.WARNING).toList();
  }
}
