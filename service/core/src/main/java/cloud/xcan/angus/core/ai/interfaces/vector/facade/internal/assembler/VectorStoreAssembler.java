package cloud.xcan.angus.core.ai.interfaces.vector.facade.internal.assembler;

import cloud.xcan.angus.core.ai.domain.ConnectionStatus;
import cloud.xcan.angus.core.ai.domain.vector.VectorStore;
import cloud.xcan.angus.core.ai.interfaces.vector.facade.dto.VectorStoreCreateDto;
import cloud.xcan.angus.core.ai.interfaces.vector.facade.dto.VectorStoreFindDto;
import cloud.xcan.angus.core.ai.interfaces.vector.facade.dto.VectorStoreUpdateDto;
import cloud.xcan.angus.core.ai.interfaces.vector.facade.vo.ConnectionTestVo;
import cloud.xcan.angus.core.ai.interfaces.vector.facade.vo.ConnectionTestVo.TestDetails;
import cloud.xcan.angus.core.ai.interfaces.vector.facade.vo.VectorStoreVo;
import cloud.xcan.angus.core.jpa.criteria.GenericSpecification;
import cloud.xcan.angus.core.jpa.criteria.SearchCriteriaBuilder;
import cloud.xcan.angus.remote.search.SearchCriteria;
import java.util.Set;

public class VectorStoreAssembler {

  public static VectorStore toCreateDomain(VectorStoreCreateDto dto) {
    VectorStore vectorStore = new VectorStore();
    vectorStore.setName(dto.getName());
    vectorStore.setType(dto.getType());
    vectorStore.setDescription(dto.getDescription());
    vectorStore.setConfig(dto.getConfig());

    // 设置默认值
    vectorStore.setStatus(ConnectionStatus.DISCONNECTED);
    vectorStore.setEnabled(true);
    vectorStore.setIndexCount(0L);
    return vectorStore;
  }

  public static VectorStore toUpdateDomain(Long id, VectorStoreUpdateDto dto) {
    VectorStore vectorStore = new VectorStore();
    vectorStore.setId(id);
    vectorStore.setName(dto.getName());
    vectorStore.setDescription(dto.getDescription());
    vectorStore.setConfig(dto.getConfig());
    return vectorStore;
  }

  public static VectorStoreVo toVo(VectorStore vectorStore) {
    VectorStoreVo vo = new VectorStoreVo();
    vo.setId(vectorStore.getId());
    vo.setName(vectorStore.getName());
    vo.setType(vectorStore.getType());
    vo.setDescription(vectorStore.getDescription());
    vo.setStatus(vectorStore.getStatus());
    vo.setEnabled(vectorStore.getEnabled());
    vo.setIndexCount(vectorStore.getIndexCount());
    vo.setConfig(vectorStore.getConfig());

    // 设置审计信息
    vo.setTenantId(vectorStore.getTenantId());
    vo.setCreatedBy(vectorStore.getCreatedBy());
    vo.setCreatedDate(vectorStore.getCreatedDate());
    vo.setModifiedBy(vectorStore.getModifiedBy());
    vo.setModifiedDate(vectorStore.getModifiedDate());
    return vo;
  }

  public static ConnectionTestVo toConnectionTestVo(VectorStore vectorStore) {
    ConnectionTestVo vo = new ConnectionTestVo();
    vo.setSuccess(vectorStore.isTestConnectionSuccess());
    vo.setStatus(vectorStore.getStatus());
    vo.setMessage(vectorStore.getTestConnectionMessage());

    TestDetails details = new TestDetails();
    details.setIndexCount(vectorStore.getIndexCount());
    details.setDimension(vectorStore.getDimension());
    details.setResponseTime(vectorStore.getResponseTime());
    details.setVersion(vectorStore.getVersion());
    vo.setTestDetails(details);
    return vo;
  }

  public static GenericSpecification<VectorStore> getSpecification(VectorStoreFindDto dto) {
    Set<SearchCriteria> filters = new SearchCriteriaBuilder<>(dto)
        .rangeSearchFields("id", "createdDate")
        .matchSearchFields("name", "description")
        .inAndNotFields("type", "status", "enabled")
        .orderByFields("id", "name", "createdDate", "status", "type")
        .build();
    return new GenericSpecification<>(filters);
  }
}

