package cloud.xcan.angus.core.ai.interfaces.activity;


import cloud.xcan.angus.core.ai.interfaces.activity.facade.ActivityFacade;
import cloud.xcan.angus.core.ai.interfaces.activity.facade.dto.ActivityFindDto;
import cloud.xcan.angus.core.ai.interfaces.activity.facade.vo.ActivityDetailVo;
import cloud.xcan.angus.remote.ApiLocaleResult;
import cloud.xcan.angus.remote.PageResult;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.annotation.Resource;
import jakarta.validation.Valid;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "Activity", description = "User Activity Management - APIs for querying user activity logs with filtering and pagination support")
@Validated
@RestController
@RequestMapping("/api/v1/activity")
public class ActivityRest {

  @Resource
  private ActivityFacade activityFacade;

  @Operation(summary = "Query activity logs",
      description = "Retrieve paginated list of user activity logs with filtering and search capabilities",
      operationId = "activity:list")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "Activity list retrieved successfully")})
  @GetMapping
  public ApiLocaleResult<PageResult<ActivityDetailVo>> list(
      @Valid @ParameterObject ActivityFindDto dto) {
    return ApiLocaleResult.success(activityFacade.list(dto));
  }

}
