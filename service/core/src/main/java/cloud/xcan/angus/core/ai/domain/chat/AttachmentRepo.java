package cloud.xcan.angus.core.ai.domain.chat;

import cloud.xcan.angus.infra.jpa.common.BaseRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * 附件仓储接口
 */
@Repository
public interface AttachmentRepo extends BaseRepository<Attachment, Long> {

  // ==================== 查询方法 ====================
  
  /**
   * 根据会话ID查询附件列表
   */
  List<Attachment> findBySessionId(Long sessionId);

  // ==================== 删除方法 ====================
  
  /**
   * 删除会话的所有附件
   */
  void deleteBySessionId(Long sessionId);
}
