export interface EmployerPayment {
  /** Идентификатор терминала */
  TerminalKey: string;

  /** Сумма в копейках */
  Amount: number;

  /** Успешность операции */
  Success: boolean;

  /** Статус платежа */
  Status: string;

  /** Токен операции */
  Token: string;

  /** Идентификатор платежа в системе Т‑Бизнес */
  PaymentId: string;

  /** Ссылка на платежную форму */
  PaymentURL?: string; // может быть пустой строкой
}

export interface EmployerPaymentOrder {
  /** Идентификатор пользователя (ObjectId в виде строки) */
  user: string;

  /** Статус записи в системе (по умолчанию "AUTHORIZED") */
  status: string;

  /** Информация о платеже, может быть null */
  payment: EmployerPayment | null;

  _id: string

  createdAt: string
  updatedAt: string
}