import { Achievement, TaskColumn } from "./types";

export const achievements: Achievement[] = [
  {
    title: "Анна взяла самую сложную задачу в спринте",
    meta: "Анна Смирнова",
    detail: "Сложность +40%"
  },
  {
    title: "Денис завершил 5 задач досрочно",
    meta: "Денис Иванов",
    detail: "5 задач на 2 дня раньше"
  },
  {
    title: "Команда закрыла спринт на 94%",
    meta: "Вся команда",
    detail: "Лучший результат за 2 месяца"
  }
];

export const taskColumns: TaskColumn[] = [
  {
    title: "К выполнению",
    count: 2,
    tone: "muted",
    tasks: [
      {
        title: "Рефакторинг API модуля",
        initials: "ИВ",
        owner: "Иванов",
        date: "15 мая",
        priority: "HIGH"
      },
      {
        title: "Тесты для нового функционала",
        initials: "ПЕ",
        owner: "Петрова",
        date: "13 мая",
        priority: "MED"
      }
    ]
  },
  {
    title: "В работе",
    count: 2,
    tone: "blue",
    tasks: [
      {
        title: "Интеграция с платёжной системой",
        initials: "СИ",
        owner: "Сидоров",
        date: "14 мая",
        priority: "HIGH",
        progress: "65%"
      },
      {
        title: "Дизайн новой формы",
        initials: "АН",
        owner: "Анна",
        date: "16 мая",
        priority: "LOW",
        progress: "40%"
      }
    ]
  },
  {
    title: "Готово",
    count: 1,
    tone: "green",
    tasks: [
      {
        title: "Настройка CI/CD",
        initials: "ДЕ",
        owner: "Денис",
        date: "12 мая",
        priority: "MED",
        progress: "100%"
      }
    ]
  }
];
