package cloud.xcan.angus.core.git.interfaces.member;

import cloud.xcan.angus.api.gm.user.UserInviteRemote;
import cloud.xcan.angus.api.gm.user.dto.UserInviteDto;
import cloud.xcan.angus.api.gm.user.dto.UserInviteFindDto;
import cloud.xcan.angus.api.gm.user.vo.UserInviteResendVo;
import cloud.xcan.angus.api.gm.user.vo.UserInviteVo;
import cloud.xcan.angus.remote.ApiLocaleResult;
import cloud.xcan.angus.remote.PageResult;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.annotation.Resource;
import jakarta.validation.Valid;
import java.util.List;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.http.HttpStatus;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

/**
 * 用户邀请管理 - 委托 AngusGM UserInviteRemote 实现
 * <p>
 * 接口、参数与 AngusGM 邀请接口保持一致
 * </p>
 */
@Tag(name = "UserInvite", description = "用户邀请管理 - 委托 GM 实现")
@Validated
@RestController
@RequestMapping("/api/v1/member/invites")
public class MemberInviteRest {

  @Resource
  private UserInviteRemote userInviteRemote;

  @Operation(operationId = "inviteUser", summary = "邀请用户", description = "发送用户邀请，支持单邮箱、多邮箱批量邀请及链接邀请")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "201", description = "邀请发送成功")
  })
  @ResponseStatus(HttpStatus.CREATED)
  @PostMapping
  public ApiLocaleResult<List<UserInviteVo>> inviteUser(@Valid @RequestBody UserInviteDto dto) {
    return userInviteRemote.invite(dto);
  }

  @Operation(operationId = "cancelInvite", summary = "取消邀请", description = "取消指定邀请")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "204", description = "取消成功")
  })
  @ResponseStatus(HttpStatus.NO_CONTENT)
  @DeleteMapping("/{id}")
  public void cancelInvite(@Parameter(description = "邀请ID") @PathVariable Long id) {
    userInviteRemote.cancelInvite(id);
  }

  @Operation(operationId = "resendInvite", summary = "重新发送邀请", description = "重新发送指定邀请")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "邀请已重新发送")
  })
  @ResponseStatus(HttpStatus.OK)
  @PostMapping("/{id}/resend")
  public ApiLocaleResult<UserInviteResendVo> resendInvite(
      @Parameter(description = "邀请ID") @PathVariable Long id) {
    return userInviteRemote.resendInvite(id);
  }

  @Operation(operationId = "getInviteList", summary = "获取邀请列表", description = "获取用户邀请列表")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "邀请列表获取成功")
  })
  @ResponseStatus(HttpStatus.OK)
  @GetMapping
  public ApiLocaleResult<PageResult<UserInviteVo>> listInvites(
      @Valid @ParameterObject UserInviteFindDto dto) {
    return userInviteRemote.listInvites(dto);
  }
}
