<img width="160" height="160" alt="Логотип" src="https://github.com/user-attachments/assets/4dc2d547-84a7-475f-8d10-ea058fe1d3b6" />

# GameCheck

Является платформой по отслеживаю игровой активности вместе со социальными функциями. Предоставляет возможность собрать всю коллекцию игр в одном месте. Делитесь результатами. Наблюдайте за друзьями. Находите для себя новое!

## 🍷 Функциональность

- Отслеживание прогресса (играю, пройдено, брошено, планирую)
- Социальные функции: подписки, комментарии
- Интерактивные квизы
- Быстрая авторизация через Steam
- Тёмная и светлая тема
- Мобильная поддержка
- **Steam интеграция:**
  - Подтягивание данных
  - Подробное отображение игр на основе вашего аккаунта

## 📚 Архитектура

**Frontend** - Написан на React

**Backend** - Сделан на Go с использованием библиотеки Gin

## 📸 Визуальная составляющая

### Приветствующий экран

<img width="3840" height="2160" alt="Приветственный экран" src="https://github.com/user-attachments/assets/244930c8-cf1d-41d9-930a-f79fa6ebd377" />

### Главная страница

<img width="3840" height="2160" alt="Главная страница" src="https://github.com/user-attachments/assets/5b9fdce4-73bd-4f3f-99c7-c3e1da636070" />
<br></br>
<img width="3840" height="2160" alt="Главная страница 2" src="https://github.com/user-attachments/assets/fd2fd85f-ecbc-4e4d-b76a-9cbbdfed1086" />

### Ваш профиль

<img width="3840" height="2160" alt="Ваш профиль" src="https://github.com/user-attachments/assets/ad43799f-bfb5-4d76-b797-e19db5e75095" />
<br></br>
<img width="3840" height="2160" alt="Ваш профиль 2" src="https://github.com/user-attachments/assets/879d9bc8-9c5d-427b-8cc7-a85ea686d478" />
<br></br>
<img width="3840" height="2160" alt="Ваш профиль 3" src="https://github.com/user-attachments/assets/b96d00c5-fd62-4021-ad4b-8e81e3342ff3" />

### Светлая тема

<img width="3840" height="2160" alt="Светлая тема" src="https://github.com/user-attachments/assets/85bcf75b-c825-44fe-ba5b-ea0aa9fa17a6" />

### Добавление игры
<img width="3840" height="2160" alt="Добавление игры" src="https://github.com/user-attachments/assets/293be8f7-f165-42c0-82c0-a9a6b065be68" />

### Список пользователей сайта
<img width="3840" height="2160" alt="Список пользователей сайта" src="https://github.com/user-attachments/assets/b518bd08-e92f-499d-95d8-046ef6eb3943" />

### Квизы

<img width="3840" height="2160" alt="Квизы" src="https://github.com/user-attachments/assets/5a11e835-e729-44d8-b1e6-7bbc5cb9d9c0" />
<br></br>
<img width="3840" height="2160" alt="Квизы 2" src="https://github.com/user-attachments/assets/25134c76-ea37-4a5e-a13d-8ca8db258eb9" />


### Библиотека

<img width="3840" height="2160" alt="26 145 33 196_3000_library" src="https://github.com/user-attachments/assets/78834017-7f2a-4728-8f18-35d835cf1242" />
<br></br>
<img width="3840" height="2160" alt="26 145 33 196_3000_library_e4ed34ed-20b0-4162-9e15-b9b66dad773e" src="https://github.com/user-attachments/assets/1bb80808-7e23-42a2-98dc-b3892adf0880" />
<br></br>
<img width="3840" height="2160" alt="26 145 33 196_3000_library_e4ed34ed-20b0-4162-9e15-b9b66dad773e (1)" src="https://github.com/user-attachments/assets/5846b795-933d-4887-aa08-a7ae05e84084" />

## 📄 Документация

### Стартовая инициализация

1. Создайте `.env`

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

2. Заполните требуемые поля

### Сборка контейнеров

```bash
docker compose build
```

### Запуск проекта

```bash
docker compose up -d
```

Перейдите на [запущенный сайт](http://localhost:3000/).

### Проверка состояния

```bash
docker compose ps
```

### Остановка проекта

```bash
docker compose down
```

### Полная очистка

```bash
docker compose down -v
```

### Бэкап данных

```bash
docker compose run --rm backup
```

В дальнейшем для восстановления из бэкапа:

```bash
gunzip -c gamecheck_XXXX.sql.gz | \
docker exec -i gamecheck_db psql -U postgres -d gamecheck
```

### ↘️ Также к прочтению

- [Документация по Frontend](./frontend/README.md)
- [Документация по Backend](./backend/README.md)

## 🔒 Лицензия

Этот проект лицензирован под GNU General Public License. [GNU General Public License v3.0](https://github.com/darkfated/gamecheck/blob/master/LICENSE)
