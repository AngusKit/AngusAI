package cloud.xcan.angus.core.ai.infra.storage;

import cloud.xcan.angus.core.ai.domain.chat.Attachment;
import cloud.xcan.angus.core.ai.domain.chat.AttachmentRepo;
import cloud.xcan.angus.core.ai.domain.chat.MessageAttachment;
import cloud.xcan.angus.core.biz.BizTemplate;
import cloud.xcan.angus.remote.message.http.ResourceNotFound;
import jakarta.annotation.Resource;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.UUID;

/**
 * 文件存储服务
 */
@Slf4j
@Service
public class FileStorageService {

    @Resource
    private AttachmentRepo attachmentRepo;

    @Value("${app.file.upload.path:/tmp/uploads}")
    private String uploadPath;

    @Value("${app.file.upload.url-prefix:/api/v1/files}")
    private String urlPrefix;

    @Value("${app.file.upload.max-size:10485760}") // 10MB
    private long maxFileSize;

    /**
     * 上传文件
     */
    public Attachment uploadFile(MultipartFile file, Long sessionId) {
        return new BizTemplate<Attachment>() {
            @Override
            protected void checkParams() {
                if (file == null || file.isEmpty()) {
                    throw new IllegalArgumentException("文件不能为空");
                }
                if (file.getSize() > maxFileSize) {
                    throw new IllegalArgumentException("文件大小不能超过 " + (maxFileSize / 1024 / 1024) + "MB");
                }
            }

            @Override
            protected Attachment process() {
                try {
                    // 1. 生成唯一文件名
                    String originalFilename = file.getOriginalFilename();
                    String extension = getFileExtension(originalFilename);
                    String uniqueFilename = UUID.randomUUID().toString() + extension;

                    // 2. 创建存储目录
                    Path uploadDir = Paths.get(uploadPath);
                    if (!Files.exists(uploadDir)) {
                        Files.createDirectories(uploadDir);
                    }

                    // 3. 保存文件
                    Path filePath = uploadDir.resolve(uniqueFilename);
                    Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

                    // 4. 创建附件记录
                    Attachment attachment = new Attachment();
                    attachment.setSessionId(sessionId);
                    attachment.setName(originalFilename);
                    attachment.setType(file.getContentType());
                    attachment.setSize(file.getSize());
                    attachment.setPath(filePath.toString());
                    attachment.setUrl(urlPrefix + "/" + uniqueFilename);
                    attachment.setUploadedAt(LocalDateTime.now().toEpochSecond(ZoneOffset.UTC));

                    // 5. 保存到数据库
                    return attachmentRepo.save(attachment);

                } catch (IOException e) {
                    log.error("文件上传失败", e);
                    throw new RuntimeException("文件上传失败: " + e.getMessage(), e);
                }
            }
        }.execute();
    }

    /**
     * 删除文件
     */
    public void deleteFile(Long attachmentId) {
        new BizTemplate<Void>() {
            Attachment attachment;

            @Override
            protected void checkParams() {
                attachment = attachmentRepo.findById(attachmentId)
                    .orElseThrow(() -> ResourceNotFound.of("附件不存在", new Object[]{}));
            }

            @Override
            protected Void process() {
                try {
                    // 1. 删除物理文件
                    Path filePath = Paths.get(attachment.getPath());
                    if (Files.exists(filePath)) {
                        Files.delete(filePath);
                    }

                    // 2. 删除数据库记录
                    attachmentRepo.deleteById(attachmentId);

                } catch (IOException e) {
                    log.error("文件删除失败: attachmentId={}", attachmentId, e);
                    throw new RuntimeException("文件删除失败: " + e.getMessage(), e);
                }

                return null;
            }
        }.execute();
    }

    /**
     * 根据文件名获取文件
     */
    public Attachment getFileByFilename(String filename) {
        return new BizTemplate<Attachment>() {
            @Override
            protected Attachment process() {
                // 从URL中提取文件名
                String actualFilename = filename;
                if (filename.contains("/")) {
                    actualFilename = filename.substring(filename.lastIndexOf("/") + 1);
                }
                
                return attachmentRepo.findByPathContaining(actualFilename)
                    .stream()
                    .findFirst()
                    .orElse(null);
            }
        }.execute();
    }

    /**
     * 获取文件
     */
    public Attachment getFile(Long attachmentId) {
        return new BizTemplate<Attachment>() {
            @Override
            protected Attachment process() {
                return attachmentRepo.findById(attachmentId)
                    .orElseThrow(() -> ResourceNotFound.of("附件不存在", new Object[]{}));
            }
        }.execute();
    }

    /**
     * 转换为MessageAttachment
     */
    public MessageAttachment toMessageAttachment(Attachment attachment) {
        MessageAttachment messageAttachment = new MessageAttachment();
        messageAttachment.setId(attachment.getId());
        messageAttachment.setName(attachment.getName());
        messageAttachment.setType(attachment.getType());
        messageAttachment.setSize(attachment.getSize());
        messageAttachment.setUrl(attachment.getUrl());
        return messageAttachment;
    }

    /**
     * 获取文件扩展名
     */
    private String getFileExtension(String filename) {
        if (filename == null || filename.isEmpty()) {
            return "";
        }
        int lastDotIndex = filename.lastIndexOf('.');
        if (lastDotIndex == -1) {
            return "";
        }
        return filename.substring(lastDotIndex);
    }

    /**
     * 验证文件类型
     */
    public boolean isValidFileType(String contentType) {
        // 允许的文件类型
        String[] allowedTypes = {
            "image/jpeg", "image/png", "image/gif", "image/webp",
            "text/plain", "text/csv", "application/pdf",
            "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            "application/vnd.ms-excel", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            "application/vnd.ms-powerpoint", "application/vnd.openxmlformats-officedocument.presentationml.presentation"
        };

        for (String allowedType : allowedTypes) {
            if (allowedType.equals(contentType)) {
                return true;
            }
        }
        return false;
    }
}
