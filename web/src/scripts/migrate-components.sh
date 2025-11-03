#!/bin/bash

# AngusAI 组件迁移脚本
# 将所有组件从 /components 根目录迁移到对应的业务模块目录

echo "🚀 开始组件迁移..."
echo ""

# 颜色定义
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# 迁移计数器
total=0
success=0
failed=0

# 定义迁移映射（源文件 -> 目标目录）
declare -A migrations=(
  # Layout
  ["Header.tsx"]="layout"
  
  # Dashboard
  ["WelcomeBanner.tsx"]="dashboard"
  ["StatsCards.tsx"]="dashboard"
  ["UsageDetails.tsx"]="dashboard"
  ["RecommendedTools.tsx"]="dashboard"
  ["RecentApplications.tsx"]="dashboard"
  
  # Applications
  ["MyApplications.tsx"]="applications"
  ["CreateApplication.tsx"]="applications"
  
  # Workflow
  ["Workflow.tsx"]="workflow"
  ["WorkflowEditor.tsx"]="workflow"
  ["CreateWorkflowDialog.tsx"]="workflow"
  ["WorkflowInfoDialog.tsx"]="workflow"
  
  # Knowledge
  ["KnowledgeBase.tsx"]="knowledge"
  ["CreateKnowledgeBaseDialog.tsx"]="knowledge"
  ["EditKnowledgeBaseDialog.tsx"]="knowledge"
  
  # Dataset
  ["Dataset.tsx"]="dataset"
  ["CreateDatasetDialog.tsx"]="dataset"
  ["EditDatasetDialog.tsx"]="dataset"
  
  # Models
  ["ModelManagement.tsx"]="models"
  
  # Team
  ["TeamMembers.tsx"]="team"
  ["TeamSettings.tsx"]="team"
  ["ResourceSharing.tsx"]="team"
  
  # Settings
  ["ApplicationSettings.tsx"]="settings"
  ["UsageAnalytics.tsx"]="settings"
  ["APIKeys.tsx"]="settings"
  ["BillingSubscription.tsx"]="settings"
  
  # Plugins
  ["PluginMarket.tsx"]="plugins"
)

# 迁移函数
migrate_component() {
  local source_file=$1
  local target_dir=$2
  local source_path="components/$source_file"
  local target_path="components/$target_dir/$source_file"
  
  total=$((total + 1))
  
  echo -n "迁移 $source_file → $target_dir/ ... "
  
  # 检查源文件是否存在
  if [ ! -f "$source_path" ]; then
    echo -e "${RED}失败${NC} (源文件不存在)"
    failed=$((failed + 1))
    return 1
  fi
  
  # 检查目标目录是否存在
  if [ ! -d "components/$target_dir" ]; then
    echo -e "${RED}失败${NC} (目标目录不存在)"
    failed=$((failed + 1))
    return 1
  fi
  
  # 检查目标文件是否已存在
  if [ -f "$target_path" ]; then
    echo -e "${YELLOW}跳过${NC} (文件已存在)"
    return 0
  fi
  
  # 执行迁移（复制文件，保留原文件以便后续验证）
  cp "$source_path" "$target_path"
  
  if [ $? -eq 0 ]; then
    echo -e "${GREEN}成功${NC}"
    success=$((success + 1))
  else
    echo -e "${RED}失败${NC}"
    failed=$((failed + 1))
  fi
}

# 执行所有迁移
echo "📦 开始迁移组件..."
echo ""

for source_file in "${!migrations[@]}"; do
  target_dir="${migrations[$source_file]}"
  migrate_component "$source_file" "$target_dir"
done

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📊 迁移统计"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "总计: $total"
echo -e "${GREEN}成功: $success${NC}"
echo -e "${RED}失败: $failed${NC}"
echo ""

if [ $failed -eq 0 ]; then
  echo -e "${GREEN}✅ 所有组件迁移成功！${NC}"
  echo ""
  echo "⚠️  请注意："
  echo "1. 组件文件已复制到新位置"
  echo "2. 请手动更新组件内部的导入路径"
  echo "3. 请更新 App.tsx 中的导入语句"
  echo "4. 验证应用功能正常后，手动删除旧文件"
  echo ""
  echo "旧文件列表："
  for source_file in "${!migrations[@]}"; do
    echo "  - components/$source_file"
  done
else
  echo -e "${RED}❌ 部分组件迁移失败，请检查错误信息${NC}"
fi

echo ""
echo "🎉 迁移脚本执行完成！"
