-- @formatter:off
-- ----------------------------
-- Table data for app
-- ----------------------------
-- Note: After installation, it is necessary to modify the application URL.
DELETE FROM `app` WHERE id = 100009;
INSERT INTO `app` (`id`, `code`, `name`, `show_name`, `icon`, `type`, `edition_type`, `description`, `auth_ctrl`, `enabled`, `url`, `sequence`, `api_ids`, `version`, `open_stage`, `client_id`, `tenant_id`, `created_by`, `created_date`, `last_modified_by`, `last_modified_date`) VALUES (100009, 'AngusAI', 'AngusAI', 'AngusAI', '', 'CLOUD_APP', 'DATACENTER', 'AngusTester数据中心版', 1, 1, 'http://localhost:2530', 7, '[]', '1.0.0', 'SIGNUP', 'xcan_tp', :TENANT_ID, -1, '2024-01-01 00:00:00', -1, '2024-01-01 00:00:00');
UPDATE `app` SET `created_date` = now(), `last_modified_date` = now();

-- ----------------------------
-- Table data for app_func
-- ----------------------------
DELETE FROM `app_func` WHERE app_id = 100009;
INSERT INTO `app_func` (`id`, `code`, `name`, `show_name`, `pid`, `icon`, `type`, `description`, `auth_ctrl`, `enabled`, `url`, `app_id`, `sequence`, `api_ids`, `client_id`, `tenant_id`, `created_by`, `created_date`, `last_modified_by`, `last_modified_date`) VALUES (1000091502001, 'Apis', '接口', '接口', -1, '', 'MENU', '', 1, 1, '/apis', 100009, 3, '[]', 'xcan_tp', :TENANT_ID, -1, '2024-01-02 11:22:22', -1, '2024-01-02 11:22:22');
INSERT INTO `app_func` (`id`, `code`, `name`, `show_name`, `pid`, `icon`, `type`, `description`, `auth_ctrl`, `enabled`, `url`, `app_id`, `sequence`, `api_ids`, `client_id`, `tenant_id`, `created_by`, `created_date`, `last_modified_by`, `last_modified_date`) VALUES (1000091517001, 'Config', '配置', '配置', -1, '', 'MENU', '', 1, 1, '/config', 100009, 15, '[]', 'xcan_tp', :TENANT_ID, -1, '2024-01-02 11:22:22', -1, '2024-03-01 20:33:50');
INSERT INTO `app_func` (`id`, `code`, `name`, `show_name`, `pid`, `icon`, `type`, `description`, `auth_ctrl`, `enabled`, `url`, `app_id`, `sequence`, `api_ids`, `client_id`, `tenant_id`, `created_by`, `created_date`, `last_modified_by`, `last_modified_date`) VALUES (1000091506001, 'Data', '数据', '数据', -1, '', 'MENU', '', 1, 1, '/data', 100009, 10, '[]', 'xcan_tp', :TENANT_ID, -1, '2024-01-02 11:22:22', -1, '2024-03-28 16:16:50');
INSERT INTO `app_func` (`id`, `code`, `name`, `show_name`, `pid`, `icon`, `type`, `description`, `auth_ctrl`, `enabled`, `url`, `app_id`, `sequence`, `api_ids`, `client_id`, `tenant_id`, `created_by`, `created_date`, `last_modified_by`, `last_modified_date`) VALUES (1000091508001, 'Execution', '执行', '执行', -1, '', 'MENU', '', 1, 1, '/execution', 100009, 7, '[]', 'xcan_tp', :TENANT_ID, -1, '2024-01-02 11:22:22', -1, '2024-03-28 16:16:22');
INSERT INTO `app_func` (`id`, `code`, `name`, `show_name`, `pid`, `icon`, `type`, `description`, `auth_ctrl`, `enabled`, `url`, `app_id`, `sequence`, `api_ids`, `client_id`, `tenant_id`, `created_by`, `created_date`, `last_modified_by`, `last_modified_date`) VALUES (1000091516001, 'FunctionTesting', '功能测试', '功能', -1, '', 'MENU', '', 1, 1, '/cases', 100009, 4, '[]', 'xcan_tp', :TENANT_ID, -1, '2024-01-02 11:22:22', -1, '2024-03-01 20:33:50');
INSERT INTO `app_func` (`id`, `code`, `name`, `show_name`, `pid`, `icon`, `type`, `description`, `auth_ctrl`, `enabled`, `url`, `app_id`, `sequence`, `api_ids`, `client_id`, `tenant_id`, `created_by`, `created_date`, `last_modified_by`, `last_modified_date`) VALUES (1000091501000, 'Kanban', '看板', '看板', -1, '', 'MENU', '', 1, 1, '/kanban', 100009, 2, '[]', 'xcan_tp', :TENANT_ID, -1, '2024-01-02 11:22:22', -1, '2024-07-31 15:11:28');
INSERT INTO `app_func` (`id`, `code`, `name`, `show_name`, `pid`, `icon`, `type`, `description`, `auth_ctrl`, `enabled`, `url`, `app_id`, `sequence`, `api_ids`, `client_id`, `tenant_id`, `created_by`, `created_date`, `last_modified_by`, `last_modified_date`) VALUES (1000091501001, 'Projects', '项目', '项目', -1, 'icon-shenheshibai', 'MENU', '', 1, 1, '/project', 100009, 1, '[]', 'xcan_tp', :TENANT_ID, -1, '2024-06-04 18:49:18', -1, '2024-08-16 08:08:15');
INSERT INTO `app_func` (`id`, `code`, `name`, `show_name`, `pid`, `icon`, `type`, `description`, `auth_ctrl`, `enabled`, `url`, `app_id`, `sequence`, `api_ids`, `client_id`, `tenant_id`, `created_by`, `created_date`, `last_modified_by`, `last_modified_date`) VALUES (1000091510001, 'Report', '报告', '报告', -1, '', 'MENU', '', 1, 1, '/report', 100009, 15, '[]', 'xcan_tp', :TENANT_ID, -1, '2024-01-02 11:22:22', -1, '2024-07-31 14:12:40');
INSERT INTO `app_func` (`id`, `code`, `name`, `show_name`, `pid`, `icon`, `type`, `description`, `auth_ctrl`, `enabled`, `url`, `app_id`, `sequence`, `api_ids`, `client_id`, `tenant_id`, `created_by`, `created_date`, `last_modified_by`, `last_modified_date`) VALUES (1000091503001, 'Scenario', '场景', '场景', -1, '', 'MENU', '', 1, 1, '/scenario', 100009, 5, '[]', 'xcan_tp', :TENANT_ID, -1, '2024-01-02 11:22:22', -1, '2024-03-28 16:15:34');
INSERT INTO `app_func` (`id`, `code`, `name`, `show_name`, `pid`, `icon`, `type`, `description`, `auth_ctrl`, `enabled`, `url`, `app_id`, `sequence`, `api_ids`, `client_id`, `tenant_id`, `created_by`, `created_date`, `last_modified_by`, `last_modified_date`) VALUES (1000091507001, 'Script', '脚本', '脚本', -1, '', 'MENU', '', 1, 1, '/script', 100009, 6, '[]', 'xcan_tp', :TENANT_ID, -1, '2024-01-02 11:22:22', -1, '2024-03-28 16:15:48');
INSERT INTO `app_func` (`id`, `code`, `name`, `show_name`, `pid`, `icon`, `type`, `description`, `auth_ctrl`, `enabled`, `url`, `app_id`, `sequence`, `api_ids`, `client_id`, `tenant_id`, `created_by`, `created_date`, `last_modified_by`, `last_modified_date`) VALUES (1000091504001, 'Task', '任务', '任务', -1, '', 'MENU', '', 1, 1, '/task', 100009, 8, '[]', 'xcan_tp', :TENANT_ID, -1, '2024-01-02 11:22:22', -1, '2024-03-28 16:16:30');
INSERT INTO `app_func` (`id`, `code`, `name`, `show_name`, `pid`, `icon`, `type`, `description`, `auth_ctrl`, `enabled`, `url`, `app_id`, `sequence`, `api_ids`, `client_id`, `tenant_id`, `created_by`, `created_date`, `last_modified_by`, `last_modified_date`) VALUES (1000091515001, 'OfficialWebsite', '官网', '官网', -1, '', 'MENU', '', 1, 1, 'https://www.xcan.cloud', 100009, 17, '[]', 'xcan_tp', :TENANT_ID, -1, '2024-01-02 11:22:22', -1, '2024-04-03 17:55:24');
INSERT INTO `app_func` (`id`, `code`, `name`, `show_name`, `pid`, `icon`, `type`, `description`, `auth_ctrl`, `enabled`, `url`, `app_id`, `sequence`, `api_ids`, `client_id`, `tenant_id`, `created_by`, `created_date`, `last_modified_by`, `last_modified_date`) VALUES (1000091512001, 'GlobalSearch', '搜索框', '搜索框', -1, '', 'MENU', '', 1, 1, '/', 100009, 14, '[]', 'xcan_tp', :TENANT_ID, -1, '2024-01-02 11:22:22', -1, '2024-01-02 11:22:22');
INSERT INTO `app_func` (`id`, `code`, `name`, `show_name`, `pid`, `icon`, `type`, `description`, `auth_ctrl`, `enabled`, `url`, `app_id`, `sequence`, `api_ids`, `client_id`, `tenant_id`, `created_by`, `created_date`, `last_modified_by`, `last_modified_date`) VALUES (1000091513001, 'WorkOrder', '工单', '工单', -1, '', 'MENU', '', 1, 1, 'https://wo.xcan.cloud/workorders', 100009, 15, '[]', 'xcan_tp', :TENANT_ID, -1, '2024-01-02 11:22:22', -1, '2024-04-03 17:54:51');
UPDATE `app_func` SET `created_date` = now(), `last_modified_date` = now();

-- ----------------------------
-- Table data for web_tag
-- ----------------------------
-- Do in AngusGM

-- ----------------------------
-- Table data for web_tag_target
-- ----------------------------
-- Func Tag
DELETE FROM `web_tag_target` WHERE target_id IN (SELECT id FROM `app_func` WHERE app_id = 100009);
INSERT INTO `web_tag_target` (`id`, `tag_id`, `target_type`, `target_id`, `tenant_id`, `created_by`, `created_date`) VALUES (215509679965473281, 1, 'MENU', 1000091502001, :TENANT_ID,  -1, '2024-03-27 09:52:01');
INSERT INTO `web_tag_target` (`id`, `tag_id`, `target_type`, `target_id`, `tenant_id`, `created_by`, `created_date`) VALUES (215509679965473282, 5, 'MENU', 1000091502001, :TENANT_ID,  -1, '2024-03-27 09:52:01');
INSERT INTO `web_tag_target` (`id`, `tag_id`, `target_type`, `target_id`, `tenant_id`, `created_by`, `created_date`) VALUES (239132446770074258, 1, 'MENU', 1000091517001, :TENANT_ID,  -1, '2024-08-16 08:41:42');
INSERT INTO `web_tag_target` (`id`, `tag_id`, `target_type`, `target_id`, `tenant_id`, `created_by`, `created_date`) VALUES (239132446770074259, 5, 'MENU', 1000091517001, :TENANT_ID,  -1, '2024-08-16 08:41:42');
INSERT INTO `web_tag_target` (`id`, `tag_id`, `target_type`, `target_id`, `tenant_id`, `created_by`, `created_date`) VALUES (219427254927623217, 1, 'MENU', 1000091506001, :TENANT_ID,  -1, '2024-03-28 16:16:50');
INSERT INTO `web_tag_target` (`id`, `tag_id`, `target_type`, `target_id`, `tenant_id`, `created_by`, `created_date`) VALUES (219427254927623218, 5, 'MENU', 1000091506001, :TENANT_ID,  -1, '2024-03-28 16:16:50');
INSERT INTO `web_tag_target` (`id`, `tag_id`, `target_type`, `target_id`, `tenant_id`, `created_by`, `created_date`) VALUES (219427254927623215, 1, 'MENU', 1000091508001, :TENANT_ID,  -1, '2024-03-28 16:16:22');
INSERT INTO `web_tag_target` (`id`, `tag_id`, `target_type`, `target_id`, `tenant_id`, `created_by`, `created_date`) VALUES (219427254927623216, 5, 'MENU', 1000091508001, :TENANT_ID,  -1, '2024-03-28 16:16:22');
INSERT INTO `web_tag_target` (`id`, `tag_id`, `target_type`, `target_id`, `tenant_id`, `created_by`, `created_date`) VALUES (219427360154321558, 1, 'MENU', 1000091516001, :TENANT_ID,  -1, '2024-03-28 16:15:25');
INSERT INTO `web_tag_target` (`id`, `tag_id`, `target_type`, `target_id`, `tenant_id`, `created_by`, `created_date`) VALUES (219427360154321559, 5, 'MENU', 1000091516001, :TENANT_ID,  -1, '2024-03-28 16:15:25');
INSERT INTO `web_tag_target` (`id`, `tag_id`, `target_type`, `target_id`, `tenant_id`, `created_by`, `created_date`) VALUES (239132446770069608, 1, 'MENU', 1000091501000, :TENANT_ID,  -1, '2024-07-31 15:17:35');
INSERT INTO `web_tag_target` (`id`, `tag_id`, `target_type`, `target_id`, `tenant_id`, `created_by`, `created_date`) VALUES (239132446770069609, 5, 'MENU', 1000091501000, :TENANT_ID,  -1, '2024-07-31 15:17:35');
INSERT INTO `web_tag_target` (`id`, `tag_id`, `target_type`, `target_id`, `tenant_id`, `created_by`, `created_date`) VALUES (239132446770074003, 1, 'MENU', 1000091501001, :TENANT_ID,  -1, '2024-08-16 08:08:15');
INSERT INTO `web_tag_target` (`id`, `tag_id`, `target_type`, `target_id`, `tenant_id`, `created_by`, `created_date`) VALUES (239132446770074004, 5, 'MENU', 1000091501001, :TENANT_ID,  -1, '2024-08-16 08:08:15');
INSERT INTO `web_tag_target` (`id`, `tag_id`, `target_type`, `target_id`, `tenant_id`, `created_by`, `created_date`) VALUES (239132446770074005, 9, 'MENU', 1000091501001, :TENANT_ID,  -1, '2024-08-16 08:08:15');
INSERT INTO `web_tag_target` (`id`, `tag_id`, `target_type`, `target_id`, `tenant_id`, `created_by`, `created_date`) VALUES (239132446770069610, 1, 'MENU', 1000091510001, :TENANT_ID,  -1, '2024-07-31 15:17:47');
INSERT INTO `web_tag_target` (`id`, `tag_id`, `target_type`, `target_id`, `tenant_id`, `created_by`, `created_date`) VALUES (239132446770069611, 5, 'MENU', 1000091510001, :TENANT_ID,  -1, '2024-07-31 15:17:47');
INSERT INTO `web_tag_target` (`id`, `tag_id`, `target_type`, `target_id`, `tenant_id`, `created_by`, `created_date`) VALUES (219427360154321560, 1, 'MENU', 1000091503001, :TENANT_ID,  -1, '2024-03-28 16:15:34');
INSERT INTO `web_tag_target` (`id`, `tag_id`, `target_type`, `target_id`, `tenant_id`, `created_by`, `created_date`) VALUES (219427360154321561, 5, 'MENU', 1000091503001, :TENANT_ID,  -1, '2024-03-28 16:15:34');
INSERT INTO `web_tag_target` (`id`, `tag_id`, `target_type`, `target_id`, `tenant_id`, `created_by`, `created_date`) VALUES (219427254927623213, 1, 'MENU', 1000091507001, :TENANT_ID,  -1, '2024-03-28 16:15:48');
INSERT INTO `web_tag_target` (`id`, `tag_id`, `target_type`, `target_id`, `tenant_id`, `created_by`, `created_date`) VALUES (219427254927623214, 5, 'MENU', 1000091507001, :TENANT_ID,  -1, '2024-03-28 16:15:48');
INSERT INTO `web_tag_target` (`id`, `tag_id`, `target_type`, `target_id`, `tenant_id`, `created_by`, `created_date`) VALUES (219427360154321562, 1, 'MENU', 1000091504001, :TENANT_ID,  -1, '2024-03-28 16:16:30');
INSERT INTO `web_tag_target` (`id`, `tag_id`, `target_type`, `target_id`, `tenant_id`, `created_by`, `created_date`) VALUES (219427360154321563, 5, 'MENU', 1000091504001, :TENANT_ID,  -1, '2024-03-28 16:16:30');
INSERT INTO `web_tag_target` (`id`, `tag_id`, `target_type`, `target_id`, `tenant_id`, `created_by`, `created_date`) VALUES (155580502340798160, 2, 'MENU', 1000091512001, :TENANT_ID,  -1, '2024-01-02 11:28:02');
INSERT INTO `web_tag_target` (`id`, `tag_id`, `target_type`, `target_id`, `tenant_id`, `created_by`, `created_date`) VALUES (155580502340798161, 5, 'MENU', 1000091512001, :TENANT_ID,  -1, '2024-01-02 11:28:02');
INSERT INTO `web_tag_target` (`id`, `tag_id`, `target_type`, `target_id`, `tenant_id`, `created_by`, `created_date`) VALUES (155580502340798162, 2, 'MENU', 1000091513001, :TENANT_ID,  -1, '2024-04-03 17:54:51');
INSERT INTO `web_tag_target` (`id`, `tag_id`, `target_type`, `target_id`, `tenant_id`, `created_by`, `created_date`) VALUES (155580502340798163, 5, 'MENU', 1000091513001, :TENANT_ID,  -1, '2024-04-03 17:54:51');
INSERT INTO `web_tag_target` (`id`, `tag_id`, `target_type`, `target_id`, `tenant_id`, `created_by`, `created_date`) VALUES (155580502340798164, 2, 'MENU', 1000091515001, :TENANT_ID,  -1, '2024-04-03 17:55:24');
INSERT INTO `web_tag_target` (`id`, `tag_id`, `target_type`, `target_id`, `tenant_id`, `created_by`, `created_date`) VALUES (155580502340798165, 5, 'MENU', 1000091515001, :TENANT_ID,  -1, '2024-04-03 17:55:24');

-- App Tag
DELETE FROM `web_tag_target` WHERE target_id = 100009;
INSERT INTO `web_tag_target` (`id`, `tag_id`, `target_type`, `target_id`, `tenant_id`, `created_by`, `created_date`) VALUES (219259085483148299, 7, 'APP', 100009, :TENANT_ID, -1, '2024-03-29 17:19:17');

-- Clear dirty data
DELETE FROM web_tag_target WHERE tag_id NOT IN (SELECT id FROM web_tag);

-- ----------------------------
-- Table data for app_open -> Do by code
-- ----------------------------
-- INSERT INTO `app_open` (`id`, `app_id`, `app_code`, `app_type`, `edition_type`, `version`, `client_id`, `tenant_id`, `user_id`, `open_date`, `expiration_date`, `expiration_deleted`, `op_client_open`, `created_date`) VALUES (2, 100009, 'AngusAI', 'CLOUD_APP', 'DATACENTER', '1.0.0', 'xcan_tp', :TENANT_ID, -1, ':appOpenDate', ':appExpirationDate', 0, 0, '2024-01-01 00:00:00');

-- ----------------------------
-- Table data for auth_policy
-- ----------------------------
DELETE FROM `auth_policy` WHERE app_id = 100009;
INSERT INTO `auth_policy` (`id`, `name`, `code`, `enabled`, `type`, `default0`, `grant_stage`, `description`, `app_id`, `client_id`, `tenant_id`, `created_by`, `created_date`, `last_modified_by`, `last_modified_date`) VALUES (127001, '应用管理员', 'ANGUSTESTER_ADMIN', 1, 'PRE_DEFINED', 1, 'SIGNUP_SUCCESS', '拥有“AngusAI”应用所有功能和“应用设置”权限。', 100009, 'xcan_tp', :TENANT_ID, -1, '2024-01-01 00:00:00', -1, '2024-01-01 00:00:00');
INSERT INTO `auth_policy` (`id`, `name`, `code`, `enabled`, `type`, `default0`, `grant_stage`, `description`, `app_id`, `client_id`, `tenant_id`, `created_by`, `created_date`, `last_modified_by`, `last_modified_date`) VALUES (127002, '一般用户', 'ANGUSTESTER_USER', 1, 'PRE_DEFINED', 1, 'SIGNUP_SUCCESS', '拥有“AngusAI”应用所有功能权限，无“应用设置”权限。', 100009, 'xcan_tp', :TENANT_ID, -1, '2024-01-01 00:00:00', -1, '2024-01-01 00:00:00');
INSERT INTO `auth_policy` (`id`, `name`, `code`, `enabled`, `type`, `default0`, `grant_stage`, `description`, `app_id`, `client_id`, `tenant_id`, `created_by`, `created_date`, `last_modified_by`, `last_modified_date`) VALUES (127003, '访客', 'ANGUSTESTER_GUEST', 1, 'PRE_DEFINED', 1, 'SIGNUP_SUCCESS', '拥有“AngusAI”应用功能查看权限，无“应用设置”权限。', 100009, 'xcan_tp', :TENANT_ID, -1, '2024-01-01 00:00:00', -1, '2024-01-01 00:00:00');
UPDATE `auth_policy` SET `created_date` = now(), `last_modified_date` = now();

-- ----------------------------
-- Table data for auth_policy_func
-- ----------------------------
DELETE FROM `auth_policy_func` WHERE app_id = 100009;
INSERT INTO `auth_policy_func` (`id`, `policy_id`, `app_id`, `func_id`, `func_type`, `tenant_id`, `created_by`, `created_date`) VALUES (239132446770074194, 127003, 100009, 1000091501001, 'MENU', :TENANT_ID, -1, '2024-08-16 08:36:42');
INSERT INTO `auth_policy_func` (`id`, `policy_id`, `app_id`, `func_id`, `func_type`, `tenant_id`, `created_by`, `created_date`) VALUES (239132446770074195, 127003, 100009, 1000091501000, 'MENU', :TENANT_ID, -1, '2024-08-16 08:36:42');
INSERT INTO `auth_policy_func` (`id`, `policy_id`, `app_id`, `func_id`, `func_type`, `tenant_id`, `created_by`, `created_date`) VALUES (239132446770074196, 127002, 100009, 1000091516001, 'MENU', :TENANT_ID, -1, '2024-08-16 08:37:02');
INSERT INTO `auth_policy_func` (`id`, `policy_id`, `app_id`, `func_id`, `func_type`, `tenant_id`, `created_by`, `created_date`) VALUES (239132446770074197, 127002, 100009, 1000091508001, 'MENU', :TENANT_ID, -1, '2024-08-16 08:37:02');
INSERT INTO `auth_policy_func` (`id`, `policy_id`, `app_id`, `func_id`, `func_type`, `tenant_id`, `created_by`, `created_date`) VALUES (239132446770074198, 127002, 100009, 1000091504001, 'MENU', :TENANT_ID, -1, '2024-08-16 08:37:02');
INSERT INTO `auth_policy_func` (`id`, `policy_id`, `app_id`, `func_id`, `func_type`, `tenant_id`, `created_by`, `created_date`) VALUES (239132446770074199, 127002, 100009, 1000091506001, 'MENU', :TENANT_ID, -1, '2024-08-16 08:37:02');
INSERT INTO `auth_policy_func` (`id`, `policy_id`, `app_id`, `func_id`, `func_type`, `tenant_id`, `created_by`, `created_date`) VALUES (239132446770074200, 127002, 100009, 1000091510001, 'MENU', :TENANT_ID, -1, '2024-08-16 08:37:02');
INSERT INTO `auth_policy_func` (`id`, `policy_id`, `app_id`, `func_id`, `func_type`, `tenant_id`, `created_by`, `created_date`) VALUES (239132446770074201, 127002, 100009, 1000091502001, 'MENU', :TENANT_ID, -1, '2024-08-16 08:37:02');
INSERT INTO `auth_policy_func` (`id`, `policy_id`, `app_id`, `func_id`, `func_type`, `tenant_id`, `created_by`, `created_date`) VALUES (239132446770074202, 127002, 100009, 1000091501001, 'MENU', :TENANT_ID, -1, '2024-08-16 08:37:02');
INSERT INTO `auth_policy_func` (`id`, `policy_id`, `app_id`, `func_id`, `func_type`, `tenant_id`, `created_by`, `created_date`) VALUES (239132446770074203, 127002, 100009, 1000091503001, 'MENU', :TENANT_ID, -1, '2024-08-16 08:37:02');
INSERT INTO `auth_policy_func` (`id`, `policy_id`, `app_id`, `func_id`, `func_type`, `tenant_id`, `created_by`, `created_date`) VALUES (239132446770074204, 127002, 100009, 1000091507001, 'MENU', :TENANT_ID, -1, '2024-08-16 08:37:02');
INSERT INTO `auth_policy_func` (`id`, `policy_id`, `app_id`, `func_id`, `func_type`, `tenant_id`, `created_by`, `created_date`) VALUES (239132446770074206, 127002, 100009, 1000091509001, 'MENU', :TENANT_ID, -1, '2024-08-16 08:37:02');
INSERT INTO `auth_policy_func` (`id`, `policy_id`, `app_id`, `func_id`, `func_type`, `tenant_id`, `created_by`, `created_date`) VALUES (239132446770074207, 127002, 100009, 1000091501000, 'MENU', :TENANT_ID, -1, '2024-08-16 08:37:02');
INSERT INTO `auth_policy_func` (`id`, `policy_id`, `app_id`, `func_id`, `func_type`, `tenant_id`, `created_by`, `created_date`) VALUES (239132446770074208, 127001, 100009, 1000091502001, 'MENU', :TENANT_ID, -1, '2024-08-16 08:37:17');
INSERT INTO `auth_policy_func` (`id`, `policy_id`, `app_id`, `func_id`, `func_type`, `tenant_id`, `created_by`, `created_date`) VALUES (239132446770074209, 127001, 100009, 1000091506001, 'MENU', :TENANT_ID, -1, '2024-08-16 08:37:17');
INSERT INTO `auth_policy_func` (`id`, `policy_id`, `app_id`, `func_id`, `func_type`, `tenant_id`, `created_by`, `created_date`) VALUES (239132446770074210, 127001, 100009, 1000091510001, 'MENU', :TENANT_ID, -1, '2024-08-16 08:37:17');
INSERT INTO `auth_policy_func` (`id`, `policy_id`, `app_id`, `func_id`, `func_type`, `tenant_id`, `created_by`, `created_date`) VALUES (239132446770074211, 127001, 100009, 1000091503001, 'MENU', :TENANT_ID, -1, '2024-08-16 08:37:17');
INSERT INTO `auth_policy_func` (`id`, `policy_id`, `app_id`, `func_id`, `func_type`, `tenant_id`, `created_by`, `created_date`) VALUES (239132446770074212, 127001, 100009, 1000091507001, 'MENU', :TENANT_ID, -1, '2024-08-16 08:37:17');
INSERT INTO `auth_policy_func` (`id`, `policy_id`, `app_id`, `func_id`, `func_type`, `tenant_id`, `created_by`, `created_date`) VALUES (239132446770074213, 127001, 100009, 1000091516001, 'MENU', :TENANT_ID, -1, '2024-08-16 08:37:17');
INSERT INTO `auth_policy_func` (`id`, `policy_id`, `app_id`, `func_id`, `func_type`, `tenant_id`, `created_by`, `created_date`) VALUES (239132446770074214, 127001, 100009, 1000091508001, 'MENU', :TENANT_ID, -1, '2024-08-16 08:37:17');
INSERT INTO `auth_policy_func` (`id`, `policy_id`, `app_id`, `func_id`, `func_type`, `tenant_id`, `created_by`, `created_date`) VALUES (239132446770074215, 127001, 100009, 1000091504001, 'MENU', :TENANT_ID, -1, '2024-08-16 08:37:17');
INSERT INTO `auth_policy_func` (`id`, `policy_id`, `app_id`, `func_id`, `func_type`, `tenant_id`, `created_by`, `created_date`) VALUES (239132446770074216, 127001, 100009, 1000091501001, 'MENU', :TENANT_ID, -1, '2024-08-16 08:37:17');
INSERT INTO `auth_policy_func` (`id`, `policy_id`, `app_id`, `func_id`, `func_type`, `tenant_id`, `created_by`, `created_date`) VALUES (239132446770074218, 127001, 100009, 1000091509001, 'MENU', :TENANT_ID, -1, '2024-08-16 08:37:17');
INSERT INTO `auth_policy_func` (`id`, `policy_id`, `app_id`, `func_id`, `func_type`, `tenant_id`, `created_by`, `created_date`) VALUES (239132446770074219, 127001, 100009, 1000091517001, 'MENU', :TENANT_ID, -1, '2024-08-16 08:37:17');
INSERT INTO `auth_policy_func` (`id`, `policy_id`, `app_id`, `func_id`, `func_type`, `tenant_id`, `created_by`, `created_date`) VALUES (239132446770074220, 127001, 100009, 1000091501000, 'MENU', :TENANT_ID, -1, '2024-08-16 08:37:17');
INSERT INTO `auth_policy_func` (`id`, `policy_id`, `app_id`, `func_id`, `func_type`, `tenant_id`, `created_by`, `created_date`) VALUES (239132446770077172, 132001, 100011, 1000111512001, 'MENU', :TENANT_ID, -1, '2024-08-16 08:34:14');
INSERT INTO `auth_policy_func` (`id`, `policy_id`, `app_id`, `func_id`, `func_type`, `tenant_id`, `created_by`, `created_date`) VALUES (239132446770077178, 132003, 100011, 1000111512001, 'MENU', :TENANT_ID, -1, '2024-08-16 08:35:03');
INSERT INTO `auth_policy_func` (`id`, `policy_id`, `app_id`, `func_id`, `func_type`, `tenant_id`, `created_by`, `created_date`) VALUES (239132446770077235, 132002, 100011, 1000111512001, 'MENU', :TENANT_ID, -1, '2024-08-16 08:37:38');
INSERT INTO `auth_policy_func` (`id`, `policy_id`, `app_id`, `func_id`, `func_type`, `tenant_id`, `created_by`, `created_date`) VALUES (239132446770077165, 132001, 100011, 1000111513001, 'MENU', :TENANT_ID, -1, '2024-08-16 08:34:14');
INSERT INTO `auth_policy_func` (`id`, `policy_id`, `app_id`, `func_id`, `func_type`, `tenant_id`, `created_by`, `created_date`) VALUES (239132446770077175, 132003, 100011, 1000111513001, 'MENU', :TENANT_ID, -1, '2024-08-16 08:35:03');
INSERT INTO `auth_policy_func` (`id`, `policy_id`, `app_id`, `func_id`, `func_type`, `tenant_id`, `created_by`, `created_date`) VALUES (239132446770077230, 132002, 100011, 1000111513001, 'MENU', :TENANT_ID, -1, '2024-08-16 08:37:38');
INSERT INTO `auth_policy_func` (`id`, `policy_id`, `app_id`, `func_id`, `func_type`, `tenant_id`, `created_by`, `created_date`) VALUES (239132446770077157, 132001, 100011, 1000111515001, 'MENU', :TENANT_ID, -1, '2024-08-16 08:34:14');
INSERT INTO `auth_policy_func` (`id`, `policy_id`, `app_id`, `func_id`, `func_type`, `tenant_id`, `created_by`, `created_date`) VALUES (239132446770077176, 132003, 100011, 1000111515001, 'MENU', :TENANT_ID, -1, '2024-08-16 08:35:03');
INSERT INTO `auth_policy_func` (`id`, `policy_id`, `app_id`, `func_id`, `func_type`, `tenant_id`, `created_by`, `created_date`) VALUES (239132446770077221, 132002, 100011, 1000111515001, 'MENU', :TENANT_ID, -1, '2024-08-16 08:37:38');

-- Clear dirty data
DELETE FROM auth_policy_func WHERE func_id NOT IN (SELECT id FROM app_func);
DELETE FROM auth_policy_func WHERE policy_id NOT IN (SELECT id FROM auth_policy);

-- ----------------------------
-- Table data for auth_policy_org
-- ----------------------------

DELETE FROM `auth_policy_org` WHERE app_id = 100009;
INSERT INTO `auth_policy_org` (`id`, `policy_id`, `policy_type`, `org_id`, `org_type`, `grant_scope`, `open_auth`, `app_id`, `tenant_id`, `default0`, `created_by`, `created_date`) VALUES (219427254927626045, 127001, 'PRE_DEFINED', :TENANT_ID, 'TENANT', 'TENANT_SYS_ADMIN', 1, 100009, :TENANT_ID, 0, -1, '2024-03-31 23:51:12');
INSERT INTO `auth_policy_org` (`id`, `policy_id`, `policy_type`, `org_id`, `org_type`, `grant_scope`, `open_auth`, `app_id`, `tenant_id`, `default0`, `created_by`, `created_date`) VALUES (219427254927626046, 127002, 'PRE_DEFINED', :TENANT_ID, 'TENANT', 'TENANT_ALL_USER', 0, 100009, :TENANT_ID, 1, -1, '2024-03-31 23:51:12');

-- @formatter:on
