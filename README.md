# WishList

Простий сайт для створення списків побажань до подій (дні народження, свята, весілля тощо).
Без авторизації — просто створюй події, додавай побажання з посиланнями, і діли з друзями.

## Можливості

- Створення та редагування подій (назва, опис, дата, емодзі)
- Список побажань для кожної події
- Посилання на товар біля кожного побажання
- Резервування побажань (вказуєш своє ім'я — інші бачать що позиція зайнята)

## Стек

- **Frontend:** React + Vite
- **Backend:** Node.js + Express
- **Database:** PostgreSQL

## Локальна розробка

### Передумови

- Node.js 20+
- PostgreSQL (або Docker)

### Швидкий старт з Docker (тільки БД)

```bash
# Запустити тільки PostgreSQL
docker run -d --name wishlist-db \
  -e POSTGRES_DB=wishlist \
  -e POSTGRES_USER=wishlist \
  -e POSTGRES_PASSWORD=wishlist \
  -p 5432:5432 \
  postgres:18-alpine
```

### Встановлення залежностей

```bash
npm run install:all
```

### Запуск (dev режим)

```bash
npm run dev
```

Відкриється:
- Frontend: http://localhost:5173
- Backend API: http://localhost:3001

### Змінні середовища

Файл `.env` в корені проєкту:

```env
DATABASE_URL=postgres://wishlist:wishlist@localhost:5432/wishlist
PORT=3001
```

## Production деплой

### Docker Compose

```bash
docker-compose up -d --build
```

Піднімає PostgreSQL + Node.js додаток на порту `3001`.

### Nginx конфіг

```nginx
server {
    listen 80;
    server_name wish-list.bursak.com.ua;

    location / {
        proxy_pass http://localhost:3001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## API

| Метод | Шлях | Опис |
|-------|------|------|
| GET | `/api/events` | Список подій |
| POST | `/api/events` | Створити подію |
| PUT | `/api/events/:id` | Редагувати подію |
| DELETE | `/api/events/:id` | Видалити подію |
| GET | `/api/events/:id/wishes` | Побажання для події |
| POST | `/api/events/:id/wishes` | Додати побажання |
| PUT | `/api/wishes/:id` | Редагувати побажання |
| PUT | `/api/wishes/:id/reserve` | Зарезервувати |
| PUT | `/api/wishes/:id/unreserve` | Зняти резерв |
| DELETE | `/api/wishes/:id` | Видалити побажання |
