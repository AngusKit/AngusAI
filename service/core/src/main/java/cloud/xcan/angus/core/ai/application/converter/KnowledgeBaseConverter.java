package cloud.xcan.angus.core.ai.application.converter;

import static cloud.xcan.angus.core.ai.infra.util.CommonUtils.calculateContentHash;
import static cloud.xcan.angus.core.ai.infra.util.CommonUtils.calculateDocumentType;
import static cloud.xcan.angus.spec.utils.ObjectUtils.stringSafe;

import cloud.xcan.angus.api.storage.file.vo.FileUploadVo;
import cloud.xcan.angus.core.ai.domain.knowledgebase.DocumentStatus;
import cloud.xcan.angus.core.ai.domain.knowledgebase.DocumentType;
import cloud.xcan.angus.core.ai.domain.knowledgebase.KnowledgeBaseDoc;
import java.util.List;
import org.jetbrains.annotations.NotNull;
import org.springframework.web.multipart.MultipartFile;

public class KnowledgeBaseConverter {

  public static @NotNull KnowledgeBaseDoc toUploadDomain(
      Long knowledgeBaseId, MultipartFile file, FileUploadVo uploadResult) {
    KnowledgeBaseDoc doc = new KnowledgeBaseDoc();
    doc.setKnowledgeBaseId(knowledgeBaseId);
    doc.setName(stringSafe(file.getOriginalFilename(), String.valueOf(System.currentTimeMillis())));
    doc.setType(calculateDocumentType(file.getOriginalFilename(), DocumentType.TXT));
    doc.setSize(file.getSize());
    doc.setStatus(DocumentStatus.PENDING);
    doc.setEnabled(true);
    doc.setProcessingProgress(0D);
    doc.setErrorMessage(null);
    doc.setFilePath(uploadResult.getUrl());
    doc.setContentHash(calculateContentHash(file));
    return doc;
  }

}
