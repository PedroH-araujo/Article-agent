import { kafka } from './kafka.js';
import { Pinecone } from '@pinecone-database/pinecone';
import { OpenAI } from 'openai';
import axios from 'axios';

const consumer = kafka.consumer({ groupId: 'news-group' });

const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY!,
});

const index = pinecone.Index(process.env.PINECONE_INDEX!);
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function startConsumer() {
  await consumer.connect();
  await consumer.subscribe({ topic: 'news', fromBeginning: false });

  await consumer.run({
    eachMessage: async ({ message }) => {
      if (!message.value) return;
      const url = message.value.toString();

      try {
        const { data } = await axios.get(url);
        const content = data.substring(0, 500);

        const embedding = await openai.embeddings.create({
          model: 'text-embedding-ada-002',
          input: content,
        });

        await index.upsert([
          {
            id: url,
            values: embedding.data[0].embedding,
            metadata: { url, content },
          },
        ]);

        console.log(`URL send to Pinecone: ${url}`);
      } catch (error) {
        console.error(`Error when sending URL to Pinecone: ${url}`, error);
      }
    },
  });
}
