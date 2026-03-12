import nodemailer from 'nodemailer';
import type { MailConfig } from '@/shared/config/mail';

// Транспортер для отправки писем
export function createMailTransporter(config: MailConfig) {
  return nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: true, // true для 465 порта
    auth: {
      user: config.user,
      pass: config.password,
    },
  });
}

// Проверка подключения
export async function verifyMailConnection(config: MailConfig) {
  try {
    const transporter = createMailTransporter(config);
    await transporter.verify();
    return { success: true, message: 'Подключение к SMTP успешно' };
  } catch (error) {
    return {
      success: false,
      message: 'Ошибка подключения к SMTP',
      error: error instanceof Error ? error.message : 'Неизвестная ошибка'
    };
  }
}