package cloud.xcan.angus.core.ai.interfaces.settings;

import cloud.xcan.angus.core.ai.interfaces.settings.facade.SettingsFacade;
import cloud.xcan.angus.core.ai.interfaces.settings.facade.dto.ChangePasswordDto;
import cloud.xcan.angus.core.ai.interfaces.settings.facade.dto.DataExportRequestDto;
import cloud.xcan.angus.core.ai.interfaces.settings.facade.dto.DeleteAccountDto;
import cloud.xcan.angus.core.ai.interfaces.settings.facade.dto.Enable2FADto;
import cloud.xcan.angus.core.ai.interfaces.settings.facade.dto.NotificationSettingsUpdateDto;
import cloud.xcan.angus.core.ai.interfaces.settings.facade.dto.UserSettingsUpdateDto;
import cloud.xcan.angus.core.ai.interfaces.settings.facade.dto.Verify2FADto;
import cloud.xcan.angus.core.ai.interfaces.settings.facade.vo.ChangePasswordVo;
import cloud.xcan.angus.core.ai.interfaces.settings.facade.vo.DataExportVo;
import cloud.xcan.angus.core.ai.interfaces.settings.facade.vo.DeleteAccountVo;
import cloud.xcan.angus.core.ai.interfaces.settings.facade.vo.Enable2FAVo;
import cloud.xcan.angus.core.ai.interfaces.settings.facade.vo.NotificationSettingsVo;
import cloud.xcan.angus.core.ai.interfaces.settings.facade.vo.SecuritySettingsVo;
import cloud.xcan.angus.core.ai.interfaces.settings.facade.vo.UploadAvatarVo;
import cloud.xcan.angus.core.ai.interfaces.settings.facade.vo.UserSettingsVo;
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
import org.springframework.http.MediaType;
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
import org.springframework.web.multipart.MultipartFile;

/**
 * 设置REST控制器
 */
@Tag(name = "Settings", description = "系统设置 - 用户偏好、通知、安全设置等")
@Validated
@RestController
@RequestMapping("/api/v1/settings")
public class SettingsRest {

  @Resource
  private SettingsFacade settingsFacade;

  // ==================== 数据导出 ====================

  @Operation(operationId = "requestDataExport", summary = "请求数据导出", description = "请求导出用户数据")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "202", description = "请求已提交")
  })
  @ResponseStatus(HttpStatus.ACCEPTED)
  @PostMapping("/data-export")
  public ApiLocaleResult<DataExportVo> requestDataExport(
      @Valid @RequestBody DataExportRequestDto dto) {
    Long userId = 1L;
    return ApiLocaleResult.success(settingsFacade.requestDataExport(userId, dto));
  }

  // ==================== 用户设置 ====================

  @Operation(operationId = "getUserSettings", summary = "获取用户设置", description = "获取当前用户的个人设置")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "获取成功")
  })
  @GetMapping("/profile")
  public ApiLocaleResult<UserSettingsVo> getUserSettings() {
    // TODO: 从当前登录用户获取userId
    Long userId = 1L;
    return ApiLocaleResult.success(settingsFacade.getUserSettings(userId));
  }

  @Operation(operationId = "updateUserSettings", summary = "更新用户设置", description = "更新用户个人设置")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "更新成功")
  })
  @PatchMapping("/profile")
  public ApiLocaleResult<UserSettingsVo> updateUserSettings(
      @Valid @RequestBody UserSettingsUpdateDto dto) {
    Long userId = 1L;
    return ApiLocaleResult.success(settingsFacade.updateUserSettings(userId, dto));
  }

  @Operation(operationId = "uploadAvatar", summary = "上传头像", description = "上传用户头像")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "上传成功")
  })
  @PostMapping(value = "/avatar", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
  public ApiLocaleResult<UploadAvatarVo> uploadAvatar(
      @Parameter(description = "头像文件") @RequestParam("avatar") MultipartFile file) {
    Long userId = 1L;
    return ApiLocaleResult.success(settingsFacade.uploadAvatar(userId, file));
  }

  // ==================== 通知设置 ====================

  @Operation(operationId = "getNotificationSettings", summary = "获取通知设置", description = "获取用户的通知设置")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "获取成功")
  })
  @GetMapping("/notifications")
  public ApiLocaleResult<NotificationSettingsVo> getNotificationSettings() {
    Long userId = 1L;
    return ApiLocaleResult.success(settingsFacade.getNotificationSettings(userId));
  }

  @Operation(operationId = "updateNotificationSettings", summary = "更新通知设置", description = "更新用户的通知设置")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "更新成功")
  })
  @PatchMapping("/notifications")
  public ApiLocaleResult<NotificationSettingsVo> updateNotificationSettings(
      @Valid @RequestBody NotificationSettingsUpdateDto dto) {
    Long userId = 1L;
    return ApiLocaleResult.success(settingsFacade.updateNotificationSettings(userId, dto));
  }

  // ==================== 安全设置 ====================

  @Operation(operationId = "getSecuritySettings", summary = "获取安全设置", description = "获取用户的安全设置")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "获取成功")
  })
  @GetMapping("/security")
  public ApiLocaleResult<SecuritySettingsVo> getSecuritySettings() {
    Long userId = 1L;
    return ApiLocaleResult.success(settingsFacade.getSecuritySettings(userId));
  }

  @Operation(operationId = "enable2FA", summary = "启用双因素认证", description = "启用双因素认证")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "启用成功")
  })
  @PostMapping("/security/2fa/enable")
  public ApiLocaleResult<Enable2FAVo> enable2FA(
      @Valid @RequestBody Enable2FADto dto) {
    Long userId = 1L;
    return ApiLocaleResult.success(settingsFacade.enable2FA(userId, dto));
  }

  @Operation(operationId = "verify2FA", summary = "验证双因素认证", description = "验证并完成双因素认证设置")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "验证成功")
  })
  @PostMapping("/security/2fa/verify")
  public ApiLocaleResult<SecuritySettingsVo> verify2FA(
      @Valid @RequestBody Verify2FADto dto) {
    Long userId = 1L;
    return ApiLocaleResult.success(settingsFacade.verify2FA(userId, dto));
  }

  @Operation(operationId = "disable2FA", summary = "禁用双因素认证", description = "禁用双因素认证")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "204", description = "禁用成功")
  })
  @ResponseStatus(HttpStatus.NO_CONTENT)
  @PostMapping("/security/2fa/disable")
  public void disable2FA(
      @Parameter(description = "当前密码") @RequestParam String password,
      @Parameter(description = "验证码") @RequestParam(required = false) String code) {
    Long userId = 1L;
    settingsFacade.disable2FA(userId, password, code);
  }

  @Operation(operationId = "changePassword", summary = "修改密码", description = "修改用户密码")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "修改成功")
  })
  @PostMapping("/security/change-password")
  public ApiLocaleResult<ChangePasswordVo> changePassword(
      @Valid @RequestBody ChangePasswordDto dto) {
    Long userId = 1L;
    return ApiLocaleResult.success(settingsFacade.changePassword(userId, dto));
  }

  @Operation(operationId = "terminateSession", summary = "终止会话", description = "终止指定会话")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "204", description = "终止成功")
  })
  @ResponseStatus(HttpStatus.NO_CONTENT)
  @DeleteMapping("/security/sessions/{sessionId}")
  public void terminateSession(
      @Parameter(description = "会话ID") @PathVariable String sessionId) {
    Long userId = 1L;
    settingsFacade.terminateSession(userId, sessionId);
  }

  @Operation(operationId = "revokeAllSessions", summary = "终止所有其他会话", description = "终止除当前外的所有会话")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "204", description = "终止成功")
  })
  @ResponseStatus(HttpStatus.NO_CONTENT)
  @PostMapping("/security/sessions/revoke-all")
  public void revokeAllSessions() {
    Long userId = 1L;
    String currentSessionId = "current-session-id"; // TODO: 从请求中获取
    settingsFacade.revokeAllSessions(userId, currentSessionId);
  }

  // ==================== 账户管理 ====================

  @Operation(operationId = "cancelDeleteAccount", summary = "取消删除账户", description = "取消账户删除请求")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "204", description = "取消成功")
  })
  @ResponseStatus(HttpStatus.NO_CONTENT)
  @PostMapping("/cancel-delete-account")
  public void cancelDeleteAccount() {
    Long userId = 1L;
    settingsFacade.cancelDeleteAccount(userId);
  }

  @Operation(operationId = "deleteAvatar", summary = "删除头像", description = "删除用户头像")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "204", description = "删除成功")
  })
  @ResponseStatus(HttpStatus.NO_CONTENT)
  @DeleteMapping("/avatar")
  public void deleteAvatar() {
    Long userId = 1L;
    settingsFacade.deleteAvatar(userId);
  }

  @Operation(operationId = "deleteAccount", summary = "删除账户", description = "请求删除用户账户")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "请求已提交")
  })
  @PostMapping("/delete-account")
  public ApiLocaleResult<DeleteAccountVo> deleteAccount(
      @Valid @RequestBody DeleteAccountDto dto) {
    Long userId = 1L;
    return ApiLocaleResult.success(settingsFacade.deleteAccount(userId, dto));
  }

  @Operation(operationId = "getDataExports", summary = "获取数据导出记录", description = "获取用户的数据导出记录")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "获取成功")
  })
  @GetMapping("/data-export")
  public ApiLocaleResult<List<DataExportVo>> getDataExports() {
    Long userId = 1L;
    return ApiLocaleResult.success(settingsFacade.getDataExports(userId));
  }
}
