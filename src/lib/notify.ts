import { createHmac } from 'crypto';

export type NotifyResult = { ok: boolean; error?: string };

function normalizeChatId(chatId: string): string {
  const trimmed = chatId.trim();
  if (/^-?\d+$/.test(trimmed)) return trimmed;
  const digits = trimmed.replace(/[^\d-]/g, '');
  return digits || trimmed;
}

export async function sendTelegram(chatId: string, text: string): Promise<boolean> {
  return (await sendTelegramDetailed(chatId, text)).ok;
}

export async function sendTelegramDetailed(chatId: string, text: string): Promise<NotifyResult> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) {
    console.error('[notify] TELEGRAM_BOT_TOKEN missing');
    return { ok: false, error: 'telegram_token_missing' };
  }

  const to = normalizeChatId(chatId);
  try {
    const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: to,
        text,
        disable_web_page_preview: true,
      }),
      signal: AbortSignal.timeout(8000),
    });

    if (!response.ok) {
      const detail = await response.text().catch(() => '');
      console.error('[notify] telegram send failed', response.status, detail.slice(0, 240));
      if (response.status === 401) return { ok: false, error: 'telegram_token_invalid' };
      if (response.status === 403) return { ok: false, error: 'telegram_blocked' };
      if (detail.includes('chat not found')) return { ok: false, error: 'telegram_chat_not_found' };
      return { ok: false, error: 'telegram_failed' };
    }
    return { ok: true };
  } catch (error) {
    console.error('[notify] telegram send error', error);
    return { ok: false, error: 'telegram_failed' };
  }
}

export async function deliverTelegram(chatId: string, text: string): Promise<NotifyResult> {
  const direct = await sendTelegramDetailed(chatId, text);
  if (direct.ok) return direct;
  const viaHermes =
    (await sendHermesWebhook('website-lead-telegram', chatId, text)) ||
    (await sendHermesWebhook('support-telegram', chatId, text));
  if (viaHermes) return { ok: true };
  return direct;
}

export async function sendWhatsApp(phone: string, text: string): Promise<boolean> {
  const token = process.env.WHATSAPP_TOKEN || process.env.WHATSAPP_ACCESS_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  if (!token || !phoneNumberId) return false;

  const to = phone.replace(/\D/g, '');
  if (!to) return false;

  const response = await fetch(`https://graph.facebook.com/v21.0/${phoneNumberId}/messages`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      messaging_product: 'whatsapp',
      to,
      type: 'text',
      text: { body: text, preview_url: false },
    }),
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => '');
    console.error('[notify] whatsapp send failed', response.status, detail.slice(0, 240));
    return false;
  }
  return true;
}

export async function sendHermesWebhook(
  route: string,
  chatId: string,
  text: string,
): Promise<boolean> {
  const base = (process.env.HERMES_WEBHOOK_URL || 'http://127.0.0.1:8642').replace(/\/$/, '');
  const secret = process.env.HERMES_WEBHOOK_SECRET || process.env.WEBHOOK_SECRET || '';
  if (!base || !chatId) return false;

  const body = JSON.stringify({ chat_id: chatId, message: text });
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (secret) {
    headers['X-Hub-Signature-256'] = `sha256=${createHmac('sha256', secret).update(body).digest('hex')}`;
  }

  try {
    const response = await fetch(`${base}/webhooks/${route}`, {
      method: 'POST',
      headers,
      body,
      signal: AbortSignal.timeout(5000),
    });
    if (!response.ok) {
      const detail = await response.text().catch(() => '');
      console.error('[notify] hermes webhook failed', route, response.status, detail.slice(0, 240));
      return false;
    }
    return true;
  } catch (error) {
    console.error('[notify] hermes webhook error', route, error);
    return false;
  }
}
