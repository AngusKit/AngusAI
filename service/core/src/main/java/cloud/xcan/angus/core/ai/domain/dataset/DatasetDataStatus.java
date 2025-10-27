package cloud.xcan.angus.core.ai.domain.dataset;

import cloud.xcan.angus.spec.experimental.EndpointRegister;
import cloud.xcan.angus.spec.locale.EnumMessage;

@EndpointRegister
public enum DatasetDataStatus implements EnumMessage<String> {
  UPLOADING, // 上传中
  PROCESSING, // 处理中
  COMPLETED, // 已完成
  FAILED; // 处理失败

  public String getValue() {
    return this.name();
  }
}
