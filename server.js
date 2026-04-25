import express from 'express';
import Anthropic from '@anthropic-ai/sdk';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

app.use(express.json());
app.use(express.static(__dirname));

const SYSTEM_PROMPT = `あなたは「AI Support」のAIアシスタントです。AI導入支援の専門家として、訪問者からの質問に丁寧・的確に答えてください。

【会社概要】
- 社名：株式会社AI Support
- 事業：AI導入コンサルティング・AIシステム開発・AI人材育成
- 特徴：500社以上の導入実績、顧客満足度98%、平均40%の業務効率化

【サービス】
1. AI導入コンサルティング：業務フロー分析・ロードマップ策定
2. AIシステム開発：チャットボット・画像認識・自然言語処理など
3. AI人材育成・研修：AIリテラシー向上・エンジニア研修

【ソリューション】
- データ分析・予測（売上予測・需要予測・顧客分析）
- 業務プロセス自動化（RPA×AI）
- カスタマーサポートAI（24時間対応チャットボット）
- セキュリティ・監視（異常検知・不正アクセス検出）

【姿勢】
- 日本語で丁寧に回答する
- AI導入に不安がある方にも分かりやすく説明する
- 具体的な相談は「無料ヒアリング」をご案内する
- 回答は簡潔にまとめ、必要に応じて箇条書きを使う
- 200字程度を目安に、長くなりすぎないようにする`;

app.post('/api/chat', async (req, res) => {
  const { messages } = req.body;
  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'messagesが必要です' });
  }

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  try {
    const stream = client.messages.stream({
      model: 'claude-opus-4-6',
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: messages.slice(-10), // 直近10件のみ送信
    });

    for await (const event of stream) {
      if (
        event.type === 'content_block_delta' &&
        event.delta.type === 'text_delta'
      ) {
        res.write(`data: ${JSON.stringify({ text: event.delta.text })}\n\n`);
      }
    }

    res.write('data: [DONE]\n\n');
    res.end();
  } catch (err) {
    console.error('Claude APIエラー:', err.message);
    res.write(`data: ${JSON.stringify({ error: 'エラーが発生しました。しばらくお待ちください。' })}\n\n`);
    res.end();
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`サーバー起動: http://localhost:${PORT}`);
  console.log('ANTHROPIC_API_KEY が設定されていることを確認してください');
});
