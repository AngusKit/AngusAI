package cloud.xcan.angus.core.ai.interfaces.vector.facade.internal;

import static cloud.xcan.angus.core.jpa.criteria.SearchCriteriaBuilder.getMatchSearchFields;
import static cloud.xcan.angus.core.utils.CoreUtils.buildVoPageResult;

import cloud.xcan.angus.core.ai.application.cmd.vector.VectorStoreCmd;
import cloud.xcan.angus.core.ai.application.query.vector.VectorStoreQuery;
import cloud.xcan.angus.core.ai.domain.vector.VectorStore;
import cloud.xcan.angus.core.ai.interfaces.vector.facade.VectorStoreFacade;
import cloud.xcan.angus.core.ai.interfaces.vector.facade.dto.ConnectionTestDto;
import cloud.xcan.angus.core.ai.interfaces.vector.facade.dto.VectorStoreCreateDto;
import cloud.xcan.angus.core.ai.interfaces.vector.facade.dto.VectorStoreFindDto;
import cloud.xcan.angus.core.ai.interfaces.vector.facade.dto.VectorStoreUpdateDto;
import cloud.xcan.angus.core.ai.interfaces.vector.facade.internal.assembler.VectorStoreAssembler;
import cloud.xcan.angus.core.ai.interfaces.vector.facade.vo.ConnectionTestVo;
import cloud.xcan.angus.core.ai.interfaces.vector.facade.vo.VectorStoreStatisticsVo;
import cloud.xcan.angus.core.ai.interfaces.vector.facade.vo.VectorStoreVo;
import cloud.xcan.angus.core.jpa.criteria.GenericSpecification;
import cloud.xcan.angus.remote.PageResult;
import jakarta.annotation.Resource;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Component;

/**
 * 向量存储源门面服务实现
 */
@Component
public class VectorStoreFacadeImpl implements VectorStoreFacade {

  @Resource
  private VectorStoreCmd vectorStoreCmd;

  @Resource
  private VectorStoreQuery vectorStoreQuery;

  @Override
  public VectorStoreVo create(VectorStoreCreateDto dto) {
    VectorStore vectorStore = VectorStoreAssembler.toCreateDomain(dto);
    VectorStore saved = vectorStoreCmd.create(vectorStore);
    return VectorStoreAssembler.toVo(saved);
  }

  @Override
  public VectorStoreVo update(Long id, VectorStoreUpdateDto dto) {
    VectorStore vectorStore = VectorStoreAssembler.toUpdateDomain(id, dto);
    VectorStore saved = vectorStoreCmd.update(vectorStore);
    return VectorStoreAssembler.toVo(saved);
  }

  @Override
  public VectorStoreVo toggleEnabled(Long id, Boolean enabled) {
    VectorStore saved = vectorStoreCmd.toggleEnabled(id, enabled);
    return VectorStoreAssembler.toVo(saved);
  }

  @Override
  public ConnectionTestVo testConnection(Long id, ConnectionTestDto dto) {
    VectorStore vectorStore = vectorStoreCmd.testConnection(id, dto.getTimeout(), dto.getConfig());
    return VectorStoreAssembler.toConnectionTestVo(vectorStore);
  }

  @Override
  public void delete(Long id, Boolean force) {
    vectorStoreCmd.delete(id, force != null ? force : false);
  }

  @Override
  public VectorStoreVo getDetail(Long id) {
    VectorStore vectorStore = vectorStoreQuery.findAndCheck(id);
    return VectorStoreAssembler.toVo(vectorStore);
  }

  @Override
  public PageResult<VectorStoreVo> list(VectorStoreFindDto dto) {
    GenericSpecification<VectorStore> spec = VectorStoreAssembler.getSpecification(dto);
    Page<VectorStore> page = vectorStoreQuery.find(spec, dto.tranPage(),
        dto.fullTextSearch, getMatchSearchFields(dto.getClass()));
    return buildVoPageResult(page, VectorStoreAssembler::toVo);
  }

  @Override
  public VectorStoreStatisticsVo getStatistics() {
    return vectorStoreQuery.getStatistics();
  }
}
