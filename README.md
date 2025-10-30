# File-Universal-Converter

## Описание

Проект представляет собой `MVP` универсального веб-конвертера для работы с шрифтами (ttf, woff, woff2), документами (pdf) и изображениями (png, jpg, webp). Создан для решения личных задач по конвертации файлов различных форматов.

![Скриншот программы](/frontend/public/image.png)

## Мотивация создания

Этот проект был разработан исходя из личных потребностей:

- **Личная потребность**: необходимость в удобном инструменте для повседневных задач конвертации файлов
- **Частая работа с дизайном**: необходимость быстро конвертировать шрифты для веб-проектов
- **Оптимизация изображений**: потребность в быстром изменении форматов
- **Скорость и удобство**: желание иметь единый инструмент вместо множества онлайн-сервисов, а также без каких-либо ограничений
- **Знакомство с vibe-coding:** начальная структура, идея и функциональная логика были реализованы с использованием Cursor для исследования этого подхода к разработке

На основе этого опыта были сформированы выводы относительно направления vibe-coding, текущие проблемы и перспективы в дальнейшем.

## Ссылки

[Демоверсия программы](https://file-universal-converter.onrender.com)

## Запуск и установка

### Docker (рекомендуется)

1. Клонируем репозиторий:

   ```bash
   git clone https://github.com/Niko142/file-universal-converter.git
   cd file-universal-converter
   ```

2. Запускаем через Docker-Compose:

   ```bash
   docker-compose up --build
   ```

3. Открываем интерфейс в браузере:

- **Frontend:** `http://localhost:5173`
- **Backend API:** `http://localhost:8000`

### Ручная установка

#### Backend

1. Переходим в папку backend:

   ```bash
   cd backend
   ```

2. Создаем и активируем виртуальное окружение:

   ```bash
   python -m venv .venv

   # Для Windows
   .\.venv\Scripts\activate
   ```

3. Устанавливаем зависимости:

   ```bash
   pip install -r requirements.txt
   ```

4. Запускаем сервер:

   ```bash
   uvicorn main:app --reload
   ```

#### Frontend

1. Переходим в папку frontend:

   ```bash
   cd frontend
   ```

2. Устанавливаем зависимости:

   ```bash
   npm install
   ```

3. Запускаем dev-сборку:

   ```bash
   npm run dev
   ```

4. При необходимости формируем production-сборку:

   ```bash
   npm run build
   npm run preview
   ```

## Основные возможности

- **Конвертация шрифтов:**

  - TTF → WOFF
  - TTF → WOFF2

- **Конвертация документов:**
  - PNG → PDF
  - JPG → PDF
  - WEBP → PDF
- **Конвертация изображений:**
  - PNG → JPG
  - JPG → PNG
  - PNG → WEBP
  - JPG → WEBP
  - WEBP → PNG
  - WEBP → JPG

## Стек технологий

**Backend**:

- Python
- FastAPI
- Fonttools - для конвертации шрифтов
- Pillow - обработка изображений

**Frontend**:

- HTML
- CSS
- JavaScript
- Vite (Сборщик)
- Vitest (тестирование)

## Структура проекта

```text
FontImageConverter
├── README.md
├── backend
│   ├── Dockerfile
│   ├── converter_router.py
│   ├── converters
│   │   ├── font_converter.py
│   │   ├── image_converter.py
│   │   └── image_to_pdf.py
│   ├── main.py
│   └── requirements.txt
├── docker-compose.yml
└── frontend
    ├── Dockerfile
    ├── eslint.config.js
    ├── index.html
    ├── jsconfig.json
    ├── nginx.conf
    ├── package-lock.json
    ├── package.json
    ├── public
    │   ├── favicon.ico
    │   ├── image.png
    │   └── vite.svg
    ├── src
    │   ├── api
    │   ├── constants
    │   ├── features
    │   ├── main.js
    │   ├── services
    │   ├── style.css
    │   └── utils
    └── vite.config.js
```

## Планы на развитие проекта

- Добавление новых форматов и методов конвертации
- Рефакторинг на TypeScript
- Улучшение алгоритмов конвертации
- Применение алгоритмов для большего сжатия размера файлов
