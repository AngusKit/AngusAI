-- @formatter:off
-- ----------------------------
-- Table data for app
-- ----------------------------
-- Note: After installation, it is necessary to modify the application URL.
DELETE FROM `app` WHERE id = 100010;
INSERT INTO `app` (`id`, `code`, `name`, `show_name`, `icon`, `type`, `edition_type`, `description`, `auth_ctrl`, `enabled`, `url`, `sequence`, `api_ids`, `version`, `open_stage`, `client_id`, `tenant_id`, `created_by`, `created_date`, `last_modified_by`, `last_modified_date`) VALUES (100010, 'AngusAI', 'AngusAI', 'AngusAI', '', 'CLOUD_APP', 'ENTERPRISE', 'AngusTester企业版', 1, 1, 'http://localhost:2530', 7, '[]', '1.0.0', 'SIGNUP', 'xcan_tp', :TENANT_ID, -1, '2024-01-01 00:00:00', -1, '2024-01-01 00:00:00');
UPDATE `app` SET `created_date` = now(), `last_modified_date` = now();

-- ----------------------------
-- Table data for app_func
-- ----------------------------
DELETE FROM `app_func` WHERE app_id = 100010;
INSERT INTO `app_func` (`id`, `code`, `name`, `show_name`, `pid`, `icon`, `type`, `description`, `auth_ctrl`, `enabled`, `url`, `app_id`, `sequence`, `api_ids`, `client_id`, `tenant_id`, `created_by`, `created_date`, `last_modified_by`, `last_modified_date`) VALUES (1000101502001, 'Apis', '接口', '接口', -1, '', 'MENU', '', 1, 1, '/apis', 100010, 5, '[]',  'xcan_tp', :TENANT_ID, -1, '2024-01-02 11:22:22',  -1, '2024-07-31 14:58:04');
INSERT INTO `app_func` (`id`, `code`, `name`, `show_name`, `pid`, `icon`, `type`, `description`, `auth_ctrl`, `enabled`, `url`, `app_id`, `sequence`, `api_ids`, `client_id`, `tenant_id`, `created_by`, `created_date`, `last_modified_by`, `last_modified_date`) VALUES (1000101517001, 'Config', '配置', '配置', -1, '', 'MENU', '', 1, 1, '/config', 100010, 15, '[]',  'xcan_tp', :TENANT_ID, -1, '2024-01-02 11:22:22', -1, '2024-03-01 20:33:50');
INSERT INTO `app_func` (`id`, `code`, `name`, `show_name`, `pid`, `icon`, `type`, `description`, `auth_ctrl`, `enabled`, `url`, `app_id`, `sequence`, `api_ids`, `client_id`, `tenant_id`, `created_by`, `created_date`, `last_modified_by`, `last_modified_date`) VALUES (1000101506001, 'Data', '数据', '数据', -1, '', 'MENU', '', 1, 1, '/data', 100010, 8, '[]',  'xcan_tp', :TENANT_ID, -1, '2024-01-02 11:22:22', -1, '2024-07-31 14:58:51');
INSERT INTO `app_func` (`id`, `code`, `name`, `show_name`, `pid`, `icon`, `type`, `description`, `auth_ctrl`, `enabled`, `url`, `app_id`, `sequence`, `api_ids`, `client_id`, `tenant_id`, `created_by`, `created_date`, `last_modified_by`, `last_modified_date`) VALUES (1000101508001, 'Execution', '执行', '执行', -1, '', 'MENU', '', 1, 1, '/execution', 100010, 9, '[]',  'xcan_tp', :TENANT_ID, -1, '2024-01-02 11:22:22', -1, '2024-07-31 14:59:02');
INSERT INTO `app_func` (`id`, `code`, `name`, `show_name`, `pid`, `icon`, `type`, `description`, `auth_ctrl`, `enabled`, `url`, `app_id`, `sequence`, `api_ids`, `client_id`, `tenant_id`, `created_by`, `created_date`, `last_modified_by`, `last_modified_date`) VALUES (1000101516001, 'FunctionTesting', '功能测试', '功能', -1, '', 'MENU', '', 1, 1, '/function', 100010, 4, '[]',  'xcan_tp', :TENANT_ID, -1, '2024-01-02 11:22:22', -1, '2024-07-31 14:51:28');
INSERT INTO `app_func` (`id`, `code`, `name`, `show_name`, `pid`, `icon`, `type`, `description`, `auth_ctrl`, `enabled`, `url`, `app_id`, `sequence`, `api_ids`, `client_id`, `tenant_id`, `created_by`, `created_date`, `last_modified_by`, `last_modified_date`) VALUES (1000101501000, 'Kanban', '看板', '看板', -1, '', 'MENU', '', 1, 1, '/kanban', 100010, 2, '[]',  'xcan_tp', :TENANT_ID, -1, '2024-01-02 11:22:22', -1, '2024-07-31 14:56:25');
INSERT INTO `app_func` (`id`, `code`, `name`, `show_name`, `pid`, `icon`, `type`, `description`, `auth_ctrl`, `enabled`, `url`, `app_id`, `sequence`, `api_ids`, `client_id`, `tenant_id`, `created_by`, `created_date`, `last_modified_by`, `last_modified_date`) VALUES (1000101501001, 'Projects', '项目', '项目', -1, 'icon-shenheshibai', 'MENU', '', 1, 1, '/project', 100010, 1, '[]',  'xcan_tp', :TENANT_ID, -1, '2024-06-04 18:49:18', -1, '2024-08-16 08:07:25');
INSERT INTO `app_func` (`id`, `code`, `name`, `show_name`, `pid`, `icon`, `type`, `description`, `auth_ctrl`, `enabled`, `url`, `app_id`, `sequence`, `api_ids`, `client_id`, `tenant_id`, `created_by`, `created_date`, `last_modified_by`, `last_modified_date`) VALUES (1000101510001, 'Report', '报告', '报告', -1, '', 'MENU', '', 1, 1, '/report', 100010, 15, '[]',  'xcan_tp', :TENANT_ID, -1, '2024-01-02 11:22:22', -1, '2024-08-20 18:29:06');
INSERT INTO `app_func` (`id`, `code`, `name`, `show_name`, `pid`, `icon`, `type`, `description`, `auth_ctrl`, `enabled`, `url`, `app_id`, `sequence`, `api_ids`, `client_id`, `tenant_id`, `created_by`, `created_date`, `last_modified_by`, `last_modified_date`) VALUES (1000101503001, 'Scenario', '场景', '场景', -1, '', 'MENU', '', 1, 1, '/scenario', 100010, 6, '[]',  'xcan_tp', :TENANT_ID, -1, '2024-01-02 11:22:22', -1, '2024-07-31 14:58:23');
INSERT INTO `app_func` (`id`, `code`, `name`, `show_name`, `pid`, `icon`, `type`, `description`, `auth_ctrl`, `enabled`, `url`, `app_id`, `sequence`, `api_ids`, `client_id`, `tenant_id`, `created_by`, `created_date`, `last_modified_by`, `last_modified_date`) VALUES (1000101507001, 'Script', '脚本', '脚本', -1, '', 'MENU', '', 1, 1, '/script', 100010, 7, '[]',  'xcan_tp', :TENANT_ID, -1, '2024-01-02 11:22:22', -1, '2024-07-31 14:58:31');
INSERT INTO `app_func` (`id`, `code`, `name`, `show_name`, `pid`, `icon`, `type`, `description`, `auth_ctrl`, `enabled`, `url`, `app_id`, `sequence`, `api_ids`, `client_id`, `tenant_id`, `created_by`, `created_date`, `last_modified_by`, `last_modified_date`) VALUES (1000101504001, 'Task', '任务', '任务', -1, '', 'MENU', '', 1, 1, '/task', 100010, 3, '[]',  'xcan_tp', :TENANT_ID, -1, '2024-01-02 11:22:22', -1, '2024-07-31 14:57:52');
INSERT INTO `app_func` (`id`, `code`, `name`, `show_name`, `pid`, `icon`, `type`, `description`, `auth_ctrl`, `enabled`, `url`, `app_id`, `sequence`, `api_ids`, `client_id`, `tenant_id`, `created_by`, `created_date`, `last_modified_by`, `last_modified_date`) VALUES (1000101515001, 'OfficialWebsite', '官网', '官网', -1, '', 'MENU', '', 1, 1, 'https://www.xcan.cloud', 100010, 17, '[]', 'xcan_tp', :TENANT_ID, -1, '2024-01-02 11:22:22', -1, '2024-04-03 17:55:24');
INSERT INTO `app_func` (`id`, `code`, `name`, `show_name`, `pid`, `icon`, `type`, `description`, `auth_ctrl`, `enabled`, `url`, `app_id`, `sequence`, `api_ids`, `client_id`, `tenant_id`, `created_by`, `created_date`, `last_modified_by`, `last_modified_date`) VALUES (1000101512001, 'GlobalSearch', '搜索框', '搜索框', -1, '', 'MENU', '', 1, 1, '/', 100010, 14, '[]', 'xcan_tp', :TENANT_ID, -1, '2024-01-02 11:22:22', -1, '2024-01-02 11:22:22');
INSERT INTO `app_func` (`id`, `code`, `name`, `show_name`, `pid`, `icon`, `type`, `description`, `auth_ctrl`, `enabled`, `url`, `app_id`, `sequence`, `api_ids`, `client_id`, `tenant_id`, `created_by`, `created_date`, `last_modified_by`, `last_modified_date`) VALUES (1000101513001, 'WorkOrder', '工单', '工单', -1, '', 'MENU', '', 1, 1, 'https://wo.xcan.cloud/workorders', 100010, 15, '[]', 'xcan_tp', :TENANT_ID, -1, '2024-01-02 11:22:22', -1, '2024-04-03 17:54:51');
UPDATE `app_func` SET `created_date` = now(), `last_modified_date` = now();

-- ----------------------------
-- Table data for web_tag
-- ----------------------------
-- Do in AngusGM

-- ----------------------------
-- Table data for web_tag_target
-- ----------------------------
-- Func Tag
DELETE FROM `web_tag_target` WHERE target_id IN (SELECT id FROM `app_func` WHERE app_id = 100010);
INSERT INTO `web_tag_target` (`id`, `tag_id`, `target_type`, `target_id`, `tenant_id`, `created_by`, `created_date`) VALUES (239132446770069593, 1, 'MENU', 1000101502001, :TENANT_ID, -1, '2024-07-31 14:58:04');
INSERT INTO `web_tag_target` (`id`, `tag_id`, `target_type`, `target_id`, `tenant_id`, `created_by`, `created_date`) VALUES (239132446770069594, 4, 'MENU', 1000101502001, :TENANT_ID, -1, '2024-07-31 14:58:04');
INSERT INTO `web_tag_target` (`id`, `tag_id`, `target_type`, `target_id`, `tenant_id`, `created_by`, `created_date`) VALUES (239132446770074260, 1, 'MENU', 1000101517001, :TENANT_ID, -1, '2024-08-16 08:41:58');
INSERT INTO `web_tag_target` (`id`, `tag_id`, `target_type`, `target_id`, `tenant_id`, `created_by`, `created_date`) VALUES (239132446770074261, 4, 'MENU', 1000101517001, :TENANT_ID, -1, '2024-08-16 08:41:58');
INSERT INTO `web_tag_target` (`id`, `tag_id`, `target_type`, `target_id`, `tenant_id`, `created_by`, `created_date`) VALUES (239132446770069599, 1, 'MENU', 1000101506001, :TENANT_ID, -1, '2024-07-31 14:58:51');
INSERT INTO `web_tag_target` (`id`, `tag_id`, `target_type`, `target_id`, `tenant_id`, `created_by`, `created_date`) VALUES (239132446770069600, 4, 'MENU', 1000101506001, :TENANT_ID, -1, '2024-07-31 14:58:51');
INSERT INTO `web_tag_target` (`id`, `tag_id`, `target_type`, `target_id`, `tenant_id`, `created_by`, `created_date`) VALUES (239132446770069601, 1, 'MENU', 1000101508001, :TENANT_ID, -1, '2024-07-31 14:59:02');
INSERT INTO `web_tag_target` (`id`, `tag_id`, `target_type`, `target_id`, `tenant_id`, `created_by`, `created_date`) VALUES (239132446770069602, 4, 'MENU', 1000101508001, :TENANT_ID, -1, '2024-07-31 14:59:02');
INSERT INTO `web_tag_target` (`id`, `tag_id`, `target_type`, `target_id`, `tenant_id`, `created_by`, `created_date`) VALUES (239132446770069578, 1, 'MENU', 1000101516001, :TENANT_ID, -1, '2024-07-31 14:51:28');
INSERT INTO `web_tag_target` (`id`, `tag_id`, `target_type`, `target_id`, `tenant_id`, `created_by`, `created_date`) VALUES (239132446770069579, 4, 'MENU', 1000101516001, :TENANT_ID, -1, '2024-07-31 14:51:28');
INSERT INTO `web_tag_target` (`id`, `tag_id`, `target_type`, `target_id`, `tenant_id`, `created_by`, `created_date`) VALUES (239132446770069580, 1, 'MENU', 1000101501000, :TENANT_ID, -1, '2024-07-31 14:56:25');
INSERT INTO `web_tag_target` (`id`, `tag_id`, `target_type`, `target_id`, `tenant_id`, `created_by`, `created_date`) VALUES (239132446770069581, 4, 'MENU', 1000101501000, :TENANT_ID, -1, '2024-07-31 14:56:25');
INSERT INTO `web_tag_target` (`id`, `tag_id`, `target_type`, `target_id`, `tenant_id`, `created_by`, `created_date`) VALUES (239132446770073994, 1, 'MENU', 1000101501001, :TENANT_ID, -1, '2024-08-16 08:07:25');
INSERT INTO `web_tag_target` (`id`, `tag_id`, `target_type`, `target_id`, `tenant_id`, `created_by`, `created_date`) VALUES (239132446770073995, 4, 'MENU', 1000101501001, :TENANT_ID, -1, '2024-08-16 08:07:25');
INSERT INTO `web_tag_target` (`id`, `tag_id`, `target_type`, `target_id`, `tenant_id`, `created_by`, `created_date`) VALUES (239132446770073996, 9, 'MENU', 1000101501001, :TENANT_ID, -1, '2024-08-16 08:07:25');
INSERT INTO `web_tag_target` (`id`, `tag_id`, `target_type`, `target_id`, `tenant_id`, `created_by`, `created_date`) VALUES (246287437083443200, 1, 'MENU', 1000101510001, :TENANT_ID, -1, '2024-08-20 18:29:07');
INSERT INTO `web_tag_target` (`id`, `tag_id`, `target_type`, `target_id`, `tenant_id`, `created_by`, `created_date`) VALUES (246287437083443201, 4, 'MENU', 1000101510001, :TENANT_ID, -1, '2024-08-20 18:29:07');
INSERT INTO `web_tag_target` (`id`, `tag_id`, `target_type`, `target_id`, `tenant_id`, `created_by`, `created_date`) VALUES (239132446770069595, 1, 'MENU', 1000101503001, :TENANT_ID, -1, '2024-07-31 14:58:23');
INSERT INTO `web_tag_target` (`id`, `tag_id`, `target_type`, `target_id`, `tenant_id`, `created_by`, `created_date`) VALUES (239132446770069596, 4, 'MENU', 1000101503001, :TENANT_ID, -1, '2024-07-31 14:58:23');
INSERT INTO `web_tag_target` (`id`, `tag_id`, `target_type`, `target_id`, `tenant_id`, `created_by`, `created_date`) VALUES (239132446770069597, 1, 'MENU', 1000101507001, :TENANT_ID, -1, '2024-07-31 14:58:31');
INSERT INTO `web_tag_target` (`id`, `tag_id`, `target_type`, `target_id`, `tenant_id`, `created_by`, `created_date`) VALUES (239132446770069598, 4, 'MENU', 1000101507001, :TENANT_ID, -1, '2024-07-31 14:58:31');
INSERT INTO `web_tag_target` (`id`, `tag_id`, `target_type`, `target_id`, `tenant_id`, `created_by`, `created_date`) VALUES (239132446770069591, 1, 'MENU', 1000101504001, :TENANT_ID, -1, '2024-07-31 14:57:52');
INSERT INTO `web_tag_target` (`id`, `tag_id`, `target_type`, `target_id`, `tenant_id`, `created_by`, `created_date`) VALUES (239132446770069592, 4, 'MENU', 1000101504001, :TENANT_ID, -1, '2024-07-31 14:57:52');
INSERT INTO `web_tag_target` (`id`, `tag_id`, `target_type`, `target_id`, `tenant_id`, `created_by`, `created_date`) VALUES (155580502340798170, 2, 'MENU', 1000101512001, :TENANT_ID, -1, '2024-01-02 11:28:02');
INSERT INTO `web_tag_target` (`id`, `tag_id`, `target_type`, `target_id`, `tenant_id`, `created_by`, `created_date`) VALUES (155580502340798171, 4, 'MENU', 1000101512001, :TENANT_ID, -1, '2024-01-02 11:28:02');
INSERT INTO `web_tag_target` (`id`, `tag_id`, `target_type`, `target_id`, `tenant_id`, `created_by`, `created_date`) VALUES (155580502340798172, 2, 'MENU', 1000101513001, :TENANT_ID, -1, '2024-04-03 17:54:51');
INSERT INTO `web_tag_target` (`id`, `tag_id`, `target_type`, `target_id`, `tenant_id`, `created_by`, `created_date`) VALUES (155580502340798173, 4, 'MENU', 1000101513001, :TENANT_ID, -1, '2024-04-03 17:54:51');
INSERT INTO `web_tag_target` (`id`, `tag_id`, `target_type`, `target_id`, `tenant_id`, `created_by`, `created_date`) VALUES (155580502340798174, 2, 'MENU', 1000101515001, :TENANT_ID, -1, '2024-04-03 17:55:24');
INSERT INTO `web_tag_target` (`id`, `tag_id`, `target_type`, `target_id`, `tenant_id`, `created_by`, `created_date`) VALUES (155580502340798175, 4, 'MENU', 1000101515001, :TENANT_ID, -1, '2024-04-03 17:55:24');

-- App Tag
DELETE FROM `web_tag_target` WHERE target_id = 100010;
INSERT INTO `web_tag_target` (`id`, `tag_id`, `target_type`, `target_id`, `tenant_id`, `created_by`, `created_date`) VALUES (215509802372041260, 7, 'APP', 100010, :TENANT_ID, -1, '2024-03-27 09:35:12');

-- Clear dirty data
DELETE FROM web_tag_target WHERE tag_id NOT IN (SELECT id FROM web_tag);

-- ----------------------------
-- Table data for app_open  -> Do by code
-- ----------------------------
-- INSERT INTO `app_open` (`id`, `app_id`, `app_code`, `app_type`, `edition_type`, `version`, `client_id`, `tenant_id`, `user_id`, `open_date`, `expiration_date`, `expiration_deleted`, `op_client_open`, `created_date`) VALUES (2, 100010, 'AngusAI', 'CLOUD_APP', 'ENTERPRISE', '1.0.0', 'xcan_tp', :TENANT_ID, -1, ':appOpenDate', ':appExpirationDate', 0, 0, '2024-01-01 00:00:00');

-- ----------------------------
-- Table data for auth_policy
-- ----------------------------
DELETE FROM `auth_policy` WHERE app_id = 100010;
INSERT INTO `auth_policy` (`id`, `name`, `code`, `enabled`, `type`, `default0`, `grant_stage`, `description`, `app_id`, `client_id`, `tenant_id`, `created_by`, `created_date`, `last_modified_by`, `last_modified_date`) VALUES (129001, '应用管理员', 'ANGUSTESTER_ADMIN', 1, 'PRE_DEFINED', 1, 'SIGNUP_SUCCESS', '拥有“AngusAI”应用所有功能和“应用设置”权限。', 100010, 'xcan_tp', :TENANT_ID, -1, '2024-01-01 00:00:00', -1, '2024-01-01 00:00:00');
INSERT INTO `auth_policy` (`id`, `name`, `code`, `enabled`, `type`, `default0`, `grant_stage`, `description`, `app_id`, `client_id`, `tenant_id`, `created_by`, `created_date`, `last_modified_by`, `last_modified_date`) VALUES (129002, '一般用户', 'ANGUSTESTER_USER', 1, 'PRE_DEFINED', 1, 'SIGNUP_SUCCESS', '拥有“AngusAI”应用所有功能权限，无“应用设置”权限。', 100010, 'xcan_tp', :TENANT_ID, -1, '2024-01-01 00:00:00', -1, '2024-01-01 00:00:00');
INSERT INTO `auth_policy` (`id`, `name`, `code`, `enabled`, `type`, `default0`, `grant_stage`, `description`, `app_id`, `client_id`, `tenant_id`, `created_by`, `created_date`, `last_modified_by`, `last_modified_date`) VALUES (129003, '访客', 'ANGUSTESTER_GUEST', 1, 'PRE_DEFINED', 1, 'SIGNUP_SUCCESS', '拥有“AngusAI”应用功能查看权限，无“应用设置”权限。', 100010, 'xcan_tp', :TENANT_ID, -1, '2024-01-01 00:00:00', -1, '2024-01-01 00:00:00');
UPDATE `auth_policy` SET `created_date` = now(), `last_modified_date` = now();

-- ----------------------------
-- Table data for auth_policy_func
-- ----------------------------
DELETE FROM `auth_policy_func` WHERE app_id = 100010;
INSERT INTO `auth_policy_func` (`id`, `policy_id`, `app_id`, `func_id`, `func_type`, `tenant_id`, `created_by`, `created_date`) VALUES (239132446770074051, 129001, 100010, 1000101503001, 'MENU', :TENANT_ID, -1, '2024-08-16 08:31:04');
INSERT INTO `auth_policy_func` (`id`, `policy_id`, `app_id`, `func_id`, `func_type`, `tenant_id`, `created_by`, `created_date`) VALUES (239132446770074052, 129001, 100010, 1000101507001, 'MENU', :TENANT_ID, -1, '2024-08-16 08:31:04');
INSERT INTO `auth_policy_func` (`id`, `policy_id`, `app_id`, `func_id`, `func_type`, `tenant_id`, `created_by`, `created_date`) VALUES (239132446770074053, 129001, 100010, 1000101502001, 'MENU', :TENANT_ID, -1, '2024-08-16 08:31:04');
INSERT INTO `auth_policy_func` (`id`, `policy_id`, `app_id`, `func_id`, `func_type`, `tenant_id`, `created_by`, `created_date`) VALUES (239132446770074054, 129001, 100010, 1000101506001, 'MENU', :TENANT_ID, -1, '2024-08-16 08:31:04');
INSERT INTO `auth_policy_func` (`id`, `policy_id`, `app_id`, `func_id`, `func_type`, `tenant_id`, `created_by`, `created_date`) VALUES (239132446770074055, 129001, 100010, 1000101510001, 'MENU', :TENANT_ID, -1, '2024-08-16 08:31:04');
INSERT INTO `auth_policy_func` (`id`, `policy_id`, `app_id`, `func_id`, `func_type`, `tenant_id`, `created_by`, `created_date`) VALUES (239132446770074057, 129001, 100010, 1000101509001, 'MENU', :TENANT_ID, -1, '2024-08-16 08:31:04');
INSERT INTO `auth_policy_func` (`id`, `policy_id`, `app_id`, `func_id`, `func_type`, `tenant_id`, `created_by`, `created_date`) VALUES (239132446770074058, 129001, 100010, 1000101501001, 'MENU', :TENANT_ID, -1, '2024-08-16 08:31:04');
INSERT INTO `auth_policy_func` (`id`, `policy_id`, `app_id`, `func_id`, `func_type`, `tenant_id`, `created_by`, `created_date`) VALUES (239132446770074059, 129001, 100010, 1000101501000, 'MENU', :TENANT_ID, -1, '2024-08-16 08:31:04');
INSERT INTO `auth_policy_func` (`id`, `policy_id`, `app_id`, `func_id`, `func_type`, `tenant_id`, `created_by`, `created_date`) VALUES (239132446770074060, 129001, 100010, 1000101517001, 'MENU', :TENANT_ID, -1, '2024-08-16 08:31:04');
INSERT INTO `auth_policy_func` (`id`, `policy_id`, `app_id`, `func_id`, `func_type`, `tenant_id`, `created_by`, `created_date`) VALUES (239132446770074061, 129001, 100010, 1000101504001, 'MENU', :TENANT_ID, -1, '2024-08-16 08:31:04');
INSERT INTO `auth_policy_func` (`id`, `policy_id`, `app_id`, `func_id`, `func_type`, `tenant_id`, `created_by`, `created_date`) VALUES (239132446770074062, 129001, 100010, 1000101508001, 'MENU', :TENANT_ID, -1, '2024-08-16 08:31:04');
INSERT INTO `auth_policy_func` (`id`, `policy_id`, `app_id`, `func_id`, `func_type`, `tenant_id`, `created_by`, `created_date`) VALUES (239132446770074063, 129001, 100010, 1000101516001, 'MENU', :TENANT_ID, -1, '2024-08-16 08:31:04');
INSERT INTO `auth_policy_func` (`id`, `policy_id`, `app_id`, `func_id`, `func_type`, `tenant_id`, `created_by`, `created_date`) VALUES (239132446770074180, 129003, 100010, 1000101501001, 'MENU', :TENANT_ID, -1, '2024-08-16 08:35:19');
INSERT INTO `auth_policy_func` (`id`, `policy_id`, `app_id`, `func_id`, `func_type`, `tenant_id`, `created_by`, `created_date`) VALUES (239132446770074181, 129003, 100010, 1000101501000, 'MENU', :TENANT_ID, -1, '2024-08-16 08:35:19');
INSERT INTO `auth_policy_func` (`id`, `policy_id`, `app_id`, `func_id`, `func_type`, `tenant_id`, `created_by`, `created_date`) VALUES (239132446770074182, 129002, 100010, 1000101501001, 'MENU', :TENANT_ID, -1, '2024-08-16 08:35:32');
INSERT INTO `auth_policy_func` (`id`, `policy_id`, `app_id`, `func_id`, `func_type`, `tenant_id`, `created_by`, `created_date`) VALUES (239132446770074183, 129002, 100010, 1000101503001, 'MENU', :TENANT_ID, -1, '2024-08-16 08:35:32');
INSERT INTO `auth_policy_func` (`id`, `policy_id`, `app_id`, `func_id`, `func_type`, `tenant_id`, `created_by`, `created_date`) VALUES (239132446770074184, 129002, 100010, 1000101507001, 'MENU', :TENANT_ID, -1, '2024-08-16 08:35:32');
INSERT INTO `auth_policy_func` (`id`, `policy_id`, `app_id`, `func_id`, `func_type`, `tenant_id`, `created_by`, `created_date`) VALUES (239132446770074186, 129002, 100010, 1000101509001, 'MENU', :TENANT_ID, -1, '2024-08-16 08:35:32');
INSERT INTO `auth_policy_func` (`id`, `policy_id`, `app_id`, `func_id`, `func_type`, `tenant_id`, `created_by`, `created_date`) VALUES (239132446770074187, 129002, 100010, 1000101501000, 'MENU', :TENANT_ID, -1, '2024-08-16 08:35:32');
INSERT INTO `auth_policy_func` (`id`, `policy_id`, `app_id`, `func_id`, `func_type`, `tenant_id`, `created_by`, `created_date`) VALUES (239132446770074188, 129002, 100010, 1000101504001, 'MENU', :TENANT_ID, -1, '2024-08-16 08:35:32');
INSERT INTO `auth_policy_func` (`id`, `policy_id`, `app_id`, `func_id`, `func_type`, `tenant_id`, `created_by`, `created_date`) VALUES (239132446770074189, 129002, 100010, 1000101502001, 'MENU', :TENANT_ID, -1, '2024-08-16 08:35:32');
INSERT INTO `auth_policy_func` (`id`, `policy_id`, `app_id`, `func_id`, `func_type`, `tenant_id`, `created_by`, `created_date`) VALUES (239132446770074190, 129002, 100010, 1000101506001, 'MENU', :TENANT_ID, -1, '2024-08-16 08:35:32');
INSERT INTO `auth_policy_func` (`id`, `policy_id`, `app_id`, `func_id`, `func_type`, `tenant_id`, `created_by`, `created_date`) VALUES (239132446770074191, 129002, 100010, 1000101508001, 'MENU', :TENANT_ID, -1, '2024-08-16 08:35:32');
INSERT INTO `auth_policy_func` (`id`, `policy_id`, `app_id`, `func_id`, `func_type`, `tenant_id`, `created_by`, `created_date`) VALUES (239132446770074192, 129002, 100010, 1000101510001, 'MENU', :TENANT_ID, -1, '2024-08-16 08:35:32');
INSERT INTO `auth_policy_func` (`id`, `policy_id`, `app_id`, `func_id`, `func_type`, `tenant_id`, `created_by`, `created_date`) VALUES (239132446770074193, 129002, 100010, 1000101516001, 'MENU', :TENANT_ID, -1, '2024-08-16 08:35:32');
INSERT INTO `auth_policy_func` (`id`, `policy_id`, `app_id`, `func_id`, `func_type`, `tenant_id`, `created_by`, `created_date`) VALUES (239132446770076172, 129001, 100010, 1000101512001, 'MENU', :TENANT_ID, -1, '2024-08-16 08:34:14');
INSERT INTO `auth_policy_func` (`id`, `policy_id`, `app_id`, `func_id`, `func_type`, `tenant_id`, `created_by`, `created_date`) VALUES (239132446770076178, 129003, 100010, 1000101512001, 'MENU', :TENANT_ID, -1, '2024-08-16 08:35:03');
INSERT INTO `auth_policy_func` (`id`, `policy_id`, `app_id`, `func_id`, `func_type`, `tenant_id`, `created_by`, `created_date`) VALUES (239132446770076235, 129002, 100010, 1000101512001, 'MENU', :TENANT_ID, -1, '2024-08-16 08:37:38');
INSERT INTO `auth_policy_func` (`id`, `policy_id`, `app_id`, `func_id`, `func_type`, `tenant_id`, `created_by`, `created_date`) VALUES (239132446770076165, 129001, 100010, 1000101513001, 'MENU', :TENANT_ID, -1, '2024-08-16 08:34:14');
INSERT INTO `auth_policy_func` (`id`, `policy_id`, `app_id`, `func_id`, `func_type`, `tenant_id`, `created_by`, `created_date`) VALUES (239132446770076175, 129003, 100010, 1000101513001, 'MENU', :TENANT_ID, -1, '2024-08-16 08:35:03');
INSERT INTO `auth_policy_func` (`id`, `policy_id`, `app_id`, `func_id`, `func_type`, `tenant_id`, `created_by`, `created_date`) VALUES (239132446770076230, 129002, 100010, 1000101513001, 'MENU', :TENANT_ID, -1, '2024-08-16 08:37:38');
INSERT INTO `auth_policy_func` (`id`, `policy_id`, `app_id`, `func_id`, `func_type`, `tenant_id`, `created_by`, `created_date`) VALUES (239132446770076157, 129001, 100010, 1000101515001, 'MENU', :TENANT_ID, -1, '2024-08-16 08:34:14');
INSERT INTO `auth_policy_func` (`id`, `policy_id`, `app_id`, `func_id`, `func_type`, `tenant_id`, `created_by`, `created_date`) VALUES (239132446770076176, 129003, 100010, 1000101515001, 'MENU', :TENANT_ID, -1, '2024-08-16 08:35:03');
INSERT INTO `auth_policy_func` (`id`, `policy_id`, `app_id`, `func_id`, `func_type`, `tenant_id`, `created_by`, `created_date`) VALUES (239132446770076221, 129002, 100010, 1000101515001, 'MENU', :TENANT_ID, -1, '2024-08-16 08:37:38');

-- Clear dirty data
DELETE FROM auth_policy_func WHERE func_id NOT IN (SELECT id FROM app_func);
DELETE FROM auth_policy_func WHERE policy_id NOT IN (SELECT id FROM auth_policy);

-- ----------------------------
-- Table data for auth_policy_org
-- ----------------------------
DELETE FROM `auth_policy_org` WHERE app_id = 100010;
INSERT INTO `auth_policy_org` (`id`, `policy_id`, `policy_type`, `org_id`, `org_type`, `grant_scope`, `open_auth`, `app_id`, `tenant_id`, `default0`, `created_by`, `created_date`) VALUES (219427254927626047, 129001, 'PRE_DEFINED', :TENANT_ID, 'TENANT', 'TENANT_SYS_ADMIN', 1, 100010, :TENANT_ID, 0, -1, '2024-03-31 23:51:12');
INSERT INTO `auth_policy_org` (`id`, `policy_id`, `policy_type`, `org_id`, `org_type`, `grant_scope`, `open_auth`, `app_id`, `tenant_id`, `default0`, `created_by`, `created_date`) VALUES (219427254927626048, 129002, 'PRE_DEFINED', :TENANT_ID, 'TENANT', 'TENANT_ALL_USER', 0, 100010, :TENANT_ID, 1, -1, '2024-03-31 23:51:12');

-- @formatter:on
