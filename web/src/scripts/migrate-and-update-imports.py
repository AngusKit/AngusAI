#!/usr/bin/env python3
"""
AngusAI 组件迁移和导入路径更新工具

功能：
1. 将组件文件从根目录迁移到对应的业务模块目录
2. 自动更新组件内部的导入路径
3. 生成迁移报告
"""

import os
import re
import shutil
from pathlib import Path
from typing import Dict, List, Tuple

# 迁移映射配置
MIGRATIONS: Dict[str, str] = {
    # Layout
    "Header.tsx": "layout",
    
    # Dashboard
    "WelcomeBanner.tsx": "dashboard",
    "StatsCards.tsx": "dashboard",
    "UsageDetails.tsx": "dashboard",
    "RecommendedTools.tsx": "dashboard",
    "RecentApplications.tsx": "dashboard",
    
    # Applications
    "MyApplications.tsx": "applications",
    "CreateApplication.tsx": "applications",
    
    # Workflow
    "Workflow.tsx": "workflow",
    "WorkflowEditor.tsx": "workflow",
    "CreateWorkflowDialog.tsx": "workflow",
    "WorkflowInfoDialog.tsx": "workflow",
    
    # Knowledge
    "KnowledgeBase.tsx": "knowledge",
    "CreateKnowledgeBaseDialog.tsx": "knowledge",
    "EditKnowledgeBaseDialog.tsx": "knowledge",
    
    # Dataset
    "Dataset.tsx": "dataset",
    "CreateDatasetDialog.tsx": "dataset",
    "EditDatasetDialog.tsx": "dataset",
    
    # Models
    "ModelManagement.tsx": "models",
    
    # Team
    "TeamMembers.tsx": "team",
    "TeamSettings.tsx": "team",
    "ResourceSharing.tsx": "team",
    
    # Settings
    "ApplicationSettings.tsx": "settings",
    "UsageAnalytics.tsx": "settings",
    "APIKeys.tsx": "settings",
    "BillingSubscription.tsx": "settings",
    
    # Plugins
    "PluginMarket.tsx": "plugins",
}

# 导入路径替换规则
IMPORT_REPLACEMENTS = [
    # UI 组件
    (r"from ['\"]\.\/ui\/", "from '../ui/"),
    
    # Shared 组件
    (r"from ['\"]\.\/ThemeProvider['\"]", "from '../shared/ThemeProvider'"),
    (r"from ['\"]\.\/LanguageProvider['\"]", "from '../shared/LanguageProvider'"),
    (r"from ['\"]\.\/AngusAILogo['\"]", "from '../shared/AngusAILogo'"),
    
    # Lib
    (r"from ['\"]\.\.\/lib\/", "from '../../lib/"),
    
    # Locales
    (r"from ['\"]\.\.\/locales\/", "from '../../locales/"),
    
    # Figma
    (r"from ['\"]\.\/figma\/", "from '../figma/"),
]


def update_imports(content: str) -> Tuple[str, int]:
    """
    更新文件内容中的导入路径
    
    Args:
        content: 文件内容
        
    Returns:
        (更新后的内容, 替换次数)
    """
    updated_content = content
    total_replacements = 0
    
    for pattern, replacement in IMPORT_REPLACEMENTS:
        updated_content, count = re.subn(pattern, replacement, updated_content)
        total_replacements += count
    
    return updated_content, total_replacements


def migrate_component(source_file: str, target_module: str, root_path: Path) -> Dict:
    """
    迁移单个组件并更新导入路径
    
    Args:
        source_file: 源文件名
        target_module: 目标模块目录名
        root_path: 项目根路径
        
    Returns:
        迁移结果字典
    """
    result = {
        "file": source_file,
        "module": target_module,
        "success": False,
        "message": "",
        "import_updates": 0
    }
    
    source_path = root_path / "components" / source_file
    target_dir = root_path / "components" / target_module
    target_path = target_dir / source_file
    
    # 检查源文件
    if not source_path.exists():
        result["message"] = "源文件不存在"
        return result
    
    # 检查目标目录
    if not target_dir.exists():
        result["message"] = "目标目录不存在"
        return result
    
    # 检查目标文件是否已存在
    if target_path.exists():
        result["message"] = "目标文件已存在（跳过）"
        result["success"] = True
        return result
    
    try:
        # 读取源文件内容
        with open(source_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # 更新导入路径
        updated_content, import_count = update_imports(content)
        result["import_updates"] = import_count
        
        # 写入目标文件
        with open(target_path, 'w', encoding='utf-8') as f:
            f.write(updated_content)
        
        result["success"] = True
        result["message"] = f"迁移成功（更新了 {import_count} 个导入）"
        
    except Exception as e:
        result["message"] = f"迁移失败: {str(e)}"
    
    return result


def generate_app_imports(migrations: Dict[str, str]) -> str:
    """
    生成 App.tsx 的新导入语句
    
    Args:
        migrations: 迁移映射
        
    Returns:
        新的导入语句
    """
    # 按模块分组
    modules: Dict[str, List[str]] = {}
    for file, module in migrations.items():
        component_name = file.replace('.tsx', '')
        if module not in modules:
            modules[module] = []
        modules[module].append(component_name)
    
    # 生成导入语句
    imports = []
    
    # Shared (固定的)
    imports.append("import { ThemeProvider, LanguageProvider } from './components/shared';")
    
    # Layout
    if 'layout' in modules:
        comps = ', '.join(modules['layout'])
        imports.append(f"import {{ {comps} }} from './components/layout';")
    
    # Dashboard
    if 'dashboard' in modules:
        comps = ',\n  '.join(modules['dashboard'])
        imports.append(f"import {{\n  {comps}\n}} from './components/dashboard';")
    
    # 其他模块
    for module in ['applications', 'workflow', 'knowledge', 'dataset', 'models', 'team', 'settings', 'plugins']:
        if module in modules:
            comps = ', '.join(modules[module])
            imports.append(f"import {{ {comps} }} from './components/{module}';")
    
    return '\n'.join(imports)


def main():
    """主函数"""
    print("🚀 AngusAI 组件迁移工具")
    print("=" * 60)
    print()
    
    # 获取项目根路径
    root_path = Path.cwd()
    print(f"项目根路径: {root_path}")
    print()
    
    # 执行迁移
    results = []
    success_count = 0
    failed_count = 0
    total_imports_updated = 0
    
    print("📦 开始迁移组件...")
    print()
    
    for source_file, target_module in MIGRATIONS.items():
        result = migrate_component(source_file, target_module, root_path)
        results.append(result)
        
        # 打印进度
        status = "✅" if result["success"] else "❌"
        print(f"{status} {source_file:40} → {target_module:15} {result['message']}")
        
        if result["success"]:
            success_count += 1
            total_imports_updated += result["import_updates"]
        else:
            failed_count += 1
    
    # 打印统计
    print()
    print("=" * 60)
    print("📊 迁移统计")
    print("=" * 60)
    print(f"总计:           {len(MIGRATIONS)}")
    print(f"✅ 成功:        {success_count}")
    print(f"❌ 失败:        {failed_count}")
    print(f"🔄 导入更新:    {total_imports_updated}")
    print()
    
    # 生成 App.tsx 导入建议
    if success_count > 0:
        print("=" * 60)
        print("📝 App.tsx 推荐导入语句")
        print("=" * 60)
        print()
        print(generate_app_imports(MIGRATIONS))
        print()
    
    # 生成待删除文件列表
    if success_count > 0:
        print("=" * 60)
        print("🗑️  待删除的旧文件")
        print("=" * 60)
        print()
        print("验证功能正常后，可以删除以下文件：")
        print()
        for result in results:
            if result["success"] and result["message"] != "目标文件已存在（跳过）":
                print(f"  - components/{result['file']}")
        print()
    
    # 最终提示
    if failed_count == 0:
        print("✅ 所有组件迁移成功！")
        print()
        print("⚠️  下一步操作：")
        print("1. 更新 App.tsx 中的导入语句（参考上面的推荐语句）")
        print("2. 测试应用所有功能是否正常")
        print("3. 验证通过后，删除旧的组件文件")
    else:
        print("❌ 部分组件迁移失败，请检查错误信息并手动处理")
    
    print()
    print("🎉 迁移工具执行完成！")


if __name__ == "__main__":
    main()
