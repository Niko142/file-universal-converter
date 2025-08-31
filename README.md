# File-Universal-Converter

![Скриншот программы](/frontend/public/image.png)

## Описание

Проект представляет собой `MVP` универсального веб-конвертера для работы с шрифтами (ttf, woff, woff2), документами (pdf) и изображениями (png, jpg, webp). Создан для решения личных запросов по конвертации файлов различных форматов.

**Мотивация создания**
Этот проект был разработан исходя из личных потребностей:

- Частая работа с дизайном: необходимость быстро конвертировать шрифты для веб-проектов
- Оптимизация изображений: потребность в быстром изменении форматов
- Скорость и удобство: желание иметь единый инструмент вместо множества онлайн-сервисов, а также без каких-либо ограничений
- Опробовать vibe-coding: начальная структура, идея и функциональная логика была реализована на основе `Cursor`.

На основе этого я также сформировал некоторые умозаключения касаемо vibe-coding направления, текущие проблемы и перспективы в дальнейшем.

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

Frontend: [http://localhost:5173]
Backend API: [http://localhost:8000]

### Ручная установка

#### Backend

1. Переходим в папку backend:

   ```bash
   cd backend
   ```

2. Устанавливаем зависимости:

   ```bash
   pip install -r requirements.txt
   ```

3. Запускаем сервер:

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

- JavaScript
- CSS
- Vite

## Структура проекта

<!-- prettier-ignore -->
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
    │   │   └── config.js
    │   ├── constants
    │   │   └── conversions.js
    │   ├── features
    │   │   ├── progress-bar
    │   │   ├── result-handler
    │   │   └── select-handler
    │   ├── main.js
    │   ├── services
    │   │   └── conversionService.js
    │   ├── style.css
    │   └── utils
    │       ├── downloadFile.js
    │       ├── formatFile.js
    │       └── headers.js
    └── vite.config.js

## Планы на развитие проекта

- Добавление новых форматов и методов конвертации
- Улучшение интерфейса
- Улучшение алгоритмов конвертации
