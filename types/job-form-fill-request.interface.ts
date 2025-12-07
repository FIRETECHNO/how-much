import type { User } from "./user.interface"

// === 1. Базовый интерфейс для создания ===
export interface JobFormFillRequest {
  job: string;
  employee: string; // ID
  startDate: string | null;
  endDate: string | null;
  manager: string | null; // ID менеджера
}

// === 2. Версия из базы (без populate) ===
export interface JobFormFillRequestDB extends JobFormFillRequest {
  confirmedByEmployee: boolean
  _id: string;
  createdAt: string;
  updatedAt: string;
}

// === 3. Помощники для populate ===
// Популированный сотрудник
export type PopulatedEmployee = {
  _id: User["_id"];
  name: User["name"];
  email: User["email"];
  tgId: User["tgId"];
  tgUsername: User["tgUsername"];
};

// Популированный менеджер (минимум данных)
export type PopulatedManager = {
  _id: User["_id"];
  name: User["name"];
  email: User["email"];
};

// === 4. Полностью популированная версия ===
export interface JobFormFillRequestDBPopulated
  extends Omit<JobFormFillRequestDB, 'employee' | 'manager'> {
  employee: PopulatedEmployee;
  manager: PopulatedManager | null;
}

// === 5. Только менеджер популирован ===
export interface JobFormFillRequestDBPopulatedManager
  extends Omit<JobFormFillRequestDB, 'manager'> {
  manager: PopulatedManager;
}