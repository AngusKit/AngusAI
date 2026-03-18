package cloud.xcan.angus.core.ai.application.query.chat.impl;

import cloud.xcan.angus.core.ai.application.query.chat.MessageQuery;
import cloud.xcan.angus.core.ai.domain.chat.Message;
import cloud.xcan.angus.core.ai.domain.chat.MessageRepo;
import cloud.xcan.angus.core.ai.domain.chat.MessageSearchRepo;
import cloud.xcan.angus.core.ai.domain.chat.SessionRepo;
import cloud.xcan.angus.core.ai.interfaces.chat.facade.vo.ChatStatisticsVo.UsageTrend;
import cloud.xcan.angus.core.biz.BizTemplate;
import cloud.xcan.angus.core.jpa.criteria.GenericSpecification;
import cloud.xcan.angus.core.utils.PrincipalContextUtils;
import cloud.xcan.angus.remote.message.http.ResourceNotFound;
import jakarta.annotation.Resource;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

/**
 * 消息查询实现
 */
@Service
public class MessageQueryImpl implements MessageQuery {

  @Resource
  private MessageRepo messageRepo;

  @Resource
  private SessionRepo sessionRepo;

  @Resource
  private MessageSearchRepo messageSearchRepo;

  @Override
  public Message findById(Long id) {
    return new BizTemplate<Message>() {
      @Override
      protected Message process() {
        return messageRepo.findById(id).orElse(null);
      }
    }.execute();
  }

  @Override
  public Message findAndCheck(Long id) {
    return new BizTemplate<Message>() {
      @Override
      protected Message process() {
        return messageRepo.findById(id)
            .orElseThrow(() -> ResourceNotFound.of("消息「{0}」不存在", new Object[]{id}));
      }
    }.execute();
  }

  @Override
  public Page<Message> find(GenericSpecification<Message> spec, PageRequest pageable,
      boolean fullTextSearch, String[] match) {
    return new BizTemplate<Page<Message>>() {
      @Override
      protected Page<Message> process() {
        return fullTextSearch
            ? messageSearchRepo.find(spec.getCriteria(), pageable, Message.class, match)
            : messageRepo.findAll(spec, pageable);
      }
    }.execute();
  }

  @Override
  public List<Message> findStreamingMessages(String sessionId) {
    return new BizTemplate<List<Message>>() {
      @Override
      protected List<Message> process() {
        return messageRepo.findBySessionIdAndIsStreamingTrue(sessionId);
      }
    }.execute();
  }

  @Override
  public List<UsageTrend> getUsageTrend(int days) {
    final int trendDays = days;
    return new BizTemplate<List<UsageTrend>>() {
      @Override
      protected List<UsageTrend> process() {
        List<UsageTrend> trends = new ArrayList<>();
        DateTimeFormatter fmt = DateTimeFormatter.ISO_LOCAL_DATE;
        for (int i = trendDays - 1; i >= 0; i--) {
          LocalDate day = LocalDate.now().minusDays(i);
          LocalDateTime start = day.atStartOfDay();
          LocalDateTime end = day.atTime(23, 59, 59, 999_999_999);
          long sessionCount = sessionRepo.countByCreatedDateBetween(start, end);
          long messageCount = messageRepo.countByCreatedDateBetween(start, end);
          UsageTrend t = new UsageTrend();
          t.setDate(day.format(fmt));
          t.setSessions(sessionCount);
          t.setMessages(messageCount);
          t.setTokens(null);
          trends.add(t);
        }
        return trends;
      }
    }.execute();
  }

  @Override
  public Long countAll() {
    return new BizTemplate<Long>() {
      @Override
      protected Long process() {
        return messageRepo.count();
      }
    }.execute();
  }

  @Override
  public Long countToday() {
    return new BizTemplate<Long>() {
      @Override
      protected Long process() {
        LocalDateTime start = LocalDate.now().atStartOfDay();
        LocalDateTime end = LocalDateTime.now();
        return messageRepo.countByCreatedDateBetween(start, end);
      }
    }.execute();
  }

  @Override
  public Map<String, Message> findLastMessageMapBySessionIds(List<String> sessionIds) {
    if (sessionIds == null || sessionIds.isEmpty()) {
      return new HashMap<>();
    }

    List<String> validIds = sessionIds.stream()
        .filter(sid -> sid != null && !sid.isBlank())
        .toList();
    if (validIds.isEmpty()) {
      return new HashMap<>();
    }

    Map<String, Message> result = new HashMap<>();

    boolean multiTenantCtrl = PrincipalContextUtils.isMultiTenantCtrl();
    try {
      if (multiTenantCtrl) {
        PrincipalContextUtils.setMultiTenantCtrl(false);
      }
      List<Message> messages = messageRepo.findLastMessageBySessionIds(validIds);
      for (Message msg : messages) {
        if (msg != null && msg.getSessionId() != null) {
          result.put(msg.getSessionId(), msg);
        }
      }
    } finally {
      if (multiTenantCtrl) {
        PrincipalContextUtils.setMultiTenantCtrl(true);
      }
    }
    return result;
  }

  @Override
  public long countActiveConversations() {
    return new BizTemplate<Long>() {
      @Override
      protected Long process() {
        return messageRepo.countActiveConversations();
      }
    }.execute();
  }
}
