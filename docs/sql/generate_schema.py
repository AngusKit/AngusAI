#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
扫描 domain 文件夹下的所有实体类，根据实体类定义生成表 SQL
兼容 MySQL 和 PostgreSQL
"""

import os
import re
from pathlib import Path
from typing import Dict, List, Optional, Tuple

# 基类字段定义
BASE_CLASS_FIELDS = {
    'TenantAuditingEntity': [
        ('tenant_id', 'BIGINT', 'NOT NULL', '租户ID'),
        ('created_by', 'BIGINT', 'NOT NULL', '创建人ID'),
        ('created_date', 'TIMESTAMP', 'NOT NULL', '创建时间'),
        ('modified_by', 'BIGINT', 'NULL', '最后修改人ID'),
        ('modified_date', 'TIMESTAMP', 'NULL', '最后修改时间'),
    ],
    'TenantEntity': [
        ('tenant_id', 'BIGINT', 'NOT NULL', '租户ID'),
    ],
    'EntitySupport': [
        ('created_by', 'BIGINT', 'NOT NULL', '创建人ID'),
        ('created_date', 'TIMESTAMP', 'NOT NULL', '创建时间'),
    ],
}

# Java 类型到 SQL 类型的映射
JAVA_TYPE_MAP = {
    'Long': 'BIGINT',
    'Integer': 'INTEGER',
    'String': 'VARCHAR',
    'Boolean': 'BOOLEAN',
    'Double': 'DOUBLE PRECISION',
    'Float': 'REAL',
    'LocalDateTime': 'TIMESTAMP',
    'LocalDate': 'DATE',
    'BigDecimal': 'DECIMAL(19,2)',
}

# MySQL 特定类型映射
MYSQL_TYPE_MAP = {
    'BOOLEAN': 'TINYINT(1)',
    'TIMESTAMP': 'DATETIME',
}

# PostgreSQL 特定类型映射
POSTGRES_TYPE_MAP = {
    'BOOLEAN': 'BOOLEAN',
    'TIMESTAMP': 'TIMESTAMP',
}


def find_entity_files(base_dir: Path) -> List[Path]:
    """查找所有实体类文件"""
    entity_files = []
    for java_file in base_dir.rglob('*.java'):
        try:
            content = java_file.read_text(encoding='utf-8')
            if '@Entity' in content and '@Table' in content:
                entity_files.append(java_file)
        except Exception as e:
            print(f"Warning: 无法读取文件 {java_file}: {e}")
    return sorted(entity_files)


def extract_table_name(content: str) -> Optional[str]:
    """提取表名"""
    match = re.search(r'@Table\s*\(\s*name\s*=\s*["\']([^"\']+)["\']', content)
    if match:
        return match.group(1)
    # 如果没有找到，尝试类名转下划线
    class_match = re.search(r'class\s+(\w+)', content)
    if class_match:
        class_name = class_match.group(1)
        # 简单的驼峰转下划线
        return re.sub(r'(?<!^)(?=[A-Z])', '_', class_name).lower()
    return None


def extract_base_class(content: str) -> Optional[str]:
    """提取基类名"""
    patterns = [
        r'extends\s+(TenantAuditingEntity|TenantEntity|EntitySupport)',
        r'extends\s+\w+<[^>]+,\s*\w+>\s*extends\s+(TenantAuditingEntity|TenantEntity|EntitySupport)',
    ]
    for pattern in patterns:
        match = re.search(pattern, content)
        if match:
            return match.group(1) if len(match.groups()) == 1 else match.group(2)
    return None


def extract_columns(content: str) -> List[Tuple[str, str, str, str, Optional[str]]]:
    """
    提取列定义
    返回: [(column_name, sql_type, nullable, default, comment), ...]
    """
    columns = []

    # 提取 @Id 字段
    id_pattern = r'@Id\s+.*?private\s+(\w+)\s+(\w+)\s*;'
    id_match = re.search(id_pattern, content, re.DOTALL)
    if id_match:
        field_type = id_match.group(1)
        field_name = id_match.group(2)
        sql_type = JAVA_TYPE_MAP.get(field_type, 'BIGINT')
        columns.append((field_name, sql_type, 'NOT NULL', None, '主键'))

    # 提取 @Column 字段
    column_pattern = r'@Column\s*\([^)]*\)\s+.*?private\s+(\w+)\s+(\w+)\s*;'
    for match in re.finditer(column_pattern, content, re.DOTALL):
        annotation = match.group(0).split('private')[0]
        field_type = match.group(1)
        field_name = match.group(2)

        # 提取列名
        name_match = re.search(r'name\s*=\s*["\']([^"\']+)["\']', annotation)
        column_name = name_match.group(1) if name_match else field_name

        # 跳过 @Transient 字段
        if '@Transient' in annotation:
            continue

        # 检查 nullable
        nullable = 'NULL'
        if 'nullable = false' in annotation:
            nullable = 'NOT NULL'

        # 提取 length
        length_match = re.search(r'length\s*=\s*(\d+)', annotation)
        length = int(length_match.group(1)) if length_match else None

        # 提取 columnDefinition
        col_def_match = re.search(r'columnDefinition\s*=\s*["\']([^"\']+)["\']', annotation)
        col_def = col_def_match.group(1) if col_def_match else None

        # 确定 SQL 类型
        if col_def:
            sql_type = col_def.upper()
        elif field_type == 'String':
            if length:
                sql_type = f'VARCHAR({length})'
            elif 'TEXT' in annotation.upper() or 'MEDIUMTEXT' in annotation.upper():
                sql_type = 'TEXT'
            else:
                sql_type = 'VARCHAR(255)'
        else:
            sql_type = JAVA_TYPE_MAP.get(field_type, 'VARCHAR(255)')
            if length and sql_type == 'VARCHAR':
                sql_type = f'VARCHAR({length})'

        # 检查枚举类型
        if '@Enumerated' in annotation:
            enum_match = re.search(r'EnumType\.(\w+)', annotation)
            if enum_match and enum_match.group(1) == 'STRING':
                if not length:
                    length = 50
                sql_type = f'VARCHAR({length})'

        # 检查 JSON 类型
        if '@Type(JsonType.class)' in annotation or 'columnDefinition = "json"' in annotation:
            sql_type = 'JSON'

        # 提取默认值（只在字段定义中查找，不在函数参数中）
        default_value = None
        field_line = match.group(0)
        # 检查字段定义行中是否有默认值
        if re.search(r'=\s*true\s*;', field_line):
            if 'BOOLEAN' in sql_type.upper() or 'TINYINT' in sql_type.upper():
                default_value = 'TRUE' if db_type == 'postgresql' else '1'
        elif re.search(r'=\s*false\s*;', field_line):
            if 'BOOLEAN' in sql_type.upper() or 'TINYINT' in sql_type.upper():
                default_value = 'FALSE' if db_type == 'postgresql' else '0'
        elif re.search(r'=\s*0[Ll]?\s*;', field_line):
            if 'BIGINT' in sql_type or 'INTEGER' in sql_type or 'INT' in sql_type:
                default_value = '0'

        columns.append((column_name, sql_type, nullable, default_value, None))

    return columns


def generate_create_table_sql(
    table_name: str,
    columns: List[Tuple[str, str, str, Optional[str], Optional[str]]],
    base_class_fields: List[Tuple[str, str, str, str]],
    db_type: str = 'mysql'
) -> str:
    """生成 CREATE TABLE SQL"""
    sql_lines = [f'CREATE TABLE `{table_name}` (' if db_type == 'mysql' else f'CREATE TABLE "{table_name}" (']

    # 实体类自己的字段
    for col_name, sql_type, nullable, default_val, comment in columns:
        # 转换类型
        if db_type == 'mysql':
            if sql_type in MYSQL_TYPE_MAP:
                sql_type = MYSQL_TYPE_MAP[sql_type]
            if sql_type == 'JSON':
                sql_type = 'JSON'
        else:  # postgresql
            if sql_type in POSTGRES_TYPE_MAP:
                sql_type = POSTGRES_TYPE_MAP[sql_type]
            if sql_type == 'JSON':
                sql_type = 'JSONB'

        col_name_quoted = col_name if db_type == "mysql" else f'"{col_name}"'
        col_def = f'  {col_name_quoted} {sql_type} {nullable}'
        if default_val and not (sql_type.startswith('VARCHAR') and default_val == '0'):
            # VARCHAR 类型不应该有数字默认值
            col_def += f' DEFAULT {default_val}'
        if comment and db_type == 'mysql':
            # MySQL 支持 COMMENT，PostgreSQL 不支持
            col_def += f' COMMENT \'{comment}\''
        sql_lines.append(col_def + ',')

    # 基类字段（放在最后）
    for col_name, sql_type, nullable, comment in base_class_fields:
        if db_type == 'mysql':
            if sql_type in MYSQL_TYPE_MAP:
                sql_type = MYSQL_TYPE_MAP[sql_type]
        else:
            if sql_type in POSTGRES_TYPE_MAP:
                sql_type = POSTGRES_TYPE_MAP[sql_type]

        col_name_quoted = col_name if db_type == "mysql" else f'"{col_name}"'
        col_def = f'  {col_name_quoted} {sql_type} {nullable}'
        if comment and db_type == 'mysql':
            # MySQL 支持 COMMENT，PostgreSQL 不支持
            col_def += f' COMMENT \'{comment}\''
        sql_lines.append(col_def + ',')

    # 添加主键
    id_column = None
    for col_name, _, _, _, _ in columns:
        if col_name == 'id':
            id_column = col_name
            break

    if id_column:
        pk_name = f'`{id_column}`' if db_type == 'mysql' else f'"{id_column}"'
        # 移除最后一个逗号并添加主键
        if sql_lines:
            sql_lines[-1] = sql_lines[-1].rstrip(',')
        sql_lines.append(f'  PRIMARY KEY ({pk_name})')
    else:
        # 如果没有找到 id 字段，尝试查找第一个 BIGINT NOT NULL 字段作为主键
        for col_name, sql_type, nullable, _, _ in columns:
            if 'BIGINT' in sql_type and nullable == 'NOT NULL':
                pk_name = f'`{col_name}`' if db_type == 'mysql' else f'"{col_name}"'
                # 移除最后一个逗号并添加主键
                if sql_lines:
                    sql_lines[-1] = sql_lines[-1].rstrip(',')
                sql_lines.append(f'  PRIMARY KEY ({pk_name})')
                break
        # 如果都没找到，只是移除最后一个逗号
        if sql_lines and not any('PRIMARY KEY' in line for line in sql_lines):
            sql_lines[-1] = sql_lines[-1].rstrip(',')

    sql_lines.append(');')

    return '\n'.join(sql_lines)


def main():
    base_dir = Path(__file__).parent
    entity_files = find_entity_files(base_dir)

    print(f'找到 {len(entity_files)} 个实体类文件\n')

    mysql_sqls = []
    postgres_sqls = []

    for entity_file in entity_files:
        try:
            content = entity_file.read_text(encoding='utf-8')

            table_name = extract_table_name(content)
            if not table_name:
                print(f'Warning: 无法提取表名: {entity_file}', file=os.sys.stderr)
                continue

            base_class = extract_base_class(content)
            base_fields = BASE_CLASS_FIELDS.get(base_class, []) if base_class else []

            columns = extract_columns(content)
            if not columns:
                print(f'Warning: 无法提取列定义: {entity_file}', file=os.sys.stderr)
                continue

            mysql_sql = generate_create_table_sql(table_name, columns, base_fields, 'mysql')
            postgres_sql = generate_create_table_sql(table_name, columns, base_fields, 'postgresql')

            mysql_sqls.append((table_name, mysql_sql))
            postgres_sqls.append((table_name, postgres_sql))

        except Exception as e:
            print(f'Error processing {entity_file}: {e}', file=os.sys.stderr)

    # 生成 MySQL SQL 文件
    mysql_output = []
    mysql_output.append('-- MySQL CREATE TABLE SQL')
    mysql_output.append('-- Generated from domain entity classes')
    mysql_output.append('')
    for table_name, sql in sorted(mysql_sqls):
        mysql_output.append(f'-- Table: {table_name}')
        mysql_output.append(sql)
        mysql_output.append('')

    # 生成 PostgreSQL SQL 文件
    postgres_output = []
    postgres_output.append('-- PostgreSQL CREATE TABLE SQL')
    postgres_output.append('-- Generated from domain entity classes')
    postgres_output.append('')
    for table_name, sql in sorted(postgres_sqls):
        postgres_output.append(f'-- Table: {table_name}')
        postgres_output.append(sql)
        postgres_output.append('')

    # 输出到控制台
    print('=' * 80)
    print('MySQL CREATE TABLE SQL')
    print('=' * 80)
    print('\n'.join(mysql_output))

    print('\n\n' + '=' * 80)
    print('PostgreSQL CREATE TABLE SQL')
    print('=' * 80)
    print('\n'.join(postgres_output))

    # 保存到文件
    # 从 domain 目录向上找到项目根目录
    current = base_dir
    while current.name != 'AngusAI' and current.parent != current:
        current = current.parent
    output_dir = current / 'docs' / 'sql'
    output_dir.mkdir(parents=True, exist_ok=True)

    mysql_file = output_dir / 'mysql_schema.sql'
    postgres_file = output_dir / 'postgresql_schema.sql'

    mysql_file.write_text('\n'.join(mysql_output), encoding='utf-8')
    postgres_file.write_text('\n'.join(postgres_output), encoding='utf-8')

    print(f'\n\nSQL 文件已保存到:')
    print(f'  MySQL: {mysql_file}')
    print(f'  PostgreSQL: {postgres_file}')


if __name__ == '__main__':
    main()

