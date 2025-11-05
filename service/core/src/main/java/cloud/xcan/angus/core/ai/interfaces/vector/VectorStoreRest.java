package cloud.xcan.angus.core.ai.interfaces.vector;

import cloud.xcan.angus.core.ai.interfaces.vector.facade.VectorStoreFacade;
import cloud.xcan.angus.core.ai.interfaces.vector.facade.dto.ConnectionTestDto;
import cloud.xcan.angus.core.ai.interfaces.vector.facade.dto.SyncDto;
import cloud.xcan.angus.core.ai.interfaces.vector.facade.dto.VectorStoreCreateDto;
import cloud.xcan.angus.core.ai.interfaces.vector.facade.dto.VectorStoreFindDto;
import cloud.xcan.angus.core.ai.interfaces.vector.facade.dto.VectorStoreUpdateDto;
import cloud.xcan.angus.core.ai.interfaces.vector.facade.vo.ConnectionTestVo;
import cloud.xcan.angus.core.ai.interfaces.vector.facade.vo.SyncTaskVo;
import cloud.xcan.angus.core.ai.interfaces.vector.facade.vo.VectorStoreListVo;
import cloud.xcan.angus.core.ai.interfaces.vector.facade.vo.VectorStoreStatisticsVo;
import cloud.xcan.angus.core.ai.interfaces.vector.facade.vo.VectorStoreVo;
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

/**
 * 向量存储源管理 REST 控制器
 */
@Tag(name = "VectorStore", description = "向量存储源管理")
@Validated
@RestController
@RequestMapping("/api/v1/vector-stores")
public class VectorStoreRest {

  @Resource
  private VectorStoreFacade vectorStoreFacade;

  @Operation(summary = "获取存储源列表", description = "分页查询向量存储源列表，支持关键词搜索、类型筛选、状态筛选等")
  @GetMapping
  public ApiLocaleResult<PageResult<VectorStoreListVo>> list(
      @Valid @ParameterObject VectorStoreFindDto dto) {
    return ApiLocaleResult.success(vectorStoreFacade.list(dto));
  }

  @Operation(summary = "获取存储源详情", description = "根据ID获取向量存储源的详细信息")
  @ApiResponses({
      @ApiResponse(responseCode = "200", description = "查询成功"),
      @ApiResponse(responseCode = "404", description = "存储源不存在")
  })
  @GetMapping("/{id}")
  public ApiLocaleResult<VectorStoreVo> getDetail(
      @Parameter(description = "存储源ID", required = true) @PathVariable Long id) {
    return ApiLocaleResult.success(vectorStoreFacade.getDetail(id));
  }

  @Operation(summary = "创建存储源", description = "创建新的向量存储源配置")
  @ApiResponses({
      @ApiResponse(responseCode = "201", description = "创建成功"),
      @ApiResponse(responseCode = "400", description = "参数错误"),
      @ApiResponse(responseCode = "409", description = "存储源名称已存在")
  })
  @PostMapping
  @ResponseStatus(HttpStatus.CREATED)
  public ApiLocaleResult<VectorStoreVo> create(@Valid @RequestBody VectorStoreCreateDto dto) {
    return ApiLocaleResult.success(vectorStoreFacade.create(dto));
  }

  @Operation(summary = "更新存储源", description = "更新向量存储源配置，更新endpoint或config后状态会重置为disconnected")
  @ApiResponses({
      @ApiResponse(responseCode = "200", description = "更新成功"),
      @ApiResponse(responseCode = "404", description = "存储源不存在"),
      @ApiResponse(responseCode = "409", description = "存储源名称已存在")
  })
  @PatchMapping("/{id}")
  public ApiLocaleResult<VectorStoreVo> update(
      @Parameter(description = "存储源ID", required = true) @PathVariable Long id,
      @Valid @RequestBody VectorStoreUpdateDto dto) {
    return ApiLocaleResult.success(vectorStoreFacade.update(id, dto));
  }

  @Operation(summary = "删除存储源", description = "删除向量存储源配置，如果被引用需要force=true才能删除")
  @ApiResponses({
      @ApiResponse(responseCode = "204", description = "删除成功"),
      @ApiResponse(responseCode = "404", description = "存储源不存在"),
      @ApiResponse(responseCode = "400", description = "存储源被引用，无法删除")
  })
  @DeleteMapping("/{id}")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public ApiLocaleResult<?> delete(
      @Parameter(description = "存储源ID", required = true) @PathVariable Long id,
      @Parameter(description = "强制删除（即使被引用）") @RequestParam(required = false) Boolean force) {
    vectorStoreFacade.delete(id, force);
    return ApiLocaleResult.success(null);
  }

  @Operation(summary = "连接测试", description = "测试向量存储源的连接状态")
  @ApiResponses({
      @ApiResponse(responseCode = "200", description = "测试完成"),
      @ApiResponse(responseCode = "404", description = "存储源不存在"),
      @ApiResponse(responseCode = "400", description = "连接测试失败")
  })
  @PostMapping("/{id}/test")
  public ApiLocaleResult<ConnectionTestVo> testConnection(
      @Parameter(description = "存储源ID", required = true) @PathVariable Long id,
      @Valid @RequestBody(required = false) ConnectionTestDto dto) {
    if (dto == null) {
      dto = new ConnectionTestDto();
    }
    return ApiLocaleResult.success(vectorStoreFacade.testConnection(id, dto));
  }

  @Operation(summary = "切换启用状态", description = "启用或禁用存储源")
  @ApiResponses({
      @ApiResponse(responseCode = "200", description = "状态已更新"),
      @ApiResponse(responseCode = "404", description = "存储源不存在")
  })
  @PatchMapping("/{id}/toggle")
  public ApiLocaleResult<VectorStoreVo> toggleEnabled(
      @Parameter(description = "存储源ID", required = true) @PathVariable Long id,
      @Parameter(description = "目标状态", required = true) @RequestParam Boolean enabled) {
    return ApiLocaleResult.success(vectorStoreFacade.toggleEnabled(id, enabled));
  }

  @Operation(summary = "同步向量数据", description = "手动触发向量数据同步")
  @ApiResponses({
      @ApiResponse(responseCode = "200", description = "同步任务已启动"),
      @ApiResponse(responseCode = "404", description = "存储源不存在")
  })
  @PostMapping("/{id}/sync")
  public ApiLocaleResult<SyncTaskVo> sync(
      @Parameter(description = "存储源ID", required = true) @PathVariable Long id,
      @Valid @RequestBody(required = false) SyncDto dto) {
    if (dto == null) {
      dto = new SyncDto();
    }
    return ApiLocaleResult.success(vectorStoreFacade.sync(id, dto));
  }

  @Operation(summary = "获取统计信息", description = "获取向量存储源的统计数据，包括总体统计、类型分布、使用率排行、性能趋势等")
  @GetMapping("/statistics")
  public ApiLocaleResult<VectorStoreStatisticsVo> getStatistics() {
    return ApiLocaleResult.success(vectorStoreFacade.getStatistics());
  }
}
