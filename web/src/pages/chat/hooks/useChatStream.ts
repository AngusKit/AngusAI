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
import type { AgentChatRequestDto } from '@/services/AgentChatTypes.ts';

async function buildStreamRequest(path: string, body: unknown): Promise<{ url: string; headers: HeadersInit }> {
  let url = RouterUtils.getAIApiUrl(path);

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Accept': 'text/event-stream',
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
 * 解析 SSE 流并回调每个 token
 * 后端格式：data: <token>\n\n
 */
export async function chatStream(
  data: AgentChatRequestDto,
  callbacks: {
    onToken: (token: string) => void;
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

  if (!res.ok) {
    const text = await res.text();
    let msg = res.statusText;
    try {
      const parsed = JSON.parse(text);
      msg = parsed?.message || parsed?.msg || msg;
    } catch {
      if (text) msg = text.slice(0, 200);
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
        if (line.startsWith('data:')) {
          const payload = line.slice(5).trim();
          if (payload) callbacks.onToken(payload);
        }
      }
    }
    if (buffer && buffer.startsWith('data:')) {
      const payload = buffer.slice(5).trim();
      if (payload) callbacks.onToken(payload);
    }
  } catch (e) {
    callbacks.onError?.(e instanceof Error ? e : new Error(String(e)));
    throw e;
  }
}
