-- @formatter:off
-- ----------------------------
-- Table data for app
-- ----------------------------
-- Note: After installation, it is necessary to modify the application URL.
DELETE FROM `app` WHERE id = 100011;
INSERT INTO `app` (`id`, `code`, `name`, `show_name`, `icon`, `type`, `edition_type`, `description`, `auth_ctrl`, `enabled`, `url`, `sequence`, `api_ids`, `version`, `open_stage`, `client_id`, `tenant_id`, `created_by`, `created_date`, `last_modified_by`, `last_modified_date`) VALUES (100011, 'AngusAI', 'AngusAI', 'AngusAI', '', 'CLOUD_APP', 'COMMUNITY', 'AngusTester社区版', 1, 1, 'http://localhost:2530', 7, '[]', '1.0.0', 'SIGNUP', 'xcan_tp', :TENANT_ID, -1, '2024-01-01 00:00:00', -1, '2024-01-01 00:00:00');
UPDATE `app` SET `created_date` = now(), `last_modified_date` = now();

-- ----------------------------
-- Table data for app_func
-- ----------------------------
DELETE FROM `app_func` WHERE app_id = 100011;
INSERT INTO `app_func` (`id`, `code`, `name`, `show_name`, `pid`, `icon`, `type`, `description`, `auth_ctrl`, `enabled`, `url`, `app_id`, `sequence`, `api_ids`, `client_id`, `tenant_id`, `created_by`, `created_date`, `last_modified_by`, `last_modified_date`) VALUES (1000111502001, 'Apis', '接口', '接口', -1, '', 'MENU', '', 1, 1, '/apis', 100011, 4, '[]', 'xcan_tp', :TENANT_ID, -1, '2024-01-02 11:22:22', -1, '2024-07-31 14:21:47');
INSERT INTO `app_func` (`id`, `code`, `name`, `show_name`, `pid`, `icon`, `type`, `description`, `auth_ctrl`, `enabled`, `url`, `app_id`, `sequence`, `api_ids`, `client_id`, `tenant_id`, `created_by`, `created_date`, `last_modified_by`, `last_modified_date`) VALUES (1000111517001, 'Config', '配置', '配置', -1, '', 'MENU', '', 1, 1, '/config', 100011, 13, '[]', 'xcan_tp', :TENANT_ID, -1, '2024-01-02 11:22:22', -1, '2024-08-19 14:59:38');
INSERT INTO `app_func` (`id`, `code`, `name`, `show_name`, `pid`, `icon`, `type`, `description`, `auth_ctrl`, `enabled`, `url`, `app_id`, `sequence`, `api_ids`, `client_id`, `tenant_id`, `created_by`, `created_date`, `last_modified_by`, `last_modified_date`) VALUES (1000111506001, 'Data', '数据', '数据', -1, '', 'MENU', '', 1, 1, '/data', 100011, 8, '[]', 'xcan_tp', :TENANT_ID, -1, '2024-01-02 11:22:22', -1, '2024-07-31 14:24:05');
INSERT INTO `app_func` (`id`, `code`, `name`, `show_name`, `pid`, `icon`, `type`, `description`, `auth_ctrl`, `enabled`, `url`, `app_id`, `sequence`, `api_ids`, `client_id`, `tenant_id`, `created_by`, `created_date`, `last_modified_by`, `last_modified_date`) VALUES (1000111508001, 'Execution', '执行', '执行', -1, '', 'MENU', '', 1, 1, '/execution', 100011, 9, '[]', 'xcan_tp', :TENANT_ID, -1, '2024-01-02 11:22:22', -1, '2024-07-31 14:23:56');
INSERT INTO `app_func` (`id`, `code`, `name`, `show_name`, `pid`, `icon`, `type`, `description`, `auth_ctrl`, `enabled`, `url`, `app_id`, `sequence`, `api_ids`, `client_id`, `tenant_id`, `created_by`, `created_date`, `last_modified_by`, `last_modified_date`) VALUES (1000111516001, 'FunctionTesting', '功能测试', '功能', -1, '', 'MENU', '', 1, 1, '/function', 100011, 5, '[]', 'xcan_tp', :TENANT_ID, -1, '2024-01-02 11:22:22', -1, '2024-07-31 14:22:28');
INSERT INTO `app_func` (`id`, `code`, `name`, `show_name`, `pid`, `icon`, `type`, `description`, `auth_ctrl`, `enabled`, `url`, `app_id`, `sequence`, `api_ids`, `client_id`, `tenant_id`, `created_by`, `created_date`, `last_modified_by`, `last_modified_date`) VALUES (1000111501001, 'Projects', '项目', '项目', -1, 'icon-anquanshezhi', 'MENU', '', 1, 1, '/project', 100011, 2, '[]', 'xcan_tp', :TENANT_ID, -1, '2024-06-04 18:38:44', -1, '2024-06-04 18:45:06');
INSERT INTO `app_func` (`id`, `code`, `name`, `show_name`, `pid`, `icon`, `type`, `description`, `auth_ctrl`, `enabled`, `url`, `app_id`, `sequence`, `api_ids`, `client_id`, `tenant_id`, `created_by`, `created_date`, `last_modified_by`, `last_modified_date`) VALUES (1000111503001, 'Scenario', '场景', '场景', -1, '', 'MENU', '', 1, 1, '/scenario', 100011, 6, '[]', 'xcan_tp', :TENANT_ID, -1, '2024-01-02 11:22:22', -1, '2024-07-31 14:22:41');
INSERT INTO `app_func` (`id`, `code`, `name`, `show_name`, `pid`, `icon`, `type`, `description`, `auth_ctrl`, `enabled`, `url`, `app_id`, `sequence`, `api_ids`, `client_id`, `tenant_id`, `created_by`, `created_date`, `last_modified_by`, `last_modified_date`) VALUES (1000111507001, 'Script', '脚本', '脚本', -1, '', 'MENU', '', 1, 1, '/script', 100011, 7, '[]', 'xcan_tp', :TENANT_ID, -1, '2024-01-02 11:22:22', -1, '2024-07-31 14:22:52');
INSERT INTO `app_func` (`id`, `code`, `name`, `show_name`, `pid`, `icon`, `type`, `description`, `auth_ctrl`, `enabled`, `url`, `app_id`, `sequence`, `api_ids`, `client_id`, `tenant_id`, `created_by`, `created_date`, `last_modified_by`, `last_modified_date`) VALUES (1000111504001, 'Task', '任务', '任务', -1, '', 'MENU', '', 1, 1, '/task', 100011, 3, '[]', 'xcan_tp', :TENANT_ID, -1, '2024-01-02 11:22:22', -1, '2024-07-31 14:23:29');
INSERT INTO `app_func` (`id`, `code`, `name`, `show_name`, `pid`, `icon`, `type`, `description`, `auth_ctrl`, `enabled`, `url`, `app_id`, `sequence`, `api_ids`, `client_id`, `tenant_id`, `created_by`, `created_date`, `last_modified_by`, `last_modified_date`) VALUES (1000111515001, 'OfficialWebsite', '官网', '官网', -1, '', 'MENU', '', 1, 1, 'https://www.xcan.cloud', 100011, 17, '[]', 'xcan_tp', :TENANT_ID, -1, '2024-01-02 11:22:22', -1, '2024-04-03 17:55:24');
INSERT INTO `app_func` (`id`, `code`, `name`, `show_name`, `pid`, `icon`, `type`, `description`, `auth_ctrl`, `enabled`, `url`, `app_id`, `sequence`, `api_ids`, `client_id`, `tenant_id`, `created_by`, `created_date`, `last_modified_by`, `last_modified_date`) VALUES (1000111512001, 'GlobalSearch', '搜索框', '搜索框', -1, '', 'MENU', '', 1, 1, '/', 100011, 14, '[]', 'xcan_tp', :TENANT_ID, -1, '2024-01-02 11:22:22', -1, '2024-01-02 11:22:22');
INSERT INTO `app_func` (`id`, `code`, `name`, `show_name`, `pid`, `icon`, `type`, `description`, `auth_ctrl`, `enabled`, `url`, `app_id`, `sequence`, `api_ids`, `client_id`, `tenant_id`, `created_by`, `created_date`, `last_modified_by`, `last_modified_date`) VALUES (1000111513001, 'WorkOrder', '工单', '工单', -1, '', 'MENU', '', 1, 1, 'https://wo.xcan.cloud/workorders', 100011, 15, '[]', 'xcan_tp', :TENANT_ID, -1, '2024-01-02 11:22:22', -1, '2024-04-03 17:54:51');
UPDATE `app_func` SET `created_date` = now(), `last_modified_date` = now();

-- ----------------------------
-- Table data for web_tag
-- ----------------------------
-- Do in AngusGM

-- ----------------------------
-- Table data for web_tag_target
-- ----------------------------
-- Func Tag
DELETE FROM `web_tag_target` WHERE target_id IN (SELECT id FROM `app_func` WHERE app_id = 100011);
INSERT INTO `web_tag_target` (`id`, `tag_id`, `target_type`, `target_id`, `tenant_id`, `created_by`, `created_date`) VALUES (215509679965473225, 1, 'MENU', 1000111502001, :TENANT_ID, -1, '2024-03-27 09:36:02');
INSERT INTO `web_tag_target` (`id`, `tag_id`, `target_type`, `target_id`, `tenant_id`, `created_by`, `created_date`) VALUES (215509679965473226, 6, 'MENU', 1000111502001, :TENANT_ID, -1, '2024-03-27 09:36:02');
INSERT INTO `web_tag_target` (`id`, `tag_id`, `target_type`, `target_id`, `tenant_id`, `created_by`, `created_date`) VALUES (245555039932783397, 1, 'MENU', 1000111517001, :TENANT_ID, -1, '2024-08-19 14:59:38');
INSERT INTO `web_tag_target` (`id`, `tag_id`, `target_type`, `target_id`, `tenant_id`, `created_by`, `created_date`) VALUES (245555039932783398, 6, 'MENU', 1000111517001, :TENANT_ID, -1, '2024-08-19 14:59:38');
INSERT INTO `web_tag_target` (`id`, `tag_id`, `target_type`, `target_id`, `tenant_id`, `created_by`, `created_date`) VALUES (219427254927623197, 1, 'MENU', 1000111506001, :TENANT_ID, -1, '2024-03-28 16:11:12');
INSERT INTO `web_tag_target` (`id`, `tag_id`, `target_type`, `target_id`, `tenant_id`, `created_by`, `created_date`) VALUES (219427254927623198, 6, 'MENU', 1000111506001, :TENANT_ID, -1, '2024-03-28 16:11:12');
INSERT INTO `web_tag_target` (`id`, `tag_id`, `target_type`, `target_id`, `tenant_id`, `created_by`, `created_date`) VALUES (219427360154321546, 1, 'MENU', 1000111508001, :TENANT_ID, -1, '2024-03-28 16:10:31');
INSERT INTO `web_tag_target` (`id`, `tag_id`, `target_type`, `target_id`, `tenant_id`, `created_by`, `created_date`) VALUES (219427360154321547, 6, 'MENU', 1000111508001, :TENANT_ID, -1, '2024-03-28 16:10:31');
INSERT INTO `web_tag_target` (`id`, `tag_id`, `target_type`, `target_id`, `tenant_id`, `created_by`, `created_date`) VALUES (219427254927623191, 1, 'MENU', 1000111516001, :TENANT_ID, -1, '2024-03-28 16:09:06');
INSERT INTO `web_tag_target` (`id`, `tag_id`, `target_type`, `target_id`, `tenant_id`, `created_by`, `created_date`) VALUES (219427254927623192, 6, 'MENU', 1000111516001, :TENANT_ID, -1, '2024-03-28 16:09:06');
INSERT INTO `web_tag_target` (`id`, `tag_id`, `target_type`, `target_id`, `tenant_id`, `created_by`, `created_date`) VALUES (246289103530754048, 1, 'MENU', 1000111501001, :TENANT_ID, -1, '2024-08-28 18:30:43');
INSERT INTO `web_tag_target` (`id`, `tag_id`, `target_type`, `target_id`, `tenant_id`, `created_by`, `created_date`) VALUES (246289103530754049, 6, 'MENU', 1000111501001, :TENANT_ID, -1, '2024-08-28 18:30:43');
INSERT INTO `web_tag_target` (`id`, `tag_id`, `target_type`, `target_id`, `tenant_id`, `created_by`, `created_date`) VALUES (246289103530754050, 9, 'MENU', 1000111501001, :TENANT_ID, -1, '2024-08-28 18:30:43');
INSERT INTO `web_tag_target` (`id`, `tag_id`, `target_type`, `target_id`, `tenant_id`, `created_by`, `created_date`) VALUES (219427360154321544, 1, 'MENU', 1000111503001, :TENANT_ID, -1, '2024-03-28 16:09:53');
INSERT INTO `web_tag_target` (`id`, `tag_id`, `target_type`, `target_id`, `tenant_id`, `created_by`, `created_date`) VALUES (219427360154321545, 6, 'MENU', 1000111503001, :TENANT_ID, -1, '2024-03-28 16:09:53');
INSERT INTO `web_tag_target` (`id`, `tag_id`, `target_type`, `target_id`, `tenant_id`, `created_by`, `created_date`) VALUES (219427254927623193, 1, 'MENU', 1000111507001, :TENANT_ID, -1, '2024-03-28 16:10:11');
INSERT INTO `web_tag_target` (`id`, `tag_id`, `target_type`, `target_id`, `tenant_id`, `created_by`, `created_date`) VALUES (219427254927623194, 6, 'MENU', 1000111507001, :TENANT_ID, -1, '2024-03-28 16:10:11');
INSERT INTO `web_tag_target` (`id`, `tag_id`, `target_type`, `target_id`, `tenant_id`, `created_by`, `created_date`) VALUES (219427254927623195, 1, 'MENU', 1000111504001, :TENANT_ID, -1, '2024-03-28 16:10:43');
INSERT INTO `web_tag_target` (`id`, `tag_id`, `target_type`, `target_id`, `tenant_id`, `created_by`, `created_date`) VALUES (219427254927623196, 6, 'MENU', 1000111504001, :TENANT_ID, -1, '2024-03-28 16:10:43');
INSERT INTO `web_tag_target` (`id`, `tag_id`, `target_type`, `target_id`, `tenant_id`, `created_by`, `created_date`) VALUES (155580502340799170, 2, 'MENU', 1000111512001, :TENANT_ID, -1, '2024-01-02 11:28:02');
INSERT INTO `web_tag_target` (`id`, `tag_id`, `target_type`, `target_id`, `tenant_id`, `created_by`, `created_date`) VALUES (155580502340799171, 6, 'MENU', 1000111512001, :TENANT_ID, -1, '2024-01-02 11:28:02');
INSERT INTO `web_tag_target` (`id`, `tag_id`, `target_type`, `target_id`, `tenant_id`, `created_by`, `created_date`) VALUES (155580502340799172, 2, 'MENU', 1000111513001, :TENANT_ID, -1, '2024-04-03 17:54:51');
INSERT INTO `web_tag_target` (`id`, `tag_id`, `target_type`, `target_id`, `tenant_id`, `created_by`, `created_date`) VALUES (155580502340799173, 6, 'MENU', 1000111513001, :TENANT_ID, -1, '2024-04-03 17:54:51');
INSERT INTO `web_tag_target` (`id`, `tag_id`, `target_type`, `target_id`, `tenant_id`, `created_by`, `created_date`) VALUES (155580502340799174, 2, 'MENU', 1000111515001, :TENANT_ID, -1, '2024-04-03 17:55:24');
INSERT INTO `web_tag_target` (`id`, `tag_id`, `target_type`, `target_id`, `tenant_id`, `created_by`, `created_date`) VALUES (155580502340799175, 6, 'MENU', 1000111515001, :TENANT_ID, -1, '2024-04-03 17:55:24');

-- App Tag
DELETE FROM `web_tag_target` WHERE target_id = 100011;
INSERT INTO `web_tag_target` (`id`, `tag_id`, `target_type`, `target_id`, `tenant_id`, `created_by`, `created_date`) VALUES (215509679965473224, 7, 'APP', 100011, :TENANT_ID, -1, '2024-03-27 09:35:12');

-- Clear dirty data
DELETE FROM web_tag_target WHERE tag_id NOT IN (SELECT id FROM web_tag);

-- ----------------------------
-- Table data for app_open -> Do by code
-- ----------------------------
-- INSERT INTO `app_open` (`id`, `app_id`, `app_code`, `app_type`, `edition_type`, `version`, `client_id`, `tenant_id`, `user_id`, `open_date`, `expiration_date`, `expiration_deleted`, `op_client_open`, `created_date`) VALUES (2, 100011, 'AngusAI', 'CLOUD_APP', 'COMMUNITY', '1.0.0', 'xcan_tp', :TENANT_ID, -1, ':appOpenDate', ':appExpirationDate', 0, 0, '2024-01-01 00:00:00');

-- ----------------------------
-- Table data for auth_policy
-- ----------------------------
DELETE FROM `auth_policy` WHERE app_id = 100011;
INSERT INTO `auth_policy` (`id`, `name`, `code`, `enabled`, `type`, `default0`, `grant_stage`, `description`, `app_id`, `client_id`, `tenant_id`, `created_by`, `created_date`, `last_modified_by`, `last_modified_date`) VALUES (132001, '应用管理员', 'ANGUSTESTER_ADMIN', 1, 'PRE_DEFINED', 1, 'SIGNUP_SUCCESS', '拥有“AngusAI”应用所有功能和“应用设置”权限。', 100011, 'xcan_tp', :TENANT_ID, -1, '2024-01-01 00:00:00', -1, '2024-01-01 00:00:00');
INSERT INTO `auth_policy` (`id`, `name`, `code`, `enabled`, `type`, `default0`, `grant_stage`, `description`, `app_id`, `client_id`, `tenant_id`, `created_by`, `created_date`, `last_modified_by`, `last_modified_date`) VALUES (132002, '一般用户', 'ANGUSTESTER_USER', 1, 'PRE_DEFINED', 1, 'SIGNUP_SUCCESS', '拥有“AngusAI”应用所有功能权限，无“应用设置”权限。', 100011, 'xcan_tp', :TENANT_ID, -1, '2024-01-01 00:00:00', -1, '2024-01-01 00:00:00');
INSERT INTO `auth_policy` (`id`, `name`, `code`, `enabled`, `type`, `default0`, `grant_stage`, `description`, `app_id`, `client_id`, `tenant_id`, `created_by`, `created_date`, `last_modified_by`, `last_modified_date`) VALUES (132003, '访客', 'ANGUSTESTER_GUEST', 1, 'PRE_DEFINED', 1, 'SIGNUP_SUCCESS', '拥有“AngusAI”应用功能查看权限，无“应用设置”权限。', 100011, 'xcan_tp', :TENANT_ID, -1, '2024-01-01 00:00:00', -1, '2024-01-01 00:00:00');
UPDATE `auth_policy` SET `created_date` = now(), `last_modified_date` = now();

-- ----------------------------
-- Table data for auth_policy_func
-- ----------------------------
DELETE FROM `auth_policy_func` WHERE app_id = 100011;
INSERT INTO `auth_policy_func` (`id`, `policy_id`, `app_id`, `func_id`, `func_type`, `tenant_id`, `created_by`, `created_date`) VALUES (239132446770074020, 132001, 100011, 1000111504001, 'MENU', :TENANT_ID, -1, '2024-08-16 08:29:17');
INSERT INTO `auth_policy_func` (`id`, `policy_id`, `app_id`, `func_id`, `func_type`, `tenant_id`, `created_by`, `created_date`) VALUES (239132446770074021, 132001, 100011, 1000111502001, 'MENU', :TENANT_ID, -1, '2024-08-16 08:29:17');
INSERT INTO `auth_policy_func` (`id`, `policy_id`, `app_id`, `func_id`, `func_type`, `tenant_id`, `created_by`, `created_date`) VALUES (239132446770074022, 132001, 100011, 1000111516001, 'MENU', :TENANT_ID, -1, '2024-08-16 08:29:17');
INSERT INTO `auth_policy_func` (`id`, `policy_id`, `app_id`, `func_id`, `func_type`, `tenant_id`, `created_by`, `created_date`) VALUES (239132446770074023, 132001, 100011, 1000111506001, 'MENU', :TENANT_ID, -1, '2024-08-16 08:29:17');
INSERT INTO `auth_policy_func` (`id`, `policy_id`, `app_id`, `func_id`, `func_type`, `tenant_id`, `created_by`, `created_date`) VALUES (239132446770074024, 132001, 100011, 1000111508001, 'MENU', :TENANT_ID, -1, '2024-08-16 08:29:17');
INSERT INTO `auth_policy_func` (`id`, `policy_id`, `app_id`, `func_id`, `func_type`, `tenant_id`, `created_by`, `created_date`) VALUES (239132446770074025, 132001, 100011, 1000111501001, 'MENU', :TENANT_ID, -1, '2024-08-16 08:29:17');
INSERT INTO `auth_policy_func` (`id`, `policy_id`, `app_id`, `func_id`, `func_type`, `tenant_id`, `created_by`, `created_date`) VALUES (239132446770074026, 132001, 100011, 1000111503001, 'MENU', :TENANT_ID, -1, '2024-08-16 08:29:17');
INSERT INTO `auth_policy_func` (`id`, `policy_id`, `app_id`, `func_id`, `func_type`, `tenant_id`, `created_by`, `created_date`) VALUES (239132446770074027, 132001, 100011, 1000111507001, 'MENU', :TENANT_ID, -1, '2024-08-16 08:29:17');
INSERT INTO `auth_policy_func` (`id`, `policy_id`, `app_id`, `func_id`, `func_type`, `tenant_id`, `created_by`, `created_date`) VALUES (239132446770074030, 132001, 100011, 1000111517001, 'MENU', :TENANT_ID, -1, '2024-08-16 08:29:17');
INSERT INTO `auth_policy_func` (`id`, `policy_id`, `app_id`, `func_id`, `func_type`, `tenant_id`, `created_by`, `created_date`) VALUES (239132446770074237, 132003, 100011, 1000111501001, 'MENU', :TENANT_ID, -1, '2024-08-16 08:38:10');
INSERT INTO `auth_policy_func` (`id`, `policy_id`, `app_id`, `func_id`, `func_type`, `tenant_id`, `created_by`, `created_date`) VALUES (239132446770074238, 132002, 100011, 1000111504001, 'MENU', :TENANT_ID, -1, '2024-08-16 08:38:21');
INSERT INTO `auth_policy_func` (`id`, `policy_id`, `app_id`, `func_id`, `func_type`, `tenant_id`, `created_by`, `created_date`) VALUES (239132446770074239, 132002, 100011, 1000111502001, 'MENU', :TENANT_ID, -1, '2024-08-16 08:38:21');
INSERT INTO `auth_policy_func` (`id`, `policy_id`, `app_id`, `func_id`, `func_type`, `tenant_id`, `created_by`, `created_date`) VALUES (239132446770074240, 132002, 100011, 1000111516001, 'MENU', :TENANT_ID, -1, '2024-08-16 08:38:21');
INSERT INTO `auth_policy_func` (`id`, `policy_id`, `app_id`, `func_id`, `func_type`, `tenant_id`, `created_by`, `created_date`) VALUES (239132446770074241, 132002, 100011, 1000111506001, 'MENU', :TENANT_ID, -1, '2024-08-16 08:38:21');
INSERT INTO `auth_policy_func` (`id`, `policy_id`, `app_id`, `func_id`, `func_type`, `tenant_id`, `created_by`, `created_date`) VALUES (239132446770074242, 132002, 100011, 1000111508001, 'MENU', :TENANT_ID, -1, '2024-08-16 08:38:21');
INSERT INTO `auth_policy_func` (`id`, `policy_id`, `app_id`, `func_id`, `func_type`, `tenant_id`, `created_by`, `created_date`) VALUES (239132446770074243, 132002, 100011, 1000111501001, 'MENU', :TENANT_ID, -1, '2024-08-16 08:38:21');
INSERT INTO `auth_policy_func` (`id`, `policy_id`, `app_id`, `func_id`, `func_type`, `tenant_id`, `created_by`, `created_date`) VALUES (239132446770074244, 132002, 100011, 1000111503001, 'MENU', :TENANT_ID, -1, '2024-08-16 08:38:21');
INSERT INTO `auth_policy_func` (`id`, `policy_id`, `app_id`, `func_id`, `func_type`, `tenant_id`, `created_by`, `created_date`) VALUES (239132446770074245, 132002, 100011, 1000111507001, 'MENU', :TENANT_ID, -1, '2024-08-16 08:38:21');
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
DELETE FROM `auth_policy_org` WHERE app_id = 100011;
INSERT INTO `auth_policy_org` (`id`, `policy_id`, `policy_type`, `org_id`, `org_type`, `grant_scope`, `open_auth`, `app_id`, `tenant_id`, `default0`, `created_by`, `created_date`) VALUES (219427254927626049, 132001, 'PRE_DEFINED', :TENANT_ID, 'TENANT', 'TENANT_SYS_ADMIN', 1, 100011, :TENANT_ID, 0, -1, '2024-03-31 23:51:12');
INSERT INTO `auth_policy_org` (`id`, `policy_id`, `policy_type`, `org_id`, `org_type`, `grant_scope`, `open_auth`, `app_id`, `tenant_id`, `default0`, `created_by`, `created_date`) VALUES (219427254927626050, 132002, 'PRE_DEFINED', :TENANT_ID, 'TENANT', 'TENANT_ALL_USER', 0, 100011, :TENANT_ID, 1, -1, '2024-03-31 23:51:12');
-- @formatter:on
