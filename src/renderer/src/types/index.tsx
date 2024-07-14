export type LogType = {
  _id?: string;
  email?: string;
  startTime: Date;
  endTime: Date;
  duration?: number;
  notes: string;
}

export type UserType = {
  _id?: string;
  name?: string;
  email?: string;
  role?: string;
}