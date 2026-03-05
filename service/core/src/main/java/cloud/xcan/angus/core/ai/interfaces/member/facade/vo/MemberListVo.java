package cloud.xcan.angus.core.ai.interfaces.member.facade.vo;

import cloud.xcan.angus.api.gm.user.vo.UserListVo;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.Setter;
import org.springframework.beans.BeanUtils;

@Setter
@Getter
public class MemberListVo extends UserListVo {

  @Schema(description = "共享资源数")
  private int shareCount;

  @Schema(description = "访问共享资源数")
  private int shareAccessCount;

  /**
   * 从 UserListVo 构建 MemberListVo
   */
  public static MemberListVo of(UserListVo userListVo) {
    MemberListVo vo = new MemberListVo();
    BeanUtils.copyProperties(userListVo, vo);
    return vo;
  }
}
