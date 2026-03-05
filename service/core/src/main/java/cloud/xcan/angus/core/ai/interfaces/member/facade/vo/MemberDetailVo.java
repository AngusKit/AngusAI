package cloud.xcan.angus.core.ai.interfaces.member.facade.vo;

import cloud.xcan.angus.api.gm.user.vo.UserDetailVo;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.Setter;
import org.springframework.beans.BeanUtils;

@Setter
@Getter
public class MemberDetailVo extends UserDetailVo {

  @Schema(description = "共享资源数")
  private int shareCount;

  @Schema(description = "访问共享资源数")
  private int shareAccessCount;

  /**
   * 从 UserDetailVo 构建 MemberDetailVo
   */
  public static MemberDetailVo of(UserDetailVo userDetailVo) {
    MemberDetailVo vo = new MemberDetailVo();
    BeanUtils.copyProperties(userDetailVo, vo);
    return vo;
  }
}
