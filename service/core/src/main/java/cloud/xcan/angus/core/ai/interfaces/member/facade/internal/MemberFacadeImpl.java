package cloud.xcan.angus.core.ai.interfaces.member.facade.internal;

import cloud.xcan.angus.api.gm.user.UserRemote;
import cloud.xcan.angus.api.gm.user.dto.UserFindDto;
import cloud.xcan.angus.api.gm.user.vo.UserDetailVo;
import cloud.xcan.angus.api.gm.user.vo.UserListVo;
import cloud.xcan.angus.core.ai.application.query.sharing.ResourceSharingAccessLogQuery;
import cloud.xcan.angus.core.ai.application.query.sharing.ResourceSharingQuery;
import cloud.xcan.angus.core.ai.interfaces.member.facade.MemberFacade;
import cloud.xcan.angus.core.ai.interfaces.member.facade.vo.MemberDetailVo;
import cloud.xcan.angus.core.ai.interfaces.member.facade.vo.MemberListVo;
import cloud.xcan.angus.remote.PageResult;
import jakarta.annotation.Resource;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import org.springframework.stereotype.Component;

@Component
public class MemberFacadeImpl implements MemberFacade {

  @Resource
  private UserRemote userRemote;

  @Resource
  private ResourceSharingQuery resourceSharingQuery;

  @Resource
  private ResourceSharingAccessLogQuery resourceSharingAccessLogQuery;

  @Override
  public MemberDetailVo getDetail(Long id) {
    UserDetailVo userDetailVo = userRemote.getDetail(id).orElseContentThrow();
    MemberDetailVo memberDetailVo = MemberDetailVo.of(userDetailVo);
    Map<Long, Integer> shareCountMap = resourceSharingQuery.getShareCountMap(List.of(id));
    Map<Long, Integer> accessCountMap = resourceSharingAccessLogQuery.getAccessCountMap(
        List.of(id));
    memberDetailVo.setShareCount(shareCountMap.getOrDefault(id, 0));
    memberDetailVo.setShareAccessCount(accessCountMap.getOrDefault(id, 0));
    return memberDetailVo;
  }

  @Override
  public PageResult<MemberListVo> list(UserFindDto dto) {
    PageResult<UserListVo> userListVoPage = userRemote.list(dto).orElseContentThrow();
    if (userListVoPage != null && !userListVoPage.isEmpty()) {
      List<MemberListVo> memberListVos = userListVoPage.getList().stream()
          .map(MemberListVo::of).collect(Collectors.toList());
      List<Long> userIds = memberListVos.stream().map(MemberListVo::getId).toList();
      Map<Long, Integer> userShareCountMap
          = resourceSharingQuery.getShareCountMap(userIds);
      for (MemberListVo memberListVo : memberListVos) {
        memberListVo.setShareCount(userShareCountMap.getOrDefault(memberListVo.getId(), 0));
      }
      Map<Long, Integer> userShareAccessCountMap
          = resourceSharingAccessLogQuery.getAccessCountMap(userIds);
      for (MemberListVo memberListVo : memberListVos) {
        memberListVo.setShareAccessCount(
            userShareAccessCountMap.getOrDefault(memberListVo.getId(), 0));
      }
      return PageResult.of(userListVoPage.getTotal(), memberListVos);
    }
    return null;
  }
}
