package cloud.xcan.angus.core.ai.domain.activity;

public enum ActionType {

  // 基础操作
  CREATE,             // 创建
  UPDATE,             // 更新
  DELETE,             // 删除
  VIEW,               // 查看
  COPY,               // 复制
  MOVE,               // 移动

  // 协作操作
  SHARE,               // 分享
  UNSHARE,             // 取消分享
  INVITE,               // 邀请

  // 数据操作
  EXPORT,             // 导出
  IMPORT,             // 导入
  UPLOAD,             // 上传
  DOWNLOAD,           // 下载

  // 执行操作
  EXECUTE,             // 执行
  START,               // 启动
  STOP,                // 停止
  RESTART,             // 重启

  // 权限操作
  GRANT_PERMISSION,    // 授予权限
  REVOKE_PERMISSION,   // 撤销权限
  CHANGE_ROLE,         // 变更角色

  // 配置操作
  CONFIGURE,          // 配置
  ENABLE,             // 启用
  DISABLE,
  ;            // 禁用

  public String getDescMessageKey() {
    return null;
  }

  public String getDetailMessageKey() {
    return null;
  }
}

