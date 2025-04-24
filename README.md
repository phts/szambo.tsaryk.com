# [`szambo.tsaryk.com`](https://szambo.tsaryk.com)

Designed specially for [PHTS LVL-1] to store and display data.

Features:

- Display levels and logs on the web page
- Send email notification when level is near the maximum
- Simple authentication system
- REST API

## Usage

### Endpoints

- `GET /`
- `POST /level?value=<value>`
- `POST /log?severity=<debug|info|warn|error>&message=<message>`

## Deployment

```sh
npm run build
npm run deploy
```

[PHTS LVL-1]: https://github.com/phts/LVL-1
