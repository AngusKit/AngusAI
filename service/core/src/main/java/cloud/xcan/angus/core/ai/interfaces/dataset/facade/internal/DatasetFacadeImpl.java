package cloud.xcan.angus.core.ai.interfaces.dataset.facade.internal;

import static cloud.xcan.angus.core.jpa.criteria.SearchCriteriaBuilder.getMatchSearchFields;
import static cloud.xcan.angus.core.utils.CoreUtils.buildVoPageResult;

import cloud.xcan.angus.core.ai.application.cmd.dataset.DatasetCmd;
import cloud.xcan.angus.core.ai.application.query.dataset.DatasetQuery;
import cloud.xcan.angus.core.ai.domain.dataset.Dataset;
import cloud.xcan.angus.core.ai.domain.dataset.DatasetConfig;
import cloud.xcan.angus.core.ai.interfaces.dataset.facade.DatasetFacade;
import cloud.xcan.angus.core.ai.interfaces.dataset.facade.dto.DatasetCreateDto;
import cloud.xcan.angus.core.ai.interfaces.dataset.facade.dto.DatasetFindDto;
import cloud.xcan.angus.core.ai.interfaces.dataset.facade.dto.DatasetUpdateDto;
import cloud.xcan.angus.core.ai.interfaces.dataset.facade.dto.DataUploadDto;
import cloud.xcan.angus.core.ai.interfaces.dataset.facade.dto.BatchDeleteDto;
import cloud.xcan.angus.core.ai.interfaces.dataset.facade.internal.assembler.DatasetAssembler;
import cloud.xcan.angus.core.ai.interfaces.dataset.facade.vo.DatasetDetailVo;
import cloud.xcan.angus.core.ai.interfaces.dataset.facade.vo.DatasetListVo;
import cloud.xcan.angus.core.ai.interfaces.dataset.facade.vo.DatasetStatisticsVo;
import cloud.xcan.angus.core.ai.interfaces.dataset.facade.vo.DataPreviewVo;
import cloud.xcan.angus.core.ai.interfaces.dataset.facade.vo.UploadResultVo;
import cloud.xcan.angus.core.biz.NameJoin;
import cloud.xcan.angus.core.jpa.criteria.GenericSpecification;
import cloud.xcan.angus.remote.PageResult;
import jakarta.annotation.Resource;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Component;

@Component
public class DatasetFacadeImpl implements DatasetFacade {

  @Resource
  private DatasetQuery datasetQuery;

  @Resource
  private DatasetCmd datasetCmd;

  @Override
  public DatasetDetailVo create(DatasetCreateDto dto) {
    Dataset dataset = DatasetAssembler.toDomain(dto);
    Dataset saved = datasetCmd.create(dataset);
    return DatasetAssembler.toDetailVo(saved);
  }

  @Override
  public DatasetDetailVo update(Long id, DatasetUpdateDto dto) {
    Dataset dataset = DatasetAssembler.updateDomain(id, dto);
    Dataset saved = datasetCmd.update(dataset);
    return DatasetAssembler.toDetailVo(saved);
  }

  @Override
  public DatasetDetailVo updateConfig(Long id, DatasetConfig config) {
    Dataset saved = datasetCmd.updateConfig(id, config);
    return DatasetAssembler.toDetailVo(saved);
  }

  @Override
  public void delete(Long id) {
    datasetCmd.delete(id);
  }

  @NameJoin
  @Override
  public DatasetDetailVo getDetail(Long id) {
    Dataset dataset = datasetQuery.findById(id);
    return DatasetAssembler.toDetailVo(dataset);
  }

  @NameJoin
  @Override
  public PageResult<DatasetListVo> list(DatasetFindDto dto) {
    GenericSpecification<Dataset> spec = DatasetAssembler.getSpecification(dto);
    Page<Dataset> page = datasetQuery.find(spec, dto.tranPage(),
        dto.fullTextSearch, getMatchSearchFields(dto.getClass()));
    return buildVoPageResult(page, DatasetAssembler::toListVo);
  }

  @Override
  public UploadResultVo uploadData(Long id, DataUploadDto dto) {
    // 这里应该调用数据上传服务
    // 暂时返回模拟数据
    UploadResultVo result = new UploadResultVo();
    // TODO: 实现数据上传逻辑
    return result;
  }

  @Override
  public DataPreviewVo previewData(Long id, Integer pageNo, Integer pageSize, Long sourceId) {
    // 这里应该调用数据预览服务
    // 暂时返回模拟数据
    DataPreviewVo result = new DataPreviewVo();
    // TODO: 实现数据预览逻辑
    return result;
  }

  @Override
  public String exportData(Long id, String format, Long sourceId) {
    // 这里应该调用数据导出服务
    // 暂时返回模拟数据
    return datasetCmd.exportData(id, format, sourceId);
  }

  @Override
  public DatasetStatisticsVo getStatistics() {
    // 这里应该调用统计服务获取详细数据
    // 暂时返回模拟数据
    DatasetStatisticsVo statistics = new DatasetStatisticsVo();
    // TODO: 实现统计逻辑
    return statistics;
  }

  @Override
  public DatasetStatisticsVo batchDeleteData(Long id, BatchDeleteDto dto) {
    // 这里应该调用批量删除服务
    // 暂时返回模拟数据
    DatasetStatisticsVo result = new DatasetStatisticsVo();
    // TODO: 实现批量删除逻辑
    return result;
  }
}
