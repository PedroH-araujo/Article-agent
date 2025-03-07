import { Kafka } from 'kafkajs';

export const kafka = new Kafka({
  clientId: 'news-agent',
  brokers: ['localhost:9092'], // Ajuste se necessário
});

export const producer = kafka.producer();

export async function connectKafka() {
  await producer.connect();
  console.log('Conected to Kafka');
}
