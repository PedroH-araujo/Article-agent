import { FastifyInstance } from 'fastify';
import { searchInVectorDB } from './services/vectorDatabase.js';
import { OpenAI } from 'openai';
import { producer } from './services/kafka.js';

export async function agentRoute(app: FastifyInstance) {
  app.post('/agent', async (request: any, reply: any) => {
    const { query } = request.body as { query: string };

    if (!query) return reply.status(400).send({ error: 'Query é obrigatória' });

    const urlMatch = query.match(/https?:\/\/[^\s]+/);
    if (!urlMatch) return reply.status(400).send({ error: 'Nenhum link foi detectado na query' });

    const url = urlMatch[0];

    try {
      await producer.send({
        topic: 'news',
        messages: [{ value: url }],
      });

    } catch (error) {
      console.error('Error send Kafka:', error);
      return reply.status(500).send({ error: 'Error' });
    }

    const results = await searchInVectorDB(query);
    const context = results
      .filter((r) => r.metadata?.content)
      .map((r) => `Title: ${r.metadata!.title ?? 'Without title'}\nURL: ${r.metadata!.url}\nContent: ${r.metadata!.content}`)
      .join('\n\n');



    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are a helpful assistant. If you recieve a link, you can extract the content and use it as context.' },
        { role: 'user', content: `Question: ${query}\n\nContext:\n${context}` },
      ],
    });

    reply.send({
      answer: response.choices[0].message.content,
      sources: results.map((r) => ({
        title: r.metadata?.title ?? 'No Title',
        url: r.metadata?.url ?? 'No URL',
        date: r.metadata?.date ?? 'No date',
      })),
    });
  });
}
