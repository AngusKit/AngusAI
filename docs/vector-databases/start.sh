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
