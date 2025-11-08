package cloud.xcan.angus.core.ai.interfaces.dataset.facade.dto;

import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

@Data
public class DatasetFileUploadDto {

  private MultipartFile file;

}
