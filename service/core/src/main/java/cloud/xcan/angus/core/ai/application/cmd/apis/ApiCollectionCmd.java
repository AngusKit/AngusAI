package cloud.xcan.angus.core.ai.application.cmd.apis;

import cloud.xcan.angus.core.ai.domain.apis.ApiCollection;
import cloud.xcan.angus.core.ai.domain.apis.ExportApiFormat;
import cloud.xcan.angus.core.ai.interfaces.apis.facade.dto.ApiCollectionImportDto;
import java.io.File;

/**
 * 接口集命令服务
 */
public interface ApiCollectionCmd {

  /**
   * 创建接口集
   */
  ApiCollection create(ApiCollection apiCollection);

  /**
   * 更新接口集
   */
  ApiCollection update(ApiCollection apiCollection);

  /**
   * 删除接口集
   */
  void delete(Long id, Boolean force);

  /**
   * 导入接口集
   */
  ApiCollection imports(Long id, ApiCollectionImportDto dto);

  /**
   * 导出OpenAPI规范
   */
  File export(Long id, ExportApiFormat format, Boolean includeDisabled);
}

