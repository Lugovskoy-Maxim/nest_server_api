# Как запустить

```bash
# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

> Статус проекта: ещё не работает

Поднять Монго БД в с помощью docker-compose
```bash
docker-compose up -d
```

Для подключения 1 админа 
```mongosh
use admin -- admin название учетной записи ДБ
db.users.updateOne({ _id: ObjectId("USER_ID")},{ $set: { roles: ["admin"] } })
```

