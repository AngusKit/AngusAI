package com.agentx.tool.database;

import dev.langchain4j.agent.tool.P;
import dev.langchain4j.agent.tool.Tool;
import java.sql.Connection;
import java.sql.DatabaseMetaData;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import javax.sql.DataSource;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

/**
 * 数据库查询工具 — 支持只读 SQL 查询，防止数据修改操作
 */
@Slf4j
@Component
public class DatabaseQueryTool {

  private final DataSource dataSource;

  public DatabaseQueryTool(DataSource dataSource) {
    this.dataSource = dataSource;
  }

  @Tool("Execute a read-only SQL query against the database and return results as formatted text. Only SELECT queries are allowed.")
  public String executeQuery(@P("The SQL SELECT query to execute") String sql) {
    log.info("Executing database query: {}", sql);

    if (!isReadOnlyQuery(sql)) {
      return "Error: Only SELECT queries are allowed. DML/DDL statements are blocked for safety.";
    }

    try (Connection conn = dataSource.getConnection();
        Statement stmt = conn.createStatement()) {
      stmt.setQueryTimeout(30);
      stmt.setMaxRows(100);

      try (ResultSet rs = stmt.executeQuery(sql)) {
        return formatResultSet(rs);
      }
    } catch (SQLException e) {
      log.error("Database query failed: {}", e.getMessage());
      return "Query error: " + e.getMessage();
    }
  }

  @Tool("List all tables in the database")
  public String listTables() {
    log.info("Listing database tables");
    try (Connection conn = dataSource.getConnection()) {
      DatabaseMetaData meta = conn.getMetaData();
      try (ResultSet rs = meta.getTables(null, null, "%", new String[]{"TABLE"})) {
        List<String> tables = new ArrayList<>();
        while (rs.next()) {
          tables.add(rs.getString("TABLE_NAME"));
        }
        return tables.isEmpty() ? "No tables found." : String.join(", ", tables);
      }
    } catch (SQLException e) {
      return "Error listing tables: " + e.getMessage();
    }
  }

  @Tool("Describe the columns of a specific database table")
  public String describeTable(@P("The name of the table to describe") String tableName) {
    log.info("Describing table: {}", tableName);
    // Validate table name to prevent injection
    if (!tableName.matches("[a-zA-Z_][a-zA-Z0-9_]*")) {
      return "Error: Invalid table name.";
    }
    try (Connection conn = dataSource.getConnection()) {
      DatabaseMetaData meta = conn.getMetaData();
      try (ResultSet rs = meta.getColumns(null, null, tableName, "%")) {
        StringBuilder sb = new StringBuilder();
        sb.append("Table: ").append(tableName).append("\n");
        while (rs.next()) {
          sb.append("  ").append(rs.getString("COLUMN_NAME"))
              .append(" (").append(rs.getString("TYPE_NAME"))
              .append(", nullable=").append(rs.getString("IS_NULLABLE"))
              .append(")\n");
        }
        return sb.isEmpty() ? "Table not found: " + tableName : sb.toString();
      }
    } catch (SQLException e) {
      return "Error describing table: " + e.getMessage();
    }
  }

  private boolean isReadOnlyQuery(String sql) {
    String trimmed = sql.trim().toUpperCase();
    return trimmed.startsWith("SELECT") || trimmed.startsWith("SHOW")
        || trimmed.startsWith("DESCRIBE") || trimmed.startsWith("EXPLAIN");
  }

  private String formatResultSet(ResultSet rs) throws SQLException {
    ResultSetMetaData meta = rs.getMetaData();
    int columnCount = meta.getColumnCount();

    List<String> headers = new ArrayList<>();
    for (int i = 1; i <= columnCount; i++) {
      headers.add(meta.getColumnLabel(i));
    }

    List<Map<String, String>> rows = new ArrayList<>();
    while (rs.next()) {
      Map<String, String> row = new LinkedHashMap<>();
      for (int i = 1; i <= columnCount; i++) {
        row.put(headers.get(i - 1), String.valueOf(rs.getObject(i)));
      }
      rows.add(row);
    }

    if (rows.isEmpty()) {
      return "Query returned 0 rows.";
    }

    StringBuilder sb = new StringBuilder();
    sb.append(String.join(" | ", headers)).append("\n");
    sb.append(
            "-".repeat(headers.stream().mapToInt(String::length).sum() + (headers.size() - 1) * 3))
        .append("\n");
    for (Map<String, String> row : rows) {
      sb.append(String.join(" | ", row.values())).append("\n");
    }
    sb.append("(").append(rows.size()).append(" rows)");

    return sb.toString();
  }
}
