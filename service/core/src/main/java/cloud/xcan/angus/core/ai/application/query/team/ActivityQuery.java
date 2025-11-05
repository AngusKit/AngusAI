package cloud.xcan.angus.core.ai.application.query.team;

import cloud.xcan.angus.core.ai.domain.team.activity.Activity;
import cloud.xcan.angus.core.jpa.criteria.GenericSpecification;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;

public interface ActivityQuery {

  Page<Activity> find(GenericSpecification<Activity> spec, PageRequest pageable,
      boolean fullTextSearch, String[] match);

}
