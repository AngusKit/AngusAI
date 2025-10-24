package cloud.xcan.angus.core.ai.interfaces.application.facade.internal;

import static cloud.xcan.angus.core.jpa.criteria.SearchCriteriaBuilder.getMatchSearchFields;
import static cloud.xcan.angus.core.utils.CoreUtils.buildVoPageResult;

import cloud.xcan.angus.core.ai.application.cmd.application.ApplicationCmd;
import cloud.xcan.angus.core.ai.application.query.application.ApplicationQuery;
import cloud.xcan.angus.core.ai.domain.application.Application;
import cloud.xcan.angus.core.ai.domain.application.ApplicationConfig;
import cloud.xcan.angus.core.ai.domain.application.ApplicationStatus;
import cloud.xcan.angus.core.ai.interfaces.application.facade.ApplicationFacade;
import cloud.xcan.angus.core.ai.interfaces.application.facade.dto.ApplicationCreateDto;
import cloud.xcan.angus.core.ai.interfaces.application.facade.dto.ApplicationDuplicateDto;
import cloud.xcan.angus.core.ai.interfaces.application.facade.dto.ApplicationFindDto;
import cloud.xcan.angus.core.ai.interfaces.application.facade.dto.ApplicationShareDto;
import cloud.xcan.angus.core.ai.interfaces.application.facade.dto.ApplicationUpdateDto;
import cloud.xcan.angus.core.ai.interfaces.application.facade.internal.assembler.ApplicationAssembler;
import cloud.xcan.angus.core.ai.interfaces.application.facade.vo.ApplicationDetailVo;
import cloud.xcan.angus.core.ai.interfaces.application.facade.vo.ApplicationListVo;
import cloud.xcan.angus.core.ai.interfaces.application.facade.vo.ApplicationStatisticsVo;
import cloud.xcan.angus.core.biz.NameJoin;
import cloud.xcan.angus.core.jpa.criteria.GenericSpecification;
import cloud.xcan.angus.remote.PageResult;
import jakarta.annotation.Resource;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Component;

@Component
public class ApplicationFacadeImpl implements ApplicationFacade {

  @Resource
  private ApplicationQuery applicationQuery;

  @Resource
  private ApplicationCmd applicationCmd;

  @Override
  public ApplicationDetailVo create(ApplicationCreateDto dto) {
    Application application = ApplicationAssembler.toDomain(dto);
    Application saved = applicationCmd.create(application);
    return ApplicationAssembler.toDetailVo(saved);
  }

  @Override
  public ApplicationDetailVo duplicate(Long id, ApplicationDuplicateDto dto) {
    Application saved = applicationCmd.duplicate(id, dto.getName());
    return ApplicationAssembler.toDetailVo(saved);
  }

  @Override
  public ApplicationDetailVo update(Long id, ApplicationUpdateDto dto) {
    Application application = ApplicationAssembler.updateDomain(id, dto);
    Application saved = applicationCmd.update(application);
    return ApplicationAssembler.toDetailVo(saved);
  }

  @Override
  public ApplicationDetailVo updateConfig(Long id, ApplicationConfig config) {
    Application saved = applicationCmd.updateConfig(id, config);
    return ApplicationAssembler.toDetailVo(saved);
  }

  @Override
  public ApplicationDetailVo modifyStatus(Long id, ApplicationStatus status) {
    Application saved = applicationCmd.modifyStatus(id, status);
    return ApplicationAssembler.toDetailVo(saved);
  }

  @Override
  public ApplicationDetailVo share(Long id, ApplicationShareDto dto) {
    Application application = ApplicationAssembler.shareDomain(id, dto);
    Application saved = applicationCmd.share(application);
    return ApplicationAssembler.toDetailVo(saved);
  }

  @Override
  public void delete(Long id) {
    applicationCmd.delete(id);
  }

  @NameJoin
  @Override
  public ApplicationDetailVo getDetail(Long id) {
    Application application = applicationQuery.findById(id);
    return ApplicationAssembler.toDetailVo(application);
  }

  @NameJoin
  @Override
  public PageResult<ApplicationListVo> list(ApplicationFindDto dto) {
    GenericSpecification<Application> spec = ApplicationAssembler.getSpecification(dto);
    Page<Application> page = applicationQuery.find(spec, dto.tranPage(),
        dto.fullTextSearch, getMatchSearchFields(dto.getClass()));
    return buildVoPageResult(page, ApplicationAssembler::toListVo);
  }

  @Override
  public ApplicationStatisticsVo getStatistics(Long id, String startDate, String endDate,
      String period) {
    // 这里应该调用统计服务获取详细数据
    // 暂时返回模拟数据
    ApplicationStatisticsVo statistics = new ApplicationStatisticsVo();
    // TODO: 实现统计逻辑
    return statistics;
  }
}
