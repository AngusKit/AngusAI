package cloud.xcan.angus.core.ai.application.cmd.apis.impl;

import static cloud.xcan.angus.spec.utils.ObjectUtils.nullSafe;

import cloud.xcan.angus.core.ai.application.cmd.apis.ApiEndpointCmd;
import cloud.xcan.angus.core.ai.application.converter.ApiEndpointConverter;
import cloud.xcan.angus.core.ai.application.query.apis.ApiEndpointQuery;
import cloud.xcan.angus.core.ai.domain.apis.ApiEndpoint;
import cloud.xcan.angus.core.ai.domain.apis.ApiEndpointRepo;
import cloud.xcan.angus.core.biz.BizTemplate;
import cloud.xcan.angus.core.biz.cmd.CommCmd;
import cloud.xcan.angus.core.jpa.repository.BaseRepository;
import cloud.xcan.angus.remote.message.http.ResourceExisted;
import io.swagger.v3.oas.models.PathItem.HttpMethod;
import jakarta.annotation.Resource;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Map;
import java.util.Set;
import org.springframework.stereotype.Service;

/**
 * 接口端点命令服务实现
 */
@Service
public class ApiEndpointCmdImpl extends CommCmd<ApiEndpoint, Long> implements ApiEndpointCmd {

  @Resource
  private ApiEndpointRepo apiEndpointRepo;

  @Resource
  private ApiEndpointQuery apiEndpointQuery;

  @Override
  public ApiEndpoint create(ApiEndpoint apiEndpoint) {
    return new BizTemplate<ApiEndpoint>() {
      @Override
      protected void checkParams() {
        // 检查同一集合下是否存在相同方法和路径的端点
        boolean exists = apiEndpointRepo.existsByCollectionIdAndMethodAndPath(
            apiEndpoint.getCollectionId(), apiEndpoint.getMethod(), apiEndpoint.getPath());
        if (exists) {
          throw ResourceExisted.of("端点「{0} {1}」已存在",
              new Object[]{apiEndpoint.getMethod(), apiEndpoint.getPath()});
        }
      }

      @Override
      protected ApiEndpoint process() {
        insert(apiEndpoint);
        return apiEndpoint;
      }
    }.execute();
  }

  @Override
  public ApiEndpoint update(ApiEndpoint apiEndpoint) {
    return new BizTemplate<ApiEndpoint>() {
      ApiEndpoint apiEndpointDb;

      @Override
      protected void checkParams() {
        // 检查端点是否存在
        apiEndpointDb = apiEndpointQuery.findAndCheck(apiEndpoint.getId());

        // 检查同一集合下是否存在相同方法和路径的端点（排除自己）
        String actualPath = nullSafe(apiEndpoint.getPath(), apiEndpointDb.getPath());
        HttpMethod actualMethod = nullSafe(apiEndpoint.getMethod(), apiEndpointDb.getMethod());
        boolean exists = apiEndpointRepo.existsByCollectionIdAndMethodAndPathAndIdNot(
            apiEndpointDb.getCollectionId(), actualMethod, actualPath, apiEndpoint.getId());
        if (exists) {
          throw ResourceExisted.of("端点「{0} {1}」已存在",
              new Object[]{actualMethod, actualPath});
        }
      }

      @Override
      protected ApiEndpoint process() {
        update(apiEndpoint, apiEndpointDb);
        return apiEndpointDb;
      }
    }.execute();
  }

  @Override
  public ApiEndpoint toggleEnabled(Long id, Boolean enabled) {
    return new BizTemplate<ApiEndpoint>() {
      ApiEndpoint apiEndpointDb;

      @Override
      protected void checkParams() {
        apiEndpointDb = apiEndpointQuery.findAndCheck(id);
      }

      @Override
      protected ApiEndpoint process() {
        apiEndpointDb.setEnabled(enabled);
        return apiEndpointRepo.save(apiEndpointDb);
      }
    }.execute();
  }

  @Override
  public void delete(Long id) {
    new BizTemplate<Void>() {
      @Override
      protected void checkParams() {
        apiEndpointQuery.findAndCheck(id);
      }

      @Override
      protected Void process() {
        apiEndpointRepo.deleteById(id);
        return null;
      }
    }.execute();
  }

  @Override
  public void add(Collection<ApiEndpoint> newApis) {
    batchInsert(newApis);
  }

  @Override
  public void updateSyncApis(Map<String, ApiEndpoint> updatedApisDbMap,
      Map<String, ApiEndpoint> openApisMap) {
    for (String uniqueKey : updatedApisDbMap.keySet()) {
      ApiEndpointConverter.assembleSchemaToUpdateApis(updatedApisDbMap.get(uniqueKey),
          openApisMap.get(uniqueKey));
    }
    batchUpdate0(updatedApisDbMap.values());
  }

  @Override
  public void deleteByCollectionId(Long id) {
    apiEndpointRepo.deleteByCollectionId(id);
  }

  @Override
  public void deleteByIds(Set<Long> ids) {
    apiEndpointRepo.deleteAllById(ids);
  }

  @Override
  protected BaseRepository<ApiEndpoint, Long> getRepository() {
    return this.apiEndpointRepo;
  }
}

