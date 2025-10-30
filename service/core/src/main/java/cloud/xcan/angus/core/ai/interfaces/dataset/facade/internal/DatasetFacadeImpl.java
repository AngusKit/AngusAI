package cloud.xcan.angus.core.ai.interfaces.dataset.facade.internal;

import static cloud.xcan.angus.core.jpa.criteria.SearchCriteriaBuilder.getMatchSearchFields;
import static cloud.xcan.angus.core.utils.CoreUtils.buildVoPageResult;

import cloud.xcan.angus.core.ai.application.cmd.dataset.DatasetCmd;
import cloud.xcan.angus.core.ai.application.query.dataset.DatasetQuery;
import cloud.xcan.angus.core.ai.domain.dataset.Dataset;
import cloud.xcan.angus.core.ai.domain.dataset.DatasetStatistics;
import cloud.xcan.angus.core.ai.infra.util.DatasourceUtils.ConnectionTestResult;
import cloud.xcan.angus.core.ai.interfaces.dataset.facade.DatasetFacade;
import cloud.xcan.angus.core.ai.interfaces.dataset.facade.dto.DataSourceUpdateDto;
import cloud.xcan.angus.core.ai.interfaces.dataset.facade.dto.DatasetCreateDto;
import cloud.xcan.angus.core.ai.interfaces.dataset.facade.dto.DatasetFindDto;
import cloud.xcan.angus.core.ai.interfaces.dataset.facade.dto.DatasetUpdateDto;
import cloud.xcan.angus.core.ai.interfaces.dataset.facade.dto.DatasourceConnectionTestDto;
import cloud.xcan.angus.core.ai.interfaces.dataset.facade.internal.assembler.DatasetAssembler;
import cloud.xcan.angus.core.ai.interfaces.dataset.facade.vo.DatasetDetailVo;
import cloud.xcan.angus.core.ai.interfaces.dataset.facade.vo.DatasetListVo;
import cloud.xcan.angus.core.ai.interfaces.dataset.facade.vo.DatasetStatisticsVo;
import cloud.xcan.angus.core.ai.interfaces.dataset.facade.vo.DatasourceConfigVo;
import cloud.xcan.angus.core.ai.interfaces.dataset.facade.vo.DatasourceConnectionTestVo;
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
  public DatasourceConfigVo modifyDataSource(Long id, DataSourceUpdateDto dto) {
    Dataset saved = datasetCmd.modifyDataSource(id,
        DatasetAssembler.toDatasourceConfig(dto));
    return DatasetAssembler.toDatasourceConfigVo(saved.getConfig());
  }

  @Override
  public DatasourceConnectionTestVo testDatasourceConnection(DatasourceConnectionTestDto dto) {
    ConnectionTestResult result = datasetCmd.testDatasourceConnection(dto.getDatasetId(),
        DatasetAssembler.toDatasourceConfig(dto));
    return DatasetAssembler.toConnectionTestResultVo(result);
  }

  @Override
  public void deleteDataSource(Long id) {
    datasetCmd.deleteDataSource(id);
  }

  @Override
  public void delete(Long id) {
    datasetCmd.delete(id);
  }

  @NameJoin
  @Override
  public DatasetDetailVo getDetail(Long id) {
    Dataset dataset = datasetQuery.findAndCheck(id);
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
  public DatasetStatisticsVo getStatistics(Long id) {
    DatasetStatistics stats = datasetQuery.getStatistics(id);
    return DatasetAssembler.toDatasetStatisticsVo(stats);
  }
}
