import { config } from '@nullvoid/config';
import { getPrisma } from '@nullvoid/database';
import { createLogger } from '@nullvoid/logger';

const logger = createLogger('ai-service');

const NIM_BASE_URL = 'https://integrate.api.nvidia.com/v1';

interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export class AIService {
  async chat(userId: string, guildId: string, channelId: string, message: string, saveHistory = true): Promise<string> {
    const apiKey = config.NVIDIA_NIM_API_KEY;
    if (!apiKey) {
      return 'No NVIDIA NIM API key configured. Set `NVIDIA_NIM_API_KEY` in your `.env` file.';
    }

    const systemMsg: ChatMessage = { role: 'system', content: 'You are NullVoid AI, a helpful assistant on a Discord bot. Be concise, friendly, and informative. Respond in the same language as the user.' };
    const messages: ChatMessage[] = [systemMsg, { role: 'user', content: message }];

    if (saveHistory) {
      const prisma = getPrisma();
      await prisma.guild.upsert({ where: { id: guildId }, update: {}, create: { id: guildId, name: guildId, ownerId: '' } });
      await prisma.user.upsert({ where: { id: userId }, update: {}, create: { id: userId, discordId: userId, username: userId, discriminator: '0000' } });
      let conversation = await prisma.aIConversation.upsert({
        where: { guildId_channelId_userId: { guildId, channelId, userId } },
        update: {},
        create: { guildId, channelId, userId, messages: '[]' },
      });

      const history: ChatMessage[] = JSON.parse(conversation.messages ?? '[]');
      messages.splice(1, 0, ...history);
    }

    const body = { model: 'nvidia/llama-3.3-nemotron-super-49b-v1', messages, temperature: 0.7, max_tokens: 1024, stream: false };

    try {
      const res = await fetch(`${NIM_BASE_URL}/chat/completions`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const errText = await res.text();
        logger.error({ status: res.status, body: errText }, 'NVIDIA NIM API error');
        return `AI request failed (status ${res.status}). Please try again later.`;
      }

      const data = await res.json() as { choices: { message: ChatMessage }[] };
      const reply = data.choices?.[0]?.message?.content ?? 'No response generated.';

      if (saveHistory) {
        const prisma = getPrisma();
        const conversation = await prisma.aIConversation.findFirst({ where: { guildId, channelId, userId } });
        if (conversation) {
          const history: ChatMessage[] = JSON.parse(conversation.messages ?? '[]');
          history.push({ role: 'user', content: message }, { role: 'assistant', content: reply });
          const trimmed = history.slice(-20);
          await prisma.aIConversation.update({
            where: { id: conversation.id },
            data: { messages: JSON.stringify(trimmed) },
          });
        }
      }

      return reply;
    } catch (err) {
      logger.error({ err }, 'NVIDIA NIM request failed');
      return 'Failed to reach the AI service. Is the API key valid?';
    }
  }
}
