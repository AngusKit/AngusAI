package cloud.xcan.angus.core.ai.infra.util;

import static java.util.Objects.isNull;
import static org.apache.commons.lang3.ObjectUtils.isNotEmpty;

import cloud.xcan.angus.core.ai.domain.dataset.DatabaseType;
import cloud.xcan.angus.core.ai.domain.dataset.DatasourceConfig;
import io.swagger.v3.oas.annotations.media.Schema;
import java.sql.Connection;
import java.sql.DatabaseMetaData;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import lombok.Data;
import lombok.extern.slf4j.Slf4j;

/**
 * 数据源连接测试工具类
 * <p>
 * 用于测试各种类型数据库的连接配置是否正确
 *
 * @author Angus Team
 */
@Slf4j
public class DatasourceUtils {

  /**
   * 数据库驱动类映射
   */
  private static final Map<DatabaseType, String> DRIVER_CLASS_MAP = new HashMap<>();

  static {
    DRIVER_CLASS_MAP.put(DatabaseType.MySQL, "com.mysql.cj.jdbc.Driver");
    DRIVER_CLASS_MAP.put(DatabaseType.PostgreSQL, "org.postgresql.Driver");
    DRIVER_CLASS_MAP.put(DatabaseType.SQLServer, "com.microsoft.sqlserver.jdbc.SQLServerDriver");
    DRIVER_CLASS_MAP.put(DatabaseType.Oracle, "oracle.jdbc.OracleDriver");
    DRIVER_CLASS_MAP.put(DatabaseType.DB2, "com.ibm.db2.jcc.DB2Driver");
    DRIVER_CLASS_MAP.put(DatabaseType.DM, "dm.jdbc.driver.DmDriver");
  }

  /**
   * 测试数据源连接
   *
   * @param config 数据源配置
   * @return 连接测试结果
   */
  public static ConnectionTestResult testConnection(DatasourceConfig config) {
    ConnectionTestResult result = new ConnectionTestResult();

    // 验证配置
    if (isNull(config)) {
      result.setSuccess(false);
      result.setMessage("数据源配置不能为空");
      result.setDetails("数据源配置对象为 null");
      return result;
    }

    if (!config.isValid()) {
      result.setSuccess(false);
      result.setMessage("数据源配置无效");
      result.setDetails("请检查数据库类型、主机、端口、数据库名称或 JDBC URL 是否正确配置");
      return result;
    }

    // 验证数据库类型
    if (isNull(config.getDatabaseType())) {
      result.setSuccess(false);
      result.setMessage("数据库类型不能为空");
      result.setDetails("请指定数据库类型");
      return result;
    }

    // 获取驱动类
    String driverClass = DRIVER_CLASS_MAP.get(config.getDatabaseType());
    if (driverClass == null) {
      result.setSuccess(false);
      result.setMessage("不支持的数据库类型: " + config.getDatabaseType());
      result.setDetails("支持的数据库类型: MySQL, PostgreSQL, SQL Server, Oracle, DB2, DM");
      return result;
    }

    // 获取 JDBC URL
    String jdbcUrl = buildJdbcUrl(config);
    if (isNull(jdbcUrl)) {
      result.setSuccess(false);
      result.setMessage("无法构建 JDBC URL");
      result.setDetails("请检查数据库配置信息");
      return result;
    }

    // 测试连接
    Connection connection = null;
    Statement statement = null;
    try {
      // 加载驱动
      Class.forName(driverClass);

      // 建立连接
      log.info("正在测试数据库连接: {}", config.getDatabaseType());
      log.debug("JDBC URL: {}", jdbcUrl.replaceAll("password=[^;&]*", "password=****"));
      log.debug("用户名: {}", config.getUsername());

      connection = DriverManager.getConnection(jdbcUrl, config.getUsername(), config.getPassword());

      // 测试查询
      statement = connection.createStatement();
      statement.execute("SELECT 1");

      result.setSuccess(true);
      result.setMessage("连接成功");
      result.setDetails(
          String.format("成功连接到 %s 数据库 (服务器: %s:%s)", config.getDatabaseType(),
              config.getHost(), config.getPort()));

    } catch (ClassNotFoundException e) {
      log.error("数据库驱动类不存在: {}", driverClass, e);
      result.setSuccess(false);
      result.setMessage("数据库驱动加载失败");
      result.setDetails(String.format("无法加载驱动类: %s", driverClass));

    } catch (SQLException e) {
      log.error("数据库连接测试失败", e);
      result.setSuccess(false);
      result.setMessage("连接失败: " + e.getMessage());

      String details = buildErrorDetails(e, config);
      result.setDetails(details);

    } catch (Exception e) {
      log.error("数据库连接测试异常", e);
      result.setSuccess(false);
      result.setMessage("测试异常: " + e.getMessage());
      result.setDetails(e.getClass().getSimpleName() + ": " + e.getMessage());

    } finally {
      // 关闭资源
      closeResources(statement, connection);
    }
    return result;
  }

  /**
   * 构建 JDBC URL
   *
   * @param config 数据源配置
   * @return JDBC URL
   */
  private static String buildJdbcUrl(DatasourceConfig config) {
    // 如果已经有完整的 JDBC URL，直接使用
    if (isNotEmpty(config.getJdbcUrl())) {
      return config.getJdbcUrl();
    }

    // 根据主机、端口等信息构建 JDBC URL
    if (isNull(config.getHost()) || isNull(config.getPort()) || isNull(config.getDatabase())
        || config.getDatabase().isEmpty()) {
      return null;
    }

    return switch (config.getDatabaseType()) {
      case MySQL -> String.format("jdbc:mysql://%s:%d/%s?useSSL=false&serverTimezone=UTC",
          config.getHost(), config.getPort(), config.getDatabase());
      case PostgreSQL -> String.format("jdbc:postgresql://%s:%d/%s", config.getHost(),
          config.getPort(), config.getDatabase());
      case SQLServer -> String.format("jdbc:sqlserver://%s:%d;databaseName=%s", config.getHost(),
          config.getPort(), config.getDatabase());
      case Oracle -> String.format("jdbc:oracle:thin:@%s:%d:%s", config.getHost(),
          config.getPort(), config.getDatabase());
      case DB2 -> String.format("jdbc:db2://%s:%d/%s", config.getHost(), config.getPort(),
          config.getDatabase());
      case DM -> String.format("jdbc:dm://%s:%d/%s", config.getHost(), config.getPort(),
          config.getDatabase());
    };
  }

  /**
   * 构建错误详情
   *
   * @param e      SQL 异常
   * @param config 数据源配置
   * @return 错误详情
   */
  private static String buildErrorDetails(SQLException e, DatasourceConfig config) {
    StringBuilder details = new StringBuilder();
    details.append("错误代码: ").append(e.getErrorCode()).append("\n");
    details.append("SQL 状态: ").append(e.getSQLState()).append("\n");
    details.append("错误消息: ").append(e.getMessage()).append("\n");

    // 添加常见错误提示
    if (e.getMessage().contains("Unknown database")) {
      details.append("\n提示: 数据库 '").append(config.getDatabase()).append("' 不存在");
    } else if (e.getMessage().contains("Access denied")) {
      details.append("\n提示: 用户名或密码错误");
    } else if (e.getMessage().contains("could not connect")) {
      details.append("\n提示: 无法连接到服务器，请检查主机和端口是否正确");
    } else if (e.getMessage().contains("Connection refused")) {
      details.append("\n提示: 连接被拒绝，请确保数据库服务正在运行");
    }
    return details.toString();
  }

  /**
   * 查询表数据（支持分页）
   *
   * @param config    数据源配置
   * @param tableName 表名
   * @param pageNo    页码（从1开始）
   * @param pageSize  每页大小
   * @return 查询结果
   */
  public static TableDataResult queryTableData(DatasourceConfig config, String tableName,
      int pageNo, int pageSize) {
    TableDataResult result = new TableDataResult();

    // 验证配置
    if (isNull(config) || !config.isValid()) {
      result.setSuccess(false);
      result.setMessage("数据源配置无效");
      return result;
    }

    if (tableName == null || tableName.trim().isEmpty()) {
      result.setSuccess(false);
      result.setMessage("表名不能为空");
      return result;
    }

    if (pageNo < 1) {
      pageNo = 1;
    }
    if (pageSize < 1) {
      pageSize = 10;
    }

    Connection connection = null;
    Statement statement = null;
    ResultSet rs = null;

    try {
      // 获取驱动类和连接URL
      String driverClass = DRIVER_CLASS_MAP.get(config.getDatabaseType());
      String jdbcUrl = buildJdbcUrl(config);

      Class.forName(driverClass);
      connection = DriverManager.getConnection(jdbcUrl, config.getUsername(), config.getPassword());

      // 构建分页查询SQL
      String sql = buildPagedQuerySql(config.getDatabaseType(), config.getDatabase(), tableName,
          pageNo, pageSize);

      log.debug("执行查询: {}", sql);

      statement = connection.createStatement();
      rs = statement.executeQuery(sql);

      // 获取列信息
      ResultSetMetaData metaData = rs.getMetaData();
      int columnCount = metaData.getColumnCount();

      List<String> columns = new ArrayList<>();
      for (int i = 1; i <= columnCount; i++) {
        columns.add(metaData.getColumnName(i));
      }
      result.setColumns(columns);

      // 读取数据
      List<Map<String, Object>> data = new ArrayList<>();
      while (rs.next()) {
        Map<String, Object> row = new LinkedHashMap<>();
        for (int i = 1; i <= columnCount; i++) {
          Object value = rs.getObject(i);
          row.put(metaData.getColumnName(i), value);
        }
        data.add(row);
      }

      result.setData(data);
      result.setSuccess(true);
      result.setMessage("查询成功");
      result.setTotal(data.size());

    } catch (SQLException e) {
      log.error("查询表数据失败", e);
      result.setSuccess(false);
      result.setMessage("查询失败: " + e.getMessage());
      result.setDetails(e.getSQLState() + " - " + e.getErrorCode());

    } catch (ClassNotFoundException e) {
      log.error("数据库驱动类不存在", e);
      result.setSuccess(false);
      result.setMessage("驱动加载失败: " + e.getMessage());

    } catch (Exception e) {
      log.error("查询异常", e);
      result.setSuccess(false);
      result.setMessage("查询异常: " + e.getMessage());

    } finally {
      closeResources(rs, statement, connection);
    }

    return result;
  }

  /**
   * 获取数据库元信息
   *
   * @param config 数据源配置
   * @return 元信息结果
   */
  public static DatabaseMetadataResult getDatabaseMetadata(DatasourceConfig config) {
    DatabaseMetadataResult result = new DatabaseMetadataResult();

    // 验证配置
    if (isNull(config) || !config.isValid()) {
      result.setSuccess(false);
      result.setMessage("数据源配置无效");
      return result;
    }

    Connection connection = null;

    try {
      // 获取驱动类和连接URL
      String driverClass = DRIVER_CLASS_MAP.get(config.getDatabaseType());
      String jdbcUrl = buildJdbcUrl(config);

      Class.forName(driverClass);
      connection = DriverManager.getConnection(jdbcUrl, config.getUsername(), config.getPassword());

      DatabaseMetaData metaData = connection.getMetaData();

      // 基本信息
      result.setProductName(metaData.getDatabaseProductName());
      result.setProductVersion(metaData.getDatabaseProductVersion());
      result.setDriverName(metaData.getDriverName());
      result.setDriverVersion(metaData.getDriverVersion());
      result.setJdbcMajorVersion(metaData.getJDBCMajorVersion());
      result.setJdbcMinorVersion(metaData.getJDBCMinorVersion());
      result.setMaxConnections(metaData.getMaxConnections());
      result.setDefaultTransactionIsolation(metaData.getDefaultTransactionIsolation());
      result.setSupportsTransactions(metaData.supportsTransactions());

      // 统计表信息
      String catalog = metaData.getConnection().getCatalog();
      String schema = config.getDatabase();
      if (isNull(schema) || schema.isEmpty()) {
        schema = config.getUsername();
      }

      try (ResultSet tables = metaData.getTables(catalog, schema, "%", new String[]{"TABLE"})) {
        List<String> tableNames = new ArrayList<>();
        Map<String, Long> tableRowCounts = new HashMap<>();
        Map<String, Long> tableSizes = new HashMap<>();
        int tableCount = 0;

        while (tables.next()) {
          String tableName = tables.getString("TABLE_NAME");
          tableNames.add(tableName);
          tableCount++;

          // 尝试获取行数和大小
          try (Statement stmt = connection.createStatement();
              ResultSet rs = stmt.executeQuery(
                  buildRowCountQuery(config.getDatabaseType(), tableName))) {
            if (rs.next()) {
              tableRowCounts.put(tableName, rs.getLong(1));
            }
          } catch (SQLException e) {
            log.debug("无法获取表 {} 的行数", tableName, e);
          }

          // 尝试获取表大小
          try (Statement stmt = connection.createStatement();
              ResultSet rs = stmt.executeQuery(
                  buildTableSizeQuery(config.getDatabaseType(), schema, tableName))) {
            if (rs.next()) {
              tableSizes.put(tableName, rs.getLong(1));
            }
          } catch (SQLException e) {
            log.debug("无法获取表 {} 的大小", tableName, e);
          }
        }

        result.setTableCount(tableCount);
        result.setTableNames(tableNames);
        result.setTableRowCounts(tableRowCounts);
        result.setTableSizes(tableSizes);
      }

      result.setSuccess(true);
      result.setMessage("获取元信息成功");

    } catch (SQLException e) {
      log.error("获取数据库元信息失败", e);
      result.setSuccess(false);
      result.setMessage("获取元信息失败: " + e.getMessage());
      result.setDetails(e.getSQLState() + " - " + e.getErrorCode());

    } catch (ClassNotFoundException e) {
      log.error("数据库驱动类不存在", e);
      result.setSuccess(false);
      result.setMessage("驱动加载失败: " + e.getMessage());

    } catch (Exception e) {
      log.error("获取元信息异常", e);
      result.setSuccess(false);
      result.setMessage("获取元信息异常: " + e.getMessage());

    } finally {
      if (connection != null) {
        try {
          connection.close();
        } catch (SQLException e) {
          log.warn("关闭连接失败", e);
        }
      }
    }

    return result;
  }

  /**
   * 构建分页查询SQL
   *
   * @param databaseType 数据库类型
   * @param database     数据库名
   * @param tableName    表名
   * @param pageNo       页码（从1开始）
   * @param pageSize     每页大小
   * @return SQL语句
   */
  private static String buildPagedQuerySql(DatabaseType databaseType, String database,
      String tableName, int pageNo, int pageSize) {
    int offset = (pageNo - 1) * pageSize;
    String qualifiedTableName =
        database != null && !database.isEmpty() ? database + "." + tableName : tableName;

    return switch (databaseType) {
      case MySQL -> String.format("SELECT * FROM %s LIMIT %d OFFSET %d",
          qualifiedTableName, pageSize, offset);
      case PostgreSQL -> String.format("SELECT * FROM %s LIMIT %d OFFSET %d", qualifiedTableName,
          pageSize, offset);
      case SQLServer -> String.format(
          "SELECT * FROM (SELECT ROW_NUMBER() OVER (ORDER BY (SELECT NULL)) AS RowNum, * FROM %s) AS Temp WHERE RowNum > %d AND RowNum <= %d",
          qualifiedTableName, offset, offset + pageSize);
      case Oracle -> String.format(
          "SELECT * FROM (SELECT a.*, ROWNUM rnum FROM (SELECT * FROM %s) a WHERE ROWNUM <= %d) WHERE rnum > %d",
          qualifiedTableName, offset + pageSize, offset);
      case DB2 -> String.format("SELECT * FROM %s FETCH FIRST %d ROWS ONLY OFFSET %d ROWS",
          qualifiedTableName, pageSize, offset);
      case DM -> String.format("SELECT * FROM %s LIMIT %d OFFSET %d", qualifiedTableName,
          pageSize, offset);
    };
  }

  /**
   * 构建行数查询SQL
   *
   * @param databaseType 数据库类型
   * @param tableName    表名
   * @return SQL语句
   */
  private static String buildRowCountQuery(DatabaseType databaseType, String tableName) {
    return switch (databaseType) {
      case MySQL -> "SELECT COUNT(*) FROM " + tableName;
      case PostgreSQL -> "SELECT COUNT(*) FROM " + tableName;
      case SQLServer -> "SELECT COUNT_BIG(*) FROM " + tableName;
      case Oracle -> "SELECT COUNT(*) FROM " + tableName;
      case DB2 -> "SELECT COUNT(*) FROM " + tableName;
      case DM -> "SELECT COUNT(*) FROM " + tableName;
    };
  }

  /**
   * 构建表大小查询SQL（返回字节数）
   *
   * @param databaseType 数据库类型
   * @param schema       数据库名/模式名
   * @param tableName    表名
   * @return SQL语句
   */
  private static String buildTableSizeQuery(DatabaseType databaseType, String schema,
      String tableName) {
    String dbName = schema != null ? schema : "";
    String tableFullName = dbName.isEmpty() ? tableName : dbName + "." + tableName;

    return switch (databaseType) {
      case MySQL -> String.format(
          "SELECT (data_length + index_length) AS size FROM information_schema.tables WHERE table_schema = '%s' AND table_name = '%s'",
          dbName, tableName);
      case PostgreSQL -> String.format(
          "SELECT pg_total_relation_size('%s'::regclass)", tableFullName);
      case SQLServer -> String.format(
          "SELECT SUM(reserved_page_count) * 8192 FROM sys.dm_db_partition_stats WHERE object_id = OBJECT_ID('%s')",
          tableFullName);
      case Oracle -> String.format(
          "SELECT bytes FROM user_segments WHERE segment_name = UPPER('%s') AND segment_type = 'TABLE'",
          tableName);
      case DB2 -> String.format(
          "SELECT data_object_pages * 4096 FROM syscat.tables WHERE tabschema = UPPER('%s') AND tabname = UPPER('%s')",
          dbName, tableName);
      case DM -> String.format(
          "SELECT bytes FROM user_segments WHERE segment_name = UPPER('%s') AND segment_type = 'TABLE'",
          tableName);
    };
  }

  /**
   * 关闭数据库资源
   *
   * @param rs         ResultSet 对象
   * @param statement  Statement 对象
   * @param connection Connection 对象
   */
  private static void closeResources(ResultSet rs, Statement statement, Connection connection) {
    try {
      if (rs != null && !rs.isClosed()) {
        rs.close();
      }
    } catch (SQLException e) {
      log.warn("关闭 ResultSet 失败", e);
    }

    try {
      if (statement != null && !statement.isClosed()) {
        statement.close();
      }
    } catch (SQLException e) {
      log.warn("关闭 Statement 失败", e);
    }

    try {
      if (connection != null && !connection.isClosed()) {
        connection.close();
      }
    } catch (SQLException e) {
      log.warn("关闭 Connection 失败", e);
    }
  }

  /**
   * 关闭数据库资源（原有方法保持兼容）
   */
  private static void closeResources(Statement statement, Connection connection) {
    closeResources(null, statement, connection);
  }

  @Data
  @Schema(description = "连接测试响应")
  public static class ConnectionTestResult {

    @Schema(description = "状态")
    private boolean success;

    @Schema(description = "消息")
    private String message;

    @Schema(description = "详细信息")
    private String details;

  }

  @Data
  @Schema(description = "表数据查询结果")
  public static class TableDataResult {

    @Schema(description = "是否成功")
    private boolean success;

    @Schema(description = "消息")
    private String message;

    @Schema(description = "详细信息")
    private String details;

    @Schema(description = "列名列表")
    private List<String> columns;

    @Schema(description = "数据行列表")
    private List<Map<String, Object>> data;

    @Schema(description = "总记录数")
    private long total;

  }

  @Data
  @Schema(description = "数据库元信息结果")
  public static class DatabaseMetadataResult {

    @Schema(description = "是否成功")
    private boolean success;

    @Schema(description = "消息")
    private String message;

    @Schema(description = "详细信息")
    private String details;

    @Schema(description = "数据库产品名称")
    private String productName;

    @Schema(description = "数据库产品版本")
    private String productVersion;

    @Schema(description = "驱动名称")
    private String driverName;

    @Schema(description = "驱动版本")
    private String driverVersion;

    @Schema(description = "JDBC主版本号")
    private int jdbcMajorVersion;

    @Schema(description = "JDBC次版本号")
    private int jdbcMinorVersion;

    @Schema(description = "最大连接数")
    private int maxConnections;

    @Schema(description = "默认事务隔离级别")
    private int defaultTransactionIsolation;

    @Schema(description = "是否支持事务")
    private boolean supportsTransactions;

    @Schema(description = "表数量")
    private int tableCount;

    @Schema(description = "表名列表")
    private List<String> tableNames;

    @Schema(description = "表行数映射")
    private Map<String, Long> tableRowCounts;

    @Schema(description = "表大小映射（字节数）")
    private Map<String, Long> tableSizes;

  }
}

