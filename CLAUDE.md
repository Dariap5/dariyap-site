# Личный сайт — dariyap.ru

Статический лендинг (Даша Пайвина): `index.html` + `offer.html` + `privacy.html` + 6 страниц форматов в `formats/`. Никакого билд-шага, фреймворка или package.json — чистые HTML/CSS/JS, редактируется напрямую.

## ⚠️ Деплой — ТОЛЬКО через rsync по SSH, НЕ через git

Сайт живёт на VPS в `/var/www/dariyap-personal/` — это НЕ git-репозиторий на сервере, обычная папка со статикой, обслуживаемая nginx.

```bash
ssh -i ~/.ssh/dariyap_deploy root@dariyap.ru   # логин root, ключ dariyap_deploy
```

Деплой — точечный rsync только изменённых файлов (не всей папки целиком, чтобы не задеть чужое):

```bash
cd "/Users/dariapaivina/Desktop/Личный сайт"
rsync -avz -e "ssh -i ~/.ssh/dariyap_deploy" <файл1> <файл2> root@dariyap.ru:/var/www/dariyap-personal/ --relative
```

Перед реальной заливкой сначала `--dry-run` (`-n`), чтобы увидеть точный список файлов. После — проверить `curl -s -o /dev/null -w "%{http_code}" https://dariyap.ru/` (ждём 200).

nginx-конфиг сайта: `/etc/nginx/sites-available/dariyap.ru` на сервере, `root /var/www/dariyap-personal;`.

## ⚠️ Локальный git — НЕ используй `git add/commit/push` в этой папке

Локальная папка лежит внутри git-репозитория, корень которого — **весь `/Users/dariapaivina`** (не сама папка сайта!). `git remote -v` там указывает на `github.com/Dariap5/community-system` — репозиторий совершенно другого проекта (Telegram-бот на FastAPI). Эта папка сайта в том репо числится как untracked. Обычный git-коммит здесь закоммитит сайт не туда и заодно захватит несвязанные изменения другого проекта. Для сайта нет своего git-репозитория — история изменений не отслеживается, только rsync-деплой напрямую.

## Структура

- `index.html` — главная, все секции лендинга
- `offer.html`, `privacy.html` — оферта и политика конфиденциальности
- `formats/*.html` — 6 отдельных страниц форматов работы (community, consultation, group, mentorship, review, support)
- `css/styles.css` — основные стили и адаптив (мобильный/планшет/десктоп)
- `css/desktop-figma.css` — pixel-perfect оверрайды, активны только на `@media (min-width: 1470px)` и требуют `<body class="figma-desktop">`
- `css/page.css` — стили для внутренних страниц (offer/privacy/formats)
- `css/figma-export-reference.css` — сырой референс из Figma-экспорта, не используется напрямую в проде
- `css/fonts.css` — подключение локальных шрифтов (Inter Tight Variable, LeoHand Light)
- `js/main.js` — hero-слайдер, табы «С чем приходят», карусель блога, мобильное меню
- `js/animations.js`, `js/page-format.js` — доп. анимации и логика страниц форматов
- `assets/images/` — изображения из Figma-экспорта; многие есть в паре `.jpg` + `.png`

## Известные грабли

- **`.jpg` vs `.png` в assets/images/**: некоторые картинки продублированы в обоих форматах, но только `.png`-версия имеет прозрачный фон (RGBA). Если в разметке случайно стоит `.jpg` там, где фон должен быть прозрачным (например `charity-pets`), прозрачность схлопывается в чёрный. При проблеме с фоном — сверяй `file assets/images/имя.{jpg,png}`, использовать нужно `.png`.
- **Брейкпоинт 1470px — разрыв между стилями**: `desktop-figma.css` активен только от 1470px и выше (плюс требует класс `figma-desktop` на `<body>`, он уже есть). MacBook Pro в обычном масштабе даёт логическую ширину **1440px** — то есть работает база из `styles.css`, БЕЗ pixel-perfect оверрайдов. Диапазон **993–1469px** — самый вероятный источник визуальных багов, которых нет ни на мобилке (`<640px`/`<992px`), ни на десктопе `≥1470px`. При жалобах на «съехало на макбуке» — сначала проверяй именно этот диапазон.
- Секция `.formats__faq` (список форматов под зелёной плашкой) — сетка `repeat(3, 1fr)` без `column-gap`; отступ между колонками задаётся через `padding-right` на `.formats__faq-item`. Базовое значение — `clamp(28px, 2.5vw, 47px)` (styles.css), на `≥1470px` оверрайдится фиксированным `47px` (desktop-figma.css).

## Локальный запуск

```bash
cd "/Users/dariapaivina/Desktop/Личный сайт"
python3 -m http.server 8080
```
