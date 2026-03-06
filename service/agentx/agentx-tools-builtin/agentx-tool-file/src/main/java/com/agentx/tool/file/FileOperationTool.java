package com.agentx.tool.file;

import dev.langchain4j.agent.tool.P;
import dev.langchain4j.agent.tool.Tool;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardOpenOption;
import java.util.stream.Collectors;
import java.util.stream.Stream;

/**
 * 文件操作工具 — 限制在安全沙盒目录内的文件读写操作
 */
@Slf4j
@Component
public class FileOperationTool {

  private final Path sandboxRoot;

  public FileOperationTool(
      @Value("${agentx.tool.file.sandbox-dir:#{systemProperties['java.io.tmpdir'] + '/agentx-files'}}") String sandboxDir) {
    this.sandboxRoot = Path.of(sandboxDir).toAbsolutePath().normalize();
    try {
      Files.createDirectories(sandboxRoot);
    } catch (IOException e) {
      log.warn("Failed to create sandbox directory: {}", sandboxRoot, e);
    }
  }

  @Tool("Read the contents of a file from the sandbox directory")
  public String readFile(@P("The relative file path within the sandbox") String filePath) {
    Path target = resolveSafe(filePath);
    if (target == null) {
      return "Error: Path escapes sandbox boundary.";
    }

    try {
      if (!Files.exists(target)) {
        return "File not found: " + filePath;
      }
      long size = Files.size(target);
      if (size > 1024 * 1024) {
        return "Error: File too large (max 1MB). Size: " + size + " bytes.";
      }
      return Files.readString(target, StandardCharsets.UTF_8);
    } catch (IOException e) {
      return "Error reading file: " + e.getMessage();
    }
  }

  @Tool("Write content to a file in the sandbox directory. Creates new file or overwrites existing.")
  public String writeFile(
      @P("The relative file path within the sandbox") String filePath,
      @P("The content to write") String content) {
    Path target = resolveSafe(filePath);
    if (target == null) {
      return "Error: Path escapes sandbox boundary.";
    }

    try {
      Files.createDirectories(target.getParent());
      Files.writeString(target, content, StandardCharsets.UTF_8,
          StandardOpenOption.CREATE, StandardOpenOption.TRUNCATE_EXISTING);
      return "File written successfully: " + filePath + " (" + content.length() + " chars)";
    } catch (IOException e) {
      return "Error writing file: " + e.getMessage();
    }
  }

  @Tool("List files and directories in a given path within the sandbox")
  public String listFiles(
      @P("The relative directory path within the sandbox (use '.' for root)") String dirPath) {
    Path target = resolveSafe(dirPath);
    if (target == null) {
      return "Error: Path escapes sandbox boundary.";
    }

    try {
      if (!Files.isDirectory(target)) {
        return "Not a directory: " + dirPath;
      }
      try (Stream<Path> paths = Files.list(target)) {
        String result = paths.map(p -> {
          String name = p.getFileName().toString();
          return Files.isDirectory(p) ? name + "/" : name;
        }).sorted().collect(Collectors.joining("\n"));
        return result.isEmpty() ? "(empty directory)" : result;
      }
    } catch (IOException e) {
      return "Error listing directory: " + e.getMessage();
    }
  }

  @Tool("Delete a file from the sandbox directory")
  public String deleteFile(@P("The relative file path within the sandbox") String filePath) {
    Path target = resolveSafe(filePath);
    if (target == null) {
      return "Error: Path escapes sandbox boundary.";
    }

    try {
      if (!Files.exists(target)) {
        return "File not found: " + filePath;
      }
      if (Files.isDirectory(target)) {
        return "Error: Cannot delete directories. Only files can be deleted.";
      }
      Files.delete(target);
      return "File deleted: " + filePath;
    } catch (IOException e) {
      return "Error deleting file: " + e.getMessage();
    }
  }

  private Path resolveSafe(String relativePath) {
    Path resolved = sandboxRoot.resolve(relativePath).toAbsolutePath().normalize();
    if (!resolved.startsWith(sandboxRoot)) {
      log.warn("Path traversal attempt blocked: {}", relativePath);
      return null;
    }
    return resolved;
  }
}
