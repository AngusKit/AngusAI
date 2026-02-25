package cloud.xcan.angus.core.ai.interfaces.team;

import cloud.xcan.angus.core.ai.interfaces.team.facade.TeamSettingsFacade;
import cloud.xcan.angus.core.ai.interfaces.team.facade.dto.TeamSettingsDto;
import cloud.xcan.angus.core.ai.interfaces.team.facade.vo.TeamSettingsVo;
import cloud.xcan.angus.remote.ApiLocaleResult;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.annotation.Resource;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "TeamSettings", description = "团队配置信息维护")
@Validated
@RestController
@RequestMapping("/api/v1/team/settings")
public class TeamSettingsRest {

  @Resource
  private TeamSettingsFacade teamSettingsFacade;

  @Operation(operationId = "updateTeamSettings", summary = "更新团队设置", description = "更新完整团队设置信息")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "更新成功")
  })
  @ResponseStatus(HttpStatus.OK)
  @PutMapping
  public ApiLocaleResult<TeamSettingsVo> update(
      @Valid @RequestBody TeamSettingsDto dto) {
    return ApiLocaleResult.success(teamSettingsFacade.update(dto));
  }

  @Operation(operationId = "getTeamSettingsDetail", summary = "查询团队设置", description = "查询完整团队设置信息")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "查询成功")
  })
  @ResponseStatus(HttpStatus.OK)
  @GetMapping
  public ApiLocaleResult<TeamSettingsVo> getDetail() {
    return ApiLocaleResult.success(teamSettingsFacade.getDetail());
  }

}
