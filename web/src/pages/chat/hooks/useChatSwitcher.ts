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
import type { SessionDetailVo } from '@/services/SessionTypes';
import {
  ApplicationStatusEnum,
  AgentStatusEnum,
  ModelTypeEnum,
  ModelStatusEnum,
} from '@/enums/enums';
import { toast } from 'sonner';

const PAGE_SIZE = 5;

/** 应用列表按 keyword 全局缓存，切换会话时复用（应用列表与 session 无关） */
const appsListCache = new Map<string, { list: ApplicationListVo[]; page: number; total: number }>();

/** 模型列表按 keyword 全局缓存，切换会话时复用 */
const modelsListCache = new Map<string, { list: ModelListVo[]; page: number; total: number }>();

/** 应用详情按 appId 缓存，切换会话时复用 */
const appDetailCache = new Map<string, ApplicationListVo>();

/** 会话删除时清理对应缓存，供外部调用（当前全局缓存不按 session 清理，保留空实现以便扩展） */
export function clearChatSwitcherCacheForSession(_sessionId: string) {
  // 应用/模型列表已改为全局 keyword 缓存，与 session 无关，无需清理
}

/** 按 modelId 缓存的模型详情，切换会话时复用，避免重复 getModelDetail */
const modelDetailCache = new Map<string, ModelListVo>();
const MODEL_DETAIL_CACHE_MAX = 50;
const modelDetailFetching = new Set<string>();

function pruneModelDetailCache() {
  if (modelDetailCache.size > MODEL_DETAIL_CACHE_MAX) {
    const firstKey = modelDetailCache.keys().next().value;
    if (firstKey) modelDetailCache.delete(firstKey);
  }
}

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

  // 当 selection.appId 不在 apps 中时，单独拉取的应用（用于正确展示）
  const [extraApp, setExtraApp] = useState<ApplicationListVo | null>(null);
  // 当 selection.modelId 不在 models 中时，单独拉取的模型（用于正确展示）
  const [extraModel, setExtraModel] = useState<ModelListVo | null>(null);

  // 用 apps + extraApp 解析 selection，切换 session 时避免因 selection 仅有 ids 无对象而闪动
  const resolvedApp =
    selection.app ??
    (selection.appId
      ? apps.find((a) => String(a.id) === selection.appId) ??
        (extraApp && String(extraApp.id) === selection.appId ? extraApp : undefined)
      : undefined);
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
    (defaultModel && String(defaultModel.id) === String(selectedModelId ?? '') ? defaultModel : undefined) ??
    (extraModel && selectedModelId && String(extraModel.id) === String(selectedModelId) ? extraModel : undefined) ??
    (selectedModelId ? models.find((m) => String(m.id) === String(selectedModelId)) : undefined);

  const loadApps = useCallback(
    async (page: number, append: boolean) => {
      if (appLoadingRef.current) return;
      const kw = debouncedAppKw.trim();
      const cacheEntry = append ? undefined : appsListCache.get(`apps_${kw}`);
      if (!append && cacheEntry && cacheEntry.list.length > 0 && cacheEntry.page === page) {
        setApps(cacheEntry.list);
        setAppPage(cacheEntry.page);
        setAppTotal(cacheEntry.total);
        return;
      }
      appLoadingRef.current = true;
      if (append) setAppLoadMore(true);
      else setAppLoading(true);
      try {
        const res = await Applications.getApplicationList({
          status: ApplicationStatusEnum.PUBLISHED,
          pageNo: page,
          pageSize: PAGE_SIZE,
          keyword: kw || undefined,
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
        setAppPage(page);
        setAppTotal(total);
        if (!append) {
          appsListCache.set(`apps_${kw}`, { list, page, total });
        }
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
      const kw = debouncedModelKw.trim();
      const cacheEntry = append ? undefined : modelsListCache.get(`models_${kw}`);
      if (!append && cacheEntry && cacheEntry.list.length > 0 && cacheEntry.page === page) {
        setModels(cacheEntry.list);
        setModelPage(cacheEntry.page);
        setModelTotal(cacheEntry.total);
        return;
      }
      modelLoadingRef.current = true;
      if (append) setModelLoadMore(true);
      else setModelLoading(true);
      try {
        const res = await Models.getModelList({
          type: ModelTypeEnum.CHAT,
          status: ModelStatusEnum.ACTIVE,
          pageNo: page,
          pageSize: PAGE_SIZE,
          keyword: kw || undefined,
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
        setModelPage(page);
        setModelTotal(total);
        if (!append) {
          modelsListCache.set(`models_${kw}`, { list, page, total });
        }
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

  // 当 selection.appId 存在但不在 apps 中时，按 id 单独拉取应用；优先用 appDetailCache 避免重复请求
  useEffect(() => {
    const appId = selection.appId?.trim();
    if (!appId || apps.some((a) => String(a.id) === appId)) {
      setExtraApp(null);
      return;
    }
    const cached = appDetailCache.get(appId);
    if (cached) {
      setExtraApp(cached);
      return;
    }
    let cancelled = false;
    Applications.getApplicationDetail(appId)
      .then((res) => {
        if (cancelled) return;
        const data = (res as any)?.data;
        if (data && String(data.id) === appId) {
          const app = data as ApplicationListVo;
          appDetailCache.set(appId, app);
          setExtraApp(app);
        } else {
          setExtraApp(null);
        }
      })
      .catch(() => {
        if (!cancelled) setExtraApp(null);
      });
    return () => {
      cancelled = true;
    };
  }, [selection.appId, apps]);

  // 当 selection.modelId 存在但无法从 agent.defaultModel 或 models 解析时，按 id 单独拉取模型
  // 优先用 selection.model、modelDetailCache，避免切换会话时重复请求
  useEffect(() => {
    const modelId = selection.modelId?.trim();
    if (!modelId) {
      setExtraModel(null);
      return;
    }
    if (selection.model && String(selection.model.id) === modelId) {
      setExtraModel(null);
      return;
    }
    const fromDefault = defaultModel && String(defaultModel.id) === modelId;
    const fromList = models.some((m) => String(m.id) === modelId);
    if (fromDefault || fromList) {
      setExtraModel(null);
      return;
    }
    const cached = modelDetailCache.get(modelId);
    if (cached) {
      setExtraModel(cached);
      return;
    }
    if (modelDetailFetching.has(modelId)) return;
    modelDetailFetching.add(modelId);
    let cancelled = false;
    Models.getModelDetail(modelId)
      .then((res) => {
        if (cancelled) return;
        const data = (res as any)?.data;
        if (data && String(data.id) === modelId) {
          const model = data as ModelListVo;
          modelDetailCache.set(modelId, model);
          pruneModelDetailCache();
          setExtraModel(model);
        } else {
          setExtraModel(null);
        }
      })
      .catch(() => {
        if (!cancelled) setExtraModel(null);
      })
      .finally(() => {
        modelDetailFetching.delete(modelId);
      });
    return () => {
      cancelled = true;
    };
  }, [selection.modelId, models, defaultModel?.id]);

  // 进入对话页面后，仅当无 selection.appId 时自动选中第一个应用；有 appId 时不再错误覆盖
  const needAutoSelect = !appLoading && apps.length > 0 && !selection.appId;
  useEffect(() => {
    if (!needAutoSelect) return;
    const app = apps[0];
    if (!app) return;
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
    setAppOpen(false);
  }, [needAutoSelect, apps, onSelectionChange]);

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
