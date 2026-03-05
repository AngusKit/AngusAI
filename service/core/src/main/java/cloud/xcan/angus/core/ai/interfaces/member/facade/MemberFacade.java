package cloud.xcan.angus.core.ai.interfaces.member.facade;

import cloud.xcan.angus.api.gm.user.dto.UserFindDto;
import cloud.xcan.angus.core.ai.interfaces.member.facade.vo.MemberDetailVo;
import cloud.xcan.angus.core.ai.interfaces.member.facade.vo.MemberListVo;
import cloud.xcan.angus.remote.PageResult;

public interface MemberFacade {

  MemberDetailVo getDetail(Long id);

  PageResult<MemberListVo> list(UserFindDto dto);
}
