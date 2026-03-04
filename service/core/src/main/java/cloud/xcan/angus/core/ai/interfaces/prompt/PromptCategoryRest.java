package cloud.xcan.angus.core.ai.interfaces.prompt;

import cloud.xcan.angus.core.ai.interfaces.prompt.facade.PromptCategoryFacade;
import cloud.xcan.angus.core.ai.interfaces.prompt.facade.dto.PromptCategoryCreateDto;
import cloud.xcan.angus.core.ai.interfaces.prompt.facade.dto.PromptCategoryUpdateDto;
import cloud.xcan.angus.core.ai.interfaces.prompt.facade.vo.PromptCategoryVo;
import cloud.xcan.angus.remote.ApiLocaleResult;
import cloud.xcan.angus.spec.principal.PrincipalContext;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.annotation.Resource;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "PromptCategory", description = "提示词分类管理 - 分类的创建、管理、排序等功能")
@Validated
@RestController
@RequestMapping("/api/v1/prompt-categories")
public class PromptCategoryRest {

  @Resource
  private PromptCategoryFacade promptCategoryFacade;

  @Operation(operationId = "createPromptCategory", summary = "创建分类", description = "创建新的提示词分类")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "201", description = "分类创建成功")
  })
  @ResponseStatus(HttpStatus.CREATED)
  @PostMapping
  public ApiLocaleResult<PromptCategoryVo> create(
      @Valid @RequestBody PromptCategoryCreateDto dto) {
    return ApiLocaleResult.success(promptCategoryFacade.create(dto));
  }

  @Operation(operationId = "updatePromptCategory", summary = "更新分类", description = "更新提示词分类信息")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "更新成功")
  })
  @ResponseStatus(HttpStatus.OK)
  @PatchMapping("/{id}")
  public ApiLocaleResult<PromptCategoryVo> update(
      @Parameter(description = "分类ID") @PathVariable Long id,
      @Valid @RequestBody PromptCategoryUpdateDto dto) {
    return ApiLocaleResult.success(promptCategoryFacade.update(id, dto));
  }

  @Operation(operationId = "updatePromptCategoryOrder", summary = "调整分类顺序", description = "调整分类在同级中的显示顺序")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "顺序调整成功")
  })
  @ResponseStatus(HttpStatus.OK)
  @PatchMapping("/{id}/order")
  public ApiLocaleResult<PromptCategoryVo> updateOrder(
      @Parameter(description = "分类ID") @PathVariable Long id,
      @Parameter(description = "新位置（从0开始）") @RequestParam Integer position) {
    return ApiLocaleResult.success(promptCategoryFacade.updateOrder(id, position));
  }

  @Operation(operationId = "deletePromptCategory", summary = "删除分类", description = "删除指定提示词分类")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "204", description = "删除成功")
  })
  @ResponseStatus(HttpStatus.NO_CONTENT)
  @DeleteMapping("/{id}")
  public void delete(
      @Parameter(description = "分类ID") @PathVariable Long id) {
    promptCategoryFacade.delete(id);
  }

  @Operation(operationId = "batchDeletePromptCategories", summary = "批量删除分类", description = "批量删除多个提示词分类")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "204", description = "批量删除成功")
  })
  @ResponseStatus(HttpStatus.NO_CONTENT)
  @DeleteMapping("/batch")
  public void batchDelete(
      @Parameter(description = "分类ID数组") @RequestParam Long[] ids) {
    promptCategoryFacade.batchDelete(ids);
  }

  @Operation(operationId = "getPromptCategoryDetail", summary = "获取分类详情", description = "获取指定分类的详细信息")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "分类详情获取成功"),
      @ApiResponse(responseCode = "404", description = "分类不存在")
  })
  @ResponseStatus(HttpStatus.OK)
  @GetMapping("/{id}")
  public ApiLocaleResult<PromptCategoryVo> getDetail(
      @Parameter(description = "分类ID") @PathVariable Long id) {
    return ApiLocaleResult.success(promptCategoryFacade.getDetail(id));
  }

  @Operation(operationId = "getPromptCategoryTree", summary = "获取分类树", description = "获取完整的分类树结构")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "分类树获取成功")
  })
  @ResponseStatus(HttpStatus.OK)
  @GetMapping("/tree")
  public ApiLocaleResult<List<PromptCategoryVo>> getTree() {
    ApiLocaleResult<List<PromptCategoryVo>> result = ApiLocaleResult.success(
        promptCategoryFacade.getTree());
    result.addExtensions(PrincipalContext.get().getExtensions());
    return result;
  }

}
