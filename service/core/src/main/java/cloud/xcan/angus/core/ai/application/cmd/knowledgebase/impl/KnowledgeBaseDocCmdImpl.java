package cloud.xcan.angus.core.ai.application.cmd.knowledgebase.impl;

import cloud.xcan.angus.core.ai.application.cmd.knowledgebase.KnowledgeBaseDocCmd;
import cloud.xcan.angus.core.ai.application.query.knowledgebase.KnowledgeBaseDocQuery;
import cloud.xcan.angus.core.ai.application.query.knowledgebase.KnowledgeBaseQuery;
import cloud.xcan.angus.core.ai.domain.knowledgebase.DocumentStatus;
import cloud.xcan.angus.core.ai.domain.knowledgebase.KnowledgeBaseDoc;
import cloud.xcan.angus.core.ai.domain.knowledgebase.KnowledgeBaseDocRepo;
import cloud.xcan.angus.core.ai.interfaces.knowledgebase.facade.internal.assembler.KnowledgeBaseDocAssembler;
import cloud.xcan.angus.core.ai.interfaces.knowledgebase.facade.vo.KnowledgeBaseDocListVo;
import cloud.xcan.angus.core.biz.BizTemplate;
import cloud.xcan.angus.remote.message.ProtocolException;
import jakarta.annotation.Resource;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

@Service
public class KnowledgeBaseDocCmdImpl implements KnowledgeBaseDocCmd {

  @Resource
  private KnowledgeBaseDocRepo knowledgeBaseDocRepo;

  @Resource
  private KnowledgeBaseDocQuery knowledgeBaseDocQuery;

  @Resource
  private KnowledgeBaseQuery knowledgeBaseQuery;

  @Override
  @Transactional
  public List<KnowledgeBaseDocListVo> uploadDocuments(Long knowledgeBaseId, MultipartFile[] files) {
    return new BizTemplate<List<KnowledgeBaseDocListVo>>() {
      @Override
      protected void checkParams() {
        // 获取源知识库并检查是否存在
        knowledgeBaseQuery.findAndCheck(knowledgeBaseId);
      }

      @Override
      protected List<KnowledgeBaseDocListVo> process() {
        // TODO: 实现文件上传逻辑
        // 1. 验证文件类型和大小
        // 2. 保存文件到存储
        // 3. 创建文档记录
        // 4. 启动异步处理任务（包括分段记录-KnowledgeBaseDocChunkRepo和向量化）

        // 暂时返回空列表
        return List.of();
      }
    }.execute();
  }

  @Override
  @Transactional
  public KnowledgeBaseDoc reprocessDocument(Long knowledgeBaseId, Long documentId) {
    return new BizTemplate<KnowledgeBaseDoc>() {
      KnowledgeBaseDoc documentDb;

      @Override
      protected void checkParams() {
        // 获取源知识库文档并检查是否存在
        documentDb = knowledgeBaseDocQuery.findAndCheck(documentId);

        // 检查文档和知识库是否一致
        if (!documentDb.getKnowledgeBaseId().equals(knowledgeBaseId)) {
          throw ProtocolException.of("文档不属于该知识库");
        }
      }

      @Override
      protected KnowledgeBaseDoc process() {
        // 重置状态为处理中
        documentDb.setStatus(DocumentStatus.PROCESSING);
        documentDb.setProcessingProgress(0);
        documentDb.setErrorMessage(null);
        documentDb = knowledgeBaseDocRepo.save(documentDb);

        // TODO: 重新加入处理队列
        return documentDb;
      }
    }.execute();
  }

  @Override
  @Transactional
  public KnowledgeBaseDocListVo toggleDocument(Long knowledgeBaseId, Long documentId,
      Boolean enabled) {
    return new BizTemplate<KnowledgeBaseDocListVo>() {
      KnowledgeBaseDoc documentDb;

      @Override
      protected void checkParams() {
        // 获取源知识库文档并检查是否存在
        documentDb = knowledgeBaseDocQuery.findAndCheck(documentId);

        // 检查文档和知识库是否一致
        if (!documentDb.getKnowledgeBaseId().equals(knowledgeBaseId)) {
          throw ProtocolException.of("文档不属于该知识库");
        }
      }

      @Override
      protected KnowledgeBaseDocListVo process() {
        // TODO 如果切换成禁用，更新向量数据库状态或删除；如果切换成启用，更新向量数据库状态或插入

        // 更新启用状态
        documentDb.setEnabled(enabled);
        knowledgeBaseDocRepo.save(documentDb);

        return KnowledgeBaseDocAssembler.toDocumentListVo(documentDb);
      }
    }.execute();
  }

  @Override
  @Transactional
  public void deleteDocument(Long knowledgeBaseId, Long documentId) {
    new BizTemplate<Void>() {
      KnowledgeBaseDoc documentDb;

      @Override
      protected void checkParams() {
        // 获取源知识库文档并检查是否存在
        documentDb = knowledgeBaseDocQuery.findAndCheck(documentId);

        // 检查文档和知识库是否一致
        if (!documentDb.getKnowledgeBaseId().equals(knowledgeBaseId)) {
          throw ProtocolException.of("文档不属于该知识库");
        }
      }

      @Override
      protected Void process() {
        // TODO 删除向量数据库数据

        // 删除文档
        knowledgeBaseDocRepo.delete(documentDb);
        return null;
      }
    }.execute();
  }

  @Override
  @Transactional
  public void batchDeleteDocuments(Long knowledgeBaseId, List<Long> documentIds) {
    new BizTemplate<Void>() {
      @Override
      protected Void process() {
        // TODO 删除向量数据库数据

        // 批量删除文档
        knowledgeBaseDocRepo.deleteByKnowledgeBaseIdAndIdIn(knowledgeBaseId, documentIds);
        return null;
      }
    }.execute();
  }
}
