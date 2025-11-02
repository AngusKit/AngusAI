package cloud.xcan.angus.core.ai.interfaces.plugin;

import cloud.xcan.angus.core.ai.interfaces.plugin.facade.PluginReviewFacade;
import cloud.xcan.angus.core.ai.interfaces.plugin.facade.dto.PluginReviewCreateDto;
import cloud.xcan.angus.core.ai.interfaces.plugin.facade.vo.PluginReviewVo;
import cloud.xcan.angus.remote.ApiLocaleResult;
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
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "PluginReview", description = "插件评级 - 新增评级与查询评级记录（不分页）")
@Validated
@RestController
@RequestMapping("/api/v1/plugins")
public class PluginReviewRest {

  @Resource
  private PluginReviewFacade pluginReviewFacade;

  @Operation(operationId = "createPluginReview", summary = "提交插件评级", description = "为指定插件提交评级记录")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "201", description = "提交成功")
  })
  @ResponseStatus(HttpStatus.CREATED)
  @PostMapping("/{pluginId}/reviews")
  public ApiLocaleResult<PluginReviewVo> create(
      @Parameter(description = "插件ID") @PathVariable Long pluginId,
      @Valid @RequestBody PluginReviewCreateDto dto) {
    return ApiLocaleResult.success(pluginReviewFacade.create(pluginId, dto));
  }

  @Operation(operationId = "listPluginReviews", summary = "查询插件评级记录", description = "查询指定插件的所有评级记录（不分页）")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "查询成功")
  })
  @GetMapping("/{pluginId}/reviews")
  public ApiLocaleResult<List<PluginReviewVo>> list(
      @Parameter(description = "插件ID") @PathVariable Long pluginId) {
    return ApiLocaleResult.success(pluginReviewFacade.list(pluginId));
  }
}
