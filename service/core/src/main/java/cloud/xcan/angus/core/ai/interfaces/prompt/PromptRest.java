package cloud.xcan.angus.core.ai.interfaces.prompt;

import cloud.xcan.angus.core.ai.interfaces.prompt.facade.PromptFacade;
import cloud.xcan.angus.core.ai.interfaces.prompt.facade.dto.PromptCreateDto;
import cloud.xcan.angus.core.ai.interfaces.prompt.facade.dto.PromptFindDto;
import cloud.xcan.angus.core.ai.interfaces.prompt.facade.dto.PromptUpdateDto;
import cloud.xcan.angus.core.ai.interfaces.prompt.facade.vo.PromptDetailVo;
import cloud.xcan.angus.core.ai.interfaces.prompt.facade.vo.PromptListVo;
import cloud.xcan.angus.remote.ApiLocaleResult;
import cloud.xcan.angus.remote.PageResult;
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
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "Prompt", description = "提示词管理 - 提示词的创建、管理、搜索、收藏等功能")
@Validated
@RestController
@RequestMapping("/api/v1/prompts")
public class PromptRest {

  @Resource
  private PromptFacade promptFacade;

  @Operation(operationId = "createPrompt", summary = "创建提示词", description = "创建新提示词")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "201", description = "提示词创建成功")
  })
  @ResponseStatus(HttpStatus.CREATED)
  @PostMapping
  public ApiLocaleResult<PromptDetailVo> create(
      @Valid @RequestBody PromptCreateDto dto) {
    PromptDetailVo result = promptFacade.create(dto);
    return ApiLocaleResult.success(result);
  }

  @Operation(operationId = "updatePrompt", summary = "更新提示词", description = "更新提示词基本信息")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "更新成功")
  })
  @ResponseStatus(HttpStatus.OK)
  @PatchMapping("/{id}")
  public ApiLocaleResult<PromptDetailVo> update(
      @Parameter(description = "提示词ID") @PathVariable Long id,
      @Valid @RequestBody PromptUpdateDto dto) {
    return ApiLocaleResult.success(promptFacade.update(id, dto));
  }

  @Operation(operationId = "toggleFavoritePrompt", summary = "收藏/取消收藏", description = "收藏或取消收藏提示词")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "操作成功")
  })
  @ResponseStatus(HttpStatus.OK)
  @PostMapping("/{id}/favorite")
  public ApiLocaleResult<PromptDetailVo> toggleFavorite(
      @Parameter(description = "提示词ID") @PathVariable Long id,
      @Parameter(description = "是否收藏") @RequestParam Boolean isFavorite) {
    return ApiLocaleResult.success(promptFacade.toggleFavorite(id, isFavorite));
  }

  @Operation(operationId = "duplicatePrompt", summary = "复制提示词", description = "复制提示词（创建副本）")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "201", description = "复制成功")
  })
  @ResponseStatus(HttpStatus.CREATED)
  @PostMapping("/{id}/duplicate")
  public ApiLocaleResult<PromptDetailVo> duplicate(
      @Parameter(description = "源提示词ID") @PathVariable Long id,
      @Parameter(description = "新标题") @RequestParam(required = false) String title) {
    return ApiLocaleResult.success(promptFacade.duplicate(id, title));
  }

  @Operation(operationId = "usePrompt", summary = "使用提示词", description = "标记提示词使用，增加使用计数")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "操作成功")
  })
  @ResponseStatus(HttpStatus.OK)
  @PostMapping("/{id}/use")
  public ApiLocaleResult<PromptDetailVo> use(
      @Parameter(description = "提示词ID") @PathVariable Long id) {
    return ApiLocaleResult.success(promptFacade.use(id));
  }

  @Operation(operationId = "deletePrompt", summary = "删除提示词", description = "删除指定提示词")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "204", description = "删除成功")
  })
  @ResponseStatus(HttpStatus.NO_CONTENT)
  @DeleteMapping("/{id}")
  public void delete(
      @Parameter(description = "提示词ID") @PathVariable Long id) {
    promptFacade.delete(id);
  }

  @Operation(operationId = "getPromptDetail", summary = "获取提示词详情", description = "获取指定提示词的详细信息")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "提示词详情获取成功"),
      @ApiResponse(responseCode = "404", description = "提示词不存在")
  })
  @ResponseStatus(HttpStatus.OK)
  @GetMapping("/{id}")
  public ApiLocaleResult<PromptDetailVo> getDetail(
      @Parameter(description = "提示词ID") @PathVariable Long id) {
    return ApiLocaleResult.success(promptFacade.getDetail(id));
  }

  @Operation(operationId = "getPromptList", summary = "获取提示词列表", description = "获取当前用户的提示词列表，支持分页、搜索和筛选")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "提示词列表获取成功")
  })
  @ResponseStatus(HttpStatus.OK)
  @GetMapping
  public ApiLocaleResult<PageResult<PromptListVo>> list(
      @Valid @ParameterObject PromptFindDto dto) {
    return ApiLocaleResult.success(promptFacade.list(dto));
  }

}
