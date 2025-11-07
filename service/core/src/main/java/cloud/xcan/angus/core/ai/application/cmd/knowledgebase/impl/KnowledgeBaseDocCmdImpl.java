package cloud.xcan.angus.core.ai.application.cmd.knowledgebase.impl;

import static cloud.xcan.angus.core.ai.application.converter.KnowledgeBaseConverter.toUploadDomain;
import static cloud.xcan.angus.core.ai.domain.Constants.KNOWLEDGE_DOC_UPLOAD_BIZ_KEY;

import cloud.xcan.angus.api.storage.file.FileRemote;
import cloud.xcan.angus.api.storage.file.vo.FileUploadVo;
import cloud.xcan.angus.core.ai.application.cmd.knowledgebase.KnowledgeBaseDocCmd;
import cloud.xcan.angus.core.ai.application.query.knowledgebase.KnowledgeBaseDocQuery;
import cloud.xcan.angus.core.ai.application.query.knowledgebase.KnowledgeBaseQuery;
import cloud.xcan.angus.core.ai.domain.knowledgebase.DocumentStatus;
import cloud.xcan.angus.core.ai.domain.knowledgebase.KnowledgeBaseDoc;
import cloud.xcan.angus.core.ai.domain.knowledgebase.KnowledgeBaseDocRepo;
import cloud.xcan.angus.core.biz.BizTemplate;
import cloud.xcan.angus.core.biz.cmd.CommCmd;
import cloud.xcan.angus.core.jpa.repository.BaseRepository;
import cloud.xcan.angus.remote.message.ProtocolException;
import jakarta.annotation.Resource;
import java.util.List;
import org.springframework.boot.autoconfigure.web.servlet.MultipartProperties;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

@Service
public class KnowledgeBaseDocCmdImpl extends CommCmd<KnowledgeBaseDoc, Long> implements
    KnowledgeBaseDocCmd {

  @Resource
  private KnowledgeBaseDocRepo knowledgeBaseDocRepo;

  @Resource
  private KnowledgeBaseDocQuery knowledgeBaseDocQuery;

  @Resource
  private KnowledgeBaseQuery knowledgeBaseQuery;

  @Resource
  private FileRemote fileRemote;

  @Resource
  private MultipartProperties multipartProperties;

  @Override
  @Transactional
  public KnowledgeBaseDoc uploadDocument(Long knowledgeBaseId, MultipartFile file) {
    return new BizTemplate<KnowledgeBaseDoc>() {
      @Override
      protected void checkParams() {
        // 获取源知识库并检查是否存在
        knowledgeBaseQuery.findAndCheck(knowledgeBaseId);

        // 检查文件大小限制
        long maxFileSize = multipartProperties.getMaxFileSize().toBytes();
        if (file.getSize() > maxFileSize) {
          throw ProtocolException.of(String.format("文件[%s]超过大小限制，最大允许上传%s",
              file.getOriginalFilename(), multipartProperties.getMaxFileSize().toString()));
        }
      }

      @Override
      protected KnowledgeBaseDoc process() {
        // TODO: 启动异步处理任务（包括分段记录-KnowledgeBaseDocChunkRepo和向量化）

        // 上传文件到文件存储服务
        List<FileUploadVo> uploadResult = fileRemote.upload(
            new MultipartFile[]{file}, KNOWLEDGE_DOC_UPLOAD_BIZ_KEY,
            file.getOriginalFilename(), null).orElseContentThrow();

        KnowledgeBaseDoc doc = toUploadDomain(knowledgeBaseId, file, uploadResult);
        insert(doc);
        return doc;
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
        // TODO: 重新加入处理队列

        // 重置状态为处理中
        documentDb.setStatus(DocumentStatus.PENDING);
        documentDb.setProcessingProgress(0);
        documentDb.setErrorMessage(null);
        knowledgeBaseDocRepo.save(documentDb);
        return documentDb;
      }
    }.execute();
  }

  @Override
  @Transactional
  public KnowledgeBaseDoc toggleDocument(Long knowledgeBaseId, Long documentId, Boolean enabled) {
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
        // TODO 如果切换成禁用，更新向量数据库状态或删除；如果切换成启用，更新向量数据库状态或插入

        // 更新启用状态
        documentDb.setEnabled(enabled);
        knowledgeBaseDocRepo.save(documentDb);

        return documentDb;
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

  @Override
  protected BaseRepository<KnowledgeBaseDoc, Long> getRepository() {
    return this.knowledgeBaseDocRepo;
  }
}
