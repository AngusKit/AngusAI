package cloud.xcan.angus.core.ai.domain.sharing;

/**
 * 共享操作枚举
 */
public enum ShareAccessAction {
  /**
   * 查看
   */
  VIEW,

  /**
   * 编辑
   */
  EDIT,

  /**
   * 删除
   */
  DELETE,

  /**
   * 授权
   */
  GRANT;

  public SharePermission toPermission() {
    switch (this) {
      case VIEW -> {
        return SharePermission.VIEW;
      }
      case EDIT -> {
        return SharePermission.EDIT;
      }
      case DELETE, GRANT -> {
        return SharePermission.MANAGE;
      }
    }
    return SharePermission.VIEW;
  }

  public boolean isEdit() {
    return this.equals(EDIT);
  }

  public boolean isView() {
    return this.equals(VIEW);
  }

  public boolean isDelete() {
    return this.equals(DELETE);
  }

  public boolean isManagement() {
    return this.equals(GRANT) || this.equals(DELETE);
  }
}
