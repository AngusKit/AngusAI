# ModelCmdImpl BizTemplate 重构总结

## 概述

根据ApplicationCmdImpl的实现模式，将ModelCmdImpl重构为使用BizTemplate模式，确保业务逻辑的一致性和规范性。

## 主要变更

### 1. 类结构变更

**之前**：
```java
@Component
public class ModelCmdImpl implements ModelCmd {
```

**之后**：
```java
@DoInFuture("添加权限校验")
@Component
@Biz
public class ModelCmdImpl extends CommCmd<Model, Long> implements ModelCmd {
```

### 2. 依赖注入变更

**新增**：
```java
@Resource
private ModelQuery modelQuery;
```

### 3. 方法重构

所有业务方法都重构为使用BizTemplate模式：

#### create方法
```java
@Override
@Transactional
public Model create(Model model) {
  return new BizTemplate<Model>() {
    @Override
    protected void checkParams() {
      // 检查名称是否已存在
      if (modelQuery.existsByName(model.getName())) {
        throw ResourceExisted.of("模型名称「{0}」已存在", new Object[]{model.getName()});
      }
    }

    @Override
    protected Model process() {
      insert0(model);
      return model;
    }
  }.execute();
}
```

#### update方法
```java
@Override
@Transactional
public Model update(Model model) {
  return new BizTemplate<Model>() {
    Model modelDb;

    @Override
    protected void checkParams() {
      // 获取模型并验证是否存在
      modelDb = modelQuery.findById(model.getId());
      if (modelDb == null) {
        throw ResourceNotFound.of("模型不存在", new Object[]{});
      }

      // 检查名称是否已存在（排除当前模型）
      if (ObjectUtils.isNotEmpty(model.getName())
          && modelQuery.existsByNameAndIdNot(model.getName(), modelDb.getId())) {
        throw ResourceExisted.of("模型名称「{0}」已存在", new Object[]{model.getName()});
      }
    }

    @Override
    protected Model process() {
      CoreUtils.copyPropertiesIgnoreNull(model, modelDb);
      return modelRepo.save(modelDb);
    }
  }.execute();
}
```

#### 其他方法
- `updateConfig` - 使用BizTemplate进行参数验证和业务处理
- `start` - 验证模型存在性，设置状态为DEPLOYING
- `stop` - 验证模型存在性，设置状态为STOPPED
- `restart` - 验证模型存在性，设置状态为DEPLOYING
- `test` - 验证模型存在性，执行测试逻辑
- `delete` - 使用BizTemplate进行删除操作
- `updateStatus` - 验证模型存在性，更新状态
- `recordCall` - 验证模型存在性，记录调用统计
- `updateMetrics` - 验证模型存在性，更新性能指标

### 4. 新增方法

```java
@Override
protected BaseRepository<Model, Long> getRepository() {
  return modelRepo;
}
```

## BizTemplate模式的优势

### 1. 统一的业务处理流程
- **checkParams()** - 参数验证和业务规则检查
- **process()** - 核心业务逻辑处理
- **execute()** - 统一执行入口

### 2. 异常处理
- 使用`ResourceNotFound`和`ResourceExisted`进行统一的异常处理
- 提供清晰的错误信息

### 3. 事务管理
- 通过`@Transactional`注解确保数据一致性
- BizTemplate内部自动处理事务

### 4. 代码复用
- 继承`CommCmd`基类，获得通用的CRUD操作
- 使用`insert0()`等基类方法

### 5. 业务规则验证
- 名称唯一性检查
- 资源存在性验证
- 业务状态检查

## 与ApplicationCmdImpl的一致性

### 1. 相同的注解
- `@DoInFuture("添加权限校验")`
- `@Component`
- `@Biz`

### 2. 相同的继承结构
- 继承`CommCmd<Entity, ID>`
- 实现对应的Cmd接口

### 3. 相同的异常处理
- 使用相同的异常类型
- 相同的错误信息格式

### 4. 相同的业务模式
- 参数验证 → 业务处理 → 结果返回
- 统一的错误处理机制

## 注意事项

### 1. TODO标记
部分复杂功能仍标记为TODO：
- `test`方法的测试逻辑实现
- `exportConfig`和`importConfig`的具体实现
- `validateConfig`的配置验证逻辑
- `checkDependencies`的依赖检查逻辑
- `cleanupResources`的资源清理逻辑

### 2. 批量操作方法
批量操作方法（`batchStart`、`batchStop`等）仍使用简单的循环调用，可以考虑后续优化为事务性批量操作。

### 3. 权限校验
所有方法都标记了`@DoInFuture("添加权限校验")`，需要在后续版本中添加权限验证逻辑。

## 总结

通过使用BizTemplate模式重构ModelCmdImpl，实现了：

1. **代码一致性** - 与ApplicationCmdImpl保持相同的架构模式
2. **业务规范性** - 统一的参数验证和异常处理
3. **可维护性** - 清晰的业务逻辑分离
4. **可扩展性** - 便于后续功能扩展
5. **事务安全** - 确保数据操作的一致性

这种重构确保了整个系统架构的一致性和规范性，为后续的功能开发和维护奠定了良好的基础。
