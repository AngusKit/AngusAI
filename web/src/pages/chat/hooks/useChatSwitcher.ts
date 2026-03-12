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

interface UseChatSwitcherProps {
  selection: ChatSwitcherSelection;
  onSelectionChange: (s: ChatSwitcherSelection) => void;
}

export function useChatSwitcher({ selection, onSelectionChange }: UseChatSwitcherProps) {
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

  const agents = selection.app?.agents ?? [];
  const defaultAgent = selection.app?.defaultAgent;
  const selectedAgent = agents.find((a) => String(a?.id) === selection.agentId) ?? defaultAgent;
  const defaultModel = selectedAgent?.defaultModel;
  const selectedModelId = selection.modelId || defaultModel?.id;

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

  // 应用列表加载完成后，若有数据且未选中应用，则默认选中第一个
  useEffect(() => {
    if (!appLoading && apps.length > 0 && !selection.appId) {
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
    }
  }, [appLoading, apps, selection.appId, onSelectionChange]);

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
    (app: ApplicationListVo) => {
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
    },
    [onSelectionChange]
  );

  const handleSelectAgent = useCallback(
    (agent: AgentInfoVo) => {
      if (agent.status !== AgentStatusEnum.ACTIVE) return;
      const model = agent.defaultModel;
      onSelectionChange({
        ...selection,
        agentId: String(agent.id ?? ''),
        modelId: model ? String(model.id ?? '') : '',
        agent,
        model: model as ModelListVo | undefined,
      });
      setAgentOpen(false);
    },
    [selection, onSelectionChange]
  );

  const handleSelectModel = useCallback(
    (model: ModelListVo) => {
      onSelectionChange({
        ...selection,
        modelId: String(model.id ?? ''),
        model,
      });
      setModelOpen(false);
    },
    [selection, onSelectionChange]
  );

  const appDisplayName = selection.app?.name ?? '选择应用';
  const agentDisplayName = selectedAgent?.name ?? '选择智能体';
  const modelDisplayName =
    selection.model?.name ??
    (defaultModel as ModelListVo)?.name ??
    '选择模型';

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
