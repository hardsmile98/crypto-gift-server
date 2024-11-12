# Gift Shop Server

Бэкенд для Telegram Mini App магазина подарков.

## Структура проекта

```
src/
├── libs       
├── middlewares 
├── migrations       
├── modules/
│   ├── ... 
├── routes
├── types
├── utils                  
├── index.ts 
└── app.ts
```

## Запуск

1. Установите зависимости:
```bash
npm install
```

2. Добавьте переменные окружения из файла env.example

3. Запустите сервер:
```bash
npm run dev
```

## Скрипты

- `npm run dev` - Запуск в dev режиме
- `npm run build` - Компиляция
- `npm run start` - Запуск собранного приложения

## Используемые технологии

- Nodejs + TypeScript
- Express
- MongoDB + Mongoose
- JWT для аутентификации
- Crypto Pay API