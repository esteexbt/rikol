# Rikol

Rikol is a personal AI assistant built around one core idea:

> **Your AI should remember you across conversations.**

Unlike a chatbot that starts from zero in every new conversation, Rikol maintains persistent user-specific memory using **Walrus Memory**. Information learned in one conversation can be recalled in a completely different conversation, creating a more continuous and personalized assistant experience.

## Features

- Persistent cross-conversation AI memory
- User-specific memory namespaces
- Google Gemini-powered conversations
- Supabase authentication and data storage
- Conversation history
- Pin, rename, archive, delete, and share conversations
- Public read-only conversation sharing
- Memory visibility through the Rikol memory interface
- Production Walrus Memory integration

## How Memory Works

Each authenticated Rikol user receives an isolated Walrus Memory namespace:

```text
rikol-user-<supabase-user-id>