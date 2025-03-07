import Fastify from 'fastify';
import { agentRoute } from './agent.js';
import { connectKafka } from './services/kafka.js';
import dotenv from 'dotenv';
import cors from '@fastify/cors';
import { startConsumer } from './services/consumer.js';

dotenv.config();

const app = Fastify({ logger: true });

app.register(cors, {
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
});

app.register(agentRoute);


const start = async () => {
  try {
    await connectKafka(); 
    await startConsumer();
    await app.listen({ port: 3000 });
    console.log('Server running http://localhost:3000');
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
