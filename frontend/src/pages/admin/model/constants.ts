import type { Achievement, ProfileRecommendation, ProfileStat, TaskColumn, WorkloadCard } from "./types";

export const workloadCards: WorkloadCard[] = [
  {
    type: "danger",
    initials: "ИВ",
    name: "Иванов Петр",
    load: "90%",
    warning: "Перегруз из-за 3 сложных задач и 5 встреч сегодня",
    recommendation:
      "Иванов Петр перегружен (90%). Петрова Ксения свободна (45%) -> Петрова, можешь помочь Иванову с задачей \"Рефакторинг API\"?"
  },
  {
    type: "danger",
    initials: "СИ",
    name: "Сидоров Алексей",
    load: "88%",
    warning: "Перегруз из-за 2 высокоприоритетных задач",
    recommendation:
      "Сидоров Алексей перегружен (88%). Денис К. свободна (55%) -> Денис, можешь помочь Сидорову с задачей \"Интеграция платежей\"?"
  },
  {
    type: "success",
    initials: "ПЕ",
    name: "Петрова Анна",
    load: "56%",
    warning: "Ресурс свободен. Можно помочь коллеге"
  },
  {
    type: "neutral",
    initials: "ДЕ",
    name: "Денис Кузнецов",
    load: "55%"
  },
  {
    type: "neutral",
    initials: "СМ",
    name: "Смирнова Елена",
    load: "68%"
  }
];

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

export const actionItems = [
  "Делегировать задачу «Рефакторинг API» от Иванова к Петровой",
  "Дать Сидорову задачу «Интеграция GraphQL API»",
  "Перенести важные задачи с пятницы на среду-четверг (низкая активность в пятницу)"
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

export const profileStats: ProfileStat[] = [
  {
    label: "Моя загрузка",
    value: "45%",
    caption: "Ресурс свободен",
    tone: "green"
  },
  {
    label: "Выполнено в срок",
    value: "95%",
    caption: "Отличный результат",
    tone: "neutral"
  }
];

export const profileGrowthZones = [
  "Backend интеграции - не осваивала 2 месяца",
  "Архитектурное проектирование",
  "GraphQL - новая технология"
];

export const profileRecommendations: ProfileRecommendation[] = [
  {
    tone: "success",
    title: "Вы берёте задачи средней сложности - попробуйте следующую сложнее",
    text: "Рекомендуем задачу \"Интеграция GraphQL API\" - сложность +20%, плавное повышение навыков"
  },
  {
    tone: "warning",
    title: "У вас много встреч (12 в неделю) - попробуйте заблокировать 2 часа в день на глубокую работу",
    text: "Это поможет сконцентрироваться на сложных задачах без отвлечений"
  },
  {
    tone: "neutral",
    title: "У вас есть свободное время (45% загрузка) - можете помочь коллегам",
    text: "Иван Иванов перегружен задачей \"Интеграция платежей\" - ваша экспертиза подходит"
  }
];
