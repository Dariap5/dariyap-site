# Личный сайт — Даша Пaйвuнa

Вёрстка лендинга по макету Figma «Презы».

## Обновление из Figma

Основной сайт: семантическая вёрстка (`index.html` + `css/styles.css`).

Экспорт **figma-to-html** синхронизирован в `assets/images/*.png` (hero, галерея, блог и др.). Сырой референс: `css/figma-export-reference.css` + `assets/figma-export/`.

При повторном экспорте из Figma замените PNG в `assets/images/` с теми же именами.

## Запуск

Откройте `index.html` в браузере или поднимите локальный сервер:

```bash
cd "/Users/dariapaivina/Desktop/Личный сайт"
python3 -m http.server 8080
```

Затем откройте http://localhost:8080

## Структура

- `index.html` — разметка всех секций
- `css/styles.css` — базовые стили и адаптив
- `css/desktop-figma.css` — pixel-perfect для ширины 1470px
- `js/main.js` — слайдер hero, табы «С чем приходят», карусель блога, мобильное меню
- `assets/images/` — изображения из Figma (действуют ~7 дней с момента экспорта; при необходимости перекачайте из Figma)

## Шрифты

Локальные файлы в `assets/fonts/` (скопированы с вашего Mac):

- **Inter Tight** — Variable + Black (900 для цифр шагов)
- **LeoHand Light** — акцентный рукописный текст

Подключение: `css/fonts.css`

## Что настроить

- Ссылки на Telegram, Calendly и соцсети в футере и CTA (`href="#"` → ваши URL)
- При необходимости — дополнительные скриншоты для точной подгонки отступов
