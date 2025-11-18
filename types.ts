export type Theme = 'light' | 'dark';

export interface StudyEntry {
  id: string;
  uid: string;
  date: string;
  subject: string;
  timeSlot: string;
  chapter: string;
  details: string;
  hours: number;
  createdAt: string;
}

export interface Reminder {
  id: string;
  uid: string;
  title: string;
  date: string;
}