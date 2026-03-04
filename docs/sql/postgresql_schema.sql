-- PostgreSQL CREATE TABLE SQL
-- Generated from domain entity classes

-- Table: ai_prompt
CREATE TABLE "ai_prompt" (
  "id" BIGINT NOT NULL,
  "title" VARCHAR(100) NOT NULL,
  "content" TEXT NOT NULL,
  "description" VARCHAR(500) NULL,
  "category_id" BIGINT NOT NULL,
  "tags" JSONB NULL,
  "tenant_id" BIGINT NOT NULL,
  "created_by" BIGINT NOT NULL,
  "created_date" TIMESTAMP NOT NULL,
  "modified_by" BIGINT NULL,
  "modified_date" TIMESTAMP NULL,
  PRIMARY KEY ("id")
);

-- Table: ai_prompt_category
CREATE TABLE "ai_prompt_category" (
  "id" BIGINT NOT NULL,
  "name" VARCHAR(20) NOT NULL,
  "icon" VARCHAR(50) NULL,
  "color" VARCHAR(20) NULL,
  "parent_id" BIGINT NULL,
  "tenant_id" BIGINT NOT NULL,
  "created_by" BIGINT NOT NULL,
  "created_date" TIMESTAMP NOT NULL,
  "modified_by" BIGINT NULL,
  "modified_date" TIMESTAMP NULL,
  PRIMARY KEY ("id")
);

-- Table: ai_prompt_favorites
CREATE TABLE "ai_prompt_favorites" (
  "id" BIGINT NOT NULL,
  "prompt_id" BIGINT NOT NULL,
  "created_by" BIGINT NOT NULL,
  "created_date" TIMESTAMP NOT NULL,
  PRIMARY KEY ("id")
);

-- Table: api_collection
CREATE TABLE "api_collection" (
  "id" BIGINT NOT NULL,
  "name" VARCHAR(100) NOT NULL,
  "description" VARCHAR(500) NULL,
  "source" VARCHAR(255) NOT NULL,
  "visibility" VARCHAR(255) NOT NULL,
  "server" JSONB NULL,
  "security" JSONB NULL,
  "tenant_id" BIGINT NOT NULL,
  "created_by" BIGINT NOT NULL,
  "created_date" TIMESTAMP NOT NULL,
  "modified_by" BIGINT NULL,
  "modified_date" TIMESTAMP NULL,
  PRIMARY KEY ("id")
);

-- Table: api_endpoint
CREATE TABLE "api_endpoint" (
  "id" BIGINT NOT NULL,
  "collection_id" BIGINT NOT NULL,
  "name" VARCHAR(200) NOT NULL,
  "method" VARCHAR(255) NOT NULL,
  "path" VARCHAR(500) NOT NULL,
  "description" VARCHAR(1000) NULL,
  "operation_id" VARCHAR(200) NULL,
  "tags" JSONB NULL,
  "tenant_id" BIGINT NOT NULL,
  "created_by" BIGINT NOT NULL,
  "created_date" TIMESTAMP NOT NULL,
  "modified_by" BIGINT NULL,
  "modified_date" TIMESTAMP NULL,
  PRIMARY KEY ("id")
);

-- Table: api_endpoint_call_log
CREATE TABLE "api_endpoint_call_log" (
  "id" BIGINT NOT NULL,
  "endpoint_id" BIGINT NOT NULL,
  "call_date" TIMESTAMP NOT NULL,
  "response_time_ms" BIGINT NULL,
  "status" VARCHAR(20) NOT NULL,
  "status_code" INTEGER NULL,
  "user_id" BIGINT NULL,
  "error_message" VARCHAR(1000) NULL,
  "ip_address" VARCHAR(50) NULL,
  "tenant_id" BIGINT NOT NULL
  PRIMARY KEY ("id")
);

-- Table: api_key
CREATE TABLE "api_key" (
  "id" BIGINT NOT NULL,
  "name" VARCHAR(100) NOT NULL,
  "key_hash" VARCHAR(255) NOT NULL,
  "key_prefix" VARCHAR(20) NULL,
  "status" INTEGER NOT NULL,
  "ip_whitelist" TEXT NULL,
  "usage_count" TIMESTAMP NULL,
  "expires_at" TIMESTAMP NULL,
  "revoked_at" TIMESTAMP NULL,
  "revoke_reason" VARCHAR(500) NULL,
  "tenant_id" BIGINT NOT NULL,
  "created_by" BIGINT NOT NULL,
  "created_date" TIMESTAMP NOT NULL,
  "modified_by" BIGINT NULL,
  "modified_date" TIMESTAMP NULL,
  PRIMARY KEY ("id")
);

-- Table: api_key_resource
CREATE TABLE "api_key_resource" (
  "id" BIGINT NOT NULL,
  "api_key_id" BIGINT NOT NULL,
  "resource_type" VARCHAR(255) NOT NULL,
  "resource_id" VARCHAR(255) NOT NULL,
  "created_by" BIGINT NOT NULL,
  "created_date" TIMESTAMP NOT NULL,
  PRIMARY KEY ("id")
);

-- Table: api_usage_log
CREATE TABLE "api_usage_log" (
  "id" BIGINT NOT NULL,
  "app_id" BIGINT NULL,
  "user_id" BIGINT NULL,
  "endpoint" VARCHAR(200) NOT NULL,
  "method" VARCHAR(10) NOT NULL,
  "model_id" BIGINT NULL,
  "model_name" VARCHAR(100) NULL,
  "status_code" INTEGER NOT NULL,
  "response_time_ms" INTEGER NOT NULL,
  "input_tokens" INTEGER NULL,
  "output_tokens" INTEGER NULL,
  "total_tokens" INTEGER NULL,
  "cost" INTEGER NULL,
  "is_successful" BOOLEAN NOT NULL,
  "error_message" VARCHAR(1000) NULL,
  "ip_address" VARCHAR(45) NULL,
  "user_agent" VARCHAR(500) NULL,
  "request_time" TIMESTAMP NOT NULL,
  "tenant_id" BIGINT NOT NULL,
  "created_by" BIGINT NOT NULL,
  "created_date" TIMESTAMP NOT NULL,
  "modified_by" BIGINT NULL,
  "modified_date" TIMESTAMP NULL,
  PRIMARY KEY ("id")
);

-- Table: application
CREATE TABLE "application" (
  "id" BIGINT NOT NULL,
  "name" VARCHAR(255) NOT NULL,
  "icon" VARCHAR(255) NOT NULL,
  "description" VARCHAR(255) NULL,
  "category" VARCHAR(255) NOT NULL,
  "status" VARCHAR(255) NOT NULL,
  "language" VARCHAR(255) NULL,
  "published_date" TIMESTAMP NULL,
  "api_calls" VARCHAR(255) NULL,
  "model_id" BIGINT NULL,
  "knowledge_base_id" BIGINT NULL,
  "dataset_id" BIGINT NULL,
  "workflow_id" BIGINT NULL,
  "public_access" VARCHAR(255) NULL,
  "share_expires_at" TIMESTAMP NULL,
  "share" JSONB NULL,
  "tenant_id" BIGINT NOT NULL,
  "created_by" BIGINT NOT NULL,
  "created_date" TIMESTAMP NOT NULL,
  "modified_by" BIGINT NULL,
  "modified_date" TIMESTAMP NULL,
  PRIMARY KEY ("id")
);

-- Table: chat_attachment
CREATE TABLE "chat_attachment" (
  "id" BIGINT NOT NULL,
  "name" VARCHAR(255) NOT NULL,
  "type" VARCHAR(100) NOT NULL,
  "size" BIGINT NOT NULL,
  "path" VARCHAR(500) NOT NULL,
  "url" VARCHAR(500) NOT NULL,
  "created_by" BIGINT NOT NULL,
  "created_date" TIMESTAMP NOT NULL,
  PRIMARY KEY ("id")
);

-- Table: chat_message
CREATE TABLE "chat_message" (
  "id" BIGINT NOT NULL,
  "session_id" BIGINT NOT NULL,
  "parent_message_id" BIGINT NULL,
  "role" VARCHAR(255) NOT NULL,
  "content" TEXT NOT NULL,
  "attachments" JSONB NULL,
  "is_streaming" VARCHAR(255) NULL,
  "feedback_comment" VARCHAR(500) NULL,
  "tenant_id" BIGINT NOT NULL,
  "created_by" BIGINT NOT NULL,
  "created_date" TIMESTAMP NOT NULL,
  "modified_by" BIGINT NULL,
  "modified_date" TIMESTAMP NULL,
  PRIMARY KEY ("id")
);

-- Table: chat_session
CREATE TABLE "chat_session" (
  "id" BIGINT NOT NULL,
  "title" VARCHAR(200) NOT NULL,
  "app_id" BIGINT NOT NULL,
  "model_id" BIGINT NOT NULL,
  "config" JSONB NULL,
  "is_starred" VARCHAR(255) NOT NULL,
  "last_message_role" VARCHAR(255) NULL,
  "last_message_time" BIGINT NULL,
  "tenant_id" BIGINT NOT NULL,
  "created_by" BIGINT NOT NULL,
  "created_date" TIMESTAMP NOT NULL,
  "modified_by" BIGINT NULL,
  "modified_date" TIMESTAMP NULL,
  PRIMARY KEY ("id")
);

-- Table: dataset
CREATE TABLE "dataset" (
  "id" BIGINT NOT NULL,
  "name" VARCHAR(50) NOT NULL,
  "description" VARCHAR(500) NOT NULL,
  "type" VARCHAR(255) NOT NULL,
  "status" VARCHAR(255) NOT NULL,
  "visibility" VARCHAR(255) NOT NULL,
  "icon" VARCHAR(255) NOT NULL,
  "icon_bg" VARCHAR(255) NULL,
  "tags" JSONB NULL,
  "access_count" BIGINT NULL DEFAULT 0,
  "last_sync_time" BIGINT NULL,
  "sync_status" VARCHAR(255) NULL,
  "sync_error" VARCHAR(255) NULL,
  "error_message" VARCHAR(255) NULL,
  "error_count" VARCHAR(255) NULL,
  "tenant_id" BIGINT NOT NULL,
  "created_by" BIGINT NOT NULL,
  "created_date" TIMESTAMP NOT NULL,
  "modified_by" BIGINT NULL,
  "modified_date" TIMESTAMP NULL,
  PRIMARY KEY ("id")
);

-- Table: dataset_data
CREATE TABLE "dataset_data" (
  "id" BIGINT NOT NULL,
  "dataset_id" BIGINT NULL,
  "name" VARCHAR(400) NOT NULL,
  "type" VARCHAR(255) NOT NULL,
  "status" VARCHAR(255) NOT NULL,
  "data_count" BIGINT NULL,
  "data_size" BIGINT NULL,
  "tenant_id" BIGINT NOT NULL,
  "created_by" BIGINT NOT NULL,
  "created_date" TIMESTAMP NOT NULL,
  "modified_by" BIGINT NULL,
  "modified_date" TIMESTAMP NULL,
  PRIMARY KEY ("id")
);

-- Table: knowledge_base
CREATE TABLE "knowledge_base" (
  "id" BIGINT NOT NULL,
  "name" VARCHAR(255) NOT NULL,
  "icon" VARCHAR(255) NOT NULL,
  "icon_bg" VARCHAR(255) NOT NULL,
  "description" VARCHAR(255) NULL,
  "visibility" VARCHAR(255) NOT NULL,
  "enabled" VARCHAR(255) NOT NULL,
  "tags" JSONB NULL,
  "tenant_id" BIGINT NOT NULL,
  "created_by" BIGINT NOT NULL,
  "created_date" TIMESTAMP NOT NULL,
  "modified_by" BIGINT NULL,
  "modified_date" TIMESTAMP NULL,
  PRIMARY KEY ("id")
);

-- Table: knowledge_base_document
CREATE TABLE "knowledge_base_document" (
  "id" BIGINT NOT NULL,
  "knowledge_base_id" BIGINT NOT NULL,
  "name" VARCHAR(255) NOT NULL,
  "type" VARCHAR(255) NOT NULL,
  "size" BIGINT NOT NULL,
  "status" VARCHAR(255) NOT NULL,
  "enabled" VARCHAR(255) NOT NULL,
  "file_path" VARCHAR(255) NULL,
  "content_hash" VARCHAR(255) NULL,
  "tenant_id" BIGINT NOT NULL,
  "created_by" BIGINT NOT NULL,
  "created_date" TIMESTAMP NOT NULL,
  "modified_by" BIGINT NULL,
  "modified_date" TIMESTAMP NULL,
  PRIMARY KEY ("id")
);

-- Table: knowledge_base_document_chunk
CREATE TABLE "knowledge_base_document_chunk" (
  "id" BIGINT NOT NULL,
  "document_id" BIGINT NOT NULL,
  "chunk_index" INTEGER NOT NULL,
  "content" TEXT NOT NULL,
  "embedding_vector" TEXT NULL,
  "metadata" TEXT NULL,
  "page_no" INTEGER NULL,
  "position" VARCHAR(255) NULL,
  "tenant_id" BIGINT NOT NULL,
  "created_by" BIGINT NOT NULL,
  "created_date" TIMESTAMP NOT NULL,
  "modified_by" BIGINT NULL,
  "modified_date" TIMESTAMP NULL,
  PRIMARY KEY ("id")
);

-- Table: model
CREATE TABLE "model" (
  "id" BIGINT NOT NULL,
  "name" VARCHAR(50) NOT NULL,
  "description" VARCHAR(500) NOT NULL,
  "type" VARCHAR(255) NOT NULL,
  "provider" VARCHAR(255) NOT NULL,
  "version" VARCHAR(40) NULL,
  "status" VARCHAR(255) NOT NULL,
  "config" JSONB NULL,
  "access_limit" JSONB NULL,
  "tenant_id" BIGINT NOT NULL,
  "created_by" BIGINT NOT NULL,
  "created_date" TIMESTAMP NOT NULL,
  "modified_by" BIGINT NULL,
  "modified_date" TIMESTAMP NULL,
  PRIMARY KEY ("id")
);

-- Table: model_call_record
CREATE TABLE "model_call_record" (
  "id" BIGINT NOT NULL,
  "model_id" BIGINT NOT NULL,
  "success" VARCHAR(255) NOT NULL,
  "created_by" BIGINT NOT NULL,
  "created_date" TIMESTAMP NOT NULL,
  PRIMARY KEY ("id")
);

-- Table: plugin
CREATE TABLE "plugin" (
  "id" BIGINT NOT NULL,
  "name" VARCHAR(100) NOT NULL,
  "icon" VARCHAR(255) NULL,
  "description" VARCHAR(500) NULL,
  "author" VARCHAR(100) NULL,
  "version" VARCHAR(20) NOT NULL,
  "category" VARCHAR(255) NOT NULL,
  "status" VARCHAR(255) NOT NULL,
  "tags" JSONB NULL,
  "published_date" TIMESTAMP NULL,
  "homepage_url" VARCHAR(500) NULL,
  "documentation_url" VARCHAR(500) NULL,
  "repository_url" VARCHAR(500) NULL,
  "support_url" VARCHAR(500) NULL,
  "license" VARCHAR(50) NULL,
  "price" VARCHAR(255) NULL,
  "tenant_id" BIGINT NOT NULL,
  "created_by" BIGINT NOT NULL,
  "created_date" TIMESTAMP NOT NULL,
  "modified_by" BIGINT NULL,
  "modified_date" TIMESTAMP NULL,
  PRIMARY KEY ("id")
);

-- Table: plugin_record
CREATE TABLE "plugin_record" (
  "id" BIGINT NOT NULL,
  "plugin_id" BIGINT NOT NULL,
  "type" VARCHAR(255) NOT NULL,
  "created_by" BIGINT NOT NULL,
  "created_date" TIMESTAMP NOT NULL,
  PRIMARY KEY ("id")
);

-- Table: plugin_review
CREATE TABLE "plugin_review" (
  "id" BIGINT NOT NULL,
  "plugin_id" BIGINT NOT NULL,
  "rating" INTEGER NOT NULL,
  "content" VARCHAR(200) NULL,
  "created_by" BIGINT NOT NULL,
  "created_date" TIMESTAMP NOT NULL,
  PRIMARY KEY ("id")
);

-- Table: resource_sharing
CREATE TABLE "resource_sharing" (
  "id" BIGINT NOT NULL,
  "resource_id" BIGINT NOT NULL,
  "resource_type" VARCHAR(255) NOT NULL,
  "resource_name" VARCHAR(200) NULL,
  "owner_id" BIGINT NOT NULL,
  "shared_with" VARCHAR(255) NOT NULL,
  "member_ids" JSONB NULL,
  "enabled" BOOLEAN NULL,
  "tenant_id" BIGINT NOT NULL,
  "created_by" BIGINT NOT NULL,
  "created_date" TIMESTAMP NOT NULL,
  "modified_by" BIGINT NULL,
  "modified_date" TIMESTAMP NULL,
  PRIMARY KEY ("id")
);

-- Table: resource_sharing
CREATE TABLE "resource_sharing" (
  "id" BIGINT NOT NULL,
  "resource_id" BIGINT NOT NULL,
  "resource_type" VARCHAR(255) NOT NULL,
  "tenant_id" BIGINT NOT NULL
  PRIMARY KEY ("id")
);

-- Table: resource_sharing_access_log
CREATE TABLE "resource_sharing_access_log" (
  "id" BIGINT NOT NULL,
  "resource_id" BIGINT NOT NULL,
  "resource_type" VARCHAR(255) NOT NULL,
  "user_id" BIGINT NOT NULL,
  "access_action" VARCHAR(255) NOT NULL,
  "metadata" JSONB NULL,
  "user_agent" VARCHAR(500) NULL,
  "tenant_id" BIGINT NOT NULL,
  "created_by" BIGINT NOT NULL,
  "created_date" TIMESTAMP NOT NULL,
  "modified_by" BIGINT NULL,
  "modified_date" TIMESTAMP NULL,
  PRIMARY KEY ("id")
);

-- Table: resource_sharing_member
CREATE TABLE "resource_sharing_member" (
  "id" BIGINT NOT NULL,
  "sharing_id" BIGINT NULL,
  "resource_id" BIGINT NOT NULL,
  "resource_type" VARCHAR(255) NOT NULL,
  "user_id" BIGINT NOT NULL,
  "permission" VARCHAR(255) NOT NULL,
  "last_accessed" TIMESTAMP NULL,
  "access_count" VARCHAR(255) NULL,
  "created_by" BIGINT NOT NULL,
  "created_date" TIMESTAMP NOT NULL,
  PRIMARY KEY ("id")
);

-- Table: ai_notification
CREATE TABLE "ai_notification" (
  "id" BIGINT NOT NULL,
  "type" VARCHAR(20) NOT NULL,
  "title" VARCHAR(200) NOT NULL,
  "description" VARCHAR(1000) NOT NULL,
  "category" VARCHAR(100) NOT NULL,
  "is_read" BOOLEAN NOT NULL DEFAULT FALSE,
  "is_starred" BOOLEAN NOT NULL DEFAULT FALSE,
  "is_archived" BOOLEAN NOT NULL DEFAULT FALSE,
  "is_email_sent" BOOLEAN NOT NULL DEFAULT FALSE,
  "priority" VARCHAR(20) NOT NULL DEFAULT 'MEDIUM',
  "timestamp" TIMESTAMP NOT NULL,
  "target_user_id" BIGINT NULL,
  "tenant_id" BIGINT NULL,
  PRIMARY KEY ("id")
);

-- Table: team_activity
CREATE TABLE "team_activity" (
  "id" BIGINT NOT NULL,
  "resource_id" BIGINT NULL,
  "resource_type" VARCHAR(50) NULL,
  "resource_name" VARCHAR(255) NULL,
  "user_id" BIGINT NULL,
  "action_type" VARCHAR(255) NULL,
  "status" VARCHAR(255) NULL,
  "activity_date" TIMESTAMP NULL,
  "ip_address" VARCHAR(255) NULL,
  "user_agent" VARCHAR(255) NULL,
  "tenant_id" BIGINT NOT NULL
  PRIMARY KEY ("id")
);

-- Table: team_settings
CREATE TABLE "team_settings" (
  "id" BIGINT NOT NULL,
  "team_avatar" VARCHAR(400) NULL,
  "team_name" VARCHAR(50) NULL,
  "team_email" VARCHAR(100) NULL,
  "team_description" VARCHAR(200) NULL,
  "team_scale" VARCHAR(255) NULL,
  "industry" VARCHAR(255) NULL,
  "tenant_id" BIGINT NOT NULL,
  "created_by" BIGINT NOT NULL,
  "created_date" TIMESTAMP NOT NULL,
  "modified_by" BIGINT NULL,
  "modified_date" TIMESTAMP NULL,
  PRIMARY KEY ("id")
);

-- Table: usage_statistics
CREATE TABLE "usage_statistics" (
  "id" BIGINT NOT NULL,
  "stat_date" DATE NOT NULL,
  "granularity" VARCHAR(255) NOT NULL,
  "app_id" BIGINT NULL,
  "model_id" BIGINT NULL,
  "total_calls" INTEGER NOT NULL,
  "successful_calls" INTEGER NOT NULL,
  "failed_calls" INTEGER NOT NULL,
  "total_input_tokens" BIGINT NULL,
  "total_output_tokens" BIGINT NULL,
  "total_tokens" BIGINT NULL,
  "total_cost" BIGINT NULL,
  "avg_response_time_ms" INTEGER NULL,
  "p50_response_time_ms" INTEGER NULL,
  "p95_response_time_ms" INTEGER NULL,
  "p99_response_time_ms" INTEGER NULL,
  "active_users" INTEGER NULL,
  "tenant_id" BIGINT NOT NULL,
  "created_by" BIGINT NOT NULL,
  "created_date" TIMESTAMP NOT NULL,
  "modified_by" BIGINT NULL,
  "modified_date" TIMESTAMP NULL,
  PRIMARY KEY ("id")
);

-- Table: vector_store
CREATE TABLE "vector_store" (
  "id" BIGINT NOT NULL,
  "name" VARCHAR(100) NOT NULL,
  "type" VARCHAR(255) NOT NULL,
  "description" VARCHAR(500) NULL,
  "config" JSONB NULL,
  "status" VARCHAR(255) NOT NULL,
  "enabled" BIGINT NOT NULL,
  "dimension" INTEGER NULL,
  "response_time" BIGINT NULL,
  "version" VARCHAR(255) NULL,
  "tenant_id" BIGINT NOT NULL,
  "created_by" BIGINT NOT NULL,
  "created_date" TIMESTAMP NOT NULL,
  "modified_by" BIGINT NULL,
  "modified_date" TIMESTAMP NULL,
  PRIMARY KEY ("id")
);

-- Table: vector_store_access_log
CREATE TABLE "vector_store_access_log" (
  "id" BIGINT NOT NULL,
  "vector_store_id" BIGINT NOT NULL,
  "query_date" TIMESTAMP NOT NULL,
  "response_time" BIGINT NULL,
  "status" VARCHAR(20) NOT NULL,
  "user_id" BIGINT NULL,
  "error_message" VARCHAR(500) NULL,
  "ip_address" VARCHAR(50) NULL,
  "tenant_id" BIGINT NOT NULL,
  PRIMARY KEY ("id")
);

-- Table: workflow
CREATE TABLE "workflow" (
  "id" BIGINT NOT NULL,
  "name" VARCHAR(50) NOT NULL,
  "description" VARCHAR(500) NULL,
  "icon" VARCHAR(10) NULL,
  "icon_bg" VARCHAR(20) NULL,
  "type" VARCHAR(255) NOT NULL,
  "status" VARCHAR(255) NOT NULL,
  "version" VARCHAR(20) NULL,
  "visibility" VARCHAR(255) NOT NULL,
  "config" JSONB NULL,
  "tags" JSONB NULL,
  "version_count" BIGINT NULL DEFAULT 0,
  "last_execution_status" VARCHAR(255) NULL,
  "tenant_id" BIGINT NOT NULL,
  "created_by" BIGINT NOT NULL,
  "created_date" TIMESTAMP NOT NULL,
  "modified_by" BIGINT NULL,
  "modified_date" TIMESTAMP NULL,
  PRIMARY KEY ("id")
);

-- ========================================
-- Indexes
-- ========================================

-- Indexes for ai_prompt
CREATE INDEX idx_ai_prompt_tenant_id ON "ai_prompt" ("tenant_id");
CREATE INDEX idx_ai_prompt_created_by ON "ai_prompt" ("created_by");
CREATE INDEX idx_ai_prompt_modified_date ON "ai_prompt" ("modified_date");
CREATE INDEX idx_ai_prompt_created_date ON "ai_prompt" ("created_date");
CREATE INDEX idx_ai_prompt_category_id ON "ai_prompt" ("category_id");
CREATE INDEX idx_ai_prompt_title_fulltext ON "ai_prompt" USING GIN (to_tsvector('english', "title"));
CREATE INDEX idx_ai_prompt_description_fulltext ON "ai_prompt" USING GIN (to_tsvector('english', "description"));

-- Indexes for ai_prompt_category
CREATE INDEX idx_ai_prompt_category_tenant_id ON "ai_prompt_category" ("tenant_id");
CREATE INDEX idx_ai_prompt_category_created_by ON "ai_prompt_category" ("created_by");
CREATE INDEX idx_ai_prompt_category_modified_date ON "ai_prompt_category" ("modified_date");
CREATE INDEX idx_ai_prompt_category_created_date ON "ai_prompt_category" ("created_date");
CREATE INDEX idx_ai_prompt_category_name_fulltext ON "ai_prompt_category" USING GIN (to_tsvector('english', "name"));

-- Indexes for ai_prompt_favorites
CREATE INDEX idx_ai_prompt_favorites_created_by ON "ai_prompt_favorites" ("created_by");
CREATE INDEX idx_ai_prompt_favorites_created_date ON "ai_prompt_favorites" ("created_date");
CREATE INDEX idx_ai_prompt_favorites_prompt_id ON "ai_prompt_favorites" ("prompt_id");

-- Indexes for ai_notification
CREATE INDEX idx_ai_notification_tenant_id ON "ai_notification" ("tenant_id");
CREATE INDEX idx_ai_notification_is_read ON "ai_notification" ("is_read");
CREATE INDEX idx_ai_notification_is_starred ON "ai_notification" ("is_starred");
CREATE INDEX idx_ai_notification_is_archived ON "ai_notification" ("is_archived");
CREATE INDEX idx_ai_notification_is_email_sent ON "ai_notification" ("is_email_sent");
CREATE INDEX idx_ai_notification_category ON "ai_notification" ("category");
CREATE INDEX idx_ai_notification_priority ON "ai_notification" ("priority");
CREATE INDEX idx_ai_notification_timestamp ON "ai_notification" ("timestamp");
CREATE INDEX idx_ai_notification_title_description_fulltext ON "ai_notification" USING GIN (to_tsvector('english', COALESCE("title", '') || ' ' || COALESCE("description", '')));

-- Indexes for api_collection
CREATE INDEX idx_api_collection_tenant_id ON "api_collection" ("tenant_id");
CREATE INDEX idx_api_collection_created_by ON "api_collection" ("created_by");
CREATE INDEX idx_api_collection_modified_date ON "api_collection" ("modified_date");
CREATE INDEX idx_api_collection_created_date ON "api_collection" ("created_date");
CREATE INDEX idx_api_collection_visibility ON "api_collection" ("visibility");
CREATE INDEX idx_api_collection_name_description_fulltext ON "api_collection" USING GIN (to_tsvector('english', COALESCE("name", '') || ' ' || COALESCE("description", '')));

-- Indexes for api_endpoint
CREATE INDEX idx_api_endpoint_tenant_id ON "api_endpoint" ("tenant_id");
CREATE INDEX idx_api_endpoint_created_by ON "api_endpoint" ("created_by");
CREATE INDEX idx_api_endpoint_modified_date ON "api_endpoint" ("modified_date");
CREATE INDEX idx_api_endpoint_created_date ON "api_endpoint" ("created_date");
CREATE INDEX idx_api_endpoint_collection_id ON "api_endpoint" ("collection_id");
CREATE INDEX idx_api_endpoint_name_description_fulltext ON "api_endpoint" USING GIN (to_tsvector('english', COALESCE("name", '') || ' ' || COALESCE("description", '')));

-- Indexes for api_endpoint_call_log
CREATE INDEX idx_api_endpoint_call_log_tenant_id ON "api_endpoint_call_log" ("tenant_id");
CREATE INDEX idx_api_endpoint_call_log_status ON "api_endpoint_call_log" ("status");
CREATE INDEX idx_api_endpoint_call_log_call_date ON "api_endpoint_call_log" ("call_date");
CREATE INDEX idx_api_endpoint_call_log_endpoint_id ON "api_endpoint_call_log" ("endpoint_id");
CREATE INDEX idx_api_endpoint_call_log_user_id ON "api_endpoint_call_log" ("user_id");

-- Indexes for api_key
CREATE INDEX idx_api_key_tenant_id ON "api_key" ("tenant_id");
CREATE INDEX idx_api_key_status ON "api_key" ("status");
CREATE INDEX idx_api_key_created_by ON "api_key" ("created_by");
CREATE INDEX idx_api_key_modified_date ON "api_key" ("modified_date");
CREATE INDEX idx_api_key_created_date ON "api_key" ("created_date");
CREATE INDEX idx_api_key_name_fulltext ON "api_key" USING GIN (to_tsvector('english', "name"));

-- Indexes for api_key_resource
CREATE INDEX idx_api_key_resource_created_by ON "api_key_resource" ("created_by");
CREATE INDEX idx_api_key_resource_created_date ON "api_key_resource" ("created_date");
CREATE INDEX idx_api_key_resource_api_key_id ON "api_key_resource" ("api_key_id");
CREATE INDEX idx_api_key_resource_resource_type ON "api_key_resource" ("resource_type");
CREATE INDEX idx_api_key_resource_resource_id ON "api_key_resource" ("resource_id");

-- Indexes for api_usage_log
CREATE INDEX idx_api_usage_log_tenant_id ON "api_usage_log" ("tenant_id");
CREATE INDEX idx_api_usage_log_created_by ON "api_usage_log" ("created_by");
CREATE INDEX idx_api_usage_log_modified_date ON "api_usage_log" ("modified_date");
CREATE INDEX idx_api_usage_log_created_date ON "api_usage_log" ("created_date");
CREATE INDEX idx_api_usage_log_request_time ON "api_usage_log" ("request_time");
CREATE INDEX idx_api_usage_log_app_id ON "api_usage_log" ("app_id");
CREATE INDEX idx_api_usage_log_user_id ON "api_usage_log" ("user_id");
CREATE INDEX idx_api_usage_log_model_id ON "api_usage_log" ("model_id");

-- Indexes for application
CREATE INDEX idx_application_tenant_id ON "application" ("tenant_id");
CREATE INDEX idx_application_status ON "application" ("status");
CREATE INDEX idx_application_created_by ON "application" ("created_by");
CREATE INDEX idx_application_modified_date ON "application" ("modified_date");
CREATE INDEX idx_application_created_date ON "application" ("created_date");
CREATE INDEX idx_application_category ON "application" ("category");
CREATE INDEX idx_application_visibility ON "application" ("visibility");
CREATE INDEX idx_application_model_id ON "application" ("model_id");
CREATE INDEX idx_application_knowledge_base_id ON "application" ("knowledge_base_id");
CREATE INDEX idx_application_dataset_id ON "application" ("dataset_id");
CREATE INDEX idx_application_workflow_id ON "application" ("workflow_id");
CREATE INDEX idx_application_name_description_fulltext ON "application" USING GIN (to_tsvector('english', COALESCE("name", '') || ' ' || COALESCE("description", '')));

-- Indexes for chat_attachment
CREATE INDEX idx_chat_attachment_created_by ON "chat_attachment" ("created_by");
CREATE INDEX idx_chat_attachment_created_date ON "chat_attachment" ("created_date");
CREATE INDEX idx_chat_attachment_type ON "chat_attachment" ("type");
CREATE INDEX idx_chat_attachment_name_fulltext ON "chat_attachment" USING GIN (to_tsvector('english', "name"));

-- Indexes for chat_message
CREATE INDEX idx_chat_message_tenant_id ON "chat_message" ("tenant_id");
CREATE INDEX idx_chat_message_created_by ON "chat_message" ("created_by");
CREATE INDEX idx_chat_message_modified_date ON "chat_message" ("modified_date");
CREATE INDEX idx_chat_message_created_date ON "chat_message" ("created_date");
CREATE INDEX idx_chat_message_session_id ON "chat_message" ("session_id");
CREATE INDEX idx_chat_message_parent_message_id ON "chat_message" ("parent_message_id");

-- Indexes for chat_session
CREATE INDEX idx_chat_session_tenant_id ON "chat_session" ("tenant_id");
CREATE INDEX idx_chat_session_created_by ON "chat_session" ("created_by");
CREATE INDEX idx_chat_session_modified_date ON "chat_session" ("modified_date");
CREATE INDEX idx_chat_session_created_date ON "chat_session" ("created_date");
CREATE INDEX idx_chat_session_app_id ON "chat_session" ("app_id");
CREATE INDEX idx_chat_session_model_id ON "chat_session" ("model_id");
CREATE INDEX idx_chat_session_title_fulltext ON "chat_session" USING GIN (to_tsvector('english', "title"));

-- Indexes for dataset
CREATE INDEX idx_dataset_tenant_id ON "dataset" ("tenant_id");
CREATE INDEX idx_dataset_status ON "dataset" ("status");
CREATE INDEX idx_dataset_created_by ON "dataset" ("created_by");
CREATE INDEX idx_dataset_modified_date ON "dataset" ("modified_date");
CREATE INDEX idx_dataset_created_date ON "dataset" ("created_date");
CREATE INDEX idx_dataset_type ON "dataset" ("type");
CREATE INDEX idx_dataset_visibility ON "dataset" ("visibility");
CREATE INDEX idx_dataset_name_description_fulltext ON "dataset" USING GIN (to_tsvector('english', COALESCE("name", '') || ' ' || COALESCE("description", '')));

-- Indexes for dataset_data
CREATE INDEX idx_dataset_data_tenant_id ON "dataset_data" ("tenant_id");
CREATE INDEX idx_dataset_data_status ON "dataset_data" ("status");
CREATE INDEX idx_dataset_data_created_by ON "dataset_data" ("created_by");
CREATE INDEX idx_dataset_data_modified_date ON "dataset_data" ("modified_date");
CREATE INDEX idx_dataset_data_created_date ON "dataset_data" ("created_date");
CREATE INDEX idx_dataset_data_dataset_id ON "dataset_data" ("dataset_id");
CREATE INDEX idx_dataset_data_type ON "dataset_data" ("type");
CREATE INDEX idx_dataset_data_name_fulltext ON "dataset_data" USING GIN (to_tsvector('english', "name"));

-- Indexes for knowledge_base
CREATE INDEX idx_knowledge_base_tenant_id ON "knowledge_base" ("tenant_id");
CREATE INDEX idx_knowledge_base_enabled ON "knowledge_base" ("enabled");
CREATE INDEX idx_knowledge_base_created_by ON "knowledge_base" ("created_by");
CREATE INDEX idx_knowledge_base_modified_date ON "knowledge_base" ("modified_date");
CREATE INDEX idx_knowledge_base_created_date ON "knowledge_base" ("created_date");
CREATE INDEX idx_knowledge_base_visibility ON "knowledge_base" ("visibility");
CREATE INDEX idx_knowledge_base_name_description_fulltext ON "knowledge_base" USING GIN (to_tsvector('english', COALESCE("name", '') || ' ' || COALESCE("description", '')));

-- Indexes for knowledge_base_document
CREATE INDEX idx_knowledge_base_document_tenant_id ON "knowledge_base_document" ("tenant_id");
CREATE INDEX idx_knowledge_base_document_status ON "knowledge_base_document" ("status");
CREATE INDEX idx_knowledge_base_document_enabled ON "knowledge_base_document" ("enabled");
CREATE INDEX idx_knowledge_base_document_created_by ON "knowledge_base_document" ("created_by");
CREATE INDEX idx_knowledge_base_document_modified_date ON "knowledge_base_document" ("modified_date");
CREATE INDEX idx_knowledge_base_document_created_date ON "knowledge_base_document" ("created_date");
CREATE INDEX idx_knowledge_base_document_knowledge_base_id ON "knowledge_base_document" ("knowledge_base_id");
CREATE INDEX idx_knowledge_base_document_type ON "knowledge_base_document" ("type");
CREATE INDEX idx_knowledge_base_document_name_fulltext ON "knowledge_base_document" USING GIN (to_tsvector('english', "name"));

-- Indexes for knowledge_base_document_chunk
CREATE INDEX idx_knowledge_base_document_chunk_tenant_id ON "knowledge_base_document_chunk" ("tenant_id");
CREATE INDEX idx_knowledge_base_document_chunk_created_by ON "knowledge_base_document_chunk" ("created_by");
CREATE INDEX idx_knowledge_base_document_chunk_modified_date ON "knowledge_base_document_chunk" ("modified_date");
CREATE INDEX idx_knowledge_base_document_chunk_created_date ON "knowledge_base_document_chunk" ("created_date");
CREATE INDEX idx_knowledge_base_document_chunk_document_id ON "knowledge_base_document_chunk" ("document_id");

-- Indexes for model
CREATE INDEX idx_model_tenant_id ON "model" ("tenant_id");
CREATE INDEX idx_model_status ON "model" ("status");
CREATE INDEX idx_model_created_by ON "model" ("created_by");
CREATE INDEX idx_model_modified_date ON "model" ("modified_date");
CREATE INDEX idx_model_created_date ON "model" ("created_date");
CREATE INDEX idx_model_type ON "model" ("type");
CREATE INDEX idx_model_name_description_fulltext ON "model" USING GIN (to_tsvector('english', COALESCE("name", '') || ' ' || COALESCE("description", '')));

-- Indexes for model_call_record
CREATE INDEX idx_model_call_record_created_by ON "model_call_record" ("created_by");
CREATE INDEX idx_model_call_record_created_date ON "model_call_record" ("created_date");
CREATE INDEX idx_model_call_record_success ON "model_call_record" ("success");
CREATE INDEX idx_model_call_record_model_id ON "model_call_record" ("model_id");

-- Indexes for plugin
CREATE INDEX idx_plugin_tenant_id ON "plugin" ("tenant_id");
CREATE INDEX idx_plugin_status ON "plugin" ("status");
CREATE INDEX idx_plugin_created_by ON "plugin" ("created_by");
CREATE INDEX idx_plugin_modified_date ON "plugin" ("modified_date");
CREATE INDEX idx_plugin_created_date ON "plugin" ("created_date");
CREATE INDEX idx_plugin_category ON "plugin" ("category");
CREATE INDEX idx_plugin_type ON "plugin" ("type");
CREATE INDEX idx_plugin_name_description_fulltext ON "plugin" USING GIN (to_tsvector('english', COALESCE("name", '') || ' ' || COALESCE("description", '')));

-- Indexes for plugin_record
CREATE INDEX idx_plugin_record_created_by ON "plugin_record" ("created_by");
CREATE INDEX idx_plugin_record_created_date ON "plugin_record" ("created_date");
CREATE INDEX idx_plugin_record_plugin_id ON "plugin_record" ("plugin_id");
CREATE INDEX idx_plugin_record_type ON "plugin_record" ("type");

-- Indexes for plugin_review
CREATE INDEX idx_plugin_review_created_by ON "plugin_review" ("created_by");
CREATE INDEX idx_plugin_review_created_date ON "plugin_review" ("created_date");
CREATE INDEX idx_plugin_review_plugin_id ON "plugin_review" ("plugin_id");

-- Indexes for resource_sharing
CREATE INDEX idx_resource_sharing_tenant_id ON "resource_sharing" ("tenant_id");
CREATE INDEX idx_resource_sharing_created_by ON "resource_sharing" ("created_by");
CREATE INDEX idx_resource_sharing_modified_date ON "resource_sharing" ("modified_date");
CREATE INDEX idx_resource_sharing_created_date ON "resource_sharing" ("created_date");
CREATE INDEX idx_resource_sharing_resource_id ON "resource_sharing" ("resource_id");
CREATE INDEX idx_resource_sharing_resource_type ON "resource_sharing" ("resource_type");
CREATE INDEX idx_resource_sharing_enabled ON "resource_sharing" ("enabled");
CREATE INDEX idx_resource_sharing_resource_name_fulltext ON "resource_sharing" USING GIN (to_tsvector('english', "resource_name"));

-- Indexes for resource_sharing_access_log
CREATE INDEX idx_resource_sharing_access_log_tenant_id ON "resource_sharing_access_log" ("tenant_id");
CREATE INDEX idx_resource_sharing_access_log_created_by ON "resource_sharing_access_log" ("created_by");
CREATE INDEX idx_resource_sharing_access_log_modified_date ON "resource_sharing_access_log" ("modified_date");
CREATE INDEX idx_resource_sharing_access_log_created_date ON "resource_sharing_access_log" ("created_date");
CREATE INDEX idx_resource_sharing_access_log_resource_id ON "resource_sharing_access_log" ("resource_id");
CREATE INDEX idx_resource_sharing_access_log_resource_type ON "resource_sharing_access_log" ("resource_type");
CREATE INDEX idx_resource_sharing_access_log_user_id ON "resource_sharing_access_log" ("user_id");
CREATE INDEX idx_resource_sharing_access_log_action_type ON "resource_sharing_access_log" ("access_action");

-- Indexes for resource_sharing_member
CREATE INDEX idx_resource_sharing_member_created_by ON "resource_sharing_member" ("created_by");
CREATE INDEX idx_resource_sharing_member_created_date ON "resource_sharing_member" ("created_date");
CREATE INDEX idx_resource_sharing_member_sharing_id ON "resource_sharing_member" ("sharing_id");
CREATE INDEX idx_resource_sharing_member_resource_id ON "resource_sharing_member" ("resource_id");
CREATE INDEX idx_resource_sharing_member_resource_type ON "resource_sharing_member" ("resource_type");
CREATE INDEX idx_resource_sharing_member_user_id ON "resource_sharing_member" ("user_id");
CREATE INDEX idx_resource_sharing_member_permission ON "resource_sharing_member" ("permission");

-- Indexes for team_activity
CREATE INDEX idx_team_activity_tenant_id ON "team_activity" ("tenant_id");
CREATE INDEX idx_team_activity_status ON "team_activity" ("status");
CREATE INDEX idx_team_activity_activity_date ON "team_activity" ("activity_date");
CREATE INDEX idx_team_activity_resource_id ON "team_activity" ("resource_id");
CREATE INDEX idx_team_activity_resource_type ON "team_activity" ("resource_type");
CREATE INDEX idx_team_activity_user_id ON "team_activity" ("user_id");
CREATE INDEX idx_team_activity_action_type ON "team_activity" ("action_type");
CREATE INDEX idx_team_activity_resource_name_fulltext ON "team_activity" USING GIN (to_tsvector('english', "resource_name"));

-- Indexes for team_settings
CREATE INDEX idx_team_settings_tenant_id ON "team_settings" ("tenant_id");
CREATE INDEX idx_team_settings_created_by ON "team_settings" ("created_by");
CREATE INDEX idx_team_settings_modified_date ON "team_settings" ("modified_date");
CREATE INDEX idx_team_settings_created_date ON "team_settings" ("created_date");
CREATE INDEX idx_team_settings_team_name_fulltext ON "team_settings" USING GIN (to_tsvector('english', "team_name"));
CREATE INDEX idx_team_settings_team_description_fulltext ON "team_settings" USING GIN (to_tsvector('english', "team_description"));

-- Indexes for usage_statistics
CREATE INDEX idx_usage_statistics_tenant_id ON "usage_statistics" ("tenant_id");
CREATE INDEX idx_usage_statistics_created_by ON "usage_statistics" ("created_by");
CREATE INDEX idx_usage_statistics_modified_date ON "usage_statistics" ("modified_date");
CREATE INDEX idx_usage_statistics_created_date ON "usage_statistics" ("created_date");
CREATE INDEX idx_usage_statistics_stat_date ON "usage_statistics" ("stat_date");
CREATE INDEX idx_usage_statistics_app_id ON "usage_statistics" ("app_id");
CREATE INDEX idx_usage_statistics_model_id ON "usage_statistics" ("model_id");

-- Indexes for vector_store
CREATE INDEX idx_vector_store_tenant_id ON "vector_store" ("tenant_id");
CREATE INDEX idx_vector_store_status ON "vector_store" ("status");
CREATE INDEX idx_vector_store_created_by ON "vector_store" ("created_by");
CREATE INDEX idx_vector_store_modified_date ON "vector_store" ("modified_date");
CREATE INDEX idx_vector_store_created_date ON "vector_store" ("created_date");
CREATE INDEX idx_vector_store_type ON "vector_store" ("type");
CREATE INDEX idx_vector_store_enabled ON "vector_store" ("enabled");
CREATE INDEX idx_vector_store_name_description_fulltext ON "vector_store" USING GIN (to_tsvector('english', COALESCE("name", '') || ' ' || COALESCE("description", '')));

-- Indexes for vector_store_access_log
CREATE INDEX idx_vector_store_access_log_tenant_id ON "vector_store_access_log" ("tenant_id");
CREATE INDEX idx_vector_store_access_log_status ON "vector_store_access_log" ("status");
CREATE INDEX idx_vector_store_access_log_query_date ON "vector_store_access_log" ("query_date");
CREATE INDEX idx_vector_store_access_log_vector_store_id ON "vector_store_access_log" ("vector_store_id");
CREATE INDEX idx_vector_store_access_log_user_id ON "vector_store_access_log" ("user_id");

-- Indexes for workflow
CREATE INDEX idx_workflow_tenant_id ON "workflow" ("tenant_id");
CREATE INDEX idx_workflow_status ON "workflow" ("status");
CREATE INDEX idx_workflow_created_by ON "workflow" ("created_by");
CREATE INDEX idx_workflow_modified_date ON "workflow" ("modified_date");
CREATE INDEX idx_workflow_created_date ON "workflow" ("created_date");
CREATE INDEX idx_workflow_type ON "workflow" ("type");
CREATE INDEX idx_workflow_visibility ON "workflow" ("visibility");
CREATE INDEX idx_workflow_name_description_fulltext ON "workflow" USING GIN (to_tsvector('english', COALESCE("name", '') || ' ' || COALESCE("description", '')));
