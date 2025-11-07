package cloud.xcan.angus.core.ai.interfaces.knowledgebase;

import cloud.xcan.angus.core.ai.interfaces.knowledgebase.facade.KnowledgeBaseDocFacade;
import cloud.xcan.angus.core.ai.interfaces.knowledgebase.facade.dto.KnowledgeBaseDocBatchDeleteDto;
import cloud.xcan.angus.core.ai.interfaces.knowledgebase.facade.dto.KnowledgeBaseDocFindDto;
import cloud.xcan.angus.core.ai.interfaces.knowledgebase.facade.dto.KnowledgeBaseDocSearchDto;
import cloud.xcan.angus.core.ai.interfaces.knowledgebase.facade.dto.KnowledgeBaseDocToggleDto;
import cloud.xcan.angus.core.ai.interfaces.knowledgebase.facade.vo.KnowledgeBaseDocSearchResultVo;
import cloud.xcan.angus.core.ai.interfaces.knowledgebase.facade.vo.KnowledgeBaseDocStatusVo;
import cloud.xcan.angus.core.ai.interfaces.knowledgebase.facade.vo.KnowledgeBaseDocVo;
import cloud.xcan.angus.remote.ApiLocaleResult;
import cloud.xcan.angus.remote.PageResult;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.annotation.Resource;
import jakarta.validation.Valid;
import java.util.List;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.http.HttpStatus;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@Tag(name = "KnowledgeBaseDoc", description = "文档管理 - 文档的上传、编辑、删除、状态管理等功能")
@Validated
@RestController
@RequestMapping("/api/v1/documents")
public class KnowledgeBaseDocRest {

  @Resource
  private KnowledgeBaseDocFacade documentFacade;

  @Operation(operationId = "uploadDocument", summary = "上传文档", description = "上传文档到知识库")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "201", description = "文档上传成功")
  })
  @ResponseStatus(HttpStatus.CREATED)
  @PostMapping("/knowledge-bases/{knowledgeBaseId}")
  public ApiLocaleResult<KnowledgeBaseDocVo> uploadDocument(
      @Parameter(description = "知识库ID") @PathVariable Long knowledgeBaseId,
      @Parameter(description = "文件列表") @RequestParam("files") MultipartFile file) {
    return ApiLocaleResult.success(documentFacade.uploadDocument(knowledgeBaseId, file));
  }

  @Operation(operationId = "reprocessDocument", summary = "重新处理文档", description = "重新处理失败的文档")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "已加入处理队列")
  })
  @ResponseStatus(HttpStatus.OK)
  @PostMapping("/{documentId}/knowledge-bases/{knowledgeBaseId}/reprocess")
  public ApiLocaleResult<KnowledgeBaseDocStatusVo> reprocessDocument(
      @Parameter(description = "文档ID") @PathVariable Long documentId,
      @Parameter(description = "知识库ID") @PathVariable Long knowledgeBaseId) {
    return ApiLocaleResult.success(documentFacade.reprocessDocument(knowledgeBaseId, documentId));
  }

  @Operation(operationId = "toggleDocument", summary = "切换文档状态", description = "切换文档的启用状态")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "状态切换成功")
  })
  @ResponseStatus(HttpStatus.OK)
  @PutMapping("/{documentId}/knowledge-bases/{knowledgeBaseId}/toggle")
  public ApiLocaleResult<KnowledgeBaseDocStatusVo> toggleDocument(
      @Parameter(description = "文档ID") @PathVariable Long documentId,
      @Parameter(description = "知识库ID") @PathVariable Long knowledgeBaseId,
      @Valid @RequestBody KnowledgeBaseDocToggleDto dto) {
    return ApiLocaleResult.success(documentFacade.toggleDocument(knowledgeBaseId, documentId, dto));
  }

  @Operation(operationId = "deleteDocument", summary = "删除文档", description = "删除指定文档")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "204", description = "删除成功")
  })
  @ResponseStatus(HttpStatus.NO_CONTENT)
  @DeleteMapping("/{documentId}/knowledge-bases/{knowledgeBaseId}")
  public void deleteDocument(
      @Parameter(description = "文档ID") @PathVariable Long documentId,
      @Parameter(description = "知识库ID") @PathVariable Long knowledgeBaseId) {
    documentFacade.deleteDocument(knowledgeBaseId, documentId);
  }

  @Operation(operationId = "batchDeleteDocuments", summary = "批量删除文档", description = "批量删除文档")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "批量删除成功")
  })
  @ResponseStatus(HttpStatus.OK)
  @PostMapping("/knowledge-bases/{knowledgeBaseId}/batch-delete")
  public void batchDeleteDocuments(
      @Parameter(description = "知识库ID") @PathVariable Long knowledgeBaseId,
      @Valid @RequestBody KnowledgeBaseDocBatchDeleteDto dto) {
    documentFacade.batchDeleteDocuments(knowledgeBaseId, dto);
  }

  @Operation(operationId = "getDocumentList", summary = "获取文档列表", description = "获取知识库的文档列表")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "文档列表获取成功")
  })
  @GetMapping("/knowledge-bases/{knowledgeBaseId}")
  public ApiLocaleResult<PageResult<KnowledgeBaseDocVo>> getDocumentList(
      @Parameter(description = "知识库ID") @PathVariable Long knowledgeBaseId,
      @Valid @ParameterObject KnowledgeBaseDocFindDto dto) {
    return ApiLocaleResult.success(documentFacade.getDocumentList(knowledgeBaseId, dto));
  }

  @Operation(operationId = "searchDocuments", summary = "搜索文档", description = "在知识库中检索相关内容")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "检索成功")
  })
  @ResponseStatus(HttpStatus.OK)
  @PostMapping("/knowledge-bases/{knowledgeBaseId}/search")
  public ApiLocaleResult<List<KnowledgeBaseDocSearchResultVo>> searchDocuments(
      @Parameter(description = "知识库ID") @PathVariable Long knowledgeBaseId,
      @Valid @RequestBody KnowledgeBaseDocSearchDto dto) {
    return ApiLocaleResult.success(documentFacade.searchDocuments(knowledgeBaseId, dto));
  }
}
