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
- `GET /remote-control`
- `GET /rc`
- `POST /level?value=<value>&mode=<auto|manual>`
- `POST /log?severity=<debug|info|warn|error|fatal>&message=<message>`
- `POST /remote-control`
- `DELETE /level`

## Deployment

```sh
npm run build
npm run deploy
```

[PHTS LVL-1]: https://github.com/phts/LVL-1
