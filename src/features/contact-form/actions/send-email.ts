'use server';

import nodemailer from 'nodemailer';
import type { ContactFormData, SendEmailResult } from '@/shared/config/mail';

export async function sendEmail(
  prevState: SendEmailResult,
  formData: FormData
): Promise<SendEmailResult> {
  // 1. Получаем данные из формы
  const data: ContactFormData = {
    name: formData.get('name') as string,
    email: formData.get('email') as string,
    message: formData.get('message') as string,
  };

  // 2. Валидация на сервере
  if (!data.name || !data.email || !data.message) {
    return {
      success: false,
      message: '',
      error: 'Все поля обязательны для заполнения'
    };
  }

  if (!data.email.includes('@')) {
    return {
      success: false,
      message: '',
      error: 'Введите корректный email'
    };
  }

  // 3. Проверяем наличие переменных окружения
  const config = {
    host: process.env.MAILRU_SMTP_HOST,
    port: process.env.MAILRU_SMTP_PORT,
    user: process.env.MAILRU_USER,
    password: process.env.MAILRU_PASSWORD,
    recipient: process.env.MAILRU_RECIPIENT,
  };

  // Проверяем, что все переменные есть
  const missingVars = Object.entries(config)
    .filter(([_, value]) => !value)
    .map(([key]) => key);

  if (missingVars.length > 0) {
    console.error('Отсутствуют переменные окружения:', missingVars);
    return {
      success: false,
      message: '',
      error: 'Ошибка конфигурации сервера'
    };
  }

  // 4. Создаем транспортер (используем значения с проверкой, что они не undefined)
  const transporter = nodemailer.createTransport({
    host: config.host!,
    port: Number(config.port!),
    secure: true,
    auth: {
      user: config.user!,
      pass: config.password!,
    },
  });

  try {
    // 5. Формируем HTML для письма
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #2563eb; color: white; padding: 10px 20px; border-radius: 8px 8px 0 0; }
          .content { background: #f3f4f6; padding: 20px; border-radius: 0 0 8px 8px; }
          .field { margin-bottom: 15px; }
          .label { font-weight: bold; color: #374151; }
          .value { margin-top: 5px; padding: 10px; background: white; border-radius: 4px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>Новое сообщение с сайта</h2>
          </div>
          <div class="content">
            <div class="field">
              <div class="label">Имя:</div>
              <div class="value">${data.name}</div>
            </div>
            <div class="field">
              <div class="label">Email:</div>
              <div class="value">${data.email}</div>
            </div>
            <div class="field">
              <div class="label">Сообщение:</div>
              <div class="value">${data.message.replace(/\n/g, '<br>')}</div>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    // 6. Отправляем письмо
    await transporter.sendMail({
      from: config.user,
      to: config.recipient,
      subject: `Новое сообщение от ${data.name}`,
      text: `Имя: ${data.name}\nEmail: ${data.email}\nСообщение: ${data.message}`,
      html: htmlContent,
    });

    // 7. Возвращаем успешный результат
    return {
      success: true,
      message: 'Сообщение успешно отправлено! Мы свяжемся с вами в ближайшее время.',
      error: ''
    };
  } catch (error) {
    // 8. Логируем ошибку (на сервере, но не показываем детали клиенту)
    console.error('Ошибка отправки письма:', error);

    // Возвращаем пользователю общее сообщение об ошибке
    return {
      success: false,
      message: '',
      error: 'Не удалось отправить сообщение. Пожалуйста, попробуйте позже.'
    };
  }
}