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
