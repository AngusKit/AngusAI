package cloud.xcan.angus.core.ai.application.cmd.vector;

import static cloud.xcan.angus.spec.utils.ObjectUtils.isNull;
import static cloud.xcan.angus.spec.utils.ObjectUtils.nullSafe;
import static java.util.Objects.nonNull;

import cloud.xcan.angus.core.ai.application.query.vector.VectorStoreQuery;
import cloud.xcan.angus.core.ai.domain.ConnectionStatus;
import cloud.xcan.angus.core.ai.domain.vector.VectorStore;
import cloud.xcan.agentx.core.vectorstore.VectorStoreConfigDefinition;
import cloud.xcan.angus.core.ai.domain.vector.VectorStoreRepo;
import cloud.xcan.angus.core.biz.BizTemplate;
import cloud.xcan.angus.core.biz.cmd.CommCmd;
import cloud.xcan.angus.core.jpa.repository.BaseRepository;
import cloud.xcan.angus.remote.message.ProtocolException;
import cloud.xcan.angus.remote.message.http.ResourceExisted;
import jakarta.annotation.Resource;
import org.springframework.lang.Nullable;
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
        // 验证配置参数
        vectorStore.getConfig().validateVectorDataSourceConfig();
      }

      @Override
      protected VectorStore process() {
        // 不实际连接，配置错误也允许保存
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
        if (vectorStoreRepo.existsByNameAndIdNot(actualName, vectorStore.getId())) {
          throw ResourceExisted.of("存储源名称「{0}」已存在", new Object[]{actualName});
        }
        // 验证配置参数
        vectorStore.getConfig().validateVectorDataSourceConfig();
      }

      @Override
      protected VectorStore process() {
        // TODO 如果config连接发生变化，测试连接，配置错误不允许保存
        // TODO: 实际调用VectorStoreFactory进行连接测试
        // VectorStoreFactory factory = ...;
        // boolean connected = factory.testConnection(vectorStoreDb);

        // 更新连接成功后数据源信息
        //        private Long indexCount;
        //        private Integer dimension;
        //        private Long responseTime;
        //        private String version;

        update(vectorStore, vectorStoreDb);
        return vectorStoreDb;
      }
    }.execute();
  }

  @Override
  public VectorStore toggleEnabled(Long id, Boolean enabled) {
    return new BizTemplate<VectorStore>() {
      VectorStore vectorStoreDb;

      @Override
      protected void checkParams() {
        // 检查存储源是否存在
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
  public VectorStore testConnection(@Nullable Long id, Integer timeout,
      @Nullable VectorStoreConfigDefinition config) {
    return new BizTemplate<VectorStore>() {
      VectorStore vectorStoreDb;

      @Override
      protected void checkParams() {
        // 检查 id 和 config 不能全为空
        if (isNull(id) && isNull(config)) {
          throw ProtocolException.of("向量存储源ID和配置必须指定其中一个");
        }

        // 检查存储源是否存在
        if (nonNull(id)) {
          vectorStoreDb = vectorStoreQuery.findAndCheck(id);
        }
      }

      @Override
      protected VectorStore process() {
        try {
          VectorStoreConfigDefinition testConfig = nonNull(config) ? config : vectorStoreDb.getConfig();

          // TODO: 实际调用VectorStoreFactory进行连接测试
          // VectorStoreFactory factory = ...;
          // boolean connected = factory.testConnection(vectorStoreDb);

          // 设置状态
          // vectorStoreDb.setStatus(?);
          // 更新连接成功后数据源信息
          // vectorStoreRepo.save(vectorStoreDb);
        } catch (Exception e) {
          vectorStoreDb.setStatus(ConnectionStatus.DISCONNECTED);
          vectorStoreDb.setTestConnectionMessage(e.getMessage());
        }

        // 如果是根据存储源ID测试，保存测试状态信息
        if (isNull(config)) {
          vectorStoreRepo.save(vectorStoreDb);
        }
        return vectorStoreDb;
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
