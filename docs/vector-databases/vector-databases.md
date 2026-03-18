

我先查一下各个向量数据库最新的 Docker 部署配置和最佳实践。下面是一个完整的项目结构，包含所有 7 个开源向量数据库的 docker-compose 配置和初始化脚本，以及一个一键启动/停止的管理脚本。

---

## 📁 项目目录结构

```
vector-databases/
├── start.sh                        # 一键启动脚本
├── stop.sh                         # 一键停止脚本
├── .env                            # 全局环境变量
├── pgvector/
│   ├── docker-compose.yml
│   └── init/
│       └── 01-init.sql
├── milvus/
│   └── docker-compose.yml
├── qdrant/
│   └── docker-compose.yml
├── chroma/
│   └── docker-compose.yml
├── elasticsearch/
│   └── docker-compose.yml
├── weaviate/
│   └── docker-compose.yml
└── mariadb/
    ├── docker-compose.yml
    └── init/
        └── 01-init.sql
```

---

## 1. 全局环境变量

```env name=vector-databases/.env
# ==============================
# 全局配置（可按需修改）
# ==============================

# PGVector
POSTGRES_USER=vector
POSTGRES_PASSWORD=vector123
POSTGRES_DB=vectordb

# Milvus
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin

# Elasticsearch
ELASTIC_PASSWORD=elastic123
ES_JAVA_OPTS=-Xms1g -Xmx1g

# MariaDB
MARIADB_ROOT_PASSWORD=root123
MARIADB_DATABASE=vectordb
MARIADB_USER=vector
MARIADB_PASSWORD=vector123
```

---

## 2. PGVector (PostgreSQL + pgvector)

```yaml name=vector-databases/pgvector/docker-compose.yml
version: "3.8"

services:
  pgvector:
    image: pgvector/pgvector:pg17
    container_name: pgvector
    restart: unless-stopped
    environment:
      POSTGRES_USER: ${POSTGRES_USER:-vector}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD:-vector123}
      POSTGRES_DB: ${POSTGRES_DB:-vectordb}
    ports:
      - "5432:5432"
    volumes:
      - pgvector_data:/var/lib/postgresql/data
      - ./init:/docker-entrypoint-initdb.d
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${POSTGRES_USER:-vector}"]
      interval: 10s
      timeout: 5s
      retries: 5

volumes:
  pgvector_data:
    driver: local
```

```sql name=vector-databases/pgvector/init/01-init.sql
-- 启用 pgvector 扩展
CREATE EXTENSION IF NOT EXISTS vector;

-- 创建示例向量表
CREATE TABLE IF NOT EXISTS embeddings (
    id BIGSERIAL PRIMARY KEY,
    content TEXT,
    embedding vector(1536),
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建 HNSW 索引（推荐，适合高召回率场景）
CREATE INDEX IF NOT EXISTS idx_embeddings_hnsw
    ON embeddings
    USING hnsw (embedding vector_cosine_ops)
    WITH (m = 16, ef_construction = 64);

-- 创建 IVFFlat 索引（适合大数据量场景）
-- CREATE INDEX IF NOT EXISTS idx_embeddings_ivfflat
--     ON embeddings
--     USING ivfflat (embedding vector_cosine_ops)
--     WITH (lists = 100);

SELECT 'PGVector initialized successfully!' AS status;
```

---

## 3. Milvus

```yaml name=vector-databases/milvus/docker-compose.yml
version: "3.8"

services:
  etcd:
    image: quay.io/coreos/etcd:v3.5.18
    container_name: milvus-etcd
    restart: unless-stopped
    environment:
      - ETCD_AUTO_COMPACTION_MODE=revision
      - ETCD_AUTO_COMPACTION_RETENTION=1000
      - ETCD_QUOTA_BACKEND_BYTES=4294967296
      - ETCD_SNAPSHOT_COUNT=50000
    volumes:
      - etcd_data:/etcd
    command: >
      etcd
      -advertise-client-urls=http://127.0.0.1:2379
      -listen-client-urls=http://0.0.0.0:2379
      --data-dir=/etcd
    healthcheck:
      test: ["CMD", "etcdctl", "endpoint", "health"]
      interval: 30s
      timeout: 20s
      retries: 3

  minio:
    image: minio/minio:latest
    container_name: milvus-minio
    restart: unless-stopped
    environment:
      MINIO_ACCESS_KEY: ${MINIO_ACCESS_KEY:-minioadmin}
      MINIO_SECRET_KEY: ${MINIO_SECRET_KEY:-minioadmin}
    ports:
      - "9001:9001"
      - "9000:9000"
    volumes:
      - minio_data:/minio_data
    command: minio server /minio_data --console-address ":9001"
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:9000/minio/health/live"]
      interval: 30s
      timeout: 20s
      retries: 3

  milvus:
    image: milvusdb/milvus:latest
    container_name: milvus-standalone
    restart: unless-stopped
    command: ["milvus", "run", "standalone"]
    security_opt:
      - seccomp:unconfined
    environment:
      ETCD_ENDPOINTS: etcd:2379
      MINIO_ADDRESS: minio:9000
      MINIO_ACCESS_KEY_ID: ${MINIO_ACCESS_KEY:-minioadmin}
      MINIO_SECRET_ACCESS_KEY: ${MINIO_SECRET_KEY:-minioadmin}
    ports:
      - "19530:19530"
      - "9091:9091"
    volumes:
      - milvus_data:/var/lib/milvus
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:9091/healthz"]
      interval: 30s
      start_period: 90s
      timeout: 20s
      retries: 3
    depends_on:
      etcd:
        condition: service_healthy
      minio:
        condition: service_healthy

volumes:
  etcd_data:
    driver: local
  minio_data:
    driver: local
  milvus_data:
    driver: local

networks:
  default:
    name: milvus
```

---

## 4. Qdrant

```yaml name=vector-databases/qdrant/docker-compose.yml
version: "3.8"

services:
  qdrant:
    image: qdrant/qdrant:latest
    container_name: qdrant
    restart: unless-stopped
    ports:
      - "6333:6333"   # REST API
      - "6334:6334"   # gRPC API
    volumes:
      - qdrant_data:/qdrant/storage
      - qdrant_snapshots:/qdrant/snapshots
    environment:
      QDRANT__SERVICE__GRPC_PORT: "6334"
      QDRANT__CLUSTER__ENABLED: "false"
      QDRANT__LOG_LEVEL: "INFO"
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:6333/healthz"]
      interval: 10s
      timeout: 5s
      retries: 5

volumes:
  qdrant_data:
    driver: local
  qdrant_snapshots:
    driver: local
```

---

## 5. Chroma

```yaml name=vector-databases/chroma/docker-compose.yml
version: "3.8"

services:
  chroma:
    image: chromadb/chroma:latest
    container_name: chroma
    restart: unless-stopped
    ports:
      - "8000:8000"
    environment:
      IS_PERSISTENT: "TRUE"
      PERSIST_DIRECTORY: "/chroma/chroma"
      ANONYMIZED_TELEMETRY: "FALSE"
      # 取消注释以启用 Token 认证
      # CHROMA_SERVER_AUTHN_PROVIDER: "chromadb.auth.token_authn.TokenAuthenticationServerProvider"
      # CHROMA_SERVER_AUTHN_CREDENTIALS: "your-secret-token"
    volumes:
      - chroma_data:/chroma/chroma
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8000/api/v1/heartbeat"]
      interval: 15s
      timeout: 5s
      retries: 5
    deploy:
      resources:
        limits:
          memory: 2G

volumes:
  chroma_data:
    driver: local
```

---

## 6. Elasticsearch

```yaml name=vector-databases/elasticsearch/docker-compose.yml
version: "3.8"

services:
  elasticsearch:
    image: docker.elastic.co/elasticsearch/elasticsearch:8.17.0
    container_name: elasticsearch
    restart: unless-stopped
    environment:
      - node.name=es-vector
      - cluster.name=vector-cluster
      - discovery.type=single-node
      - bootstrap.memory_lock=true
      - "ES_JAVA_OPTS=${ES_JAVA_OPTS:--Xms1g -Xmx1g}"
      # 开发环境关闭安���认证，生产环境请开启
      - xpack.security.enabled=false
      - xpack.security.http.ssl.enabled=false
      # 取消注释以启用安全认证
      # - xpack.security.enabled=true
      # - ELASTIC_PASSWORD=${ELASTIC_PASSWORD:-elastic123}
    ulimits:
      memlock:
        soft: -1
        hard: -1
      nofile:
        soft: 65536
        hard: 65536
    ports:
      - "9200:9200"
      - "9300:9300"
    volumes:
      - es_data:/usr/share/elasticsearch/data
    healthcheck:
      test: ["CMD-SHELL", "curl -f http://localhost:9200/_cluster/health || exit 1"]
      interval: 15s
      timeout: 10s
      retries: 5

volumes:
  es_data:
    driver: local
```

---

## 7. Weaviate

```yaml name=vector-databases/weaviate/docker-compose.yml
version: "3.8"

services:
  weaviate:
    image: cr.weaviate.io/semitechnologies/weaviate:latest
    container_name: weaviate
    restart: unless-stopped
    ports:
      - "8080:8080"     # REST API
      - "50051:50051"   # gRPC API
    volumes:
      - weaviate_data:/var/lib/weaviate
    environment:
      QUERY_DEFAULTS_LIMIT: 25
      AUTHENTICATION_ANONYMOUS_ACCESS_ENABLED: "true"
      PERSISTENCE_DATA_PATH: "/var/lib/weaviate"
      CLUSTER_HOSTNAME: "node1"
      DEFAULT_VECTORIZER_MODULE: "none"
      # 按需启用向量化模块
      # ENABLE_MODULES: "text2vec-openai,generative-openai"
      LOG_LEVEL: "info"
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8080/v1/.well-known/ready"]
      interval: 10s
      timeout: 5s
      retries: 5

volumes:
  weaviate_data:
    driver: local
```

---

## 8. MariaDB (向量扩展)

```yaml name=vector-databases/mariadb/docker-compose.yml
version: "3.8"

services:
  mariadb:
    image: mariadb:11.7
    container_name: mariadb-vector
    restart: unless-stopped
    environment:
      MARIADB_ROOT_PASSWORD: ${MARIADB_ROOT_PASSWORD:-root123}
      MARIADB_DATABASE: ${MARIADB_DATABASE:-vectordb}
      MARIADB_USER: ${MARIADB_USER:-vector}
      MARIADB_PASSWORD: ${MARIADB_PASSWORD:-vector123}
    ports:
      - "3306:3306"
    volumes:
      - mariadb_data:/var/lib/mysql
      - ./init:/docker-entrypoint-initdb.d
    healthcheck:
      test: ["CMD", "healthcheck.sh", "--connect", "--innodb_initialized"]
      interval: 10s
      timeout: 5s
      retries: 5

volumes:
  mariadb_data:
    driver: local
```

```sql name=vector-databases/mariadb/init/01-init.sql
-- MariaDB 11.7+ 向量支持初始化

-- 创建示例向量表（1536维，适配 OpenAI Embedding）
CREATE TABLE IF NOT EXISTS embeddings (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    content TEXT,
    embedding VECTOR(1536) NOT NULL,
    metadata JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 创建向量索引
ALTER TABLE embeddings ADD VECTOR INDEX idx_embedding (embedding);

SELECT 'MariaDB Vector initialized successfully!' AS status;
```

---

## 9. 一键启动脚本

```bash name=vector-databases/start.sh
#!/bin/bash
set -e

# ============================================
# 向量数据库一键部署脚本
# 用法: ./start.sh [db_name...]
# 示例:
#   ./start.sh              # 启动全部
#   ./start.sh pgvector     # 仅启动 pgvector
#   ./start.sh milvus qdrant # 启动 milvus 和 qdrant
# ============================================

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ENV_FILE="${SCRIPT_DIR}/.env"

# 所有支持的数据库
ALL_DBS=("pgvector" "milvus" "qdrant" "chroma" "elasticsearch" "weaviate" "mariadb")

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

log_info()  { echo -e "${GREEN}[INFO]${NC}  $1"; }
log_warn()  { echo -e "${YELLOW}[WARN]${NC}  $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }
log_step()  { echo -e "${BLUE}[STEP]${NC}  $1"; }

# 检查 Docker 和 Docker Compose
check_prerequisites() {
    if ! command -v docker &> /dev/null; then
        log_error "Docker 未安装，请先安装 Docker"
        exit 1
    fi

    if ! docker compose version &> /dev/null && ! docker-compose version &> /dev/null; then
        log_error "Docker Compose 未安装，请先安装 Docker Compose"
        exit 1
    fi

    # 优先使用 docker compose (V2)
    if docker compose version &> /dev/null; then
        COMPOSE_CMD="docker compose"
    else
        COMPOSE_CMD="docker-compose"
    fi

    log_info "使用 Compose 命令: ${COMPOSE_CMD}"
}

# 调整 Elasticsearch 所需的系统参数
tune_system_for_es() {
    local current_max_map=$(cat /proc/sys/vm/max_map_count 2>/dev/null || echo "0")
    if [ "$current_max_map" -lt 262144 ]; then
        log_warn "Elasticsearch 需要 vm.max_map_count >= 262144 (当前: ${current_max_map})"
        if [ "$(id -u)" = "0" ]; then
            sysctl -w vm.max_map_count=262144
            log_info "已设置 vm.max_map_count=262144"
        else
            log_warn "请手动执行: sudo sysctl -w vm.max_map_count=262144"
        fi
    fi
}

# 启动单个数据库
start_db() {
    local db_name=$1
    local db_dir="${SCRIPT_DIR}/${db_name}"

    if [ ! -d "$db_dir" ] || [ ! -f "${db_dir}/docker-compose.yml" ]; then
        log_error "找不到 ${db_name} 的配置目录或 docker-compose.yml"
        return 1
    fi

    log_step "正在启动 ${db_name}..."

    # Elasticsearch 特殊处理
    if [ "$db_name" = "elasticsearch" ]; then
        tune_system_for_es
    fi

    cd "$db_dir"
    ${COMPOSE_CMD} --env-file "${ENV_FILE}" up -d

    log_info "${db_name} 启动完成 ✅"
    echo ""
}

# 等待健康检查
wait_for_health() {
    local db_name=$1
    local container_name=$2
    local max_wait=120
    local waited=0

    log_step "等待 ${db_name} 就绪..."
    while [ $waited -lt $max_wait ]; do
        local health=$(docker inspect --format='{{.State.Health.Status}}' "$container_name" 2>/dev/null || echo "not_found")
        if [ "$health" = "healthy" ]; then
            log_info "${db_name} 已就绪 ✅"
            return 0
        fi
        sleep 3
        waited=$((waited + 3))
    done
    log_warn "${db_name} 启动超时（${max_wait}s），请手动检查"
}

# 打印访问信息
print_access_info() {
    echo ""
    echo "============================================"
    echo "  🚀 向量数据库部署完成"
    echo "============================================"
    echo ""

    for db_name in "${TARGET_DBS[@]}"; do
        case $db_name in
            pgvector)
                echo "  📦 PGVector (PostgreSQL)"
                echo "     连接: postgresql://vector:vector123@localhost:5432/vectordb"
                echo ""
                ;;
            milvus)
                echo "  📦 Milvus"
                echo "     gRPC: localhost:19530"
                echo "     Health: http://localhost:9091/healthz"
                echo "     MinIO: http://localhost:9001 (minioadmin/minioadmin)"
                echo ""
                ;;
            qdrant)
                echo "  📦 Qdrant"
                echo "     REST: http://localhost:6333"
                echo "     gRPC: localhost:6334"
                echo "     Dashboard: http://localhost:6333/dashboard"
                echo ""
                ;;
            chroma)
                echo "  📦 Chroma"
                echo "     HTTP: http://localhost:8000"
                echo "     心跳: http://localhost:8000/api/v1/heartbeat"
                echo ""
                ;;
            elasticsearch)
                echo "  📦 Elasticsearch"
                echo "     HTTP: http://localhost:9200"
                echo "     集群信息: http://localhost:9200/_cluster/health"
                echo ""
                ;;
            weaviate)
                echo "  📦 Weaviate"
                echo "     REST: http://localhost:8080"
                echo "     gRPC: localhost:50051"
                echo "     就绪检查: http://localhost:8080/v1/.well-known/ready"
                echo ""
                ;;
            mariadb)
                echo "  📦 MariaDB (Vector)"
                echo "     连接: mysql://vector:vector123@localhost:3306/vectordb"
                echo ""
                ;;
        esac
    done

    echo "============================================"
    echo "  停止所有: ./stop.sh"
    echo "  停止单个: ./stop.sh <db_name>"
    echo "============================================"
}

# ============== 主流程 ==============

echo ""
echo "============================================"
echo "  🗄️  开源向量数据库一键部署"
echo "============================================"
echo ""

check_prerequisites

# 确定要启动的数据库
if [ $# -eq 0 ]; then
    TARGET_DBS=("${ALL_DBS[@]}")
    log_info "将启动所有向量数据库: ${ALL_DBS[*]}"
else
    TARGET_DBS=("$@")
    log_info "将启动指定数据库: ${TARGET_DBS[*]}"
fi

echo ""

# 逐个启动
for db in "${TARGET_DBS[@]}"; do
    start_db "$db" || log_error "${db} 启动失败"
done

# 等待健康检查
CONTAINER_MAP=(
    "pgvector:pgvector"
    "milvus:milvus-standalone"
    "qdrant:qdrant"
    "chroma:chroma"
    "elasticsearch:elasticsearch"
    "weaviate:weaviate"
    "mariadb:mariadb-vector"
)

for mapping in "${CONTAINER_MAP[@]}"; do
    db_name="${mapping%%:*}"
    container="${mapping##*:}"
    for target in "${TARGET_DBS[@]}"; do
        if [ "$target" = "$db_name" ]; then
            wait_for_health "$db_name" "$container"
            break
        fi
    done
done

print_access_info
```

---

## 10. 一键停止脚本

```bash name=vector-databases/stop.sh
#!/bin/bash
set -e

# ============================================
# 向量数据库一键停止脚本
# 用法: ./stop.sh [db_name...]
# 示例:
#   ./stop.sh              # 停止全部
#   ./stop.sh pgvector     # 仅停止 pgvector
#   ./stop.sh --clean      # 停止全部并清理数据卷
# ============================================

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ENV_FILE="${SCRIPT_DIR}/.env"

ALL_DBS=("pgvector" "milvus" "qdrant" "chroma" "elasticsearch" "weaviate" "mariadb")

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

log_info()  { echo -e "${GREEN}[INFO]${NC}  $1"; }
log_warn()  { echo -e "${YELLOW}[WARN]${NC}  $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }

# Compose 命令检测
if docker compose version &> /dev/null; then
    COMPOSE_CMD="docker compose"
else
    COMPOSE_CMD="docker-compose"
fi

CLEAN_VOLUMES=false
TARGET_DBS=()

# 解析参数
for arg in "$@"; do
    if [ "$arg" = "--clean" ] || [ "$arg" = "-c" ]; then
        CLEAN_VOLUMES=true
    else
        TARGET_DBS+=("$arg")
    fi
done

if [ ${#TARGET_DBS[@]} -eq 0 ]; then
    TARGET_DBS=("${ALL_DBS[@]}")
fi

echo ""
echo "============================================"
echo "  🛑 停止向量数据库"
echo "============================================"
echo ""

if [ "$CLEAN_VOLUMES" = true ]; then
    log_warn "将同时清理数据卷（--clean）"
fi

for db_name in "${TARGET_DBS[@]}"; do
    db_dir="${SCRIPT_DIR}/${db_name}"

    if [ ! -d "$db_dir" ] || [ ! -f "${db_dir}/docker-compose.yml" ]; then
        log_warn "跳过 ${db_name}（配置不存在）"
        continue
    fi

    log_info "正在停止 ${db_name}..."
    cd "$db_dir"

    if [ "$CLEAN_VOLUMES" = true ]; then
        ${COMPOSE_CMD} --env-file "${ENV_FILE}" down -v
    else
        ${COMPOSE_CMD} --env-file "${ENV_FILE}" down
    fi

    log_info "${db_name} 已停止 ✅"
done

echo ""
echo "============================================"
echo "  所有指定数据库已停止"
if [ "$CLEAN_VOLUMES" = true ]; then
    echo "  ⚠️  数据卷已清理"
fi
echo "============================================"
```

---

## 🚀 使用方法

```bash name=usage-examples.sh
# 1. 赋予脚本执行权限
chmod +x vector-databases/start.sh
chmod +x vector-databases/stop.sh

# 2. 启动所有向量数据库
cd vector-databases
./start.sh

# 3. 仅启动部分数据库
./start.sh pgvector milvus qdrant

# 4. 停止所有
./stop.sh

# 5. 停止单个
./stop.sh chroma

# 6. 停止全部并清理数据（危险！会删除所有持久化数据）
./stop.sh --clean

# 7. 单独管理某个数据库
cd pgvector && docker compose up -d
cd qdrant && docker compose down
```

---

## 📋 各数据库端口与访问汇总

| 数据库 | 端口 | 协议 | 健康检查 |
|---|---|---|---|
| **PGVector** | `5432` | PostgreSQL | `pg_isready` |
| **Milvus** | `19530` (gRPC), `9091` (HTTP) | gRPC/REST | `http://localhost:9091/healthz` |
| **Qdrant** | `6333` (REST), `6334` (gRPC) | REST/gRPC | `http://localhost:6333/healthz` |
| **Chroma** | `8000` | HTTP | `http://localhost:8000/api/v1/heartbeat` |
| **Elasticsearch** | `9200` (HTTP), `9300` (Transport) | REST | `http://localhost:9200/_cluster/health` |
| **Weaviate** | `8080` (REST), `50051` (gRPC) | REST/gRPC | `http://localhost:8080/v1/.well-known/ready` |
| **MariaDB** | `3306` | MySQL | `healthcheck.sh` |

> ⚠️ **注意事项**:
> - Elasticsearch 需要 `vm.max_map_count >= 262144`，启动脚本会自动检测并提醒
> - Milvus 依赖 etcd 和 MinIO，首次启动可能需要 1-2 分钟
> - 所有数据库的数据均通过 Docker Volume 持久化，`stop.sh` 默认不删除数据，加 `--clean` 才会清理
> - 如在同一机器部署，请确保端口没有冲突（尤其是 `3306`, `5432`, `9200` 等常用端口）
> - 生产环境请务必修改 `.env` 中的默认密码
