package cloud.xcan.angus.core.ai.application.cmd.apis;

import static cloud.xcan.angus.spec.utils.ObjectUtils.nullSafe;

import cloud.xcan.angus.core.ai.application.query.apis.ApiCollectionQuery;
import cloud.xcan.angus.core.ai.domain.apis.ApiCollection;
import cloud.xcan.angus.core.ai.domain.apis.ApiCollectionRepo;
import cloud.xcan.angus.core.ai.interfaces.apis.facade.dto.ApiCollectionImportDto;
import cloud.xcan.angus.core.ai.interfaces.apis.facade.dto.SecurityConfigDto;
import cloud.xcan.angus.core.biz.BizTemplate;
import cloud.xcan.angus.core.biz.cmd.CommCmd;
import cloud.xcan.angus.core.jpa.repository.BaseRepository;
import cloud.xcan.angus.core.utils.CoreUtils;
import cloud.xcan.angus.remote.message.ProtocolException;
import cloud.xcan.angus.remote.message.http.ResourceExisted;
import jakarta.annotation.Resource;
import java.util.HashMap;
import java.util.Map;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

/**
 * 接口集命令服务实现
 */
@Service
public class ApiCollectionCmdImpl extends CommCmd<ApiCollection, Long> implements ApiCollectionCmd {

  @Resource
  private ApiCollectionRepo apiCollectionRepo;

  @Resource
  private ApiCollectionQuery apiCollectionQuery;

  @Override
  public ApiCollection create(ApiCollection apiCollection) {
    return new BizTemplate<ApiCollection>() {
      @Override
      protected void checkParams() {
        // 检查名称是否重复
        boolean exists = apiCollectionRepo.existsByName(apiCollection.getName());
        if (exists) {
          throw ResourceExisted.of("接口集名称「{0}」已存在", new Object[]{apiCollection.getName()});
        }
      }

      @Override
      protected ApiCollection process() {
        // 设置默认来源为手动创建
        if (apiCollection.getSource() == null) {
          apiCollection.setSource(cloud.xcan.angus.core.ai.domain.apis.ApiCollectionSource.MANUAL);
        }
        insert(apiCollection);
        return apiCollection;
      }
    }.execute();
  }

  @Override
  public ApiCollection update(ApiCollection apiCollection) {
    return new BizTemplate<ApiCollection>() {
      ApiCollection apiCollectionDb;

      @Override
      protected void checkParams() {
        // 检查接口集是否存在
        apiCollectionDb = apiCollectionQuery.findAndCheck(apiCollection.getId());

        // 检查名称是否重复（排除自己）
        String actualName = nullSafe(apiCollection.getName(), apiCollectionDb.getName());
        boolean exists = apiCollectionRepo.existsByNameAndIdNot(actualName, apiCollection.getId());
        if (exists) {
          throw ResourceExisted.of("接口集名称「{0}」已存在", new Object[]{actualName});
        }
      }

      @Override
      protected ApiCollection process() {
        CoreUtils.copyPropertiesIgnoreNull(apiCollection, apiCollectionDb);
        return apiCollectionRepo.save(apiCollectionDb);
      }
    }.execute();
  }

  @Override
  public void delete(Long id, Boolean force) {
    new BizTemplate<Void>() {
      @Override
      protected void checkParams() {
        // 检查接口集是否存在
        apiCollectionQuery.findAndCheck(id);

        // TODO: 检查是否被工作流引用
        // 如果force=false且被引用，抛出异常
        // if (!force && hasReferences(id)) {
        //   throw ProtocolException.of("接口集被引用，无法删除", new Object[]{});
        // }
      }

      @Override
      protected Void process() {
        apiCollectionRepo.deleteById(id);
        return null;
      }
    }.execute();
  }

  @Override
  public ApiCollection importCollection(ApiCollectionImportDto dto) {
    return new BizTemplate<ApiCollection>() {
      @Override
      protected void checkParams() {
        // 验证文件
        MultipartFile file = dto.getFile();
        if (file == null || file.isEmpty()) {
          throw ProtocolException.of("文件不能为空", new Object[]{});
        }

        // 验证文件大小（10MB）
        if (file.getSize() > 10 * 1024 * 1024) {
          throw ProtocolException.of("文件大小不能超过10MB", new Object[]{});
        }

        // 验证文件类型
        String fileName = file.getOriginalFilename();
        if (fileName == null || (!fileName.endsWith(".json") && !fileName.endsWith(".yaml") && !fileName.endsWith(".yml"))) {
          throw ProtocolException.of("不支持的文件格式", new Object[]{});
        }
      }

      @Override
      protected ApiCollection process() {
        // TODO: 实际解析OpenAPI/Swagger/Postman文件
        // 这里先创建空集合，后续实现导入逻辑
        
        ApiCollection collection = new ApiCollection();
        collection.setName(dto.getName() != null ? dto.getName() : "导入的接口集");
        collection.setSource(dto.getType());
        collection.setVisibility(dto.getVisibility() != null ? dto.getVisibility() : cloud.xcan.angus.core.ai.domain.Visibility.PRIVATE);
        
        insert(collection);
        return collection;
      }
    }.execute();
  }

  @Override
  public ApiCollection updateSecurity(Long id, SecurityConfigDto dto) {
    return new BizTemplate<ApiCollection>() {
      ApiCollection apiCollectionDb;

      @Override
      protected void checkParams() {
        apiCollectionDb = apiCollectionQuery.findAndCheck(id);
      }

      @Override
      protected ApiCollection process() {
        // 构建安全配置
        Map<String, Object> securityConfig = new HashMap<>();
        securityConfig.put("type", dto.getType());
        securityConfig.put("config", dto.getConfig());
        
        apiCollectionDb.setSecurityConfig(securityConfig);
        return apiCollectionRepo.save(apiCollectionDb);
      }
    }.execute();
  }

  @Override
  protected BaseRepository<ApiCollection, Long> getRepository() {
    return this.apiCollectionRepo;
  }
}

