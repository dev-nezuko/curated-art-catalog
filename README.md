# Art Gallery

A simple Next.js gallery app with a typed API route and reusable filtering utilities.

## Local development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## API

`GET /api/artworks`

Supported query params:

- `search`: filters by title, artist, or medium
- `limit`: caps returned result count (default `10`, max `50`)

## Testing

Automated tests are written with Jest and cover:

- Query and limit normalization behavior
- Filtering logic edge cases
- API route method handling and response shape

Run tests with:

```bash
npm test
```
