import type { User } from "./user.interface"

export interface JobFormFillRequest {
  job: string
  employee: string
  startDate: string | null
  endDate: string | null
  manager: string | null
}

export interface JobFormFillRequestDB extends JobFormFillRequest {
  _id: string
  createdAt: string
  updatedAt: string
}

export interface JobFormFillRequestDBPopulated {
  _id: string;
  job: string;
  employee: {
    _id: User["_id"];
    name: User["name"];
    email: User['email'];
    tgId: User["tgId"];
    tgUsername: User["tgUsername"]
  };
  startDate: string | null;
  endDate: string | null;
  createdAt: string;
  updatedAt: string;

  manager: {
    _id: User["_id"];
    name: User["name"];
    email: User['email'];
  } | null
}