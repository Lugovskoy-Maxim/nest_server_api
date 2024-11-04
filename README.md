## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

# Запрос на регистрацию
> curl -X POST http://localhost:3001/api/auth/register -d '{"username": "john", "password": "changeme"}' -H "Content-Type: application/json"
# Ответ 
> {"access_token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXlsb2FkIjp7InVzZXJuYW1lIjoiam9obiIsInN1YiI6IjY3MWViMTQ0Y2Y4YjM4MzA1YjQ0NjY0MCJ9LCJpYXQiOjE3MzAwNjQ3MDgsImV4cCI6MTczMDY2OTUwOH0.qJeNgz2UOvl8fxW0WBK_DSi_63I4Kn4ubkWLV7jb0RY","userId":"671eb144cf8b38305b446640","username":"john"}