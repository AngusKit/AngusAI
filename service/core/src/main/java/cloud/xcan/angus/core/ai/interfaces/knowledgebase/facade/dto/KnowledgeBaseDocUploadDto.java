package cloud.xcan.angus.core.ai.interfaces.knowledgebase.facade.dto;

import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

@Data
public class KnowledgeBaseDocUploadDto {

  private MultipartFile file;

}
