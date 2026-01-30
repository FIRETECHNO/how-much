export function useAppConst() {
  let companyEmail = "ya.bezm2012@yandex.ru"
  const jobItems = [
    'Продажи',
    'Маркетинг',
    'Ассистент',
  ]
  const jobColors: any = {
    'Продажи': "primary",
    'Маркетинг': "secondary",
    'Ассистент': "#F32D40",
  }

  const jobReservationFeedbackOptions = [
    'Принял(а) на работу',
    'Отказал(а)',
    'Еще думаю',
  ];

  const experienceOptions = ['от 1 до 3 лет', 'от 3 до 5 лет', 'от 5 лет', 'не указан'];
  const workFormatOptions = ['онлайн', 'оффлайн', 'гибрид', 'не указан'];

  const EMPLOYER_SUBSCRIPTION_DURATION = 7 * 24 * 60 * 60 * 1000;

  return { companyEmail, jobItems, jobColors, experienceOptions, workFormatOptions, jobReservationFeedbackOptions, EMPLOYER_SUBSCRIPTION_DURATION }
}