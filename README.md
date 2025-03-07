# AI News Agent

This project is an AI-powered news agent that retrieves and summarizes news articles using OpenAI, Pinecone for vector storage, and Kafka for event-driven processing. It consists of a **chat widget (Angular frontend)** and an **API (Fastify backend)**.

---

## 🚀 **Getting Started**

### **1. Clone the Repository**

```sh
git clone https://github.com/your-repo/project-ai.git
cd project-ai
```

### **2. Environment Variables**

Before running the application, ensure you have the necessary environment variables set up. Create a `.env` file in the `api/` directory with the following:

```env
OPENAI_API_KEY=your_openai_api_key
PINECONE_API_KEY=your_pinecone_api_key
PINECONE_ENVIRONMENT=production
PINECONE_INDEX=news-agent
KAFKA_BROKER=localhost:9092
KAFKA_TOPIC_NAME=news
KAFKA_GROUP_ID_PREFIX=test-task-
```

---

## 🖥️ **Running the Frontend (Chat Widget - Angular)**

1. Navigate to the frontend directory:
   ```sh
   cd chat-widget-angular
   ```
2. Use Node.js version specified in `.nvmrc`:
   ```sh
   nvm use
   ```
3. Install dependencies:
   ```sh
   npm install
   ```
4. Start the frontend:
   ```sh
   npm run start
   ```
5. The chat widget should be accessible at `http://localhost:4200`.

---

## 🌍 **Running the Backend (Fastify API)**

1. Navigate to the API directory:
   ```sh
   cd api
   ```
2. Use Node.js version specified in `.nvmrc`:
   ```sh
   nvm use
   ```
3. Start the required services using Docker:
   ```sh
   docker-compose up -d
   ```
4. Install dependencies:
   ```sh
   npm install
   ```
5. Build the project:
   ```sh
   npm run build
   ```
6. Start the API:
   ```sh
   npm run start
   ```
7. The API should be running at `http://localhost:3000`.

---

## ✅ **Testing the API**

Once the API is running, you can test it using `curl` or Postman:

```sh
curl -X POST http://localhost:3000/agent \
     -H "Content-Type: application/json" \
     -d '{ "query": "summarize this article https://www.bbc.com/news/articles/cy4m84d2xz2o" }'
```

Expected response:

```json
{
  "answer": "The article discusses the latest AI developments...",
  "sources": [
    {
      "title": "Tech Giants Announce AI Plan",
      "url": "https://www.bbc.com/news/articles/cy4m84d2xz2o",
      "date": "2024-03-07"
    }
  ]
}
```

---

## 📌 **Project Structure**

```
project-ai/
│── chat-widget-angular/    # Frontend (Angular)
│── api/                    # Backend (Fastify)
│── docker-compose.yml      # Docker setup for Kafka, Zookeeper
```

---

## 🔧 **Troubleshooting**

- If `nvm use` fails, ensure **NVM** is installed: [Install NVM](https://github.com/nvm-sh/nvm#installing-and-updating)
- If `docker-compose up` fails, ensure **Docker** is installed and running
- If API requests fail, check logs in `api/logs/` or run `docker ps` to see if Kafka is running

---

## 📜 **License**

This project is licensed under the MIT License.

---

## 🎯 **Contributing**

Pull requests are welcome! If you encounter issues, please open an issue in the repository.

🚀 Happy coding!

