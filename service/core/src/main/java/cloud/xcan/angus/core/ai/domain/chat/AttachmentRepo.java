package cloud.xcan.angus.core.ai.domain.chat;

import cloud.xcan.angus.core.jpa.repository.BaseRepository;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.NoRepositoryBean;

/**
 * 附件仓储接口
 */
@NoRepositoryBean
public interface AttachmentRepo extends BaseRepository<Attachment, Long> {

    /**
     * 根据路径包含内容查询附件
     */
    List<Attachment> findByPathContaining(String path);

    /**
     * 根据会话ID查询附件列表
     */
    List<Attachment> findBySessionId(Long sessionId);

    /**
     * 根据会话ID分页查询附件
     */
    Page<Attachment> findBySessionId(Long sessionId, Pageable pageable);

    /**
     * 根据文件名查询附件
     */
    List<Attachment> findByName(String name);

    /**
     * 根据文件类型查询附件
     */
    List<Attachment> findByType(String type);

    /**
     * 查询最近上传的附件
     */
    Page<Attachment> findRecentAttachments(Pageable pageable);

    /**
     * 统计会话的附件数量
     */
    long countBySessionId(Long sessionId);

    /**
     * 删除会话的所有附件
     */
    void deleteBySessionId(Long sessionId);
}
