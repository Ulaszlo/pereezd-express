import { ContactForm } from '@/features/contact-form';

export const metadata = {
  title: 'Свяжитесь с нами',
  description: 'Форма обратной связи',
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-gray-100 py-12">
      <ContactForm />
    </main>
  );
}