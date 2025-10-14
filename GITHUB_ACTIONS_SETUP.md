# Настройка GitHub Actions для деплоя

## Шаг 1: Настройка репозитория

1. Откройте ваш репозиторий на GitHub
2. Перейдите в **Settings** (Настройки)

## Шаг 2: Включение GitHub Pages через Actions

1. В меню слева выберите **Pages**
2. В разделе **Build and deployment**:
   - **Source**: выберите **GitHub Actions**
   - (Не нужно выбирать branch, Actions сами будут деплоить)

![GitHub Pages Settings](https://i.imgur.com/example.png)

## Шаг 3: Проверка прав доступа

1. В настройках репозитория перейдите в **Actions** → **General**
2. Пролистайте вниз до **Workflow permissions**
3. Убедитесь, что выбрано:
   - ✅ **Read and write permissions**
   ИЛИ
   - ✅ **Read repository contents and packages permissions** + галочка **Allow GitHub Actions to create and approve pull requests**

## Шаг 4: Деплой

Теперь при каждом `git push` в ветку `main`:

```bash
git add .
git commit -m "Migrate to Astro"
git push
```

GitHub Actions автоматически:
1. Установит зависимости (`npm ci`)
2. Соберёт сайт (`npm run build`)
3. Задеплоит папку `dist/` на GitHub Pages

## Шаг 5: Проверка деплоя

1. Перейдите во вкладку **Actions** в репозитории
2. Вы увидите запущенный workflow "Deploy to GitHub Pages"
3. Дождитесь зелёной галочки ✅
4. Сайт будет доступен по адресу: `https://ivankniazev.dev`

## Устранение проблем

### Ошибка: "Deployment failed"
- Проверьте логи в Actions
- Убедитесь, что в настройках Pages выбран "GitHub Actions"

### Ошибка: "Permission denied"
- Проверьте Workflow permissions (Шаг 3)
- Дайте права на запись

### Сайт не обновляется
- Очистите кэш браузера (Ctrl+F5)
- Проверьте, что деплой завершился успешно в Actions
- Подождите 1-2 минуты после деплоя

## Структура проекта после миграции

```
ivankniazev.dev/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions конфиг
├── src/                        # Исходники Astro
│   ├── components/            # Компоненты
│   ├── layouts/               # Layouts
│   ├── pages/                 # Страницы (генерируют роуты)
│   ├── data/                  # Данные (JSON)
│   └── utils/                 # Утилиты
├── public/                    # Статичные файлы (копируются как есть)
│   ├── style.css             # Стили
│   └── CNAME                 # Для custom domain
├── dist/                      # ⚠️ Папка сборки (игнорируется в git)
├── astro.config.mjs          # Конфиг Astro
├── package.json              # Зависимости
└── tsconfig.json             # TypeScript конфиг
```

## Добавление нового проекта

Теперь добавление проекта занимает 2 минуты:

1. Откройте `src/data/projects.json`
2. Добавьте новый объект:

```json
{
  "id": "new-project",
  "slug": "new-project",
  "icon": "🚀",
  "title": {
    "en": "New Project",
    "ru": "Новый проект"
  },
  "shortDescription": {
    "en": "Description",
    "ru": "Описание"
  },
  "tech": ["JavaScript", "React"],
  "status": "released",
  "year": 2025,
  "overview": { ... },
  "features": [ ... ]
}
```

3. Закоммитьте и запушьте:

```bash
git add src/data/projects.json
git commit -m "Add new project"
git push
```

4. Готово! Страницы `/projects` и `/projects/new-project` создадутся автоматически

## Полезные команды

```bash
# Локальная разработка
npm run dev

# Сборка для продакшена
npm run build

# Предпросмотр prod сборки
npm run preview

# Проверка TypeScript
npm run astro check
```
