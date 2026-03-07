package cloud.xcan.agentx.core.workflow.validation;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

/**
 * 工作流 DSL 规范注册中心 — 提供所有节点类型的规范描述， 用于生成文档、前端联想以及运行时校验。
 */
public class WorkflowSpecRegistry {

  private final Map<String, NodeTypeSpec> specs = new LinkedHashMap<>();

  public WorkflowSpecRegistry() {
    registerBuiltinSpecs();
  }

  public Optional<NodeTypeSpec> getSpec(String nodeType) {
    return Optional.ofNullable(specs.get(nodeType));
  }

  public List<NodeTypeSpec> getAllSpecs() {
    return List.copyOf(specs.values());
  }

  public void register(NodeTypeSpec spec) {
    specs.put(spec.getType(), spec);
  }

  // --------------- 内置节点类型规范 ---------------

  private void registerBuiltinSpecs() {
    specs.put("START", NodeTypeSpec.builder()
        .type("START").description("工作流入口节点，每个工作流有且仅有一个")
        .configParams(List.of())
        .supportsRetry(false).supportsTimeout(false)
        .build());

    specs.put("END", NodeTypeSpec.builder()
        .type("END").description("工作流终止节点，收集最终输出")
        .configParams(List.of(
            param("outputMapping", "Map<String,String>", "输出映射，将变量映射到最终输出字段", false)
        ))
        .supportsNext(false).supportsRetry(false).supportsTimeout(false)
        .build());

    specs.put("LLM", NodeTypeSpec.builder()
        .type("LLM").description("调用大语言模型生成文本")
        .configParams(List.of(
            param("prompt", "String", "提示词模板，支持 ${variable} 变量替换", true),
            param("model", "String", "模型配置 ID（可选，默认使用全局模型）", false),
            param("temperature", "Double", "温度参数", false),
            param("maxTokens", "Integer", "最大 Token 数", false)
        )).build());

    specs.put("AGENT", NodeTypeSpec.builder()
        .type("AGENT").description("调用已注册的 Agent 进行对话")
        .configParams(List.of(
            param("agentId", "String", "要调用的 Agent ID", true),
            param("message", "String", "发送给 Agent 的消息模板", false)
        )).build());

    specs.put("TOOL", NodeTypeSpec.builder()
        .type("TOOL").description("调用注册的工具")
        .configParams(List.of(
            param("toolId", "String", "工具 ID", true),
            param("params", "Map<String,Object>", "工具调用参数", false)
        )).build());

    specs.put("HTTP", NodeTypeSpec.builder()
        .type("HTTP").description("发起 HTTP 请求")
        .configParams(List.of(
            param("url", "String", "请求 URL，支持变量替换", true),
            param("method", "String", "HTTP 方法 (GET/POST/PUT/DELETE)", false),
            param("headers", "Map<String,String>", "请求头", false),
            param("body", "String", "请求体模板", false)
        )).build());

    specs.put("CODE", NodeTypeSpec.builder()
        .type("CODE").description("执行自定义代码片段")
        .configParams(List.of(
            param("language", "String", "编程语言 (javascript / python / groovy)", true),
            param("script", "String", "代码内容", true)
        )).build());

    specs.put("CONDITION", NodeTypeSpec.builder()
        .type("CONDITION").description("条件分支节点，根据表达式结果选择路径")
        .configParams(List.of(
            param("expression", "String", "SpEL 条件表达式", true),
            param("ifTrue", "String", "条件为 true 时跳转的节点 ID", true),
            param("ifFalse", "String", "条件为 false 时跳转的节点 ID", true)
        )).supportsNext(false).build());

    specs.put("SWITCH", NodeTypeSpec.builder()
        .type("SWITCH").description("多路分支节点，根据表达式值匹配 case")
        .configParams(List.of(
            param("expression", "String", "SpEL 表达式", true),
            param("cases", "Map<String,String>", "值到节点 ID 的映射", true),
            param("default", "String", "默认跳转节点 ID", false)
        )).supportsNext(false).build());

    specs.put("LOOP", NodeTypeSpec.builder()
        .type("LOOP").description("for-each 遍历循环")
        .configParams(List.of(
            param("items", "String", "要遍历的列表变量名", true),
            param("body", "String", "循环体起始节点 ID", true),
            param("itemVariable", "String", "当前项变量名，默认 'item'", false)
        )).build());

    specs.put("WHILE", NodeTypeSpec.builder()
        .type("WHILE").description("条件循环")
        .configParams(List.of(
            param("condition", "String", "SpEL 循环条件", true),
            param("body", "String", "循环体起始节点 ID", true),
            param("maxIterations", "Integer", "最大迭代次数（防死循环），默认 100", false)
        )).build());

    specs.put("PARALLEL", NodeTypeSpec.builder()
        .type("PARALLEL").description("并行执行多个分支")
        .configParams(List.of(
            param("branches", "List<String>", "并行分支起始节点 ID 列表", true),
            param("joinStrategy", "String", "汇聚策略: ALL / ANY，默认 ALL", false)
        )).build());

    specs.put("WAIT", NodeTypeSpec.builder()
        .type("WAIT").description("等待节点 — 人工审批或延时")
        .configParams(List.of(
            param("waitType", "String", "等待类型: DELAY / APPROVAL", false),
            param("delaySeconds", "Integer", "延迟秒数（DELAY 类型）", false)
        )).build());

    specs.put("SUB_WORKFLOW", NodeTypeSpec.builder()
        .type("SUB_WORKFLOW").description("调用子工作流")
        .configParams(List.of(
            param("workflowId", "String", "子工作流 ID", true),
            param("inputMapping", "Map<String,String>", "输入变量映射", false)
        )).build());

    specs.put("SET_VARIABLE", NodeTypeSpec.builder()
        .type("SET_VARIABLE").description("设置变量值")
        .configParams(List.of(
            param("assignments", "Map<String,Object>", "变量赋值映射", true)
        )).build());

    specs.put("KNOWLEDGE_RETRIEVAL", NodeTypeSpec.builder()
        .type("KNOWLEDGE_RETRIEVAL").description("知识库检索节点")
        .configParams(List.of(
            param("query", "String", "检索查询模板，支持变量替换", true),
            param("knowledgeBaseId", "String", "知识库 ID", false),
            param("topK", "Integer", "返回结果数量，默认 5", false)
        )).build());
  }

  private static NodeTypeSpec.ParamSpec param(String name, String type, String desc,
      boolean required) {
    return NodeTypeSpec.ParamSpec.builder()
        .name(name).type(type).description(desc).required(required).build();
  }
}
