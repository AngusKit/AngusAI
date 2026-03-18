package cloud.xcan.angus.api.enums;

/**
 * 月份枚举，与 java.time.Month 对应，用于 API 返回。
 * 国际化由前端处理。
 */
public enum Month {
  JANUARY(1),
  FEBRUARY(2),
  MARCH(3),
  APRIL(4),
  MAY(5),
  JUNE(6),
  JULY(7),
  AUGUST(8),
  SEPTEMBER(9),
  OCTOBER(10),
  NOVEMBER(11),
  DECEMBER(12);

  private final int value;

  Month(int value) {
    this.value = value;
  }

  public int getValue() {
    return value;
  }

  public static Month of(int monthValue) {
    if (monthValue < 1 || monthValue > 12) {
      throw new IllegalArgumentException("Invalid value for Month: " + monthValue);
    }
    return values()[monthValue - 1];
  }
}
