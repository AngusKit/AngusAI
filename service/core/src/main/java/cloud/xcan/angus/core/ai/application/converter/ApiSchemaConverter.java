package cloud.xcan.angus.core.ai.application.converter;

import static cloud.xcan.angus.core.ai.domain.apis.converter.ApiResponseConverter.OPENAPI_MAPPER;
import static cloud.xcan.angus.core.biz.ProtocolAssert.assertNotNull;
import static cloud.xcan.angus.core.spring.SpringContextHolder.getCachedUidGenerator;
import static cloud.xcan.angus.spec.utils.ObjectUtils.distinctByKey;
import static cloud.xcan.angus.spec.utils.ObjectUtils.isNotEmpty;
import static io.swagger.v3.oas.models.Components.COMPONENTS_EXTENSIONS_REF;
import static io.swagger.v3.oas.models.extension.ExtensionKey.ID_KEY;
import static java.util.Objects.nonNull;
import static org.apache.commons.lang3.ObjectUtils.isEmpty;

import cloud.xcan.angus.core.ai.domain.apis.ApiComponent;
import cloud.xcan.angus.core.ai.domain.apis.ApiComponentType;
import cloud.xcan.angus.core.ai.domain.apis.ApiSchema;
import cloud.xcan.angus.spec.experimental.Assert;
import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.examples.Example;
import io.swagger.v3.oas.models.headers.Header;
import io.swagger.v3.oas.models.links.Link;
import io.swagger.v3.oas.models.media.Schema;
import io.swagger.v3.oas.models.parameters.Parameter;
import io.swagger.v3.oas.models.parameters.RequestBody;
import io.swagger.v3.oas.models.responses.ApiResponse;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.servers.Server;
import io.swagger.v3.oas.models.tags.Tag;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.TreeSet;
import java.util.stream.Collectors;
import lombok.SneakyThrows;
import org.jetbrains.annotations.NotNull;

public class ApiSchemaConverter {

  public static void updateSchema(
      ApiSchema schemaDb, OpenAPI openApi, boolean mergeSchema, boolean cover) {
    schemaDb.setOpenapi(openApi.getOpenapi())
        .setInfo(openApi.getInfo())
        .setExternalDocs(openApi.getExternalDocs())
        .setSpecVersion(openApi.getSpecVersion());
    if (mergeSchema) {
      // Append
      if (isNotEmpty(openApi.getServers())) {
        Map<String, Server> serversDbMap = schemaDb.getServers().stream()
            .collect(Collectors.toMap(Server::getUrl, server -> server, (u1, u2) -> u2));
        List<Server> openapiServers = openApi.getServers();
        if (isNotEmpty(schemaDb.getServers())) {
          // Find updated if needs cover
          if (cover) {
            List<Server> updatedServers = openapiServers.stream()
                .filter(x -> serversDbMap.containsKey(x.getUrl()))
                .toList();
            if (isNotEmpty(updatedServers)) {
              for (Server updatedServer : updatedServers) {
                Server serverDb = serversDbMap.get(updatedServer.getUrl());
                serverDb.setDescription(updatedServer.getDescription());
                serverDb.setVariables(updatedServer.getVariables());
              }
            }
          }

          List<Server> addServers = openapiServers.stream()
              .filter(x -> !serversDbMap.containsKey(x.getUrl()))
              .toList();
          if (isNotEmpty(addServers)) {
            for (Server addServer : addServers) {
              addServer.addExtension(ID_KEY, getCachedUidGenerator().getUID());
              schemaDb.getServers().add(addServer);
            }
          }
        } else {
          for (Server server : openApi.getServers()) {
            server.addExtension(ID_KEY, getCachedUidGenerator().getUID());
          }
          schemaDb.setServers(openApi.getServers());
        }
      }
      if (isNotEmpty(openApi.getSecurity())) {
        if (isNotEmpty(schemaDb.getSecurity())) {
          List<SecurityRequirement> removeDuplicate = new ArrayList<>(openApi.getSecurity());
          Set<String> existedKeys = new HashSet<>();
          for (SecurityRequirement securityRequirement : openApi.getSecurity()) {
            existedKeys.addAll(securityRequirement.keySet());
          }
          for (SecurityRequirement securityRequirement : schemaDb.getSecurity()) {
            for (String key : securityRequirement.keySet()) {
              if (!existedKeys.contains(key)) {
                removeDuplicate.add(securityRequirement);
              }
            }
          }
          schemaDb.setSecurity(removeDuplicate);
        } else {
          schemaDb.setSecurity(openApi.getSecurity());
        }
      }
      if (isNotEmpty(openApi.getTags())) {
        if (isNotEmpty(schemaDb.getTags())) {
          List<Tag> tags = new ArrayList<>(openApi.getTags());
          tags.addAll(schemaDb.getTags());
          List<Tag> removeDuplicate = tags.stream()
              .collect(Collectors.collectingAndThen(Collectors.toCollection(()
                  -> new TreeSet<>(Comparator.comparing(Tag::getName))), ArrayList::new));
          schemaDb.setTags(removeDuplicate);
        } else {
          schemaDb.setTags(openApi.getTags());
        }
      }
      if (isNotEmpty(openApi.getExtensions())) {
        schemaDb.getExtensions().putAll(openApi.getExtensions());
      }
    } else {
      // Replace
      schemaDb.setServers(openApi.getServers())
          .setSecurity(openApi.getSecurity())
          .setTags(openApi.getTags())
          .setExtensions(openApi.getExtensions());
    }
  }

  public static void openApiToUpdateComp(ApiComponent compDb, ApiComponent openApiComp) {
    compDb.setKey(openApiComp.getKey())
        .setRef(openApiComp.getRef())
        .setModel(openApiComp.getModel())
        .setDescription(openApiComp.getDescription())
        .setSchemaHash(openApiComp.getSchemaHash());
  }

  public static ApiComponent toCollectionComp(Long apiCollectionId,
      ApiComponentType type, String key, String model) {
    Assert.assertNotEmpty(model, "Component model cannot be empty");
    switch (type) {
      case schemas: {
        Schema schema = toComponent(Schema.class, model);
        return toCollectionSchemaComp(apiCollectionId, key, schema);
      }
      case responses: {
        ApiResponse response = toComponent(ApiResponse.class, model);
        return toCollectionResponseComp(apiCollectionId, key, response);
      }
      case parameters: {
        Parameter parameter = toComponent(Parameter.class, model);
        return toCollectionParameterComp(apiCollectionId, key, parameter);
      }
      case examples: {
        Example example = toComponent(Example.class, model);
        return toCollectionExampleComp(apiCollectionId, key, example);
      }
      case requestBodies: {
        RequestBody requestBody = toComponent(RequestBody.class, model);
        return toCollectionRequestBodyComp(apiCollectionId, key, requestBody);
      }
      case headers: {
        Header header = toComponent(Header.class, model);
        return toCollectionHeaderComp(apiCollectionId, key, header);
      }
      case securitySchemes: {
        SecurityScheme securityScheme = toComponent(SecurityScheme.class, model);
        return toCollectionSecuritySchemaComp(apiCollectionId, key, securityScheme);
      }
      case links: {
        Link link = toComponent(Link.class, model);
        return toCollectionLinkComp(apiCollectionId, key, link);
      }
      case extensions: {
        Object extension = toComponent(Object.class, model);
        return toCollectionExtensionComp(apiCollectionId, key, extension);
      }
      case callbacks: {
      }
      case pathItems: {
      }
      default: {
        throw new IllegalArgumentException("Unsupported type: " + type);
      }
    }
  }

  @SneakyThrows
  public static Map<String, ApiComponent> toCollectionComp(Long apiCollectionId,
      Components components) {
    Map<String, ApiComponent> flat = new HashMap<>();
    if (isNotEmpty(components.getSchemas())) {
      for (String key : components.getSchemas().keySet()) {
        Schema schema = components.getSchemas().get(key);
        flat.put(Schema.format$ref(key), toCollectionSchemaComp(apiCollectionId, key, schema));
      }
    }
    if (isNotEmpty(components.getResponses())) {
      for (String key : components.getResponses().keySet()) {
        ApiResponse response = components.getResponses().get(key);
        flat.put(ApiResponse.format$ref(key),
            toCollectionResponseComp(apiCollectionId, key, response));
      }
    }
    if (isNotEmpty(components.getParameters())) {
      for (String key : components.getParameters().keySet()) {
        Parameter parameter = components.getParameters().get(key);
        flat.put(Parameter.format$ref(key),
            toCollectionParameterComp(apiCollectionId, key, parameter));
      }
    }
    if (isNotEmpty(components.getExamples())) {
      for (String key : components.getExamples().keySet()) {
        Example example = components.getExamples().get(key);
        flat.put(Example.format$ref(key), toCollectionExampleComp(apiCollectionId, key, example));
      }
    }
    if (isNotEmpty(components.getRequestBodies())) {
      for (String key : components.getRequestBodies().keySet()) {
        RequestBody requestBody = components.getRequestBodies().get(key);
        flat.put(RequestBody.format$ref(key),
            toCollectionRequestBodyComp(apiCollectionId, key, requestBody));
      }
    }
    if (isNotEmpty(components.getHeaders())) {
      for (String key : components.getHeaders().keySet()) {
        Header header = components.getHeaders().get(key);
        flat.put(Header.format$ref(key), toCollectionHeaderComp(apiCollectionId, key, header));
      }
    }
    if (isNotEmpty(components.getSecuritySchemes())) {
      for (String key : components.getSecuritySchemes().keySet()) {
        SecurityScheme securityScheme = components.getSecuritySchemes().get(key);
        flat.put(SecurityScheme.format$ref(key),
            toCollectionSecuritySchemaComp(apiCollectionId, key, securityScheme));
      }
    }
    if (isNotEmpty(components.getLinks())) {
      for (String key : components.getLinks().keySet()) {
        Link link = components.getLinks().get(key);
        flat.put(Link.format$ref(key), toCollectionLinkComp(apiCollectionId, key, link));
      }
      //} else if (isNotEmpty(components.getCallbacks())) {
    }
    if (isNotEmpty(components.getExtensions())) {
      for (String key : components.getExtensions().keySet()) {
        Object extension = components.getExtensions().get(key);
        flat.put(COMPONENTS_EXTENSIONS_REF + key,
            toCollectionExtensionComp(apiCollectionId, key, extension));
      }
      //} else if (isNotEmpty(components.getPathItems())) {
      //
    }
    return flat;
  }

  public static Components toOpenApiComp(Map<ApiComponentType, List<ApiComponent>> compsMap) {
    Components components = new Components();
    for (ApiComponentType type : compsMap.keySet()) {
      List<ApiComponent> comps = compsMap.get(type).stream()
          .filter(distinctByKey(ApiComponent::getRef)).toList();
      switch (type) {
        case schemas: {
          components.schemas(toOasComp(Schema.class, comps));
          break;
        }
        case responses: {
          components.responses(toOasComp(ApiResponse.class, comps));
          break;
        }
        case parameters: {
          components.parameters(toOasComp(Parameter.class, comps));
          break;
        }
        case examples: {
          components.examples(toOasComp(Example.class, comps));
          break;
        }
        case requestBodies: {
          components.requestBodies(toOasComp(RequestBody.class, comps));
          break;
        }
        case headers: {
          components.headers(toOasComp(Header.class, comps));
          break;
        }
        case securitySchemes: {
          components.securitySchemes(toOasComp(SecurityScheme.class, comps));
          break;
        }
        case links: {
          components.links(toOasComp(Link.class, comps));
          break;
        }
        case extensions: {
          components.extensions(toOasMapComp(comps));
          break;
        }
        default: {
          // NOOP
        }
      }
    }
    return components;
  }

  private static @NotNull <T> Map<String, T> toOasComp(Class<T> clz, List<ApiComponent> comps) {
    Map<String, T> oasComps = new HashMap<>();
    for (ApiComponent comp : comps) {
      T schema = comp.toComponent(clz);
      if (nonNull(schema)) {
        oasComps.put(comp.getRef(), schema);
      }
    }
    return oasComps;
  }

  private static @NotNull Map<String, Object> toOasMapComp(List<ApiComponent> comps) {
    Map<String, Object> oasComps = new HashMap<>();
    for (ApiComponent comp : comps) {
      Object schema = comp.toComponent(Map.class);
      if (nonNull(schema)) {
        oasComps.put(comp.getRef(), schema);
      }
    }
    return oasComps;
  }

  @SneakyThrows
  private static ApiComponent toCollectionSchemaComp(Long apiCollectionId, String key,
      Schema schema) {
    return new ApiComponent()
        .setCollectionId(apiCollectionId).setType(ApiComponentType.schemas)
        .setKey(key).setRef(Schema.format$ref(key))
        .setSchema(schema)
        .setModel(OPENAPI_MAPPER.writeValueAsString(schema))
        .setDescription(schema.getDescription())
        .setSchemaHash(schema.hashCode());
  }

  @SneakyThrows
  private static ApiComponent toCollectionResponseComp(Long apiCollectionId, String key,
      ApiResponse response) {
    return new ApiComponent()
        .setCollectionId(apiCollectionId).setType(ApiComponentType.responses)
        .setKey(key).setRef(ApiResponse.format$ref(key))
        .setResponse(response)
        .setModel(OPENAPI_MAPPER.writeValueAsString(response))
        .setDescription(response.getDescription())
        .setSchemaHash(response.hashCode());
  }

  @SneakyThrows
  private static ApiComponent toCollectionParameterComp(Long apiCollectionId, String key,
      Parameter parameter) {
    return new ApiComponent()
        .setCollectionId(apiCollectionId).setType(ApiComponentType.parameters)
        .setKey(key).setRef(Parameter.format$ref(key))
        .setParameter(parameter)
        .setModel(OPENAPI_MAPPER.writeValueAsString(parameter))
        .setDescription(parameter.getDescription())
        .setSchemaHash(parameter.hashCode());
  }

  @SneakyThrows
  private static ApiComponent toCollectionExampleComp(Long apiCollectionId, String key,
      Example example) {
    return new ApiComponent()
        .setCollectionId(apiCollectionId).setType(ApiComponentType.examples)
        .setKey(key).setRef(Example.format$ref(key))
        .setExample(example)
        .setModel(OPENAPI_MAPPER.writeValueAsString(example))
        .setDescription(example.getDescription())
        .setSchemaHash(example.hashCode());
  }

  @SneakyThrows
  private static ApiComponent toCollectionRequestBodyComp(Long apiCollectionId, String key,
      RequestBody requestBody) {
    return new ApiComponent()
        .setCollectionId(apiCollectionId).setType(ApiComponentType.requestBodies)
        .setKey(key).setRef(RequestBody.format$ref(key))
        .setRequestBody(requestBody)
        .setModel(OPENAPI_MAPPER.writeValueAsString(requestBody))
        .setDescription(requestBody.getDescription())
        .setSchemaHash(requestBody.hashCode());
  }

  @SneakyThrows
  private static ApiComponent toCollectionHeaderComp(Long apiCollectionId, String key,
      Header header) {
    return new ApiComponent()
        .setCollectionId(apiCollectionId).setType(ApiComponentType.headers)
        .setKey(key).setRef(Header.format$ref(key))
        .setHeader(header)
        .setModel(OPENAPI_MAPPER.writeValueAsString(header))
        .setDescription(header.getDescription())
        .setSchemaHash(header.hashCode());
  }

  @SneakyThrows
  private static ApiComponent toCollectionSecuritySchemaComp(Long apiCollectionId, String key,
      SecurityScheme securityScheme) {
    return new ApiComponent()
        .setCollectionId(apiCollectionId).setType(ApiComponentType.securitySchemes)
        .setKey(key).setRef(SecurityScheme.format$ref(key))
        .setSecurityScheme(securityScheme)
        .setModel(OPENAPI_MAPPER.writeValueAsString(securityScheme))
        .setDescription(securityScheme.getDescription())
        .setSchemaHash(securityScheme.hashCode());
  }

  @SneakyThrows
  private static ApiComponent toCollectionLinkComp(Long apiCollectionId, String key, Link link) {
    return new ApiComponent()
        .setCollectionId(apiCollectionId).setType(ApiComponentType.links)
        .setKey(key).setRef(Link.format$ref(key))
        .setLink(link)
        .setModel(OPENAPI_MAPPER.writeValueAsString(link))
        .setDescription(link.getDescription())
        .setSchemaHash(link.hashCode());
  }

  @SneakyThrows
  private static ApiComponent toCollectionExtensionComp(Long apiCollectionId, String key,
      Object extension) {
    return new ApiComponent().setCollectionId(apiCollectionId)
        .setType(ApiComponentType.extensions)
        .setKey(key).setRef(COMPONENTS_EXTENSIONS_REF + key)
        .setExtension(extension)
        .setModel(OPENAPI_MAPPER.writeValueAsString(extension))
        //.setDescription(link.getDescription())
        .setSchemaHash(extension.hashCode());
  }

  public static List<ApiComponent> toCollectionSecurityComp(Long collectionId,
      Map<String, SecurityScheme> securities) {
    List<ApiComponent> comps = new ArrayList<>();
    for (String key : securities.keySet()) {
      SecurityScheme securityScheme = securities.get(key);
      comps.add(toCollectionSecuritySchemaComp(collectionId, key, securityScheme));
    }
    return comps;
  }

  /**
   * <p>
   * Convert a JSON model string to a component object.
   * </p>
   * <p>
   * Deserializes a JSON model string into the specified component class using OpenAPI mapper.
   * Validates that the resulting object is not null.
   * </p>
   *
   * @param clz   Target component class
   * @param model JSON model string
   * @param <T>   Component type
   * @return Deserialized component object
   */
  @SneakyThrows
  public static <T> T toComponent(Class<T> clz, String model) {
    if (isEmpty(model)) {
      return null;
    }
    T t = OPENAPI_MAPPER.readValue(model, clz);
    assertNotNull(t, "The component model is not in a valid format");
    return t;
  }

}
