# LangChain4j 文档解析与向量化完整方案

> 基于 LangChain4j 1.12.2（2026.03），涵盖 10+ 文档格式解析、图片处理、向量化入库、LLM RAG 问答全流程。

---

## 一、整体架构

```
文档源 (PDF/Word/Excel/PPT/MD/HTML/CSV/JSON/XML/TXT/图片)
       │
       ▼
  DocumentParser (解析为纯文本)
       │
       ▼
  DocumentTransformer (HTML清洗等)
       │
       ▼
  DocumentImageProcessor (图片提取 → 多模态LLM描述 / OCR)
       │
       ▼
  DocumentSplitter (智能分块)
       │
       ▼
  EmbeddingModel (文本 → 向量)
       │
       ▼
  EmbeddingStore (向量存储/检索)
       │
       ▼
  ContentRetriever + ChatLanguageModel + AiServices (RAG 对话)
```

---

## 二、Maven 依赖配置（完整版）

```xml
<properties>
    <langchain4j.version>1.12.2</langchain4j.version>
</properties>

<dependencyManagement>
    <dependencies>
        <dependency>
            <groupId>dev.langchain4j</groupId>
            <artifactId>langchain4j-bom</artifactId>
            <version>${langchain4j.version}</version>
            <type>pom</type>
            <scope>import</scope>
        </dependency>
    </dependencies>
</dependencyManagement>

<dependencies>

    <!-- ========== 核心库 ========== -->
    <dependency>
        <groupId>dev.langchain4j</groupId>
        <artifactId>langchain4j-core</artifactId>
    </dependency>

    <!-- ========== 文档解析器 ========== -->
    <!-- PDF 解析 -->
    <dependency>
        <groupId>dev.langchain4j</groupId>
        <artifactId>langchain4j-document-parser-apache-pdfbox</artifactId>
    </dependency>
    <!-- Word / Excel / PPT (doc/docx/xls/xlsx/ppt/pptx) -->
    <dependency>
        <groupId>dev.langchain4j</groupId>
        <artifactId>langchain4j-document-parser-apache-poi</artifactId>
    </dependency>
    <!-- 通用解析 (Markdown/HTML/RTF/ODF 等全格式) -->
    <dependency>
        <groupId>dev.langchain4j</groupId>
        <artifactId>langchain4j-document-parser-apache-tika</artifactId>
    </dependency>

    <!-- ========== HTML 清洗 ========== -->
    <dependency>
        <groupId>dev.langchain4j</groupId>
        <artifactId>langchain4j-document-transformer-jsoup</artifactId>
    </dependency>

    <!-- ========== CSV 解析（OpenCSV） ========== -->
    <dependency>
        <groupId>com.opencsv</groupId>
        <artifactId>opencsv</artifactId>
        <version>5.9</version>
    </dependency>

    <!-- ========== JSON 解析（Jackson） ========== -->
    <dependency>
        <groupId>com.fasterxml.jackson.core</groupId>
        <artifactId>jackson-databind</artifactId>
        <version>2.17.0</version>
    </dependency>

    <!-- ========== XML 解析（JDOM2） ========== -->
    <dependency>
        <groupId>org.jdom</groupId>
        <artifactId>jdom2</artifactId>
        <version>2.0.6.1</version>
    </dependency>

    <!-- ========== Embedding 模型 ========== -->
    <!-- OpenAI Embedding -->
    <dependency>
        <groupId>dev.langchain4j</groupId>
        <artifactId>langchain4j-open-ai</artifactId>
    </dependency>
    <!-- 阿里千问 Embedding（可选） -->
    <!--
    <dependency>
        <groupId>dev.langchain4j</groupId>
        <artifactId>langchain4j-dashscope</artifactId>
    </dependency>
    -->

    <!-- ========== 向量数据库 ========== -->
    <!-- 内存（开发/测试） -->
    <dependency>
        <groupId>dev.langchain4j</groupId>
        <artifactId>langchain4j-embedding-store-inmemory</artifactId>
    </dependency>
    <!-- Qdrant（生产推荐） -->
    <!--
    <dependency>
        <groupId>dev.langchain4j</groupId>
        <artifactId>langchain4j-qdrant</artifactId>
    </dependency>
    -->
    <!-- PGVector（关系型数据库方案） -->
    <!--
    <dependency>
        <groupId>dev.langchain4j</groupId>
        <artifactId>langchain4j-pgvector</artifactId>
    </dependency>
    -->
    <!-- Milvus（海量数据高性能） -->
    <!--
    <dependency>
        <groupId>dev.langchain4j</groupId>
        <artifactId>langchain4j-milvus</artifactId>
    </dependency>
    -->

</dependencies>
```

---

## 三、全格式文档解析器对照表

| 文档格式 | 解析器 | 说明 |
|---|---|---|
| **PDF** | `ApachePdfBoxDocumentParser` | 专业 PDF 解析，支持多页 |
| **Word** (.doc/.docx) | `ApachePoiDocumentParser` | Apache POI |
| **Excel** (.xls/.xlsx) | `ApachePoiDocumentParser` | 每个 Sheet 逐行提取 |
| **PowerPoint** (.ppt/.pptx) | `ApachePoiDocumentParser` | 逐 Slide 提取文本 |
| **Markdown** (.md) | `ApacheTikaDocumentParser` | Tika 自动检测 |
| **HTML** (.html/.htm) | `ApacheTikaDocumentParser` + `HtmlToTextDocumentTransformer` | 先解析再清洗标签 |
| **CSV** | 自定义 `CsvDocumentParser` | OpenCSV 逐行转文本 |
| **JSON** | 自定义 `JsonDocumentParser` | Jackson 递归提取文本值 |
| **XML** | 自定义 `XmlDocumentParser` | JDOM2 递归提取文本节点 |
| **纯文本** (.txt/.log/.yaml/.yml) | `TextDocumentParser` | LangChain4j 内置 |
| **RTF / ODF** | `ApacheTikaDocumentParser` | Tika 通用识别 |

---

## 四、全格式文档解析服务

```java
package com.example.rag.parser;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.opencsv.CSVReader;
import dev.langchain4j.data.document.Document;
import dev.langchain4j.data.document.Metadata;
import dev.langchain4j.data.document.parser.TextDocumentParser;
import dev.langchain4j.data.document.parser.apache.pdfbox.ApachePdfBoxDocumentParser;
import dev.langchain4j.data.document.parser.apache.poi.ApachePoiDocumentParser;
import dev.langchain4j.data.document.parser.apache.tika.ApacheTikaDocumentParser;
import dev.langchain4j.data.document.transformer.jsoup.HtmlToTextDocumentTransformer;
import org.jdom2.Element;
import org.jdom2.input.SAXBuilder;

import java.io.*;
import java.nio.charset.StandardCharsets;
import java.util.*;

/**
 * 通用文档解析服务 —— 支持 10+ 格式
 */
public class UniversalDocumentParserService {

    private final ApachePdfBoxDocumentParser pdfParser = new ApachePdfBoxDocumentParser();
    private final ApachePoiDocumentParser poiParser = new ApachePoiDocumentParser();
    private final ApacheTikaDocumentParser tikaParser = new ApacheTikaDocumentParser();
    private final TextDocumentParser textParser = new TextDocumentParser();
    private final HtmlToTextDocumentTransformer htmlCleaner = new HtmlToTextDocumentTransformer();
    private final ObjectMapper objectMapper = new ObjectMapper();

    // ==================== 统一入口 ====================

    public Document parse(String fileName, InputStream inputStream) {
        String ext = getExtension(fileName).toLowerCase();
        Document doc = switch (ext) {
            case "pdf"                          -> pdfParser.parse(inputStream);
            case "doc", "docx"                  -> poiParser.parse(inputStream);
            case "xls", "xlsx"                  -> parseExcel(inputStream);
            case "ppt", "pptx"                  -> poiParser.parse(inputStream);
            case "md", "markdown"               -> tikaParser.parse(inputStream);
            case "html", "htm"                  -> parseHtml(inputStream);
            case "csv"                          -> parseCsv(inputStream);
            case "json"                         -> parseJson(inputStream);
            case "xml"                          -> parseXml(inputStream);
            case "txt", "log", "yaml", "yml",
                 "properties", "ini", "conf"    -> textParser.parse(inputStream);
            case "rtf", "odt", "ods", "odp"     -> tikaParser.parse(inputStream);
            default -> throw new IllegalArgumentException("不支持的文件格式: " + ext);
        };
        doc.metadata().put("source", fileName);
        doc.metadata().put("format", ext);
        return doc;
    }

    // ==================== HTML：解析 + 清洗 ====================

    private Document parseHtml(InputStream inputStream) {
        Document rawDoc = tikaParser.parse(inputStream);
        return htmlCleaner.transform(rawDoc);
    }

    // ==================== Excel：逐行逐 Sheet 提取 ====================

    private Document parseExcel(InputStream inputStream) {
        return poiParser.parse(inputStream);
    }

    // ==================== CSV：逐行组装为文本 ====================

    private Document parseCsv(InputStream inputStream) {
        try (CSVReader reader = new CSVReader(
                new InputStreamReader(inputStream, StandardCharsets.UTF_8))) {

            StringBuilder sb = new StringBuilder();
            String[] headers = reader.readNext();
            if (headers == null) {
                return Document.from("", new Metadata());
            }

            String[] row;
            while ((row = reader.readNext()) != null) {
                for (int i = 0; i < row.length && i < headers.length; i++) {
                    sb.append(headers[i]).append(": ").append(row[i]).append("; ");
                }
                sb.append("\n");
            }
            return Document.from(sb.toString().trim(), new Metadata());

        } catch (Exception e) {
            throw new RuntimeException("CSV 解析失败", e);
        }
    }

    // ==================== JSON：递归提取所有文本值 ====================

    private Document parseJson(InputStream inputStream) {
        try {
            JsonNode rootNode = objectMapper.readTree(inputStream);
            StringBuilder sb = new StringBuilder();
            extractJsonText(rootNode, "", sb);
            return Document.from(sb.toString().trim(), new Metadata());

        } catch (Exception e) {
            throw new RuntimeException("JSON 解析失败", e);
        }
    }

    private void extractJsonText(JsonNode node, String path, StringBuilder sb) {
        if (node.isObject()) {
            node.fields().forEachRemaining(entry ->
                    extractJsonText(entry.getValue(), path + entry.getKey() + ".", sb));
        } else if (node.isArray()) {
            for (int i = 0; i < node.size(); i++) {
                extractJsonText(node.get(i), path + "[" + i + "].", sb);
            }
        } else if (node.isTextual()) {
            sb.append(path).append(": ").append(node.asText()).append("\n");
        } else if (node.isNumber() || node.isBoolean()) {
            sb.append(path).append(": ").append(node.asText()).append("\n");
        }
    }

    // ==================== XML：递归提取所有文本节点 ====================

    private Document parseXml(InputStream inputStream) {
        try {
            SAXBuilder builder = new SAXBuilder();
            org.jdom2.Document xmlDoc = builder.build(inputStream);
            StringBuilder sb = new StringBuilder();
            extractXmlText(xmlDoc.getRootElement(), "", sb);
            return Document.from(sb.toString().trim(), new Metadata());

        } catch (Exception e) {
            throw new RuntimeException("XML 解析失败", e);
        }
    }

    private void extractXmlText(Element element, String path, StringBuilder sb) {
        String currentPath = path.isEmpty() ? element.getName() : path + "." + element.getName();
        String text = element.getTextTrim();
        if (!text.isEmpty()) {
            sb.append(currentPath).append(": ").append(text).append("\n");
        }
        for (Element child : element.getChildren()) {
            extractXmlText(child, currentPath, sb);
        }
    }

    // ==================== 工具方法 ====================

    private String getExtension(String fileName) {
        int dotIndex = fileName.lastIndexOf('.');
        return (dotIndex == -1) ? "" : fileName.substring(dotIndex + 1);
    }
}
```

---

## 五、文档分块策略

```java
package com.example.rag;

import dev.langchain4j.data.document.DocumentSplitter;
import dev.langchain4j.data.document.splitter.DocumentByParagraphSplitter;
import dev.langchain4j.data.document.splitter.DocumentBySentenceSplitter;
import dev.langchain4j.data.document.splitter.DocumentSplitters;

/**
 * 文档分块策略工厂
 *
 * 最佳实践建议：
 * - chunkSize:  300~1000 tokens（取决于 Embedding 模型的 max input tokens）
 * - overlap:    50~100 tokens（保证上下文连贯性）
 * - 使用递归分割器（recursive），按 段落 → 句子 → 字符 层级分割
 */
public class DocumentSplitterFactory {

    /**
     * 推荐方案：递归分割器
     * 按 "\n\n" → "\n" → " " → "" 层级优先分割
     */
    public static DocumentSplitter createRecursiveSplitter() {
        return DocumentSplitters.recursive(
                512,   // maxSegmentSizeInChars — 每块最大字符数
                64     // maxOverlapSizeInChars — 重叠字符数
        );
    }

    /**
     * 备选方案：按段落分割
     */
    public static DocumentSplitter createParagraphSplitter() {
        return new DocumentByParagraphSplitter(
                512,  // maxSegmentSizeInChars
                64    // maxOverlapSizeInChars
        );
    }

    /**
     * 备选方案：按句子分割（适合精确语义检索）
     */
    public static DocumentSplitter createSentenceSplitter() {
        return new DocumentBySentenceSplitter(
                256,  // maxSegmentSizeInChars
                32    // maxOverlapSizeInChars
        );
    }
}
```

### 分块参数建议

| 参数 | 推荐值 | 说明 |
|---|---|---|
| **chunkSize** | 300~800 字符 | 过大影响检索精度，过小丢失上下文 |
| **overlap** | 50~100 字符 | 保证上下文连贯性，避免语义断裂 |
| **分割策略** | `recursive` | 按 段落→句子→字符 层级递归分割，最通用 |

---

## 六、文档中图片处理方案

文档中的图片是 RAG 系统中的常见难题。LangChain4j 提供了 **三种主流方案**：

### 方案对照表

| 方案 | 适用场景 | 优点 | 缺点 |
|---|---|---|---|
| **方案A：多模态 LLM 描述** | PDF/Word 中嵌入的图片 | 精度高、语义丰富 | 需要调用多模态大模型 API |
| **方案B：OCR 文字识别** | 扫描件、截图、表格图 | 提取纯文字，成本低 | 无法理解图表含义 |
| **方案C：多模态 Embedding** | 图文混合检索 | 图片直接向量化检索 | 模型选择有限 |

### 图片处理流程

```
PDF / Word / HTML ��档
       │
       ├─── 文本部分 ──→ 普通解析 → 分块 → Embedding → 向量库
       │
       └─── 图片部分 ──→ 提取图片 ──┬→ 方案A: 多模态LLM描述 → 文本 → 分块 → Embedding → 向量库
                                     ├→ 方案B: OCR文字提取   → 文本 → 分块 → Embedding → 向量库
                                     └→ 方案C: 多模态Embedding → 图片向量 → 向量库（直接检索）
```

### 图片处理器代码

```java
package com.example.rag.image;

import dev.langchain4j.data.document.Document;
import dev.langchain4j.data.document.Metadata;
import dev.langchain4j.data.message.*;
import dev.langchain4j.model.chat.ChatLanguageModel;
import dev.langchain4j.model.openai.OpenAiChatModel;
import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDResources;
import org.apache.pdfbox.cos.COSName;
import org.apache.pdfbox.pdmodel.graphics.image.PDImageXObject;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.*;
import java.util.*;

/**
 * 文档图片处理器
 * 支持从 PDF 中提取图片，并通过多模态 LLM 生成文本描述用于向量化
 */
public class DocumentImageProcessor {

    private final ChatLanguageModel visionModel;

    /**
     * 推荐使用支持视觉的模型：
     * - OpenAI: gpt-4o / gpt-4o-mini
     * - 阿里: qwen-vl-max / qwen-vl-plus
     * - Google: gemini-2.0-flash
     */
    public DocumentImageProcessor(ChatLanguageModel visionModel) {
        this.visionModel = visionModel;
    }

    // ==================== 方案A：多模态 LLM 图片描述 ====================

    /**
     * 从 PDF 中提取所有图片，并用多模态 LLM 生成文本描述
     * 返回的 Document 列表可直接用于向量化入库
     */
    public List<Document> extractAndDescribeImages(File pdfFile) throws Exception {
        List<Document> imageDocuments = new ArrayList<>();
        List<byte[]> images = extractImagesFromPdf(pdfFile);

        for (int i = 0; i < images.size(); i++) {
            byte[] imageBytes = images.get(i);
            String base64 = Base64.getEncoder().encodeToString(imageBytes);

            // 调用多模态 LLM 描述图片内容
            String description = describeImageWithVisionModel(base64);

            Metadata metadata = new Metadata();
            metadata.put("source", pdfFile.getName());
            metadata.put("type", "image");
            metadata.put("imageIndex", String.valueOf(i + 1));

            Document doc = Document.from(
                    "[图片 " + (i + 1) + " 描述] " + description,
                    metadata
            );
            imageDocuments.add(doc);
            System.out.printf("  📷 图片 %d/%d 已描述并生成文档%n", i + 1, images.size());
        }

        return imageDocuments;
    }

    /**
     * 使用多模态 LLM 对单张图片进行内容描述
     */
    public String describeImageWithVisionModel(String base64Image) {
        UserMessage userMessage = UserMessage.from(
                TextContent.from("请详细描述这张图片的内容，"
                        + "包括��键信息、文字、数据、图表含义等。"
                        + "用中文回答，尽量全面准确。"),
                ImageContent.from(base64Image, "image/png")
        );

        return visionModel.generate(userMessage).content().text();
    }

    // ==================== 方案B：OCR 文字提取 ====================

    /**
     * 对图片调用 LLM 做 OCR 文字提取（比传统 OCR 引擎更准确）
     */
    public String ocrWithVisionModel(String base64Image) {
        UserMessage userMessage = UserMessage.from(
                TextContent.from("请识别这张图片中的所有文字内容，"
                        + "按照原始排版格式输出，包含表格数据。"
                        + "只输出识别到的文字，不做额外解释。"),
                ImageContent.from(base64Image, "image/png")
        );

        return visionModel.generate(userMessage).content().text();
    }

    // ==================== PDF 图片提取（PDFBox） ====================

    /**
     * 使用 Apache PDFBox 从 PDF 中提取所有嵌入的图片
     */
    public List<byte[]> extractImagesFromPdf(File pdfFile) throws Exception {
        List<byte[]> images = new ArrayList<>();

        try (PDDocument document = Loader.loadPDF(pdfFile)) {
            for (PDPage page : document.getPages()) {
                PDResources resources = page.getResources();
                if (resources == null) continue;

                for (COSName name : resources.getXObjectNames()) {
                    if (resources.isImageXObject(name)) {
                        PDImageXObject image = (PDImageXObject) resources.getXObject(name);
                        BufferedImage bufferedImage = image.getImage();

                        ByteArrayOutputStream baos = new ByteArrayOutputStream();
                        ImageIO.write(bufferedImage, "png", baos);
                        images.add(baos.toByteArray());
                    }
                }
            }
        }

        System.out.printf("📄 从 %s 中提取到 %d 张图片%n", pdfFile.getName(), images.size());
        return images;
    }

    // ==================== 工厂方法 ====================

    /**
     * 使用 OpenAI GPT-4o 作为视觉模型
     */
    public static DocumentImageProcessor withOpenAi(String apiKey) {
        ChatLanguageModel visionModel = OpenAiChatModel.builder()
                .apiKey(apiKey)
                .modelName("gpt-4o-mini")  // 性价比高，支持视觉
                .maxTokens(1024)
                .build();
        return new DocumentImageProcessor(visionModel);
    }

    /**
     * 使用阿里千问 VL 作为视觉模型（需要 langchain4j-dashscope 依赖）
     */
    /*
    public static DocumentImageProcessor withQwenVl(String apiKey) {
        ChatLanguageModel visionModel = QwenChatModel.builder()
                .apiKey(apiKey)
                .modelName("qwen-vl-max")
                .build();
        return new DocumentImageProcessor(visionModel);
    }
    */
}
```

---

## 七、向量化入库引擎

```java
package com.example.rag;

import dev.langchain4j.data.document.Document;
import dev.langchain4j.data.segment.TextSegment;
import dev.langchain4j.model.embedding.EmbeddingModel;
import dev.langchain4j.model.openai.OpenAiEmbeddingModel;
import dev.langchain4j.store.embedding.EmbeddingStore;
import dev.langchain4j.store.embedding.EmbeddingStoreIngestor;
import dev.langchain4j.store.embedding.inmemory.InMemoryEmbeddingStore;

/**
 * 向量化入库引擎
 * 负责将 Document → 分块 → Embedding → 存入向量数据库
 */
public class VectorIngestionEngine {

    private final EmbeddingModel embeddingModel;
    private final EmbeddingStore<TextSegment> embeddingStore;
    private final EmbeddingStoreIngestor ingestor;

    public VectorIngestionEngine(EmbeddingModel embeddingModel,
                                  EmbeddingStore<TextSegment> embeddingStore) {
        this.embeddingModel = embeddingModel;
        this.embeddingStore = embeddingStore;

        this.ingestor = EmbeddingStoreIngestor.builder()
                .documentSplitter(DocumentSplitterFactory.createRecursiveSplitter())
                .embeddingModel(embeddingModel)
                .embeddingStore(embeddingStore)
                .build();
    }

    /** 将文档向量化并存入向量数据库 */
    public void ingest(Document document) {
        ingestor.ingest(document);
    }

    /** 批量入库 */
    public void ingest(Document... documents) {
        ingestor.ingest(documents);
    }

    /** 批量入库（List） */
    public void ingest(java.util.List<Document> documents) {
        ingestor.ingest(documents);
    }

    // ==================== 工厂方法 ====================

    /** 使用 OpenAI Embedding 模型 + 内存向量库（开发/测试用） */
    public static VectorIngestionEngine withOpenAiInMemory(String apiKey) {
        EmbeddingModel model = OpenAiEmbeddingModel.builder()
                .apiKey(apiKey)
                .modelName("text-embedding-3-small")  // 1536 维, 性价比最高
                .build();
        EmbeddingStore<TextSegment> store = new InMemoryEmbeddingStore<>();
        return new VectorIngestionEngine(model, store);
    }

    /**
     * 使用阿里千问 Embedding 模型（中文场景推荐）
     * 需要 langchain4j-dashscope 依赖
     */
    /*
    public static VectorIngestionEngine withQwenInMemory(String apiKey) {
        EmbeddingModel model = QwenEmbeddingModel.builder()
                .apiKey(apiKey)
                .modelName("text-embedding-v3")  // 1024 维
                .build();
        EmbeddingStore<TextSegment> store = new InMemoryEmbeddingStore<>();
        return new VectorIngestionEngine(model, store);
    }
    */

    public EmbeddingModel getEmbeddingModel() {
        return embeddingModel;
    }

    public EmbeddingStore<TextSegment> getEmbeddingStore() {
        return embeddingStore;
    }
}
```

---

## 八、生产环境向量数据库配置

```java
package com.example.rag;

import dev.langchain4j.data.segment.TextSegment;
import dev.langchain4j.store.embedding.EmbeddingStore;
import dev.langchain4j.store.embedding.inmemory.InMemoryEmbeddingStore;

/**
 * 生产环境向量数据库配置示例
 */
public class ProductionEmbeddingStoreConfig {

    /** 方案一：内存（仅开发测试） */
    public static EmbeddingStore<TextSegment> inMemory() {
        return new InMemoryEmbeddingStore<>();
    }

    /** 方案二：Qdrant（推荐生产使用）—— 需要 langchain4j-qdrant 依赖 */
    /*
    public static EmbeddingStore<TextSegment> qdrant() {
        return QdrantEmbeddingStore.builder()
                .host("localhost")
                .port(6334)
                .collectionName("knowledge-base")
                .build();
    }
    */

    /** 方案三：PGVector（PostgreSQL 方案，运维友好）—— 需要 langchain4j-pgvector 依赖 */
    /*
    public static EmbeddingStore<TextSegment> pgVector(DataSource dataSource) {
        return PgVectorEmbeddingStore.builder()
                .datasource(dataSource)
                .table("embeddings")
                .dimension(1536)  // 需与 Embedding 模型维度一致！
                .build();
    }
    */

    /** 方案四：Milvus（海量数据，高性能检索）—— 需要 langchain4j-milvus 依赖 */
    /*
    public static EmbeddingStore<TextSegment> milvus() {
        return MilvusEmbeddingStore.builder()
                .host("localhost")
                .port(19530)
                .collectionName("knowledge_base")
                .dimension(1536)
                .build();
    }
    */
}
```

---

## 九、AI 助手接口定义

```java
package com.example.rag.assistant;

import dev.langchain4j.service.SystemMessage;
import dev.langchain4j.service.UserMessage;

/**
 * 知识库 RAG 问答助手接口
 * LangChain4j AiServices 会自动代理实现
 */
public interface KnowledgeAssistant {

    @SystemMessage("""
            你是一个专业的知识库问答助手。请基于提供的参考资料回答用户问题。

            规则：
            1. 只根据参考资料中的内容回答，不要编造信息
            2. 如果参考资料中没有相关信息，请明确告知用户
            3. 回答要准确、简洁、条理清晰
            4. 如果涉及多个来源，请注明来源文件名
            5. 用中文回答
            """)
    String answer(@UserMessage String userQuestion);
}
```

---

## 十、RAG 核心引擎（完整编排）

```java
package com.example.rag.engine;

import com.example.rag.DocumentSplitterFactory;
import com.example.rag.assistant.KnowledgeAssistant;
import com.example.rag.image.DocumentImageProcessor;
import com.example.rag.parser.UniversalDocumentParserService;

import dev.langchain4j.data.document.Document;
import dev.langchain4j.data.document.DocumentSplitter;
import dev.langchain4j.data.segment.TextSegment;
import dev.langchain4j.memory.chat.MessageWindowChatMemory;
import dev.langchain4j.model.chat.ChatLanguageModel;
import dev.langchain4j.model.embedding.EmbeddingModel;
import dev.langchain4j.model.openai.OpenAiChatModel;
import dev.langchain4j.model.openai.OpenAiEmbeddingModel;
import dev.langchain4j.rag.content.retriever.ContentRetriever;
import dev.langchain4j.rag.content.retriever.EmbeddingStoreContentRetriever;
import dev.langchain4j.service.AiServices;
import dev.langchain4j.store.embedding.EmbeddingStore;
import dev.langchain4j.store.embedding.EmbeddingStoreIngestor;
import dev.langchain4j.store.embedding.inmemory.InMemoryEmbeddingStore;

import java.io.*;
import java.util.List;

/**
 * RAG 问答引擎 —— 完整端到端方案
 * 文档解析 → 图片处理 → 分块 → 向量化 → 检索 → LLM 对话
 */
public class RagEngine {

    private final UniversalDocumentParserService parserService;
    private final DocumentImageProcessor imageProcessor;
    private final EmbeddingModel embeddingModel;
    private final EmbeddingStore<TextSegment> embeddingStore;
    private final EmbeddingStoreIngestor ingestor;
    private final ChatLanguageModel chatModel;
    private final ContentRetriever contentRetriever;
    private final KnowledgeAssistant assistant;

    public RagEngine(String openAiApiKey) {
        // ========== 1. 文档解析器 ==========
        this.parserService = new UniversalDocumentParserService();

        // ========== 2. 图片处理器（多模态 LLM） ==========
        this.imageProcessor = DocumentImageProcessor.withOpenAi(openAiApiKey);

        // ========== 3. Embedding 模型 ==========
        this.embeddingModel = OpenAiEmbeddingModel.builder()
                .apiKey(openAiApiKey)
                .modelName("text-embedding-3-small") // 1536 维
                .build();

        // ========== 4. 向量数据库 ==========
        this.embeddingStore = new InMemoryEmbeddingStore<>();

        // ========== 5. 文档入库管道（分块 + 向量化 + 存储） ==========
        DocumentSplitter splitter = DocumentSplitterFactory.createRecursiveSplitter();
        this.ingestor = EmbeddingStoreIngestor.builder()
                .documentSplitter(splitter)
                .embeddingModel(embeddingModel)
                .embeddingStore(embeddingStore)
                .build();

        // ========== 6. 内容检索器 ==========
        this.contentRetriever = EmbeddingStoreContentRetriever.builder()
                .embeddingStore(embeddingStore)
                .embeddingModel(embeddingModel)
                .maxResults(5)       // 返回 Top 5 最相关片段
                .minScore(0.65)      // 最低相似度阈值
                .build();

        // ========== 7. 对话 LLM ==========
        this.chatModel = OpenAiChatModel.builder()
                .apiKey(openAiApiKey)
                .modelName("gpt-4o-mini")
                .temperature(0.2)    // 低温度，回答更准确
                .maxTokens(2048)
                .build();

        // ========== 8. 组装 AI 助手（RAG = 检索 + 对话 + 记忆） ==========
        this.assistant = AiServices.builder(KnowledgeAssistant.class)
                .chatLanguageModel(chatModel)
                .contentRetriever(contentRetriever)
                .chatMemory(MessageWindowChatMemory.withMaxMessages(20))
                .build();
    }

    // ==================== 文档入库 ====================

    /**
     * 导入文档（自动识别格式，处理文本+图片）
     */
    public void ingestDocument(String fileName, InputStream inputStream) throws Exception {
        System.out.println("📥 正在导入文档: " + fileName);

        // 1. 缓存文件字节（inputStream 只能读一次）
        byte[] fileBytes = inputStream.readAllBytes();

        // 2. 解析文档文本
        Document textDoc = parserService.parse(fileName,
                new ByteArrayInputStream(fileBytes));
        ingestor.ingest(textDoc);
        System.out.println("  ✅ 文本内容已向量化入库");

        // 3. 如果是 PDF，额外提取图片并描述
        String ext = fileName.substring(fileName.lastIndexOf('.') + 1).toLowerCase();
        if ("pdf".equals(ext)) {
            File tempFile = File.createTempFile("rag-", ".pdf");
            try (OutputStream os = new FileOutputStream(tempFile)) {
                os.write(fileBytes);
            }
            List<Document> imageDocs = imageProcessor.extractAndDescribeImages(tempFile);
            if (!imageDocs.isEmpty()) {
                ingestor.ingest(imageDocs);
                System.out.println("  ✅ " + imageDocs.size() + " 张图片描述已向量化入库");
            }
            tempFile.delete();
        }

        System.out.println("✅ 文档导入完成: " + fileName);
    }

    /**
     * 批量导入目录下所有文件
     */
    public void ingestDirectory(File directory) throws Exception {
        File[] files = directory.listFiles();
        if (files == null) return;

        for (File file : files) {
            if (file.isFile()) {
                try (InputStream is = new FileInputStream(file)) {
                    ingestDocument(file.getName(), is);
                } catch (Exception e) {
                    System.err.println("⚠️ 跳过文件 " + file.getName() + ": " + e.getMessage());
                }
            }
        }
    }

    // ==================== 问答对话 ====================

    /**
     * RAG 问答（支持多轮对话，自动检索相关知识）
     */
    public String ask(String question) {
        return assistant.answer(question);
    }
}
```

---

## 十一、主程序入口：完整 RAG 问答 Demo

```java
package com.example.rag;

import com.example.rag.engine.RagEngine;

import java.io.File;
import java.util.Scanner;

/**
 * 完整 RAG 知识库问答系统
 *
 * 功能：
 * 1. 支持 PDF / Word / Excel / PPT / Markdown / HTML / CSV / JSON / XML / TXT 等 10+ 格式
 * 2. 自动处理文档中的图片（多模态 LLM 描述 → 向量化）
 * 3. 支持多轮对话，带上下文记忆
 * 4. 基于 RAG 检索增强，只回答知识库中有的内容
 */
public class RagChatApplication {

    public static void main(String[] args) throws Exception {

        String apiKey = System.getenv("OPENAI_API_KEY");
        if (apiKey == null || apiKey.isBlank()) {
            System.err.println("❌ 请设置环境变量 OPENAI_API_KEY");
            return;
        }

        // ========== 1. 初始化 RAG 引擎 ==========
        System.out.println("🚀 正在初始化 RAG 知识库引擎...\n");
        RagEngine rag = new RagEngine(apiKey);

        // ========== 2. 导入知识库文档 ==========
        File docsDir = new File("docs");
        if (docsDir.exists() && docsDir.isDirectory()) {
            rag.ingestDirectory(docsDir);
        } else {
            System.out.println("📂 请在项目根目录下创建 docs/ 文件夹并放入文档");
            System.out.println("   支持格式: PDF, DOCX, XLSX, PPTX, MD, HTML, CSV, JSON, XML, TXT");
            return;
        }

        // ========== 3. 交互式多轮问答 ==========
        System.out.println("\n" + "=".repeat(60));
        System.out.println("💬 知识库问答系统已就绪！输入问题开始对话，输入 'quit' 退出");
        System.out.println("=".repeat(60) + "\n");

        Scanner scanner = new Scanner(System.in);
        while (true) {
            System.out.print("🧑 你: ");
            String question = scanner.nextLine().trim();

            if ("quit".equalsIgnoreCase(question) || "exit".equalsIgnoreCase(question)) {
                System.out.println("👋 再见！");
                break;
            }
            if (question.isEmpty()) continue;

            System.out.println("🤔 正在检索知识库并生成回答...\n");

            String answer = rag.ask(question);

            System.out.println("🤖 助手: " + answer);
            System.out.println();
        }

        scanner.close();
    }
}
```

---

## 十二、项目结构总览

```
project/
├── docs/                                    # 📂 放入各种格式的知识库文档
│   ├── 技术手册.pdf
│   ├── 产品文档.docx
│   ├── 数据报表.xlsx
│   ├── 产品介绍.pptx
│   ├── API说明.md
│   ├── 帮助页面.html
│   ├── 用户数据.csv
│   ├── 配置文件.json
│   ├── 系统配置.xml
│   └── 常见问题.txt
│
├── src/main/java/com/example/rag/
│   ├── RagChatApplication.java              # 🚀 主程序入口
│   ├── DocumentSplitterFactory.java         # ✂️ 分块策略工厂
│   ├── VectorIngestionEngine.java           # 📦 向量化入库引擎
│   ├── ProductionEmbeddingStoreConfig.java  # 🗄️ 生产向量库配置
│   │
│   ├── parser/
│   │   └── UniversalDocumentParserService.java  # 📄 全格式文档解析
│   │
│   ├── image/
│   │   └── DocumentImageProcessor.java      # 📷 图片提取 + 多模态描述
│   │
│   ├── engine/
│   │   └── RagEngine.java                   # 🧠 RAG 核心引擎
│   │
│   └── assistant/
│       └── KnowledgeAssistant.java          # 💬 AI 助手接口
│
└── pom.xml                                  # 📦 Maven 依赖配置
```

---

## 十三、Embedding 模型维度参考

> ⚠️ **dimension 必须匹配**：向量数据库创建集合时的 `dimension` 参数必须与 Embedding 模型输出维度一致。

| Embedding 模型 | 输出维度 (dimension) | 推荐场景 |
|---|---|---|
| OpenAI text-embedding-3-small | **1536** | 通用场景，性价比最高 |
| OpenAI text-embedding-3-large | **3072** | ��精度场景 |
| 阿里 text-embedding-v3 | **1024** | 中文商用 |
| Qwen3-Embedding-0.6B | **1024** | 中文私有化部署 |
| BAAI/bge-large-zh | **1024** | 中文开源标杆 |
| Cohere Embed-V3 | **1024** | 多语言检索 |
| Jina Embeddings v5 | **768 / 1024** | 高速低成本 |

---

## 十四、关键最佳实践总结

| 维度 | 建议 |
|---|---|
| **文档解析** | 统一使用 Tika 作为兜底解析器，PDF 用 PdfBox 精度更高 |
| **图片处理** | 生产环境推荐多模态 LLM 描述（方案A），比传统 OCR 效果好 5 倍以上 |
| **分块策略** | 递归分割 `512 chars + 64 overlap`，根据业务微调 |
| **Embedding 模型** | 英文用 `text-embedding-3-small`，中文优先 `Qwen3-Embedding` 或 `bge-large-zh` |
| **向量数据库** | 开发用 InMemory，生产用 Qdrant / PGVector / Milvus |
| **对话记忆** | `MessageWindowChatMemory(20)` 保持 20 轮上下文 |
| **相似度阈值** | `minScore: 0.65~0.75`，过低引入噪音，过高遗漏内容 |
| **LLM 温度** | RAG 场景建议 `temperature: 0.1~0.3`，保证回答准确性 |

---

## 十五、运行效果示例

```
🚀 正在初始化 RAG 知识库引擎...

📥 正在导入文档: 技术手册.pdf
  ✅ 文本内容已向量化入库
📄 从 技术手册.pdf 中提取到 3 张图片
  📷 图片 1/3 已描述并生成文档
  📷 图片 2/3 已描述并生成文档
  📷 图片 3/3 已描述并生成文档
  ✅ 3 张图片描述已向量化入库
✅ 文档导入完成: 技术手册.pdf

📥 正在导入文档: 产品文档.docx
  ✅ 文本内容已向量化入库
✅ 文档导入完成: 产品文档.docx

📥 正在导入文档: 用户数据.csv
  ✅ 文本内容已向量化入库
✅ 文档导入完成: 用户数据.csv

============================================================
💬 知识库问答系统已就绪！输入问题开始对话，输入 'quit' 退出
============================================================

🧑 你: 系统认证模块怎么配置？
🤔 正在检索知识库并生成回答...

🤖 助手: 根据《技术手册.pdf》中的说明，系统认证模块配置步骤如下：
   1. 在 application.yml 中配置 auth.type 为 OAuth2 或 JWT
   2. 配置密钥文件路径 auth.key-path
   3. 设置 token 有效期 auth.token-expiry: 3600
   ...（来源: 技术手册.pdf 第3章）

🧑 你: 上面提到的架构图里有几个微服务？
🤔 正在检索知识库并生成回答...

🤖 助手: 根据技术手册中架构图的描述，系统共包含 5 个核心微服务：
   1. 网关服务（Gateway Service）
   2. 用户认证服务（Auth Service）
   3. 订单服务（Order Service）
   4. 商品服务（Product Service）
   5. 消息服务（Message Service）
   ...（来源: 技术手册.pdf 图片2 描述）

🧑 你: quit
👋 再见！
```