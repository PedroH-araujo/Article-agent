import { Pinecone } from '@pinecone-database/pinecone';
import { OpenAI } from 'openai';
import 'dotenv/config';

const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY!,
});

const index = pinecone.Index(process.env.PINECONE_INDEX!);
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

export const searchInVectorDB = async (query: string) => {

  const embedding = await openai.embeddings.create({
    model: 'text-embedding-ada-002',
    input: query,
  });

  const results = await index.query({
    vector: embedding.data[0].embedding,
    topK: 5,
    includeMetadata: true,
  });

  console.log('Results from Pinecone:', JSON.stringify(results, null, 2));

  return results.matches ?? [];
};

