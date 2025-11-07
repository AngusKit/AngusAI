package cloud.xcan.angus.core.ai.application.converter;

import static cloud.xcan.angus.core.ai.infra.util.CommonUtils.calculateContentHash;
import static cloud.xcan.angus.core.ai.infra.util.CommonUtils.calculateFileType;

import cloud.xcan.angus.api.storage.file.vo.FileUploadVo;
import cloud.xcan.angus.core.ai.domain.knowledgebase.DocumentStatus;
import cloud.xcan.angus.core.ai.domain.knowledgebase.KnowledgeBaseDoc;
import java.util.List;
import org.jetbrains.annotations.NotNull;
import org.springframework.web.multipart.MultipartFile;

public class KnowledgeBaseConverter {

  public static @NotNull KnowledgeBaseDoc toUploadDomain(
      Long knowledgeBaseId, MultipartFile file, List<FileUploadVo> uploadResult) {
    KnowledgeBaseDoc doc = new KnowledgeBaseDoc();
    doc.setKnowledgeBaseId(knowledgeBaseId);
    doc.setName(file.getOriginalFilename());
    doc.setType(calculateFileType(file.getOriginalFilename()));
    doc.setSize(file.getSize());
    doc.setStatus(DocumentStatus.PENDING);
    doc.setEnabled(true);
    doc.setProcessingProgress(0);
    doc.setErrorMessage(null);
    doc.setFilePath(uploadResult.get(0).getUrl());
    doc.setContentHash(calculateContentHash(file));
    return doc;
  }

}
