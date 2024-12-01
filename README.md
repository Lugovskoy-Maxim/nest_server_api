# Как запустить

```bash
# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```
> Статус проекта: ещё не работает

## MVP функционал
<details>
  <summary><b>Аунтификация</b></summary>
  
  - [x]  POST /register — Регистрация нового пользователя.
  - [x]  POST /login — Аувторизация и получение токена.
 </details>
 
<details>
   <summary><b>Кошельки</b></summary>
  
  - [ ]  GET /wallets — Получение списка всех кошельков.
  - [ ]  GET /wallets/{id} — Получение информации о конкретном кошельке.
  - [ ]  POST /wallets — Создание нового кошелька.
  - [ ]  PUT /wallets/{id} — Редактирование существующего кошелька.
  - [ ]  DELETE /wallets/{id} — Удаление кошелька.
</details>
  
<details>
      <summary><b>Транзакции</b></summary>
   
  - [ ]  GET /wallets/{walletId}/transactions — Получение списка всех транзакций для кошелька.
  - [ ]  GET /transactions/{id} — Получение информации о конкретной транзакции.
  - [ ]  POST /wallets/{walletId}/transactions — Создание новой транзакции для кошелька.
  - [ ]  PUT /transactions/{id} — Редактирование существующей транзакции.
  - [ ]  DELETE /transactions/{id} — Удаление транзакции.
</details>

<details>
    <summary><b>Пользователи</b></summary>
  
  - [ ]  GET /users — Получение списка всех пользователей.
  - [ ]  GET /users/{id} — Получение информации о конкретном пользователе.
  - [ ]  PUT /users/{id} — Редактирование профиля пользователя.
  - [ ]  DELETE /users/{id} — Удаление пользователя. 
</details>

<details>
    <summary><b>Категории</b></summary>
  
 - [ ]  GET /categories/expenses — Получение списка категорий расходов.
 - [ ]  GET /categories/incomes — Получение списка категорий доходов.
 - [ ]  POST /categories/expenses — Создание новой категории расходов.
 - [ ]  POST /categories/incomes — Создание новой категории доходов.
 - [ ]  PUT /categories/{id} — Редактирование категории.
 - [ ]  DELETE /categories/{id} — Удаление категории.
</details>
