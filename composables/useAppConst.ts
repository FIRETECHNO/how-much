export function useAppConst() {
  let companyEmail = "glazyrina@anna-glazyrina.ru"
  const jobItems = [
    'Продажи',
    'Маркетинг',
    'Ассистент',
  ]
  const experienceOptions = ['от 1 до 3 лет', 'от 3 до 5 лет', 'от 5 лет', 'не указан'];
  const workFormatOptions = ['онлайн', 'оффлайн', 'гибрид', 'не указан'];

  return { companyEmail, jobItems, experienceOptions, workFormatOptions }
}