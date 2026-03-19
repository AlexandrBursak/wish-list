const swaggerSpec = {
  openapi: '3.0.0',
  info: {
    title: 'WishList API',
    version: '1.0.0',
    description: 'API для управління подіями та списками побажань',
  },
  servers: [
    { url: '/api', description: 'API сервер' },
  ],
  tags: [
    { name: 'Events', description: 'Управління подіями' },
    { name: 'Wishes', description: 'Управління побажаннями' },
  ],
  paths: {
    '/events': {
      get: {
        tags: ['Events'],
        summary: 'Список всіх подій',
        responses: {
          200: {
            description: 'Масив подій з кількістю побажань',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/EventWithCounts' },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ['Events'],
        summary: 'Створити подію',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/EventInput' },
            },
          },
        },
        responses: {
          201: {
            description: 'Створена подія',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Event' },
              },
            },
          },
        },
      },
    },
    '/events/{id}': {
      get: {
        tags: ['Events'],
        summary: 'Отримати подію за ID',
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'integer' } },
        ],
        responses: {
          200: {
            description: 'Подія',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Event' },
              },
            },
          },
          404: { description: 'Подію не знайдено' },
        },
      },
      put: {
        tags: ['Events'],
        summary: 'Оновити подію',
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'integer' } },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/EventInput' },
            },
          },
        },
        responses: {
          200: {
            description: 'Оновлена подія',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Event' },
              },
            },
          },
          404: { description: 'Подію не знайдено' },
        },
      },
      delete: {
        tags: ['Events'],
        summary: 'Видалити подію',
        description: 'Видаляє подію та всі пов\'язані побажання',
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'integer' } },
        ],
        responses: {
          200: { description: 'Успішно видалено' },
        },
      },
    },
    '/events/{eventId}/wishes': {
      get: {
        tags: ['Wishes'],
        summary: 'Побажання для події',
        parameters: [
          { name: 'eventId', in: 'path', required: true, schema: { type: 'integer' } },
        ],
        responses: {
          200: {
            description: 'Масив побажань',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/Wish' },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ['Wishes'],
        summary: 'Додати побажання',
        parameters: [
          { name: 'eventId', in: 'path', required: true, schema: { type: 'integer' } },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/WishInput' },
            },
          },
        },
        responses: {
          201: {
            description: 'Створене побажання',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Wish' },
              },
            },
          },
        },
      },
    },
    '/wishes/{id}': {
      put: {
        tags: ['Wishes'],
        summary: 'Оновити побажання',
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'integer' } },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/WishInput' },
            },
          },
        },
        responses: {
          200: {
            description: 'Оновлене побажання',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Wish' },
              },
            },
          },
          404: { description: 'Побажання не знайдено' },
        },
      },
      delete: {
        tags: ['Wishes'],
        summary: 'Видалити побажання',
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'integer' } },
        ],
        responses: {
          200: { description: 'Успішно видалено' },
        },
      },
    },
    '/wishes/{id}/reserve': {
      put: {
        tags: ['Wishes'],
        summary: 'Зарезервувати побажання',
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'integer' } },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name'],
                properties: {
                  name: { type: 'string', example: 'Олена', description: "Ім'я того, хто резервує" },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Зарезервоване побажання',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Wish' },
              },
            },
          },
          404: { description: 'Побажання не знайдено' },
        },
      },
    },
    '/wishes/{id}/unreserve': {
      put: {
        tags: ['Wishes'],
        summary: 'Зняти резерв з побажання',
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'integer' } },
        ],
        responses: {
          200: {
            description: 'Побажання без резерву',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Wish' },
              },
            },
          },
          404: { description: 'Побажання не знайдено' },
        },
      },
    },
  },
  components: {
    schemas: {
      Event: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          title: { type: 'string', example: 'День народження Марії' },
          description: { type: 'string', example: '30 років!' },
          date: { type: 'string', format: 'date', example: '2026-05-15', nullable: true },
          emoji: { type: 'string', example: '🎂' },
          created_at: { type: 'string', format: 'date-time' },
        },
      },
      EventWithCounts: {
        allOf: [
          { $ref: '#/components/schemas/Event' },
          {
            type: 'object',
            properties: {
              wish_count: { type: 'integer', example: 5 },
              reserved_count: { type: 'integer', example: 2 },
            },
          },
        ],
      },
      EventInput: {
        type: 'object',
        required: ['title'],
        properties: {
          title: { type: 'string', example: 'День народження Марії' },
          description: { type: 'string', example: '30 років!' },
          date: { type: 'string', format: 'date', example: '2026-05-15', nullable: true },
          emoji: { type: 'string', example: '🎂', default: '🎁' },
        },
      },
      Wish: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          event_id: { type: 'integer', example: 1 },
          title: { type: 'string', example: 'AirPods Pro' },
          url: { type: 'string', example: 'https://store.apple.com/airpods-pro' },
          image_url: { type: 'string', example: '' },
          reserved_by: { type: 'string', nullable: true, example: null },
          created_at: { type: 'string', format: 'date-time' },
        },
      },
      WishInput: {
        type: 'object',
        required: ['title'],
        properties: {
          title: { type: 'string', example: 'AirPods Pro' },
          url: { type: 'string', example: 'https://store.apple.com/airpods-pro' },
          image_url: { type: 'string', example: '' },
        },
      },
    },
  },
};

module.exports = swaggerSpec;
