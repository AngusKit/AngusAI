package cloud.xcan.angus.core.ai.application.cmd.vector;

import static cloud.xcan.angus.spec.utils.ObjectUtils.nullSafe;

import cloud.xcan.angus.core.ai.application.query.vector.VectorStoreQuery;
import cloud.xcan.angus.core.ai.domain.vector.VectorStore;
import cloud.xcan.angus.core.ai.domain.vector.VectorStoreRepo;
import cloud.xcan.angus.core.ai.interfaces.vector.facade.dto.ConnectionTestDto;
import cloud.xcan.angus.core.ai.interfaces.vector.facade.dto.SyncDto;
import cloud.xcan.angus.core.biz.BizTemplate;
import cloud.xcan.angus.core.biz.cmd.CommCmd;
import cloud.xcan.angus.core.jpa.repository.BaseRepository;
import cloud.xcan.angus.core.utils.CoreUtils;
import cloud.xcan.angus.remote.message.ProtocolException;
import cloud.xcan.angus.remote.message.http.ResourceExisted;
import jakarta.annotation.Resource;
import java.util.Objects;
import java.util.UUID;
import org.springframework.stereotype.Service;

/**
 * 向量存储源命令服务实现
 */
@Service
public class VectorStoreCmdImpl extends CommCmd<VectorStore, Long> implements VectorStoreCmd {

  @Resource
  private VectorStoreRepo vectorStoreRepo;

  @Resource
  private VectorStoreQuery vectorStoreQuery;

  @Override
  public VectorStore create(VectorStore vectorStore) {
    return new BizTemplate<VectorStore>() {
      @Override
      protected void checkParams() {
        // 检查名称是否重复
        boolean exists = vectorStoreRepo.existsByName(vectorStore.getName());
        if (exists) {
          throw ResourceExisted.of("存储源名称「{0}」已存在", new Object[]{vectorStore.getName()});
        }
      }

      @Override
      protected VectorStore process() {
        // 设置默认状态为未连接
        vectorStore.setStatus("disconnected");
        insert(vectorStore);
        return vectorStore;
      }
    }.execute();
  }

  @Override
  public VectorStore update(VectorStore vectorStore) {
    return new BizTemplate<VectorStore>() {
      VectorStore vectorStoreDb;

      @Override
      protected void checkParams() {
        // 检查存储源是否存在
        vectorStoreDb = vectorStoreQuery.findAndCheck(vectorStore.getId());

        // 检查名称是否重复（排除自己）
        String actualName = nullSafe(vectorStore.getName(), vectorStoreDb.getName());
        boolean exists = vectorStoreRepo.existsByNameAndIdNot(actualName, vectorStore.getId());
        if (exists) {
          throw ResourceExisted.of("存储源名称「{0}」已存在", new Object[]{actualName});
        }
      }

      @Override
      protected VectorStore process() {
        // 如果endpoint或config发生变化，状态重置为disconnected
        boolean endpointChanged = vectorStore.getEndpoint() != null
            && !Objects.equals(vectorStore.getEndpoint(), vectorStoreDb.getEndpoint());
        boolean configChanged = vectorStore.getConfig() != null
            && !Objects.equals(vectorStore.getConfig(), vectorStoreDb.getConfig());

        CoreUtils.copyPropertiesIgnoreNull(vectorStore, vectorStoreDb);

        if (endpointChanged || configChanged) {
          vectorStoreDb.setStatus("disconnected");
        }

        return vectorStoreRepo.save(vectorStoreDb);
      }
    }.execute();
  }

  @Override
  public VectorStore toggleEnabled(Long id, Boolean enabled) {
    return new BizTemplate<VectorStore>() {
      VectorStore vectorStoreDb;

      @Override
      protected void checkParams() {
        vectorStoreDb = vectorStoreQuery.findAndCheck(id);
      }

      @Override
      protected VectorStore process() {
        vectorStoreDb.setEnabled(enabled);
        return vectorStoreRepo.save(vectorStoreDb);
      }
    }.execute();
  }

  @Override
  public VectorStore testConnection(Long id, ConnectionTestDto dto) {
    return new BizTemplate<VectorStore>() {
      VectorStore vectorStoreDb;

      @Override
      protected void checkParams() {
        vectorStoreDb = vectorStoreQuery.findAndCheck(id);
      }

      @Override
      protected VectorStore process() {
        // 设置状态为testing
        vectorStoreDb.setStatus("testing");
        vectorStoreRepo.save(vectorStoreDb);

        try {
          // TODO: 实际调用VectorStoreFactory进行连接测试
          // VectorStoreFactory factory = ...;
          // boolean connected = factory.testConnection(vectorStoreDb);

          // 模拟连接测试
          boolean connected = true;

          if (connected) {
            vectorStoreDb.setStatus("connected");
            // TODO: 更新indexCount等信息
          } else {
            vectorStoreDb.setStatus("disconnected");
          }

          return vectorStoreRepo.save(vectorStoreDb);
        } catch (Exception e) {
          vectorStoreDb.setStatus("disconnected");
          vectorStoreRepo.save(vectorStoreDb);
          throw ProtocolException.of("连接测试失败: {0}", new Object[]{e.getMessage()});
        }
      }
    }.execute();
  }

  @Override
  public void delete(Long id, Boolean force) {
    new BizTemplate<Void>() {
      @Override
      protected void checkParams() {
        // 检查存储源是否存在
        vectorStoreQuery.findAndCheck(id);

        // TODO: 检查是否被知识库引用
        // 如果force=false且被引用，抛出异常
        // if (!force && hasReferences(id)) {
        //   throw ProtocolException.of("存储源被引用，无法删除", new Object[]{});
        // }
      }

      @Override
      protected Void process() {
        vectorStoreRepo.deleteById(id);
        return null;
      }
    }.execute();
  }

  @Override
  protected BaseRepository<VectorStore, Long> getRepository() {
    return this.vectorStoreRepo;
  }
}
