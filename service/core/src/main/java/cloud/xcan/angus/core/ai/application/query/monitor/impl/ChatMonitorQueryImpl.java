package cloud.xcan.angus.core.ai.application.query.monitor.impl;

import cloud.xcan.angus.api.enums.Month;
import cloud.xcan.angus.core.ai.application.query.chat.MessageQuery;
import cloud.xcan.angus.core.ai.application.query.monitor.ChatMonitorQuery;
import cloud.xcan.angus.core.ai.domain.chat.MessageRepo;
import cloud.xcan.angus.core.ai.domain.chat.SessionRepo;
import cloud.xcan.angus.core.ai.interfaces.monitor.facade.dto.ChatMonitorChartQueryDto;
import cloud.xcan.angus.core.ai.interfaces.monitor.facade.vo.ChatMonitorOverviewVo;
import cloud.xcan.angus.core.ai.interfaces.monitor.facade.vo.ChatMonitorOverviewVo.DualStatsVo;
import cloud.xcan.angus.core.ai.interfaces.monitor.facade.vo.ChatMonitorOverviewVo.FeedbackStatsVo;
import cloud.xcan.angus.core.ai.interfaces.monitor.facade.vo.ChatMonitorOverviewVo.ThroughputStatsVo;
import cloud.xcan.angus.core.ai.interfaces.monitor.facade.vo.ChartDataPointVo;
import jakarta.annotation.Resource;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.YearMonth;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;

/**
 * 对话监控查询实现
 */
@Service
public class ChatMonitorQueryImpl implements ChatMonitorQuery {

  @Resource
  private SessionRepo sessionRepo;

  @Resource
  private MessageRepo messageRepo;

  @Resource
  private MessageQuery messageQuery;

  @Override
  public ChatMonitorOverviewVo getOverview() {
    LocalDateTime now = LocalDateTime.now();
    LocalDate today = now.toLocalDate();
    LocalDateTime todayStart = today.atStartOfDay();
    LocalDateTime todayEnd = today.atTime(LocalTime.MAX);

    // 活动/总数统计：统一从 MessageQuery 获取（活动=10分钟内流式中，总=历史）
    Map<String, Long> activeStats = messageQuery.countActive();
    Map<String, Long> totalStats = messageQuery.getTotalStats();
    long sessionsActive = activeStats.getOrDefault("sessions", 0L);
    long sessionsTotal = totalStats.getOrDefault("sessions", 0L);
    long messagesActive = activeStats.getOrDefault("messages", 0L);
    long messagesTotal = totalStats.getOrDefault("messages", 0L);
    long usersActive = activeStats.getOrDefault("users", 0L);
    long usersTotal = totalStats.getOrDefault("users", 0L);

    // 反馈统计（全量）
    long likeCount = messageRepo.countByFeedbackType("like");
    long dislikeCount = messageRepo.countByFeedbackType("dislike");

    // 吞吐量：当天按分钟分组统计，0 填充，当前为完整近一分钟
    ThroughputStatsVo throughput = buildThroughputStats(todayStart, todayEnd, now);

    ChatMonitorOverviewVo vo = new ChatMonitorOverviewVo();
    vo.setThroughput(throughput);
    vo.setSessions(new DualStatsVo(sessionsActive, sessionsTotal));
    vo.setMessages(new DualStatsVo(messagesActive, messagesTotal));
    vo.setUsers(new DualStatsVo(usersActive, usersTotal));
    vo.setFeedback(new FeedbackStatsVo(likeCount, dislikeCount, likeCount + dislikeCount));
    vo.setApplications(new DualStatsVo(
        activeStats.getOrDefault("apps", 0L), totalStats.getOrDefault("apps", 0L)));
    vo.setAgents(new DualStatsVo(
        activeStats.getOrDefault("agents", 0L), totalStats.getOrDefault("agents", 0L)));
    vo.setModels(new DualStatsVo(
        activeStats.getOrDefault("models", 0L), totalStats.getOrDefault("models", 0L)));
    return vo;
  }

  /**
   * 吞吐量：当天时间范围内按分钟分组，无值用 0 填充，计算 min/max/avg，
   * 当前吞吐量 = 完整近一分钟内的消息数。
   */
  private ThroughputStatsVo buildThroughputStats(LocalDateTime todayStart, LocalDateTime todayEnd,
      LocalDateTime now) {
    List<Object[]> rows = messageRepo.countByMinuteForDate(todayStart, todayEnd);
    Map<Integer, Long> minuteToCount = new LinkedHashMap<>();
    for (Object[] row : rows) {
      int minute = ((Number) row[0]).intValue();
      long count = ((Number) row[1]).longValue();
      minuteToCount.put(minute, count);
    }

    int totalMinutes = 24 * 60;
    double throughputMin = Double.MAX_VALUE;
    double throughputMax = 0;
    double sum = 0;
    int filledCount = 0;
    for (int m = 0; m < totalMinutes; m++) {
      long count = minuteToCount.getOrDefault(m, 0L);
      double val = count;
      if (val < throughputMin) {
        throughputMin = val;
      }
      if (val > throughputMax) {
        throughputMax = val;
      }
      sum += val;
      filledCount++;
    }
    if (filledCount == 0) {
      throughputMin = 0;
    }
    double throughputAvg = filledCount > 0 ? sum / filledCount : 0;

    // 当前吞吐量：完整近一分钟（上一分钟）内的消息数
    LocalDateTime lastMinuteStart = now.minusMinutes(1).withSecond(0).withNano(0);
    LocalDateTime lastMinuteEnd = lastMinuteStart.plusMinutes(1).minusNanos(1);
    long currentCount = messageRepo.countByCreatedDateBetween(lastMinuteStart, lastMinuteEnd);
    double throughputCurrent = currentCount;

    ThroughputStatsVo vo = new ThroughputStatsVo();
    vo.setCurrent(throughputCurrent);
    vo.setMin(throughputMin);
    vo.setMax(throughputMax);
    vo.setAverage(throughputAvg);
    return vo;
  }

  @Override
  public List<ChartDataPointVo> getSessionsChartData(ChatMonitorChartQueryDto dto) {
    return buildChartDataFromBatch(dto, sessionRepo::countByMonthForYear,
        sessionRepo::countByDayForMonth, sessionRepo::countByHourForDay, "sess");
  }

  @Override
  public List<ChartDataPointVo> getMessagesChartData(ChatMonitorChartQueryDto dto) {
    return buildChartDataFromBatch(dto, messageRepo::countByMonthForYear,
        messageRepo::countByDayForMonth, messageRepo::countByHourForDay, "msg");
  }

  @Override
  public List<ChartDataPointVo> getFeedbackChartData(ChatMonitorChartQueryDto dto) {
    return buildChartDataFromBatch(dto, messageRepo::countFeedbackByMonthForYear,
        messageRepo::countFeedbackByDayForMonth, messageRepo::countFeedbackByHourForDay, "fb");
  }

  private interface CountByMonth {
    List<Object[]> count(LocalDateTime start, LocalDateTime end);
  }

  private interface CountByDay {
    List<Object[]> count(LocalDateTime start, LocalDateTime end);
  }

  private interface CountByHour {
    List<Object[]> count(LocalDateTime start, LocalDateTime end);
  }

  private List<ChartDataPointVo> buildChartDataFromBatch(ChatMonitorChartQueryDto dto,
      CountByMonth countByMonth, CountByDay countByDay, CountByHour countByHour, String prefix) {
    String range = dto.getRange() != null ? dto.getRange() : "day";
    int year = parseYear(dto.getYear());
    int month = parseMonth(dto.getMonth());
    int day = parseDay(dto.getDay());

    List<ChartDataPointVo> result = new ArrayList<>();
    if ("year".equals(range)) {
      LocalDateTime yearStart = LocalDate.of(year, 1, 1).atStartOfDay();
      LocalDateTime yearEnd = LocalDate.of(year, 12, 31).atTime(LocalTime.MAX);
      List<Object[]> rows = countByMonth.count(yearStart, yearEnd);
      Map<Integer, Long> monthToCount = rows.stream()
          .collect(Collectors.toMap(r -> ((Number) r[0]).intValue(), r -> ((Number) r[1]).longValue()));
      for (int m = 1; m <= 12; m++) {
        long value = monthToCount.getOrDefault(m, 0L);
        String dateLabel = Month.of(m).name();
        result.add(new ChartDataPointVo(prefix + "-y-" + m, dateLabel, value));
      }
    } else if ("month".equals(range)) {
      YearMonth ym = YearMonth.of(year, month);
      LocalDateTime monthStart = ym.atDay(1).atStartOfDay();
      LocalDateTime monthEnd = ym.atEndOfMonth().atTime(LocalTime.MAX);
      List<Object[]> rows = countByDay.count(monthStart, monthEnd);
      Map<Integer, Long> dayToCount = rows.stream()
          .collect(Collectors.toMap(r -> ((Number) r[0]).intValue(), r -> ((Number) r[1]).longValue()));
      int days = ym.lengthOfMonth();
      for (int d = 1; d <= days; d++) {
        long value = dayToCount.getOrDefault(d, 0L);
        result.add(new ChartDataPointVo(prefix + "-m-" + d, String.valueOf(d), value));
      }
    } else {
      LocalDate date = LocalDate.of(year, month, day);
      LocalDateTime dayStart = date.atStartOfDay();
      LocalDateTime dayEnd = date.atTime(LocalTime.MAX);
      List<Object[]> rows = countByHour.count(dayStart, dayEnd);
      Map<Integer, Long> hourToCount = rows.stream()
          .collect(Collectors.toMap(r -> ((Number) r[0]).intValue(), r -> ((Number) r[1]).longValue()));
      for (int h = 0; h < 24; h++) {
        long value = hourToCount.getOrDefault(h, 0L);
        result.add(new ChartDataPointVo(prefix + "-d-" + h, h + ":00", value));
      }
    }
    return result;
  }

  private int parseYear(String s) {
    if (s != null && !s.isEmpty()) {
      try {
        return Integer.parseInt(s);
      } catch (NumberFormatException ignored) {
      }
    }
    return LocalDate.now().getYear();
  }

  private int parseMonth(String s) {
    if (s != null && !s.isEmpty()) {
      try {
        return Math.max(1, Math.min(12, Integer.parseInt(s)));
      } catch (NumberFormatException ignored) {
      }
    }
    return LocalDate.now().getMonthValue();
  }

  private int parseDay(String s) {
    if (s != null && !s.isEmpty()) {
      try {
        return Integer.parseInt(s);
      } catch (NumberFormatException ignored) {
      }
    }
    return LocalDate.now().getDayOfMonth();
  }
}
