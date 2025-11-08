package cloud.xcan.angus.core.ai.interfaces.apis.facade;

import cloud.xcan.angus.core.ai.interfaces.apis.facade.dto.ApiCollectionCreateDto;
import cloud.xcan.angus.core.ai.interfaces.apis.facade.dto.ApiCollectionFindDto;
import cloud.xcan.angus.core.ai.interfaces.apis.facade.dto.ApiCollectionImportDto;
import cloud.xcan.angus.core.ai.interfaces.apis.facade.dto.ApiCollectionUpdateDto;
import cloud.xcan.angus.core.ai.interfaces.apis.facade.vo.ApiCollectionDetailVo;
import cloud.xcan.angus.core.ai.interfaces.apis.facade.vo.ApiCollectionImportVo;
import cloud.xcan.angus.core.ai.interfaces.apis.facade.vo.ApiCollectionListVo;
import cloud.xcan.angus.core.ai.interfaces.apis.facade.vo.ApiCollectionStatisticsVo;
import cloud.xcan.angus.remote.PageResult;
import cloud.xcan.angus.remote.dto.SimpleStatisticsDto;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.core.io.Resource;
import org.springframework.http.ResponseEntity;

/**
 * 接口集门面服务接口
 */
public interface ApiCollectionFacade {

  /**
   * 创建接口集
   */
  ApiCollectionDetailVo create(ApiCollectionCreateDto dto);

  /**
   * 更新接口集
   */
  ApiCollectionDetailVo update(Long id, ApiCollectionUpdateDto dto);

  /**
   * 删除接口集
   */
  void delete(Long id, Boolean force);

  /**
   * 获取接口集详情
   */
  ApiCollectionDetailVo getDetail(Long id);

  /**
   * 获取接口集列表
   */
  PageResult<ApiCollectionListVo> list(ApiCollectionFindDto dto);

  /**
   * 获取接口集统计数据
   */
  ApiCollectionStatisticsVo getStatistics(SimpleStatisticsDto dto);

  /**
   * 导入接口集
   */
  ApiCollectionImportVo importCollection(ApiCollectionImportDto dto);

  /**
   * 导出OpenAPI规范
   */
  ResponseEntity<Resource> exportOpenApi(Long id, String format, Boolean includeDisabled,
      HttpServletResponse response);

}

