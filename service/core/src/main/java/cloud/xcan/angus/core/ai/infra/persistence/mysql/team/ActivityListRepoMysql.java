package cloud.xcan.angus.core.ai.infra.persistence.mysql.team;

import static cloud.xcan.angus.core.jpa.criteria.CriteriaUtils.findFirstValue;
import static cloud.xcan.angus.core.jpa.criteria.CriteriaUtils.findValueAndRemove;
import static cloud.xcan.angus.spec.utils.ObjectUtils.isEmpty;

import cloud.xcan.angus.api.commonlink.FullResourceType;
import cloud.xcan.angus.core.ai.domain.team.activity.Activity;
import cloud.xcan.angus.core.ai.domain.team.activity.ActivityListRepo;
import cloud.xcan.angus.core.jpa.repository.AbstractSearchRepository;
import cloud.xcan.angus.core.jpa.repository.SearchMode;
import cloud.xcan.angus.remote.search.SearchCriteria;
import java.util.Set;
import org.springframework.stereotype.Repository;

@Repository
public class ActivityListRepoMysql extends AbstractSearchRepository<Activity>
    implements ActivityListRepo {

  @Override
  public StringBuilder getSqlTemplate(Set<SearchCriteria> criteria, Class<Activity> mainClz,
      Object[] objects, String... matches) {
    return getSqlTemplate0(getSearchMode(), mainClz, criteria, "activity", matches);
  }

  @Override
  public StringBuilder getSqlTemplate0(SearchMode mode, Class<Activity> mainClz,
      Set<SearchCriteria> criteria, String tableName, String... matches) {
    StringBuilder sql;
    String targetTypeValue = findFirstValue(criteria, "targetType");
    String targetIdValue = findFirstValue(criteria, "targetId");
    if (isEmpty(targetTypeValue) || targetTypeValue.contains(",") /* IN filter*/
        || !FullResourceType.valueOf(targetTypeValue).isParent() || isEmpty(targetIdValue)) {
      String mainAlis = "a";

      // Assemble mainClass table
      sql = new StringBuilder("SELECT %s FROM " + tableName + " " + mainAlis + " WHERE 1=1 ");

      // Assemble mainClass Conditions
      sql.append(getCriteriaAliasCondition(criteria, mainClz, mainAlis, mode, false, matches));
    } else {
      // Note: Only a single targetType value is supported.
      String mainAlis = "a";
      String subAlis = "b";
      findValueAndRemove(criteria, "targetType");
      findValueAndRemove(criteria, "targetId");

      // Query parent activities
      sql = new StringBuilder(
          "SELECT %s FROM " + tableName + " " + mainAlis + " WHERE " + mainAlis + ".id IN (");
      sql.append("SELECT id FROM " + tableName + " " + subAlis + " WHERE " + subAlis
              + ".target_id=" + targetIdValue + " AND " + subAlis + ".target_type='" + targetTypeValue
              + "' ")
          .append(getCriteriaAliasCondition(criteria, mainClz, subAlis, mode, false, matches));

      // Union sub activities

      sql.append(" UNION SELECT id FROM " + tableName + " " + subAlis + " WHERE " + subAlis
          + ".parent_target_id=" + targetIdValue);
      sql.append(getCriteriaAliasCondition(criteria, mainClz, subAlis, mode, false, matches));

      sql.append(" )");
    }
    return sql;
  }

  @Override
  public String getReturnFieldsCondition(Set<SearchCriteria> criteria, Object[] params) {
    return "a.*";
  }

}
