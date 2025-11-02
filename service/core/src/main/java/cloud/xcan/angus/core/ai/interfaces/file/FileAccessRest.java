package cloud.xcan.angus.core.ai.interfaces.file;

import cloud.xcan.angus.core.ai.domain.chat.Attachment;
import cloud.xcan.angus.core.ai.infra.storage.FileStorageService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.annotation.Resource;
import java.io.File;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import org.springframework.core.io.FileSystemResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

// TODO 支持数据集和知识库文件上传、下载、向量化

/**
 * 文件访问控制器
 */
@Tag(name = "文件访问", description = "文件下载和访问接口")
@RestController
@RequestMapping("/api/v1/files")
public class FileAccessRest {

  @Resource
  private FileStorageService fileStorageService;

  @Operation(operationId = "downloadFile", summary = "下载文件", description = "根据文件名下载文件")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "文件下载成功"),
      @ApiResponse(responseCode = "404", description = "文件不存在")
  })
  @GetMapping("/{filename}")
  public ResponseEntity<SpringResource> downloadFile(
      @Parameter(description = "文件名") @PathVariable String filename) {

    try {
      // 1. 根据文件名查找附件记录
      Attachment attachment = fileStorageService.getFileByFilename(filename);
      if (attachment == null) {
        return ResponseEntity.notFound().build();
      }

      // 2. 检查文件是否存在
      Path filePath = Paths.get(attachment.getPath());
      if (!Files.exists(filePath)) {
        return ResponseEntity.notFound().build();
      }

      // 3. 创建文件资源
      File file = filePath.toFile();
      FileSystemResource resource = new FileSystemResource(file);

      // 4. 设置响应头
      HttpHeaders headers = new HttpHeaders();
      headers.add(HttpHeaders.CONTENT_DISPOSITION,
          "attachment; filename=\"" + attachment.getName() + "\"");
      headers.add(HttpHeaders.CONTENT_TYPE, attachment.getType());
      headers.add(HttpHeaders.CONTENT_LENGTH, String.valueOf(attachment.getSize()));

      return ResponseEntity.ok()
          .headers(headers)
          .contentLength(file.length())
          .contentType(MediaType.parseMediaType(attachment.getType()))
          .body(resource);

    } catch (Exception e) {
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    }
  }

  @Operation(operationId = "viewFile", summary = "预览文件", description = "在线预览文件内容")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "文件预览成功"),
      @ApiResponse(responseCode = "404", description = "文件不存在")
  })
  @GetMapping("/{filename}/preview")
  public ResponseEntity<SpringResource> previewFile(
      @Parameter(description = "文件名") @PathVariable String filename) {

    try {
      // 1. 根据文件名查找附件记录
      Attachment attachment = fileStorageService.getFileByFilename(filename);
      if (attachment == null) {
        return ResponseEntity.notFound().build();
      }

      // 2. 检查文件是否存在
      Path filePath = Paths.get(attachment.getPath());
      if (!Files.exists(filePath)) {
        return ResponseEntity.notFound().build();
      }

      // 3. 创建文件资源
      File file = filePath.toFile();
      FileSystemResource resource = new FileSystemResource(file);

      // 4. 设置响应头（内联显示）
      HttpHeaders headers = new HttpHeaders();
      headers.add(HttpHeaders.CONTENT_DISPOSITION, "inline");
      headers.add(HttpHeaders.CONTENT_TYPE, attachment.getType());

      return ResponseEntity.ok()
          .headers(headers)
          .contentLength(file.length())
          .contentType(MediaType.parseMediaType(attachment.getType()))
          .body(resource);

    } catch (Exception e) {
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    }
  }
}
