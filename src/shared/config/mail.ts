// Типы для конфигурации почты
export interface MailConfig {
  host: string;
  port: number;
  user: string;
  password: string;
  recipient: string;
}

// Типы для данных формы
export interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

// Типы для результата отправки
export interface SendEmailResult {
  success: boolean;
  message: string;
  error?: string;
}

// Конфигурация для Mail.ru
export const MAILRU_CONFIG = {
  host: 'smtp.mail.ru',
  port: 465,
  secure: true,
} as const;