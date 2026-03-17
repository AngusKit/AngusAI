import { useCallback, useEffect, useRef, useState } from 'react';
import { useDebounce } from '@/hooks/useDebounce';
import Applications from '@/services/Applications';
import Models from '@/services/Models';
import type {
  ApplicationListVo,
  AgentInfoVo,
  ModelInfoVo,
} from '@/services/ApplicationsTypes';
import type { ModelListVo } from '@/services/ModelsTypes';
import type { SessionDetailVo } from '@/services/ChatTypes';
import {
  ApplicationStatusEnum,
  AgentStatusEnum,
  ModelTypeEnum,
  ModelStatusEnum,
} from '@/enums/enums';
import { toast } from 'sonner';

const PAGE_SIZE = 5;

export interface ChatSwitcherSelection {
  appId: string;
  agentId: string;
  modelId: string;
  app?: ApplicationListVo;
  agent?: AgentInfoVo;
  model?: ModelListVo | ModelInfoVo;
}

/** 切换 API 返回结果，用于根据后端返回的 agentId/modelId 更新选中项 */
export type SwitchSessionResult = { data?: SessionDetailVo } | null;

interface UseChatSwitcherProps {
  selection: ChatSwitcherSelection;
  onSelectionChange: (s: ChatSwitcherSelection) => void;
  /** 当前会话 ID，有值时切换会调用后端 API */
  sessionId?: string;
  /** 切换应用/智能体/模型时调用的 API，返回更新后的会话详情 */
  onSwitch?: (
    type: 'app' | 'agent' | 'model',
    payload: { appId?: string; agentId?: string; modelId?: string }
  ) => Promise<SwitchSessionResult>;
}

export function useChatSwitcher({
  selection,
  onSelectionChange,
  sessionId,
  onSwitch,
}: UseChatSwitcherProps) {
  const [appOpen, setAppOpen] = useState(false);
  const [agentOpen, setAgentOpen] = useState(false);
  const [modelOpen, setModelOpen] = useState(false);

  const [appKeyword, setAppKeyword] = useState('');
  const [modelKeyword, setModelKeyword] = useState('');
  const debouncedAppKw = useDebounce(appKeyword, 500);
  const debouncedModelKw = useDebounce(modelKeyword, 500);

  const [apps, setApps] = useState<ApplicationListVo[]>([]);
  const [appPage, setAppPage] = useState(1);
  const [appTotal, setAppTotal] = useState(0);
  const [appLoading, setAppLoading] = useState(false);
  const [appLoadMore, setAppLoadMore] = useState(false);
  const appScrollRef = useRef<HTMLDivElement>(null);
  const appLoadingRef = useRef(false);

  const [models, setModels] = useState<ModelListVo[]>([]);
  const [modelPage, setModelPage] = useState(1);
  const [modelTotal, setModelTotal] = useState(0);
  const [modelLoading, setModelLoading] = useState(false);
  const [modelLoadMore, setModelLoadMore] = useState(false);
  const modelScrollRef = useRef<HTMLDivElement>(null);
  const modelLoadingRef = useRef(false);

  // 用 apps 解析 selection，切换 session 时避免因 selection 仅有 ids 无对象而闪动
  const resolvedApp =
    selection.app ?? (selection.appId ? apps.find((a) => String(a.id) === selection.appId) : undefined);
  const agents = resolvedApp?.agents ?? [];
  const defaultAgent = resolvedApp?.defaultAgent;
  const selectedAgent =
    selection.agent ??
    (selection.agentId ? agents.find((a) => String(a?.id) === selection.agentId) : undefined) ??
    defaultAgent ??
    agents.find((a) => a.status === AgentStatusEnum.ACTIVE) ??
    agents[0];
  const defaultModel = selectedAgent?.defaultModel;
  const selectedModelId = selection.modelId || defaultModel?.id;
  const resolvedModel =
    selection.model ??
    (defaultModel && String(defaultModel.id) === String(selectedModelId ?? '') ? defaultModel : undefined);

  const loadApps = useCallback(
    async (page: number, append: boolean) => {
      if (appLoadingRef.current) return;
      appLoadingRef.current = true;
      if (append) setAppLoadMore(true);
      else setAppLoading(true);
      try {
        const res = await Applications.getApplicationList({
          status: ApplicationStatusEnum.PUBLISHED,
          pageNo: page,
          pageSize: PAGE_SIZE,
          keyword: debouncedAppKw.trim() || undefined,
        } as any);
        const data = (res as any)?.data;
        const list: ApplicationListVo[] = data?.list ?? (Array.isArray(data) ? data : []);
        const total = data?.total ?? list.length;
        if (append) {
          setApps((prev) => {
            const seen = new Set(prev.map((a) => a.id));
            return [...prev, ...list.filter((a) => a.id && !seen.has(a.id))];
          });
        } else {
          setApps(list);
        }
        setAppTotal(total);
      } catch (e) {
        console.error('Load apps failed:', e);
        toast.error('加载应用失败');
      } finally {
        appLoadingRef.current = false;
        setAppLoading(false);
        setAppLoadMore(false);
      }
    },
    [debouncedAppKw]
  );

  const loadModels = useCallback(
    async (page: number, append: boolean) => {
      if (modelLoadingRef.current) return;
      modelLoadingRef.current = true;
      if (append) setModelLoadMore(true);
      else setModelLoading(true);
      try {
        const res = await Models.getModelList({
          type: ModelTypeEnum.CHAT,
          status: ModelStatusEnum.ACTIVE,
          pageNo: page,
          pageSize: PAGE_SIZE,
          keyword: debouncedModelKw.trim() || undefined,
        } as any);
        const data = (res as any)?.data;
        const list: ModelListVo[] = data?.list ?? (Array.isArray(data) ? data : []);
        const total = data?.total ?? list.length;
        if (append) {
          setModels((prev) => {
            const seen = new Set(prev.map((m) => m.id));
            return [...prev, ...list.filter((m) => m.id && !seen.has(m.id))];
          });
        } else {
          setModels(list);
        }
        setModelTotal(total);
      } catch (e) {
        console.error('Load models failed:', e);
        toast.error('加载模型失败');
      } finally {
        modelLoadingRef.current = false;
        setModelLoading(false);
        setModelLoadMore(false);
      }
    },
    [debouncedModelKw]
  );

  // 进入对话页面后自动加载应用列表
  useEffect(() => {
    setAppPage(1);
    loadApps(1, false);
  }, [loadApps]);

  useEffect(() => {
    if (appOpen) {
      setAppPage(1);
      loadApps(1, false);
    }
  }, [appOpen, debouncedAppKw, loadApps]);

  useEffect(() => {
    if (modelOpen) {
      setModelPage(1);
      loadModels(1, false);
    }
  }, [modelOpen, debouncedModelKw, loadModels]);

  // 进入对话页面后，应用列表加载完成时：优先根据会话的 appId/agentId/modelId 匹配，匹配不到再选中第一个应用
  const needAutoSelect =
    !appLoading &&
    apps.length > 0 &&
    (!selection.appId || !selection.app || !apps.some((a) => String(a.id) === selection.appId));
  useEffect(() => {
    if (!needAutoSelect) return;
    // 1. 优先匹配会话的 appId，否则用第一个应用
    const app = (selection.appId && apps.some((a) => String(a.id) === selection.appId))
      ? (apps.find((a) => String(a.id) === selection.appId) ?? apps[0])
      : apps[0];
    if (!app) return;
    const agentsList = app.agents ?? [];
    const defAgent = app.defaultAgent;
    const firstActive = agentsList.find((a) => a.status === AgentStatusEnum.ACTIVE);
    // 2. 若 app 匹配到会话，则优先匹配会话的 agentId；否则用默认/第一个活跃智能体
    const agent =
      selection.appId && String(app.id) === selection.appId && selection.agentId
        ? (agentsList.find((a) => String(a?.id) === selection.agentId) ??
           (defAgent && agentsList.some((a) => a?.id === defAgent?.id) ? defAgent : firstActive ?? agentsList[0]))
        : defAgent && agentsList.some((a) => a?.id === defAgent?.id)
          ? defAgent
          : firstActive ?? agentsList[0];
    // 3. 若 agent 匹配到会话，优先用会话的 modelId，且 agent.defaultModel 匹配时带出 model 对象；否则用 agent.defaultModel
    const modelId = selection.modelId || agent?.defaultModel?.id;
    const model =
      agent?.defaultModel && String(agent.defaultModel.id) === String(modelId ?? '')
        ? agent.defaultModel
        : undefined;
    const nextAppId = String(app.id ?? '');
    const nextAgentId = agent ? String(agent.id ?? '') : '';
    const nextModelId = modelId ? String(modelId) : '';
    // 仅当值发生变化时才更新，避免切换 session 时因同值刷新而闪动
    if (
      selection.appId === nextAppId &&
      selection.agentId === nextAgentId &&
      selection.modelId === nextModelId &&
      selection.app &&
      selection.agent
    ) {
      return;
    }
    onSelectionChange({
      appId: nextAppId,
      agentId: nextAgentId,
      modelId: nextModelId,
      app,
      agent: agent ?? undefined,
      model: model as ModelListVo | undefined,
    });
    setAppOpen(false);
  }, [needAutoSelect, apps, selection.appId, selection.agentId, selection.modelId, selection.app, selection.agent, onSelectionChange]);

  const handleAppScroll = useCallback(() => {
    const el = appScrollRef.current;
    if (!el || appLoadMore || appLoading || apps.length >= appTotal) return;
    if (el.scrollTop + el.clientHeight >= el.scrollHeight - 20) {
      const nextPage = appPage + 1;
      setAppPage(nextPage);
      loadApps(nextPage, true);
    }
  }, [appPage, apps.length, appTotal, appLoadMore, appLoading, loadApps]);

  const handleModelScroll = useCallback(() => {
    const el = modelScrollRef.current;
    if (!el || modelLoadMore || modelLoading || models.length >= modelTotal) return;
    if (el.scrollTop + el.clientHeight >= el.scrollHeight - 20) {
      const nextPage = modelPage + 1;
      setModelPage(nextPage);
      loadModels(nextPage, true);
    }
  }, [modelPage, models.length, modelTotal, modelLoadMore, modelLoading, loadModels]);

  const handleSelectApp = useCallback(
    async (app: ApplicationListVo) => {
      setAppOpen(false);
      if (sessionId && onSwitch) {
        try {
          const res = await onSwitch('app', { appId: String(app.id ?? '') });
          const d = res?.data;
          if (!d) return;
          // 根据返回的 agentId、modelId 选中对应智能体和模型
          const agentsList = app.agents ?? [];
          const agent =
            d.agentId != null
              ? agentsList.find((a) => String(a?.id) === String(d.agentId))
              : undefined;
          const modelId = d.modelId != null ? String(d.modelId) : '';
          const model =
            agent?.defaultModel && String(agent.defaultModel.id) === modelId
              ? agent.defaultModel
              : models.find((m) => String(m.id) === modelId) ??
                (d.modelName ? { id: modelId, name: d.modelName } : undefined);
          onSelectionChange({
            appId: String(app.id ?? ''),
            agentId: d.agentId != null ? String(d.agentId) : '',
            modelId,
            app,
            agent: agent ?? undefined,
            model: model as ModelListVo | undefined,
          });
          toast.success('已切换应用');
        } catch {
          // onSwitch 内部已 toast.error
        }
        return;
      }
      const agentsList = app.agents ?? [];
      const defAgent = app.defaultAgent;
      const firstActive = agentsList.find((a) => a.status === AgentStatusEnum.ACTIVE);
      const agent =
        defAgent && agentsList.some((a) => a?.id === defAgent?.id)
          ? defAgent
          : firstActive ?? agentsList[0];
      const model = agent?.defaultModel;
      onSelectionChange({
        appId: String(app.id ?? ''),
        agentId: agent ? String(agent.id ?? '') : '',
        modelId: model ? String(model.id ?? '') : '',
        app,
        agent: agent ?? undefined,
        model: model as ModelListVo | undefined,
      });
    },
    [sessionId, onSwitch, onSelectionChange, models]
  );

  const handleSelectAgent = useCallback(
    async (agent: AgentInfoVo) => {
      if (agent.status !== AgentStatusEnum.ACTIVE) return;
      setAgentOpen(false);
      if (sessionId && onSwitch) {
        try {
          const res = await onSwitch('agent', { agentId: String(agent.id ?? '') });
          const d = res?.data;
          if (!d) return;
          // 根据返回的 modelId 选中对应模型
          const modelId = d.modelId != null ? String(d.modelId) : '';
          const model =
            agent.defaultModel && String(agent.defaultModel.id) === modelId
              ? agent.defaultModel
              : models.find((m) => String(m.id) === modelId) ??
                (d.modelName ? { id: modelId, name: d.modelName } : undefined);
          onSelectionChange({
            ...selection,
            agentId: String(agent.id ?? ''),
            modelId,
            agent,
            model: model as ModelListVo | undefined,
          });
          toast.success('已切换智能体');
        } catch {
          // onSwitch 内部已 toast.error
        }
        return;
      }
      const model = agent.defaultModel;
      onSelectionChange({
        ...selection,
        agentId: String(agent.id ?? ''),
        modelId: model ? String(model.id ?? '') : '',
        agent,
        model: model as ModelListVo | undefined,
      });
    },
    [sessionId, onSwitch, selection, onSelectionChange, models]
  );

  const handleSelectModel = useCallback(
    async (model: ModelListVo) => {
      setModelOpen(false);
      if (sessionId && onSwitch) {
        try {
          const res = await onSwitch('model', { modelId: String(model.id ?? '') });
          const d = res?.data;
          if (!d) return;
          onSelectionChange({
            ...selection,
            modelId: String(model.id ?? ''),
            model,
          });
          toast.success('已切换模型');
        } catch {
          // onSwitch 内部已 toast.error
        }
        return;
      }
      onSelectionChange({
        ...selection,
        modelId: String(model.id ?? ''),
        model,
      });
    },
    [sessionId, onSwitch, selection, onSelectionChange]
  );

  const appDisplayName = resolvedApp?.name ?? '选择应用';
  const agentDisplayName = selectedAgent?.name ?? '选择智能体';
  const modelDisplayName = resolvedModel?.name ?? (defaultModel as ModelListVo)?.name ?? '选择模型';

  // 供展示用，切换 session 时优先用解析结果避免闪动
  const displayApp = resolvedApp ?? selection.app;

  return {
    appOpen,
    setAppOpen,
    agentOpen,
    setAgentOpen,
    modelOpen,
    setModelOpen,
    appKeyword,
    setAppKeyword,
    modelKeyword,
    setModelKeyword,
    apps,
    appLoading,
    appLoadMore,
    models,
    modelLoading,
    modelLoadMore,
    appScrollRef,
    modelScrollRef,
    agents,
    selectedAgent,
    selectedModelId,
    displayApp,
    handleAppScroll,
    handleModelScroll,
    handleSelectApp,
    handleSelectAgent,
    handleSelectModel,
    appDisplayName,
    agentDisplayName,
    modelDisplayName,
  };
}
