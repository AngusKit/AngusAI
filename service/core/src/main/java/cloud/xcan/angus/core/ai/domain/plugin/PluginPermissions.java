package cloud.xcan.angus.core.ai.domain.plugin;

import com.fasterxml.jackson.annotation.JsonInclude;
import java.io.Serializable;
import java.util.List;
import lombok.Data;

/**
 * 插件权限配置
 */
@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class PluginPermissions implements Serializable {

  /**
   * 需要的权限列表
   */
  private List<String> required;

  /**
   * 可选权限列表
   */
  private List<String> optional;

  /**
   * 访问范围
   */
  private List<String> scopes;

  /**
   * 数据访问权限
   */
  private DataAccess dataAccess;

  @Data
  public static class DataAccess {
    /**
     * 可读取的数据类型
     */
    private List<String> read;

    /**
     * 可写入的数据类型
     */
    private List<String> write;

    /**
     * 可删除的数据类型
     */
    private List<String> delete;
  }
}
