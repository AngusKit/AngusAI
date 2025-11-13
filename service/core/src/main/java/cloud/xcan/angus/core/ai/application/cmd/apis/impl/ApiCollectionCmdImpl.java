package cloud.xcan.angus.core.ai.application.cmd.apis.impl;

import static cloud.xcan.angus.core.ai.domain.Constants.API_COLLECTION_MAX_FILE_BYTE;
import static cloud.xcan.angus.core.ai.domain.Constants.API_COLLECTION_MAX_FILE_MB;
import static cloud.xcan.angus.core.ai.infra.util.ApiImportUtils.checkAndParseOpenApi;
import static cloud.xcan.angus.core.ai.infra.util.ApiImportUtils.getImportTmpPath;
import static cloud.xcan.angus.core.biz.ProtocolAssert.assertNotEmpty;
import static cloud.xcan.angus.core.biz.ProtocolAssert.assertTrue;
import static cloud.xcan.angus.spec.utils.ObjectUtils.isEmpty;
import static cloud.xcan.angus.spec.utils.ObjectUtils.nullSafe;
import static cloud.xcan.angus.spec.utils.ObjectUtils.stringSafe;
import static java.util.Collections.emptyMap;
import static java.util.Objects.nonNull;
import static org.apache.commons.lang3.ObjectUtils.isNotEmpty;
import static org.aspectj.util.FileUtil.readAsString;

import cloud.xcan.angus.core.ai.application.cmd.apis.ApiCollectionCmd;
import cloud.xcan.angus.core.ai.application.cmd.apis.ApiComponentCmd;
import cloud.xcan.angus.core.ai.application.cmd.apis.ApiEndpointCmd;
import cloud.xcan.angus.core.ai.application.cmd.apis.ApiSchemaCmd;
import cloud.xcan.angus.core.ai.application.converter.ApiEndpointConverter;
import cloud.xcan.angus.core.ai.application.query.apis.ApiCollectionQuery;
import cloud.xcan.angus.core.ai.application.query.apis.ApiEndpointQuery;
import cloud.xcan.angus.core.ai.domain.apis.ApiCollection;
import cloud.xcan.angus.core.ai.domain.apis.ApiCollectionRepo;
import cloud.xcan.angus.core.ai.domain.apis.ApiEndpoint;
import cloud.xcan.angus.core.ai.domain.apis.ApiSchema;
import cloud.xcan.angus.core.ai.domain.apis.ApiSchemaRepo;
import cloud.xcan.angus.core.ai.domain.apis.ConflictStrategy;
import cloud.xcan.angus.core.ai.domain.apis.ImportApiStrategy;
import cloud.xcan.angus.core.ai.interfaces.apis.facade.dto.ApiCollectionImportDto;
import cloud.xcan.angus.core.biz.BizTemplate;
import cloud.xcan.angus.core.biz.cmd.CommCmd;
import cloud.xcan.angus.core.jpa.repository.BaseRepository;
import cloud.xcan.angus.remote.ExceptionLevel;
import cloud.xcan.angus.remote.message.SysException;
import cloud.xcan.angus.remote.message.http.ResourceExisted;
import cloud.xcan.angus.spec.utils.FileUtils;
import cloud.xcan.angus.spec.utils.ObjectUtils;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.Operation;
import io.swagger.v3.oas.models.extension.OpenAPIUtils;
import jakarta.annotation.Resource;
import jakarta.validation.constraints.NotNull;
import java.io.File;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.Collection;
import java.util.Map;
import java.util.stream.Collectors;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

/**
 * 接口集命令服务实现
 */
@Slf4j
@Service
public class ApiCollectionCmdImpl extends CommCmd<ApiCollection, Long> implements ApiCollectionCmd {

  @Resource
  private ApiCollectionRepo apiCollectionRepo;

  @Resource
  private ApiCollectionQuery apiCollectionQuery;

  @Resource
  private ApiEndpointQuery apiEndpointQuery;

  @Resource
  private ApiSchemaRepo apiSchemaRepo;

  @Resource
  private ApiEndpointCmd apiEndpointCmd;

  @Resource
  private ApiSchemaCmd apiSchemaCmd;

  @Resource
  private ApiComponentCmd apiComponentCmd;

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
        insert(apiCollection);

        apiSchemaCmd.init(apiCollection.getId());
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
        if (apiCollectionRepo.existsByNameAndIdNot(actualName, apiCollection.getId())) {
          throw ResourceExisted.of("接口集名称「{0}」已存在", new Object[]{actualName});
        }
      }

      @Override
      protected ApiCollection process() {
        update(apiCollection, apiCollectionDb);
        return apiCollectionDb;
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
        apiEndpointCmd.deleteByCollectionId(id);
        return null;
      }
    }.execute();
  }

  @Override
  public ApiCollection importCollection(Long id, ApiCollectionImportDto dto) {
    return new BizTemplate<ApiCollection>() {
      ApiCollection apiCollectionDb;
      final MultipartFile file = dto.getFile();
      final String content = dto.getContent();

      @Override
      protected void checkParams() {
        // 检查接口集是否存在
        apiCollectionDb = apiCollectionQuery.findAndCheck(id);

        // 验证文件
        assertTrue((file != null && !file.isEmpty()) || isNotEmpty(content),
            "导入文件或内容不能为空");

        if (file != null && !file.isEmpty()) {
          // 验证文件名
          assertNotEmpty(file.getOriginalFilename(), "文件名是必须的");

          // 验证文件大小（20MB）
          assertTrue(file.getSize() <= API_COLLECTION_MAX_FILE_BYTE,
              "文件大小不能超过{0}MB", new Object[]{API_COLLECTION_MAX_FILE_MB});

          // 验证文件类型
          String fileName = file.getOriginalFilename();
          assertTrue(fileName.endsWith(".json") || fileName.endsWith(".yaml")
              || fileName.endsWith(".yml"), "不支持的文件格式");
        } else {
          assertTrue(content.getBytes(StandardCharsets.UTF_8).length > API_COLLECTION_MAX_FILE_BYTE,
              "文件大小不能超过{0}MB", new Object[]{API_COLLECTION_MAX_FILE_MB});
        }
      }

      @Override
      protected ApiCollection process() {
        // Import by file
        if (nonNull(dto.getFile())) {
          // Get import files, If it is a multi file import decompression zip file
          String srcFileName = file.getOriginalFilename();
          File tmpPath = getImportTmpPath(dto.getType(), null);
          File importFile = new File(tmpPath.getPath() + File.separator + srcFileName);
          try {
            file.transferTo(importFile);
          } catch (IOException e) {
            log.error("Transfer import file exception", e);
            throw SysException.of("Transfer import file exception, cause: "
                + e.getMessage(), ExceptionLevel.ERROR);
          }

          // Save import schema, components and apis
          try {
            openapiReplace(apiCollectionDb.getId(), readAsString(importFile),
                dto.getImportStrategy());
          } catch (IOException e) {
            log.error("Reading import file exception", e);
            throw SysException.of("Reading import file exception, cause: "
                + e.getMessage(), ExceptionLevel.ERROR);
          }

          // Delete tmp import files
          FileUtils.deleteQuietly(importFile);
        } else {
          // Import by text
          openapiReplace(apiCollectionDb.getId(), content, dto.getImportStrategy());
        }

        // Update collection source
        apiCollectionDb.setSource(dto.getType());
        apiCollectionRepo.save(apiCollectionDb);

        return apiCollectionDb;
      }
    }.execute();
  }

  private void openapiReplace(Long id, String content,
      @NotNull ImportApiStrategy importStrategy) {

    OpenAPI openApi = checkAndParseOpenApi(content, null, null);

    ConflictStrategy conflictStrategy = importStrategy.getConflictStrategy();

    // 1. Update service schema
    ApiSchema apiSchemaDb = apiSchemaRepo.findByCollectionId(id);
    // Warning: Multiple files importing the same project will be overwritten by the last imported file
    apiSchemaCmd.updateSchema(apiSchemaDb, openApi, conflictStrategy.isMerge(),
        conflictStrategy.isOverwrite());

    // 2. Update APIs (Operation Object Schema)
    Map<String, ApiEndpoint> apisDbMap = apiEndpointQuery.findByCollectionId(id).stream()
        .collect(Collectors.toMap(x -> x.getMethod().name().toLowerCase()
            + ":" + stringSafe(x.getPath()), x -> x));
    // Note: Since OpenAPI 3.1, paths are not required
    if (ObjectUtils.isNotEmpty(openApi.getPaths())) {
      Map<String, Operation> operationsMap = OpenAPIUtils.flatPaths(openApi.getPaths());
      Map<String, ApiEndpoint> openApisMap = isEmpty(operationsMap) ? emptyMap()
          : operationsMap.keySet().stream().collect(Collectors
              .toMap(x -> x, x -> ApiEndpointConverter.toSchemaApiEndpoint(operationsMap.get(x))));

      // 2.1 Find APIs to update
      if (conflictStrategy.isOverwrite()) {
        Map<String, ApiEndpoint> updatedApisDbMap = apisDbMap.keySet().stream()
            .filter(x -> openApisMap.containsKey(x) &&
                apisDbMap.get(x).getSchemaHash() != openApisMap.get(x).getSchemaHash())
            .collect(Collectors.toMap(x -> x, apisDbMap::get));
        if (ObjectUtils.isNotEmpty(updatedApisDbMap)) {
          apiEndpointCmd.updateSyncApis(updatedApisDbMap, openApisMap);
        }
      }

      // 2.2 Delete APIs not in the import if requested
      if (conflictStrategy.isOverwrite()) {
        Collection<ApiEndpoint> deletedApisInDb = apisDbMap.keySet().stream()
            .filter(x -> !openApisMap.containsKey(x))
            .collect(Collectors.toMap(x -> x, apisDbMap::get)).values();
        if (ObjectUtils.isNotEmpty(deletedApisInDb)) {
          // Note: The following method does not delete component references, deleted by apisCmd.delete0() when clearing Trash
          apiEndpointCmd.deleteByIds(
              deletedApisInDb.stream().map(ApiEndpoint::getId).collect(Collectors.toSet()));
        }
      }

      // 2.3 Find new APIs to add
      Collection<ApiEndpoint> newApis = openApisMap.keySet().stream()
          .filter(x -> !apisDbMap.containsKey(x))
          .collect(Collectors.toMap(x -> x, openApisMap::get)).values();
      if (ObjectUtils.isNotEmpty(newApis)) {
        for (ApiEndpoint x : newApis) {
          x.setCollectionId(id);
          x.setEnabled(importStrategy.getEnableByDefault());
        }
        apiEndpointCmd.add(newApis);
      }
    } else {
      // Delete all APIs if no paths exist and deletion is requested
      if (conflictStrategy.isOverwrite()) {
        // Note: The following method does not delete component references, deleted by apisCmd.delete0() when clearing Trash
        apiEndpointCmd.deleteByIds(
            apisDbMap.values().stream().map(ApiEndpoint::getId).collect(Collectors.toSet()));
      }
    }

    // 3. Update service components (Components Object Schema)
    if (isNotEmpty(openApi.getComponents())) {
      apiComponentCmd.replaceByOpenApi(id, openApi.getComponents(), conflictStrategy);
    }
  }

  @Override
  protected BaseRepository<ApiCollection, Long> getRepository() {
    return this.apiCollectionRepo;
  }
}

