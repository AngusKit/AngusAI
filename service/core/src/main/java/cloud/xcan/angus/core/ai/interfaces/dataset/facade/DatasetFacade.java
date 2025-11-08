package cloud.xcan.angus.core.ai.interfaces.dataset.facade;

import cloud.xcan.angus.core.ai.domain.Visibility;
import cloud.xcan.angus.core.ai.interfaces.dataset.facade.dto.DataSourceUpdateDto;
import cloud.xcan.angus.core.ai.interfaces.dataset.facade.dto.DatasetCreateDto;
import cloud.xcan.angus.core.ai.interfaces.dataset.facade.dto.DatasetFindDto;
import cloud.xcan.angus.core.ai.interfaces.dataset.facade.dto.DatasetToggleDto;
import cloud.xcan.angus.core.ai.interfaces.dataset.facade.dto.DatasetUpdateDto;
import cloud.xcan.angus.core.ai.interfaces.dataset.facade.dto.DatasourceConnectionTestDto;
import cloud.xcan.angus.core.ai.interfaces.dataset.facade.vo.DatasetDetailVo;
import cloud.xcan.angus.core.ai.interfaces.dataset.facade.vo.DatasetListVo;
import cloud.xcan.angus.core.ai.interfaces.dataset.facade.vo.DatasetStatisticsVo;
import cloud.xcan.angus.core.ai.interfaces.dataset.facade.vo.DatasourceConfigVo;
import cloud.xcan.angus.core.ai.interfaces.dataset.facade.vo.DatasourceConnectionTestVo;
import cloud.xcan.angus.remote.PageResult;
import cloud.xcan.angus.remote.dto.SimpleStatisticsDto;

public interface DatasetFacade {

  /**
   * 创建数据集
   */
  DatasetDetailVo create(DatasetCreateDto dto);

  /**
   * 更新数据集基本信息
   */
  DatasetDetailVo update(Long id, DatasetUpdateDto dto);

  /**
   * 启用/禁用数据集
   */
  DatasetDetailVo toggle(Long id, DatasetToggleDto dto);

  /**
   * 修改数据集可见性
   */
  DatasetDetailVo modifyVisibility(Long id, Visibility visibility);

  /**
   * 添加数据源
   */
  DatasourceConfigVo modifyDataSource(Long id, DataSourceUpdateDto dto);

  /**
   * 测试数据源连接
   */
  DatasourceConnectionTestVo testDatasourceConnection(DatasourceConnectionTestDto dto);

  /**
   * 删除数据源
   */
  void deleteDataSource(Long id);

  /**
   * 删除数据集
   */
  void delete(Long id);

  /**
   * 获取数据集详情
   */
  DatasetDetailVo getDetail(Long id);

  /**
   * 获取数据集列表
   */
  PageResult<DatasetListVo> list(DatasetFindDto dto);

  /**
   * 获取数据集统计
   */
  DatasetStatisticsVo getStatistics(SimpleStatisticsDto dto);

}
