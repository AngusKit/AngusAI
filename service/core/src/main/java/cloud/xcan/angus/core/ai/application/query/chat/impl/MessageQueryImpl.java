package cloud.xcan.angus.core.ai.application.query.chat.impl;

import cloud.xcan.angus.core.ai.application.query.chat.MessageQuery;
import cloud.xcan.angus.core.ai.domain.chat.Message;
import cloud.xcan.angus.core.ai.domain.chat.MessageRepo;
import cloud.xcan.angus.core.ai.domain.chat.MessageRole;
import cloud.xcan.angus.core.ai.interfaces.chat.facade.vo.ChatStatisticsVo.UsageTrend;
import cloud.xcan.angus.core.biz.BizTemplate;
import cloud.xcan.angus.core.jpa.criteria.GenericSpecification;
import cloud.xcan.angus.remote.message.http.ResourceNotFound;
import jakarta.annotation.Resource;
import java.util.List;
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
  public List<Message> findBySessionId(Long sessionId) {
    return new BizTemplate<List<Message>>() {
      @Override
      protected List<Message> process() {
        return messageRepo.findBySessionIdOrderByCreatedDateAsc(sessionId);
      }
    }.execute();
  }

  @Override
  public Page<Message> findBySessionId(Long sessionId, PageRequest pageable) {
    return new BizTemplate<Page<Message>>() {
      @Override
      protected Page<Message> process() {
        return messageRepo.findBySessionIdOrderByCreatedDateDesc(sessionId, pageable);
      }
    }.execute();
  }

  @Override
  public Message findLastMessageBySessionId(String sessionId) {
    return new BizTemplate<Message>() {
      @Override
      protected Message process() {
        return messageRepo.findFirstBySessionIdOrderByCreatedDateDesc(sessionId);
      }
    }.execute();
  }

  @Override
  public long countBySessionId(String sessionId) {
    return new BizTemplate<Long>() {
      @Override
      protected Long process() {
        return messageRepo.countBySessionId(sessionId);
      }
    }.execute();
  }

  @Override
  public Page<Message> find(GenericSpecification<Message> spec, PageRequest pageable) {
    return new BizTemplate<Page<Message>>() {
      @Override
      protected Page<Message> process() {
        return messageRepo.findAll(spec, pageable);
      }
    }.execute();
  }

  @Override
  public List<Message> findBySessionIdAndRole(Long sessionId, MessageRole role) {
    return new BizTemplate<List<Message>>() {
      @Override
      protected List<Message> process() {
        return messageRepo.findBySessionIdAndRole(sessionId, role);
      }
    }.execute();
  }

  @Override
  public List<Message> findStreamingMessages(Long sessionId) {
    return new BizTemplate<List<Message>>() {
      @Override
      protected List<Message> process() {
        return messageRepo.findBySessionIdAndIsStreamingTrue(sessionId);
      }
    }.execute();
  }

  @Override
  public List<Message> findByParentMessageId(Long parentMessageId) {
    return new BizTemplate<List<Message>>() {
      @Override
      protected List<Message> process() {
        return messageRepo.findByParentMessageId(parentMessageId);
      }
    }.execute();
  }

  @Override
  public List<Message> findRecentBySessionId(Long sessionId, int limit) {
    return new BizTemplate<List<Message>>() {
      @Override
      protected List<Message> process() {
        return messageRepo.findBySessionIdOrderByCreatedDateDesc(sessionId,
            PageRequest.of(0, limit)).getContent();
      }
    }.execute();
  }

  @Override
  public void updateContent(Long messageId, String content) {
    new BizTemplate<Void>() {
      @Override
      protected Void process() {
        Message message = messageRepo.findById(messageId)
            .orElseThrow(() -> ResourceNotFound.of("消息不存在", new Object[]{}));
        message.setContent(content);
        messageRepo.save(message);
        return null;
      }
    }.execute();
  }

  @Override
  public List<UsageTrend> getUsageTrend(int days) {
    return List.of();
  }

  @Override
  public Long countAll() {
    return 0L;
  }

  @Override
  public Long countToday() {
    return 0L;
  }
}
