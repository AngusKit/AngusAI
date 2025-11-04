// Node Related Enums
export enum NodeSource {
  OWN_NODE = 'OWN_NODE',
  ONLINE_BUY = 'ONLINE_BUY'
}

export enum CountScriptType {
  PERF = 'PERF',
  FUNCTIONAL = 'FUNCTIONAL',
  STABILITY = 'STABILITY',
  FILE = 'FILE',
  DATASOURCE = 'DATASOURCE',
  ALL = 'ALL'
}

// Task Related Enums
export enum TaskTargetType {
  TASK = 'TASK',
  TASK_SPRINT = 'TASK_SPRINT'
}

export enum TaskType {
  REQUIREMENT = 'REQUIREMENT',
  STORY = 'STORY',
  TASK = 'TASK',
  BUG = 'BUG',
  API_TEST = 'API_TEST',
  SCENARIO_TEST = 'SCENARIO_TEST'
}

export enum TaskStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  CONFIRMING = 'CONFIRMING',
  COMPLETED = 'COMPLETED',
  CANCELED = 'CANCELED'
}

export enum TaskSprintStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  BLOCKED = 'BLOCKED'
}

export enum TaskMeetingType {
  DAILY_STANDUP = 'DAILY_STANDUP',
  PLANNING = 'PLANNING',
  REVIEW = 'REVIEW',
  RETROSPECTIVE = 'RETROSPECTIVE',
  BACKLOG_REFINEMENT = 'BACKLOG_REFINEMENT',
  OTHER = 'OTHER'
}

export enum ApisProtocol {
  http = 'http',
  https = 'https',
  ws = 'ws',
  wss = 'wss'
}

// API Related Enums
export enum ApisTargetType {
  SERVICE = 'SERVICE',
  API = 'API'
}

export enum AuthorizationType {
  NO_AUTH = 'NO_AUTH',
  BASIC_AUTH = 'BASIC_AUTH',
  BEARER_TOKEN = 'BEARER_TOKEN',
  CUSTOM = 'CUSTOM'
}

export enum ApiSource {
  CREATED = 'CREATED',
  EDITOR = 'EDITOR',
  IMPORT = 'IMPORT',
  SYNC = 'SYNC'
}

export enum ApiStatus {
  UNKNOWN = 'UNKNOWN',
  IN_DESIGN = 'IN_DESIGN',
  IN_DEV = 'IN_DEV',
  DEV_COMPLETED = 'DEV_COMPLETED',
  RELEASED = 'RELEASED'
}

export enum ApisDesignSource {
  SYNCHRONOUS_SERVICE = 'SYNCHRONOUS_SERVICE',
  FILE_IMPORT = 'FILE_IMPORT',
  MANUAL_CREATED = 'MANUAL_CREATED'
}

// Testing Related Enums
export enum TestType {
  PERFORMANCE = 'PERFORMANCE',
  FUNCTIONAL = 'FUNCTIONAL',
  STABILITY = 'STABILITY',
  CUSTOMIZATION = 'CUSTOMIZATION'
}

export enum CountTestType {
  PERF = 'PERF',
  FUNCTIONAL = 'FUNCTIONAL',
  STABILITY = 'STABILITY',
  ALL = 'ALL'
}

export enum TestResultStatus {
  NOT_ENABLED = 'NOT_ENABLED',
  UNTESTED = 'UNTESTED',
  PARTIALLY_PASSED = 'PARTIALLY_PASSED',
  FULLY_PASSED = 'FULLY_PASSED',
  FULLY_FAILED = 'FULLY_FAILED'
}

// Functional Testing Enums
export enum FuncTargetType {
  PLAN = 'PLAN',
  CASE = 'CASE'
}

export enum CaseTestResult {
  PENDING = 'PENDING',
  PASSED = 'PASSED',
  NOT_PASSED = 'NOT_PASSED',
  BLOCKED = 'BLOCKED',
  CANCELED = 'CANCELED'
}

export enum CaseStepView {
  TABLE = 'TABLE',
  TEXT = 'TEXT'
}

export enum FuncPlanStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  BLOCKED = 'BLOCKED'
}

// Software Version Enums
export enum SoftwareVersionStatus {
  NOT_RELEASED = 'NOT_RELEASED',
  RELEASED = 'RELEASED',
  ARCHIVED = 'ARCHIVED'
}

// Bug Related Enums
export enum BugLevel {
  CRITICAL = 'CRITICAL',
  MAJOR = 'MAJOR',
  MINOR = 'MINOR',
  TRIVIAL = 'TRIVIAL'
}

export enum OverdueRiskLevel {
  HIGH = 'HIGH',
  LOW = 'LOW',
  NONE = 'NONE'
}

// User Association Enums
export enum AssociateUserType {
  CREATOR = 'CREATOR',
  ASSIGNEE = 'ASSIGNEE',
  CONFIRMER = 'CONFIRMER',
  OWNER = 'OWNER',
  SYS_ADMIN = 'SYS_ADMIN',
  APP_ADMIN = 'APP_ADMIN'
}

export enum AssociateTargetType {
  EXEC = 'EXEC',
  REPORTER = 'REPORTER'
}

// Permission Enums
export enum ServicesPermission {
  ADD = 'ADD',
  VIEW = 'VIEW',
  MODIFY = 'MODIFY',
  DELETE = 'DELETE',
  TEST = 'TEST',
  GRANT = 'GRANT',
  SHARE = 'SHARE',
  RELEASE = 'RELEASE',
  EXPORT = 'EXPORT'
}

export enum ApiPermission {
  VIEW = 'VIEW',
  MODIFY = 'MODIFY',
  DELETE = 'DELETE',
  DEBUG = 'DEBUG',
  TEST = 'TEST',
  GRANT = 'GRANT',
  SHARE = 'SHARE',
  RELEASE = 'RELEASE',
  EXPORT = 'EXPORT'
}

export enum ApiServerSource {
  CURRENT_REQUEST = 'CURRENT_REQUEST',
  API_SERVERS = 'API_SERVERS',
  PARENT_SERVERS = 'PARENT_SERVERS',
  MOCK_SERVICE = 'MOCK_SERVICE',
}

export enum ScriptPermission {
  VIEW = 'VIEW',
  MODIFY = 'MODIFY',
  DELETE = 'DELETE',
  TEST = 'TEST',
  GRANT = 'GRANT',
  EXPORT = 'EXPORT'
}

export enum ScenarioPermission {
  VIEW = 'VIEW',
  MODIFY = 'MODIFY',
  DELETE = 'DELETE',
  TEST = 'TEST',
  GRANT = 'GRANT',
  EXPORT = 'EXPORT'
}

export enum MockServicePermission {
  ADD = 'ADD',
  VIEW = 'VIEW',
  MODIFY = 'MODIFY',
  DELETE = 'DELETE',
  RUN = 'RUN',
  GRANT = 'GRANT',
  EXPORT = 'EXPORT'
}

export enum TaskSprintPermission {
  MODIFY_SPRINT = 'MODIFY_SPRINT',
  DELETE_SPRINT = 'DELETE_SPRINT',
  ADD_TASK = 'ADD_TASK',
  MODIFY_TASK = 'MODIFY_TASK',
  DELETE_TASK = 'DELETE_TASK',
  EXPORT_TASK = 'EXPORT_TASK',
  RESTART_TASK = 'RESTART_TASK',
  REOPEN_TASK = 'REOPEN_TASK',
  GRANT = 'GRANT'
}

export enum FuncPlanPermission {
  MODIFY_PLAN = 'MODIFY_PLAN',
  DELETE_PLAN = 'DELETE_PLAN',
  ADD_CASE = 'ADD_CASE',
  MODIFY_CASE = 'MODIFY_CASE',
  DELETE_CASE = 'DELETE_CASE',
  EXPORT_CASE = 'EXPORT_CASE',
  REVIEW = 'REVIEW',
  RESET_REVIEW_RESULT = 'RESET_REVIEW_RESULT',
  TEST = 'TEST',
  RESET_TEST_RESULT = 'RESET_TEST_RESULT',
  ESTABLISH_BASELINE = 'ESTABLISH_BASELINE',
  GRANT = 'GRANT'
}

export enum ReportPermission {
  VIEW = 'VIEW',
  MODIFY = 'MODIFY',
  GENERATE = 'GENERATE',
  DELETE = 'DELETE',
  GRANT = 'GRANT',
  EXPORT = 'EXPORT'
}

export enum SpacePermission {
  VIEW = 'VIEW',
  MODIFY = 'MODIFY',
  DELETE = 'DELETE',
  SHARE = 'SHARE',
  GRANT = 'GRANT',
  OBJECT_READ = 'OBJECT_READ',
  OBJECT_WRITE = 'OBJECT_WRITE',
  OBJECT_DELETE = 'OBJECT_DELETE'
}

// Action Strategy Enums
export enum ActionWhenDuplicate {
  COVER = 'COVER',
  IGNORE = 'IGNORE'
}

export enum StrategyWhenDuplicated {
  COVER = 'COVER',
  IGNORE = 'IGNORE'
}

// Mock Service Enums
export enum MockServiceStartStatus {
  NOT_STARTED = 'NOT_STARTED',
  SUCCESS = 'SUCCESS',
  FAILURE = 'FAILURE',
  UNKNOWN = 'UNKNOWN'
}

export enum MockServiceStatus {
  NOT_STARTED = 'NOT_STARTED',
  RUNNING = 'RUNNING'
}

export enum MockServiceSource {
  CREATED = 'CREATED',
  FILE_IMPORT = 'FILE_IMPORT',
  ASSOC_SERVICE = 'ASSOC_SERVICE'
}

export enum MockApisSource {
  CREATED = 'CREATED',
  ANGUS_IMPORT = 'ANGUS_IMPORT',
  COPY_APIS = 'COPY_APIS',
  ASSOC_APIS = 'ASSOC_APIS'
}

export enum MockDataSourceStatus {
  SUCCESS = 'SUCCESS',
  FAIL = 'FAIL'
}

export enum MockAuthorizationType {
  HTTP_BASIC = 'HTTP_BASIC',
  REQUEST_HEADER_MATCH = 'REQUEST_HEADER_MATCH'
}

export enum MockDataTargetType {
  FILE = 'FILE',
  DATASOURCE = 'DATASOURCE'
}

// Execution Enums
export enum ExecStatus {
  CREATED = 'CREATED',
  PENDING = 'PENDING',
  RUNNING = 'RUNNING',
  STOPPED = 'STOPPED',
  FAILED = 'FAILED',
  TIMEOUT = 'TIMEOUT',
  COMPLETED = 'COMPLETED'
}

export enum ExecResult {
  SUCCESS = 'SUCCESS',
  FAIL = 'FAIL'
}

export enum ScenarioMonitorStatus {
  PENDING = 'PENDING',
  SUCCESS = 'SUCCESS',
  FAILURE = 'FAILURE'
}

// Project Enums
export enum ProjectType {
  AGILE = 'AGILE',
  GENERAL = 'GENERAL',
  TESTING = 'TESTING'
}

// Export/Share Enums
export enum ServicesExportScope {
  SERVICE = 'SERVICE',
  APIS = 'APIS'
}

export enum ApisShareScope {
  SERVICES = 'SERVICES',
  PARTIAL_APIS = 'PARTIAL_APIS',
  SINGLE_APIS = 'SINGLE_APIS'
}

export enum ApiImportSource{
  OPENAPI = 'OPENAPI',
  POSTMAN = 'POSTMAN',
  ANGUS = 'ANGUS'
}

// Indicator Enums
export enum IndicatorType {
  FUNC = 'FUNC',
  PERF = 'PERF',
  STABILITY = 'STABILITY'
}

// Data Assets Enums
export enum DataAssetsCategory {
  FUNC = 'FUNC',
  APIS = 'APIS',
  SCENARIO = 'SCENARIO',
  TASK = 'TASK',
  SCRIPT = 'SCRIPT',
  MOCK = 'MOCK',
  DATA = 'DATA'
}

// Parameterization Enums
export enum ParameterizationDataSource {
  STATIC_VALUE = 'STATIC_VALUE',
  EXTRACT_VALUE = 'EXTRACT_VALUE',
  EXTRACT_FILE = 'EXTRACT_FILE',
  EXTRACT_HTTP = 'EXTRACT_HTTP',
  EXTRACT_HTTP_SAMPLING = 'EXTRACT_HTTP_SAMPLING',
  EXTRACT_JDBC = 'EXTRACT_JDBC'
}

// Efficiency Enums
export enum EfficiencyResourceType {
  TASK = 'TASK',
  CASE = 'CASE'
}

export enum BurnDownResourceType {
  NUM = 'NUM',
  WORKLOAD = 'WORKLOAD'
}

// Service Components Enums
export enum ServicesCompType {
  schemas = 'schemas',
  responses = 'responses',
  parameters = 'parameters',
  examples = 'examples',
  requestBodies = 'requestBodies',
  headers = 'headers',
  securitySchemes = 'securitySchemes',
  links = 'links',
  callbacks = 'callbacks',
  extensions = 'extensions',
  pathItems = 'pathItems'
}

// Binary Content Enums
export enum BinaryContentType {
  FILE = 'FILE',
  BASE64_TEXT = 'BASE64_TEXT',
  URL = 'URL'
}

// DNS Line Enums
export enum DnsLine {
  DEFAULT = 'DEFAULT',
  TELECOM = 'TELECOM',
  UNICOM = 'UNICOM',
  MOBILE = 'MOBILE',
  OVERSEA = 'OVERSEA'
}

// Instance Charge Type Enums
export enum InstanceChargeType {
  PREPAID = 'PREPAID',
  POSTPAID = 'POSTPAID'
}

// Analysis Enums
export enum AnalysisTimeRange {
  ALL_TIME = 'ALL_TIME',
  THIS_WEEK = 'THIS_WEEK',
  LAST_WEEK = 'LAST_WEEK',
  THIS_MONTH = 'THIS_MONTH',
  LAST_MONTH = 'LAST_MONTH',
  THIS_YEAR = 'THIS_YEAR',
  CUSTOM_TIME = 'CUSTOM_TIME'
}

export enum AnalysisDataSource {
  REAL_TIME_DATA = 'REAL_TIME_DATA',
  SNAPSHOT_DATA = 'SNAPSHOT_DATA'
}

export enum AnalysisTaskObject {
  CURRENT_PROJECT = 'CURRENT_PROJECT',
  SPRINT = 'SPRINT',
  ASSIGNEE_ORG = 'ASSIGNEE_ORG'
}

export enum AnalysisTaskTemplate {
  PROGRESS = 'PROGRESS',
  BURNDOWN = 'BURNDOWN',
  WORKLOAD = 'WORKLOAD',
  OVERDUE_ASSESSMENT = 'OVERDUE_ASSESSMENT',
  BUGS = 'BUGS',
  HANDLING_EFFICIENCY = 'HANDLING_EFFICIENCY',
  CORE_KPI = 'CORE_KPI',
  FAILURES = 'FAILURES',
  BACKLOG_TASKS = 'BACKLOG_TASKS',
  RECENT_DELIVERY = 'RECENT_DELIVERY',
  LEAD_TIME = 'LEAD_TIME',
  UNPLANNED_TASKS = 'UNPLANNED_TASKS',
  TASK_GROWTH_TREND = 'TASK_GROWTH_TREND',
  RESOURCE_CREATION = 'RESOURCE_CREATION'
  // CUSTOM_DEFINITION = 'CUSTOM_DEFINITION'
}

export enum AnalysisTaskTemplateDesc {
  PROGRESS = 'PROGRESS',
  BURNDOWN = 'BURNDOWN',
  WORKLOAD = 'WORKLOAD',
  OVERDUE_ASSESSMENT = 'OVERDUE_ASSESSMENT',
  BUGS = 'BUGS',
  HANDLING_EFFICIENCY = 'HANDLING_EFFICIENCY',
  CORE_KPI = 'CORE_KPI',
  FAILURES = 'FAILURES',
  BACKLOG_TASKS = 'BACKLOG_TASKS',
  RECENT_DELIVERY = 'RECENT_DELIVERY',
  LEAD_TIME = 'LEAD_TIME',
  UNPLANNED_TASKS = 'UNPLANNED_TASKS',
  TASK_GROWTH_TREND = 'TASK_GROWTH_TREND',
  RESOURCE_CREATION = 'RESOURCE_CREATION'
  // CUSTOM_DEFINITION = 'CUSTOM_DEFINITION'
}

export enum AnalysisCaseObject {
  CURRENT_PROJECT = 'CURRENT_PROJECT',
  PLAN = 'PLAN',
  TESTER_ORG = 'TESTER_ORG'
}

export enum AnalysisCaseTemplate {
  PROGRESS = 'PROGRESS',
  BURNDOWN = 'BURNDOWN',
  WORKLOAD = 'WORKLOAD',
  OVERDUE_ASSESSMENT = 'OVERDUE_ASSESSMENT',
  SUBMITTED_BUGS = 'SUBMITTED_BUGS',
  TESTING_EFFICIENCY = 'TESTING_EFFICIENCY',
  CORE_KPI = 'CORE_KPI',
  REVIEW_EFFICIENCY = 'REVIEW_EFFICIENCY',
  BACKLOG_CASES = 'BACKLOG_CASES',
  RECENT_DELIVERY = 'RECENT_DELIVERY',
  LEAD_TIME = 'LEAD_TIME',
  UNPLANNED_CASES = 'UNPLANNED_CASES',
  CASE_GROWTH_TREND = 'CASE_GROWTH_TREND',
  RESOURCE_CREATION = 'RESOURCE_CREATION'
  // CUSTOM_DEFINITION = 'CUSTOM_DEFINITION'
}

export enum AnalysisCaseTemplateDesc {
  PROGRESS = 'PROGRESS',
  BURNDOWN = 'BURNDOWN',
  WORKLOAD = 'WORKLOAD',
  OVERDUE_ASSESSMENT = 'OVERDUE_ASSESSMENT',
  SUBMITTED_BUGS = 'SUBMITTED_BUGS',
  TESTING_EFFICIENCY = 'TESTING_EFFICIENCY',
  CORE_KPI = 'CORE_KPI',
  REVIEW_EFFICIENCY = 'REVIEW_EFFICIENCY',
  BACKLOG_CASES = 'BACKLOG_CASES',
  RECENT_DELIVERY = 'RECENT_DELIVERY',
  LEAD_TIME = 'LEAD_TIME',
  UNPLANNED_CASES = 'UNPLANNED_CASES',
  CASE_GROWTH_TREND = 'CASE_GROWTH_TREND',
  RESOURCE_CREATION = 'RESOURCE_CREATION'
  // CUSTOM_DEFINITION = 'CUSTOM_DEFINITION'
}

// Report Enums
export enum ReportStatus {
  PENDING = 'PENDING',
  SUCCESS = 'SUCCESS',
  FAILURE = 'FAILURE'
}

// Check Settings
export enum SmokeCheckSetting {
  SERVICE_AVAILABLE = 'SERVICE_AVAILABLE',
  API_AVAILABLE = 'API_AVAILABLE',
  USER_DEFINED_ASSERTION = 'USER_DEFINED_ASSERTION'
}

export enum SecurityCheckSetting {
  NOT_SECURITY_CODE = 'NOT_SECURITY_CODE',
  IS_SECURITY_CODE = 'IS_SECURITY_CODE',
  USER_DEFINED_ASSERTION = 'USER_DEFINED_ASSERTION'
}


export enum ReportCategory {
  PROJECT = 'PROJECT',
  TASK = 'TASK',
  FUNCTIONAL = 'FUNCTIONAL',
  APIS = 'APIS',
  SCENARIO = 'SCENARIO',
  EXECUTION = 'EXECUTION'
}

export enum ReportTemplate {
  PROJECT_PROGRESS = 'PROJECT_PROGRESS',
  PROJECT_DATA_ASSETS = 'PROJECT_DATA_ASSETS',
  PROJECT_EFFICIENCY = 'PROJECT_EFFICIENCY',
  PROJECT_ACTIVITY = 'PROJECT_ACTIVITY',
  TASK_SPRINT = 'TASK_SPRINT',
  TASK = 'TASK',
  FUNC_TESTING_PLAN = 'FUNC_TESTING_PLAN',
  FUNC_TESTING_CASE = 'FUNC_TESTING_CASE',
  SERVICES_TESTING_RESULT = 'SERVICES_TESTING_RESULT',
  APIS_TESTING_RESULT = 'APIS_TESTING_RESULT',
  APIS_TESTING = 'APIS_TESTING',
  SCENARIO_TESTING_RESULT = 'SCENARIO_TESTING_RESULT',
  SCENARIO_TESTING = 'SCENARIO_TESTING',
  EXEC_FUNCTIONAL_RESULT = 'EXEC_FUNCTIONAL_RESULT',
  EXEC_PERFORMANCE_RESULT = 'EXEC_PERFORMANCE_RESULT',
  EXEC_STABILITY_RESULT = 'EXEC_STABILITY_RESULT',
  EXEC_CUSTOMIZATION_RESULT = 'EXEC_CUSTOMIZATION_RESULT'
}

export enum ExampleDataType {
  TAG = 'TAG',
  MODULE = 'MODULE',
  TASK = 'TASK',
  FUNC = 'FUNC',
  SERVICES = 'SERVICES',
  SCENARIO = 'SCENARIO',
  SCRIPT = 'SCRIPT',
  MOCK = 'MOCK',
  VARIABLE = 'VARIABLE',
  DATASET = 'DATASET',
  EXECUTION = 'EXECUTION',
  REPORT = 'REPORT'
}

// Scenario Type Enums
export enum ScenarioType {
  HTTP = 'HTTP',
  JDBC = 'JDBC',
  FTP = 'FTP',
  WEBSOCKET = 'WEBSOCKET',
  LDAP = 'LDAP',
  MAIL = 'MAIL',
  SMTP = 'SMTP',
  TCP = 'TCP',
}

// CombinedTargetType Enums
export enum CombinedTargetType {
  PROJECT = 'PROJECT',
  TAG = 'TAG',
  MODULE = 'MODULE',
  TASK = 'TASK',
  TASK_SPRINT = 'TASK_SPRINT',
  SOFTWARE_VERSION = 'SOFTWARE_VERSION',
  TASK_ANALYSIS = 'TASK_ANALYSIS',
  MEETING = 'MEETING',
  FUNC_PLAN = 'FUNC_PLAN',
  FUNC_REVIEW = 'FUNC_REVIEW',
  FUNC_CASE = 'FUNC_CASE',
  FUNC_CASE_BASELINE = 'FUNC_CASE_BASELINE',
  FUNC_CASE_ANALYSIS = 'FUNC_CASE_ANALYSIS',
  SERVICE = 'SERVICE',
  API = 'API',
  API_CASE = 'API_CASE',
  API_DESIGN = 'API_DESIGN',
  SCENARIO = 'SCENARIO',
  SCENARIO_MONITOR = 'SCENARIO_MONITOR',
  SCRIPT = 'SCRIPT',
  VARIABLE = 'VARIABLE',
  DATASET = 'DATASET',
  MOCK_SERVICE = 'MOCK_SERVICE',
  MOCK_APIS = 'MOCK_APIS',
  EXECUTION = 'EXECUTION',
  REPORT = 'REPORT'
}

export enum PiplineTarget {
  JDBC = 'JDBC',
  TRANS_END = 'TRANS_END',
  RENDEZVOUS = 'RENDEZVOUS',
  WAITING_TIME = 'WAITING_TIME',
  THROUGHPUT = 'THROUGHPUT',
  HTTP = 'HTTP',
  FTP = 'FTP',
  LDAP = 'LDAP',
  MAIL = 'MAIL',
  SMTP = 'SMTP',
  TCP = 'TCP',
  WEBSOCKET = 'WEBSOCKET',
  JMS = 'JMS',
  TRANS_START = 'TRANS_START'
}

export const enumNamespaceMap = new Map<any, string>([
  [NodeSource, 'xcm.enum.NodeSource'],
  [CountScriptType, 'xcm.enum.CountScriptType'],
  [TaskTargetType, 'xcm.enum.TaskTargetType'],
  [ApisTargetType, 'xcm.enum.ApisTargetType'],
  [AuthorizationType, 'xcm.enum.AuthorizationType'],
  [ApiSource, 'xcm.enum.ApiSource'],
  [ApiStatus, 'xcm.enum.ApiStatus'],
  [ActionWhenDuplicate, 'xcm.enum.ActionWhenDuplicate'],
  [TestType, 'xcm.enum.TestType'],
  [CountTestType, 'xcm.enum.CountTestType'],
  [TaskType, 'xcm.enum.TaskType'],
  [TaskStatus, 'xcm.enum.TaskStatus'],
  [SoftwareVersionStatus, 'xcm.enum.SoftwareVersionStatus'],
  [BugLevel, 'xcm.enum.BugLevel'],
  [OverdueRiskLevel, 'xcm.enum.OverdueRiskLevel'],
  [AssociateUserType, 'xcm.enum.AssociateUserType'],
  [ServicesPermission, 'xcm.enum.ServicesPermission'],
  [ApiPermission, 'xcm.enum.ApiPermission'],
  [StrategyWhenDuplicated, 'xcm.enum.StrategyWhenDuplicated'],
  [ScriptPermission, 'xcm.enum.ScriptPermission'],
  [MockServiceStartStatus, 'xcm.enum.MockServiceStartStatus'],
  [ExecStatus, 'xcm.enum.ExecStatus'],
  [ExecResult, 'xcm.enum.ExecResult'],
  [TestResultStatus, 'xcm.enum.TestResultStatus'],
  [ProjectType, 'xcm.enum.ProjectType'],
  [ServicesExportScope, 'xcm.enum.ServicesExportScope'],
  [ApisShareScope, 'xcm.enum.ApisShareScope'],
  [ApiImportSource, 'xcm.enum.ApiImportSource'],
  [IndicatorType, 'xcm.enum.IndicatorType'],
  [TaskSprintPermission, 'xcm.enum.TaskSprintPermission'],
  [ScenarioPermission, 'xcm.enum.ScenarioPermission'],
  [MockServicePermission, 'xcm.enum.MockServicePermission'],
  [MockServiceStatus, 'xcm.enum.MockServiceStatus'],
  [MockServiceSource, 'xcm.enum.MockServiceSource'],
  [MockApisSource, 'xcm.enum.MockApisSource'],
  [MockDataSourceStatus, 'xcm.enum.MockDataSourceStatus'],
  [BinaryContentType, 'xcm.enum.BinaryContentType'],
  [MockAuthorizationType, 'xcm.enum.MockAuthorizationType'],
  [MockDataTargetType, 'xcm.enum.MockDataTargetType'],
  [ServicesCompType, 'xcm.enum.ServicesCompType'],
  [TaskSprintStatus, 'xcm.enum.TaskSprintStatus'],
  [TaskMeetingType, 'xcm.enum.TaskMeetingType'],
  [ApisDesignSource, 'xcm.enum.ApisDesignSource'],
  [DnsLine, 'xcm.enum.DnsLine'],
  [InstanceChargeType, 'xcm.enum.InstanceChargeType'],
  [FuncTargetType, 'xcm.enum.FuncTargetType'],
  [CaseTestResult, 'xcm.enum.CaseTestResult'],
  [CaseStepView, 'xcm.enum.CaseStepView'],
  [FuncPlanPermission, 'xcm.enum.FuncPlanPermission'],
  [FuncPlanStatus, 'xcm.enum.FuncPlanStatus'],
  [ScenarioMonitorStatus, 'xcm.enum.ScenarioMonitorStatus'],
  [DataAssetsCategory, 'xcm.enum.DataAssetsCategory'],
  [ParameterizationDataSource, 'xcm.enum.ParameterizationDataSource'],
  [EfficiencyResourceType, 'xcm.enum.EfficiencyResourceType'],
  [BurnDownResourceType, 'xcm.enum.BurnDownResourceType'],
  [AnalysisTimeRange, 'xcm.enum.AnalysisTimeRange'],
  [AnalysisDataSource, 'xcm.enum.AnalysisDataSource'],
  [AnalysisTaskObject, 'xcm.enum.AnalysisTaskObject'],
  [AnalysisTaskTemplate, 'xcm.enum.AnalysisTaskTemplate'],
  [AnalysisTaskTemplateDesc, 'xcm.enum.AnalysisTaskTemplateDesc'],
  [AnalysisCaseObject, 'xcm.enum.AnalysisCaseObject'],
  [AnalysisCaseTemplate, 'xcm.enum.AnalysisCaseTemplate'],
  [AnalysisCaseTemplateDesc, 'xcm.enum.AnalysisCaseTemplateDesc'],
  [ReportPermission, 'xcm.enum.ReportPermission'],
  [SpacePermission, 'xcm.enum.SpacePermission'],
  [ReportStatus, 'xcm.enum.ReportStatus'],
  [ReportCategory, 'xcm.enum.ReportCategory'],
  [ReportTemplate, 'xcm.enum.ReportTemplate'],
  [ExampleDataType, 'xcm.enum.ExampleDataType'],
  [AssociateTargetType, 'xcm.enum.AssociateTargetType'],
  [CombinedTargetType, 'xcm.enum.CombinedTargetType'],
  [SmokeCheckSetting, 'xcm.enum.SmokeCheckSetting'],
  [SecurityCheckSetting, 'xcm.enum.SecurityCheckSetting']
]);
