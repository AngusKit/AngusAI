package cloud.xcan.angus.core.ai.domain;

/**
 * 统计周期
 * <p>
 * TODAY       -> 今天 LAST_7_DAYS -> 近一周 LAST_30_DAYS-> 近一月
 */
public enum StatisticsPeriod {
  TODAY,
  LAST_7_DAYS,
  LAST_30_DAYS,
  LAST_YEAR
}

