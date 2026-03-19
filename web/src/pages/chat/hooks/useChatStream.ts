/**
 * AgentChat 流式 SSE 请求工具
 * 使用 fetch + ReadableStream 解析 SSE，与 HttpClient 鉴权逻辑一致
 */
import {
  ApiType,
  app,
  cookieUtils,
  httpUtils,
  IFRAME_ACCESS_TOKEN_NAME,
  routerUtils as RouterUtils,
} from '@xcan-angus/infra';
import { AUTH_BEARER_PREFIX, HEADER_ACCEPT_LANGUAGE, HEADER_AUTHORIZATION, HEADER_DEVICE_ID } from '@/Constants.ts';
import type { AgentChatRequestDto, OpenAIChatCompletionChunk } from '@/services/AgentChatTypes.ts';

async function buildStreamRequest(path: string, _body: unknown): Promise<{ url: string; headers: HeadersInit }> {
  let url = RouterUtils.getAIApiUrl(path);

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    //'Accept': 'text/event-stream',
    [HEADER_ACCEPT_LANGUAGE]: cookieUtils.getCurrentLanguage(),
    [HEADER_DEVICE_ID]: await httpUtils.preloadVisitorId(),
  };

  if (url.includes(ApiType.API)) {
    const accessToken = httpUtils.isInIframe()
      ? (httpUtils.getParamsFromIframeUrl(IFRAME_ACCESS_TOKEN_NAME) || '')
      : (cookieUtils.getTokenInfo()?.access_token ?? '');
    headers[HEADER_AUTHORIZATION] = `${AUTH_BEARER_PREFIX}${accessToken}`;
  }

  return { url, headers };
}

/**
 * 剥离行首的 data: 前缀（支持后端可能返回的 data:data: 双重前缀）
 */
function peelDataPrefix(line: string): string {
  let s = line.trim();
  while (s.startsWith('data:')) {
    s = s.slice(5).trim();
  }
  return s;
}

/**
 * 解析 SSE 流（OpenAI 格式）
 * 后端格式：data: OpenAIChatCompletionChunk 或 data: [DONE]
 * 兼容 data:data: 双重前缀及 sessionId/session_id 两种字段名
 */
export async function chatStream(
  data: AgentChatRequestDto,
  callbacks: {
    onToken: (token: string) => void;
    onSessionId?: (sessionId: string) => void;
    onMessageId?: (messageId: number) => void;
    onError?: (err: Error) => void;
  }
): Promise<void> {
  const path = `/agents/chat/stream`;
  const { url, headers } = await buildStreamRequest(path, data);

  const res = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify(data),
  });

  // 如果设置 'Accept': 'text/event-stream', 代码会直接抛出异常不会运行到这
  if (!res.ok) {
    const text = await res.text();
    let msg = res.statusText;
    const ct = res.headers.get('Content-Type') ?? '';
    if (ct.includes('application/json')) {
      try {
        const parsed = JSON.parse(text);
        msg = parsed?.message ?? parsed?.msg ?? msg;
      } catch {
        if (text) msg = text.slice(0, 200);
      }
    } else if (text) {
      msg = text.slice(0, 200);
    }
    if (res.status === 401) {
      app.toSignIn(true);
    }
    throw new Error(msg || '请求失败');
  }

  const reader = res.body?.getReader();
  if (!reader) throw new Error('无法读取响应流');

  const decoder = new TextDecoder();
  let buffer = '';

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';
      for (const line of lines) {
        if (!line.startsWith('data:')) continue;
        let payload = peelDataPrefix(line);
        if (!payload) continue;
        if (payload === '[DONE]') continue;
        try {
          const obj = JSON.parse(payload) as OpenAIChatCompletionChunk & { sessionId?: string };
          const sid = obj?.session_id ?? obj?.sessionId;
          if (sid) callbacks.onSessionId?.(sid);
          const mid = obj?.message_id;
          if (mid != null) callbacks.onMessageId?.(mid);
          const content = obj?.choices?.[0]?.delta?.content;
          if (content) callbacks.onToken(content);
        } catch {
          /* 非 JSON，忽略 */
        }
      }
    }
    if (buffer) {
      const dataIdx = buffer.indexOf('data:');
      if (dataIdx >= 0) {
        const rawLine = buffer.slice(dataIdx).split('\n')[0] ?? '';
        const payload = peelDataPrefix(rawLine);
        if (payload && payload !== '[DONE]') {
          try {
            const obj = JSON.parse(payload) as OpenAIChatCompletionChunk & { sessionId?: string };
            const sid = obj?.session_id ?? obj?.sessionId;
            if (sid) callbacks.onSessionId?.(sid);
            const mid = obj?.message_id;
            if (mid != null) callbacks.onMessageId?.(mid);
            const content = obj?.choices?.[0]?.delta?.content;
            if (content) callbacks.onToken(content);
          } catch {
            /* ignore */
          }
        }
      }
    }
  } catch (e) {
    callbacks.onError?.(e instanceof Error ? e : new Error(String(e)));
    throw e;
  }
}
