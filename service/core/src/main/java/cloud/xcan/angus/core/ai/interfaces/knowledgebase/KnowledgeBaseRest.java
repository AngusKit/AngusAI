package cloud.xcan.angus.core.ai.interfaces.knowledgebase;

import cloud.xcan.angus.core.ai.domain.Visibility;
import cloud.xcan.angus.core.ai.interfaces.apis.facade.dto.ApiCollectionStatisticsDto;
import cloud.xcan.angus.core.ai.interfaces.apis.facade.vo.ApiCollectionStatisticsVo;
import cloud.xcan.angus.core.ai.interfaces.knowledgebase.facade.KnowledgeBaseFacade;
import cloud.xcan.angus.core.ai.interfaces.knowledgebase.facade.dto.KnowledgeBaseCreateDto;
import cloud.xcan.angus.core.ai.interfaces.knowledgebase.facade.dto.KnowledgeBaseFindDto;
import cloud.xcan.angus.core.ai.interfaces.knowledgebase.facade.dto.KnowledgeBaseToggleDto;
import cloud.xcan.angus.core.ai.interfaces.knowledgebase.facade.dto.KnowledgeBaseUpdateDto;
import cloud.xcan.angus.core.ai.interfaces.knowledgebase.facade.vo.KnowledgeBaseDetailVo;
import cloud.xcan.angus.core.ai.interfaces.knowledgebase.facade.vo.KnowledgeBaseListVo;
import cloud.xcan.angus.core.ai.interfaces.knowledgebase.facade.vo.KnowledgeBaseStatisticsVo;
import cloud.xcan.angus.remote.ApiLocaleResult;
import cloud.xcan.angus.remote.PageResult;
import cloud.xcan.angus.remote.dto.SimpleStatisticsDto;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.annotation.Resource;
import jakarta.validation.Valid;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.http.HttpStatus;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "KnowledgeBase", description = "知识库管理 - 知识库的创建、编辑、删除、文档管理等功能")
@Validated
@RestController
@RequestMapping("/api/v1/knowledge-bases")
public class KnowledgeBaseRest {

  @Resource
  private KnowledgeBaseFacade knowledgeBaseFacade;

  @Operation(operationId = "createKnowledgeBase", summary = "创建知识库", description = "创建新知识库")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "201", description = "知识库创建成功")
  })
  @ResponseStatus(HttpStatus.CREATED)
  @PostMapping
  public ApiLocaleResult<KnowledgeBaseDetailVo> create(
      @Valid @RequestBody KnowledgeBaseCreateDto dto) {
    KnowledgeBaseDetailVo result = knowledgeBaseFacade.create(dto);
    return ApiLocaleResult.success(result);
  }

  @Operation(operationId = "toggleKnowledge", summary = "更新知识库", description = "更新知识库信息")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "更新成功")
  })
  @ResponseStatus(HttpStatus.OK)
  @PatchMapping("/{id}")
  public ApiLocaleResult<KnowledgeBaseDetailVo> update(
      @Parameter(description = "知识库ID") @PathVariable Long id,
      @Valid @RequestBody KnowledgeBaseUpdateDto dto) {
    return ApiLocaleResult.success(knowledgeBaseFacade.update(id, dto));
  }

  @Operation(operationId = "toggleKnowledgeStatus", summary = "切换知识库状态", description = "切换知识库的启用状态")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "状态修改成功")
  })
  @ResponseStatus(HttpStatus.OK)
  @PutMapping("/{id}/toggle")
  public ApiLocaleResult<KnowledgeBaseDetailVo> toggle(
      @Parameter(description = "知识库ID") @PathVariable Long id,
      @Valid @RequestBody KnowledgeBaseToggleDto dto) {
    return ApiLocaleResult.success(knowledgeBaseFacade.toggle(id, dto));
  }

  @Operation(operationId = "modifyKnowledgeBaseVisibility", summary = "修改知识库可见性", description = "修改知识库可见性")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "可见性修改成功")
  })
  @ResponseStatus(HttpStatus.OK)
  @PutMapping("/{id}/visibility")
  public ApiLocaleResult<KnowledgeBaseDetailVo> modifyVisibility(
      @Parameter(description = "知识库ID") @PathVariable Long id,
      @Parameter(description = "可见性") @RequestParam Visibility visibility) {
    return ApiLocaleResult.success(knowledgeBaseFacade.modifyVisibility(id, visibility));
  }

  @Operation(operationId = "deleteKnowledgeBase", summary = "删除知识库", description = "删除指定知识库")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "204", description = "删除成功")
  })
  @ResponseStatus(HttpStatus.NO_CONTENT)
  @DeleteMapping("/{id}")
  public void delete(
      @Parameter(description = "知识库ID") @PathVariable Long id) {
    knowledgeBaseFacade.delete(id);
  }

  @Operation(operationId = "getKnowledgeBaseDetail", summary = "获取知识库详情", description = "获取指定知识库的详细信息")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "知识库详情获取成功"),
      @ApiResponse(responseCode = "404", description = "知识库不存在")
  })
  @GetMapping("/{id}")
  public ApiLocaleResult<KnowledgeBaseDetailVo> getDetail(
      @Parameter(description = "知识库ID") @PathVariable Long id) {
    return ApiLocaleResult.success(knowledgeBaseFacade.getDetail(id));
  }

  @Operation(operationId = "getKnowledgeBaseList", summary = "获取知识库列表", description = "获取当前用户的知识库列表，支持分页、搜索和筛选")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "知识库列表获取成功")
  })
  @GetMapping
  public ApiLocaleResult<PageResult<KnowledgeBaseListVo>> list(
      @Valid @ParameterObject KnowledgeBaseFindDto dto) {
    return ApiLocaleResult.success(knowledgeBaseFacade.list(dto));
  }

  @Operation(operationId = "GetKnowledgeBaseStatistics", summary = "获取统计信息", description = "获取接口集的统计数据，包括总体统计、使用率排行、性能趋势等")
  @GetMapping("/statistics")
  public ApiLocaleResult<KnowledgeBaseStatisticsVo> getStatistics(
      @ParameterObject SimpleStatisticsDto dto) {
    return ApiLocaleResult.success(knowledgeBaseFacade.getStatistics(dto));
  }

}
