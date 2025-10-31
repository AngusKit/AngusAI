package cloud.xcan.angus.core.ai.interfaces.plugin;

import cloud.xcan.angus.core.ai.domain.plugin.PluginStatus;
import cloud.xcan.angus.core.ai.interfaces.plugin.facade.PluginFacade;
import cloud.xcan.angus.core.ai.interfaces.plugin.facade.dto.PluginCreateDto;
import cloud.xcan.angus.core.ai.interfaces.plugin.facade.dto.PluginFavoriteDto;
import cloud.xcan.angus.core.ai.interfaces.plugin.facade.dto.PluginFindDto;
import cloud.xcan.angus.core.ai.interfaces.plugin.facade.dto.PluginUpdateDto;
import cloud.xcan.angus.core.ai.interfaces.plugin.facade.vo.PluginDetailVo;
import cloud.xcan.angus.core.ai.interfaces.plugin.facade.vo.PluginListVo;
import cloud.xcan.angus.core.ai.interfaces.plugin.facade.vo.PluginStatisticsVo;
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
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "Plugin", description = "插件管理 - 插件的创建、安装、配置、使用等功能")
@Validated
@RestController
@RequestMapping("/api/v1/plugins")
public class PluginRest {

  @Resource
  private PluginFacade pluginFacade;

  // TODO 缺少插件文件字段
  @Operation(operationId = "createPlugin", summary = "创建插件", description = "创建新插件")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "201", description = "插件创建成功")
  })
  @ResponseStatus(HttpStatus.CREATED)
  @PostMapping
  public ApiLocaleResult<PluginDetailVo> create(
      @Valid @RequestBody PluginCreateDto dto) {
    PluginDetailVo result = pluginFacade.create(dto);
    return ApiLocaleResult.success(result);
  }

  @Operation(operationId = "updatePlugin", summary = "更新插件基本信息", description = "更新插件的基本信息")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "更新成功")
  })
  @ResponseStatus(HttpStatus.OK)
  @PatchMapping("/{id}")
  public ApiLocaleResult<PluginDetailVo> update(
      @Parameter(description = "插件ID") @PathVariable Long id,
      @Valid @RequestBody PluginUpdateDto dto) {
    return ApiLocaleResult.success(pluginFacade.update(id, dto));
  }

  @Operation(operationId = "modifyPluginStatus", summary = "修改插件状态", description = "修改插件状态")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "修改状态成功")
  })
  @ResponseStatus(HttpStatus.OK)
  @PutMapping("/{id}/status")
  public ApiLocaleResult<PluginDetailVo> modifyStatus(
      @Parameter(description = "插件ID") @PathVariable Long id,
      @Parameter(description = "插件状态") @RequestParam PluginStatus status) {
    return ApiLocaleResult.success(pluginFacade.modifyStatus(id, status));
  }

  @Operation(operationId = "favoritePlugin", summary = "收藏/取消收藏插件", description = "收藏或取消收藏插件")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "操作成功")
  })
  @ResponseStatus(HttpStatus.OK)
  @PostMapping("/{id}/favorite")
  public ApiLocaleResult<PluginDetailVo> favorite(
      @Parameter(description = "插件ID") @PathVariable Long id,
      @Valid @RequestBody PluginFavoriteDto dto) {
    return ApiLocaleResult.success(pluginFacade.favorite(id, dto));
  }

  @Operation(operationId = "installPlugin", summary = "安装插件", description = "安装指定插件")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "安装成功")
  })
  @ResponseStatus(HttpStatus.OK)
  @PostMapping("/{id}/install")
  public ApiLocaleResult<PluginDetailVo> install(
      @Parameter(description = "插件ID") @PathVariable Long id) {
    return ApiLocaleResult.success(pluginFacade.install(id));
  }

  @Operation(operationId = "uninstallPlugin", summary = "卸载插件", description = "卸载指定插件")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "204", description = "卸载成功")
  })
  @ResponseStatus(HttpStatus.NO_CONTENT)
  @PostMapping("/{id}/uninstall")
  public void uninstall(
      @Parameter(description = "插件ID") @PathVariable Long id) {
    pluginFacade.uninstall(id);
  }

  @Operation(operationId = "usePlugin", summary = "使用插件", description = "标记插件使用，增加使用计数")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "操作成功")
  })
  @ResponseStatus(HttpStatus.OK)
  @PostMapping("/{id}/use")
  public ApiLocaleResult<PluginDetailVo> use(
      @Parameter(description = "插件ID") @PathVariable Long id) {
    return ApiLocaleResult.success(pluginFacade.use(id));
  }

  @Operation(operationId = "publishPlugin", summary = "发布插件", description = "发布插件到插件市场")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "发布成功")
  })
  @ResponseStatus(HttpStatus.OK)
  @PostMapping("/{id}/publish")
  public ApiLocaleResult<PluginDetailVo> publish(
      @Parameter(description = "插件ID") @PathVariable Long id) {
    return ApiLocaleResult.success(pluginFacade.publish(id));
  }

  @Operation(operationId = "verifyPlugin", summary = "验证插件", description = "管理员验证插件（需要管理员权限）")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "验证成功")
  })
  @ResponseStatus(HttpStatus.OK)
  @PutMapping("/{id}/verify")
  public ApiLocaleResult<PluginDetailVo> verify(
      @Parameter(description = "插件ID") @PathVariable Long id,
      @Parameter(description = "是否验证通过") @RequestParam Boolean verified) {
    return ApiLocaleResult.success(pluginFacade.verify(id, verified));
  }

  @Operation(operationId = "deletePlugin", summary = "删除插件", description = "删除指定插件")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "204", description = "删除成功")
  })
  @ResponseStatus(HttpStatus.NO_CONTENT)
  @DeleteMapping("/{id}")
  public void delete(
      @Parameter(description = "插件ID") @PathVariable Long id) {
    pluginFacade.delete(id);
  }

  @Operation(operationId = "getPluginDetail", summary = "获取插件详情", description = "获取指定插件的详细信息")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "插件详情获取成功"),
      @ApiResponse(responseCode = "404", description = "插件不存在")
  })
  @ResponseStatus(HttpStatus.OK)
  @GetMapping("/{id}")
  public ApiLocaleResult<PluginDetailVo> getDetail(
      @Parameter(description = "插件ID") @PathVariable Long id) {
    return ApiLocaleResult.success(pluginFacade.getDetail(id));
  }

  @Operation(operationId = "getPluginList", summary = "获取插件列表", description = "获取插件列表，支持分页、搜索和筛选")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "插件列表获取成功")
  })
  @ResponseStatus(HttpStatus.OK)
  @GetMapping
  public ApiLocaleResult<PageResult<PluginListVo>> list(
      @Valid @ParameterObject PluginFindDto dto) {
    return ApiLocaleResult.success(pluginFacade.list(dto));
  }

  @Operation(operationId = "getTrendingPlugins", summary = "获取热门插件", description = "获取热门/推荐插件")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "获取成功")
  })
  @GetMapping("/trending")
  public ApiLocaleResult<PageResult<PluginListVo>> getTrendingPlugins(
      @Parameter(description = "返回数量，默认10") @RequestParam(required = false) Integer limit) {
    return ApiLocaleResult.success(pluginFacade.getTrendingPlugins(limit));
  }

  @Operation(operationId = "getPluginStatistics", summary = "获取插件统计", description = "获取插件的详细统计数据")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "统计数据获取成功")
  })
  @GetMapping("/statistics")
  public ApiLocaleResult<PluginStatisticsVo> getStatistics(
      @Parameter(description = "统计周期") @RequestParam(required = false) String period) {
    return ApiLocaleResult.success(pluginFacade.getStatistics(period));
  }
}
