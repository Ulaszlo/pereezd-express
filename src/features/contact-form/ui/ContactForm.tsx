'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { sendEmail } from '../actions/send-email';
import type { SendEmailResult } from '@/shared/config/mail';
import { useEffect, useRef, useState } from 'react';

// TODO 1) Разбить на компоненты
// TODO 2) Пересобрать поля(некоторые избыточны)
// TODO 3) Добавить scss модули

// Кнопка отправки с состоянием загрузки
function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition disabled:bg-blue-300 disabled:cursor-not-allowed font-medium"
    >
      {pending ? 'Отправка...' : 'Отправить сообщение'}
    </button>
  );
}

type statusType = 'success' | 'error';

// Компонент уведомления
function Notification({ type, message, onClose }: {
  type: statusType;
  message: string;
  onClose: () => void;
}) {
  useEffect(() => {
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose, message]);

  const styles = {
    success: 'bg-green-100 border-green-400 text-green-700',
    error: 'bg-red-100 border-red-400 text-red-700',
  };

  return (
    <div className={`mb-4 p-3 border rounded ${styles[type]}`}>
      {message}
    </div>
  );
}

const initialState: SendEmailResult = {
  success: false,
  message: '',
  error: '',
};

export function ContactForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction] = useFormState(sendEmail, initialState);
  const [notification, setNotification] = useState<{
    type: statusType;
    message: string;
  } | null>(null);

  useEffect(() => {
    if (!state.success && !state.error) return;

    setNotification(prevNotification => {
      // Если уведомление уже показывает то же сообщение, не обновляем
      if (state.success && state.message) {
        if (prevNotification?.type === 'success' && prevNotification?.message === state.message) {
          return prevNotification;
        }
        formRef.current?.reset();
        return { type: 'success', message: state.message };
      }

      if (state.error) {
        if (prevNotification?.type === 'error' && prevNotification?.message === state.error) {
          return prevNotification;
        }
        return { type: 'error', message: state.error };
      }

      return prevNotification;
    });
  }, [state.success, state.message, state.error]); // Зависимости от конкретных полей

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center">Обратная связь</h2>

      {notification && (
        <Notification
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification(null)}
        />
      )}

      <form ref={formRef} action={formAction} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Ваше имя *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Иван Иванов"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email для ответа *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="ivan@example.com"
          />
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
            Сообщение *
          </label>
          <textarea
            id="message"
            name="message"
            required
            rows={5}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            placeholder="Напишите ваше сообщение..."
          />
        </div>

        <SubmitButton />
      </form>
    </div>
  );
}