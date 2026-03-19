# WishList — План реалізації

## Архітектура

```
wishlist/
├── server/          # Express + PostgreSQL
│   ├── index.js
│   ├── db.js        # pg pool + міграції
│   └── routes/
│       ├── events.js
│       └── wishes.js
├── client/          # React + Vite
│   ├── src/
│   │   ├── App.jsx
│   │   ├── pages/
│   │   │   ├── EventsPage.jsx    # Список подій
│   │   │   └── WishesPage.jsx    # Побажання для події
│   │   ├── components/
│   │   │   ├── EventCard.jsx
│   │   │   ├── EventForm.jsx     # Модалка додати/редагувати подію
│   │   │   ├── WishItem.jsx
│   │   │   └── WishForm.jsx      # Модалка додати побажання
│   │   └── api.js                # axios інстанс
│   └── vite.config.js
├── docker-compose.yml            # postgres + app
├── package.json                  # root scripts
└── .env
```

## База даних (PostgreSQL)

### Таблиця `events`
| Поле | Тип | Опис |
|------|-----|------|
| id | SERIAL PK | |
| title | VARCHAR(255) | Назва події |
| description | TEXT | Опис |
| date | DATE | Дата події |
| emoji | VARCHAR(10) | Емодзі для картки |
| created_at | TIMESTAMP | |

### Таблиця `wishes`
| Поле | Тип | Опис |
|------|-----|------|
| id | SERIAL PK | |
| event_id | INT FK → events.id | |
| title | VARCHAR(255) | Назва побажання |
| url | TEXT | Посилання на товар |
| reserved_by | VARCHAR(100) | Хто зарезервував (ім'я) |
| created_at | TIMESTAMP | |

## API Ендпоінти

### Events
- `GET /api/events` — список подій
- `POST /api/events` — створити подію
- `PUT /api/events/:id` — редагувати подію
- `DELETE /api/events/:id` — видалити подію

### Wishes
- `GET /api/events/:eventId/wishes` — побажання для події
- `POST /api/events/:eventId/wishes` — додати побажання
- `PUT /api/wishes/:id` — редагувати побажання
- `PUT /api/wishes/:id/reserve` — зарезервувати (ім'я того хто бере)
- `PUT /api/wishes/:id/unreserve` — зняти резерв
- `DELETE /api/wishes/:id` — видалити побажання

## Сторінки React

### 1. EventsPage (`/`)
- Картки подій (емодзі + назва + дата + кількість побажань)
- Кнопка "+" для додавання нової події
- По кліку на картку → перехід на `/events/:id`
- Кнопка редагування на кожній картці

### 2. WishesPage (`/events/:id`)
- Заголовок події
- Список побажань у вигляді карток
- Кожна картка: назва, посилання (кнопка), статус резерву
- Кнопка "Зарезервувати" → модалка з введенням імені
- Кнопка додавання побажання
- Кнопка видалення

## Деплой
- Docker Compose: postgres + node app
- Nginx reverse proxy на `wish-list.bursak.com.ua`
- Production build React вбудовується в Express static

## Кроки реалізації

1. Ініціалізація проєкту (package.json, структура)
2. Backend: Express + pg + маршрути + авто-міграція
3. Frontend: React + Vite + сторінки + компоненти
4. Docker Compose для деплою
5. Nginx конфіг
