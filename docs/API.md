# API Documentation

## Base URL

- Development: `http://localhost:3001`
- Production: `https://api.nullvoid.dev`

## Authentication

All API endpoints require authentication via Discord OAuth2.

### Login

```
GET /api/v1/auth/discord
```

Redirects to Discord OAuth2 consent screen.

### Callback

```
GET /api/v1/auth/discord/callback
```

Exchanges code for a JWT token.

### Get Current User

```
GET /api/v1/auth/me
```

Returns the authenticated user's profile.

## Endpoints

### Guilds

```
GET    /api/v1/guilds              # List user's guilds
GET    /api/v1/guilds/:id          # Get guild details
POST   /api/v1/guilds/:id/modules  # Toggle module
```

### Moderation

```
GET    /api/v1/guilds/:id/cases    # List moderation cases
POST   /api/v1/guilds/:id/cases   # Create moderation case
```

### Tickets

```
GET    /api/v1/guilds/:id/tickets  # List tickets
POST   /api/v1/guilds/:id/tickets # Create ticket
```

### Economy

```
GET    /api/v1/guilds/:id/economy  # Get economy stats
```

### Analytics

```
GET    /api/v1/guilds/:id/analytics # Get analytics data
```

## WebSocket

Connect to `/ws` for real-time events.

## Response Format

```json
{
  "success": true,
  "data": {},
  "error": {
    "code": "ERROR_CODE",
    "message": "Error description"
  },
  "meta": {
    "page": 1,
    "pageSize": 25,
    "total": 100,
    "totalPages": 4
  }
}
```

## Rate Limiting

- 100 requests per minute per IP
- 429 Too Many Requests on limit exceeded
