package cloud.xcan.angus.core.ai.interfaces.apis.facade.internal.assembler;

import cloud.xcan.angus.core.ai.domain.apis.ApiSchema;
import cloud.xcan.angus.core.ai.interfaces.apis.facade.vo.ApiSchemaVo;

public class ApiSchemaAssembler {

  public static ApiSchemaVo toVo(ApiSchema apiSchema) {
    ApiSchemaVo vo = new ApiSchemaVo();
    vo.setId(apiSchema.getId());
    vo.setCollectionId(apiSchema.getCollectionId());
    vo.setOpenapi(apiSchema.getOpenapi());
    vo.setInfo(apiSchema.getInfo());
    vo.setExternalDocs(apiSchema.getExternalDocs());
    vo.setServers(apiSchema.getServers());
    vo.setSecurityRequirements(apiSchema.getSecurity());
    vo.setTags(apiSchema.getTags());
    vo.setSecurities(apiSchema.getSecurities());
    vo.setSpecVersion(apiSchema.getSpecVersion());
    return vo;
  }
}
