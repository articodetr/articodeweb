import { useState } from 'react';
import { ArrowUpRight, Check, Loader2, AlertCircle, Mail, Phone, MapPin, Clock, MessageCircle } from 'lucide-react';
import { SectionHeading } from '@/components/SectionHeading';
import { Reveal } from '@/components/motion';
import { getServices } from '@/data/content';
import {
  CONTACT_EMAIL,
  CONTACT_EMAIL_HREF,
  CONTACT_PHONE_DISPLAY,
  CONTACT_PHONE_HREF,
  getWhatsAppUrl,
} from '@/data/contact';
import { supabase } from '@/lib/supabase';
import { useLang } from '@/i18n';

type Status = 'idle' | 'submitting' | 'success' | 'error';
type RequiredField = 'name' | 'email' | 'message';
type FieldErrors = Partial<Record<RequiredField, string>>;

export function ContactPage() {
  const { lang, t } = useLang();
  const services = getServices(lang);

  const [status, setStatus] = useState<Status>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  const [form, setForm] = useState({
    name: '',
    email: '',
    company: '',
    service: '',
    message: '',
  });

  const update = (key: keyof typeof form, value: string) => {
    setForm((f) => ({ ...f, [key]: value }));
    if (key === 'name' || key === 'email' || key === 'message') {
      setFieldErrors((current) => ({ ...current, [key]: undefined }));
    }
    if (status === 'error') {
      setStatus('idle');
      setErrorMsg('');
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === 'submitting') return;

    const nextErrors: FieldErrors = {};
    if (!form.name.trim()) nextErrors.name = t.contact.errName;
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      nextErrors.email = t.contact.errEmail;
    }
    if (!form.message.trim()) nextErrors.message = t.contact.errMessage;

    if (Object.keys(nextErrors).length > 0) {
      setFieldErrors(nextErrors);
      setStatus('error');
      setErrorMsg('');
      return;
    }

    if (!supabase) {
      setStatus('error');
      setErrorMsg(t.contact.errUnavailable.replace('{email}', CONTACT_EMAIL));
      return;
    }

    setStatus('submitting');
    setErrorMsg('');
    setFieldErrors({});

    const { error } = await supabase.from('contact_submissions').insert({
      name: form.name.trim(),
      email: form.email.trim(),
      company: form.company.trim() || null,
      service: form.service || null,
      message: form.message.trim(),
    });

    if (error) {
      setStatus('error');
      setErrorMsg(t.contact.errSubmit);
      return;
    }

    setStatus('success');
    setFieldErrors({});
    setForm({ name: '', email: '', company: '', service: '', message: '' });
  };

  return (
    <section
      id="contact"
      className="relative scroll-mt-20 border-t border-ink-100 py-24 md:scroll-mt-24 md:py-32"
    >
      <div className="container-x">
        <SectionHeading
          eyebrow={t.contact.eyebrow}
          title={
            <>
              {t.contact.titleA}{' '}
              <span className="text-gradient-accent">{t.contact.titleB}</span>
            </>
          }
          description={t.contact.description}
        />

        <div className="mt-14 grid gap-10 lg:grid-cols-12">
          {/* Form */}
          <Reveal className="lg:col-span-7" y={44} scale={0.97} amount={0.15}>
            <div className="card-surface p-7 md:p-9">
              {status === 'success' ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent-50 text-accent-700 ring-1 ring-accent-100">
                    <Check className="h-8 w-8" />
                  </div>
                  <h2 className="mt-6 font-display text-2xl font-semibold text-ink-950">{t.contact.successTitle}</h2>
                  <p className="mt-3 max-w-sm text-sm leading-relaxed text-ink-600">{t.contact.successBody}</p>
                  <button
                    onClick={() => setStatus('idle')}
                    className="btn-ghost mt-8"
                  >
                    {t.contact.sendAnother}
                  </button>
                </div>
              ) : (
                <form onSubmit={onSubmit} className="space-y-5" noValidate>
                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field id="contact-name" label={t.contact.fullName} error={fieldErrors.name} required>
                      <input
                        id="contact-name"
                        name="name"
                        type="text"
                        autoComplete="name"
                        value={form.name}
                        onChange={(e) => update('name', e.target.value)}
                        placeholder={t.contact.namePlaceholder}
                        className={inputClass}
                        aria-invalid={!!fieldErrors.name}
                        aria-describedby={fieldErrors.name ? 'contact-name-error' : undefined}
                      />
                    </Field>
                    <Field id="contact-email" label={t.contact.email} error={fieldErrors.email} required>
                      <input
                        id="contact-email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        value={form.email}
                        onChange={(e) => update('email', e.target.value)}
                        placeholder={t.contact.emailPlaceholder}
                        className={inputClass}
                        dir="ltr"
                        aria-invalid={!!fieldErrors.email}
                        aria-describedby={fieldErrors.email ? 'contact-email-error' : undefined}
                      />
                    </Field>
                  </div>

                  <Field id="contact-company" label={t.contact.company}>
                    <input
                      id="contact-company"
                      name="company"
                      type="text"
                      autoComplete="organization"
                      value={form.company}
                      onChange={(e) => update('company', e.target.value)}
                      placeholder={t.contact.companyPlaceholder}
                      className={inputClass}
                    />
                  </Field>

                  <div className="block">
                    <span className="mb-2 block text-xs font-semibold text-ink-600">
                      {t.contact.quickSelectService}
                    </span>
                    <div className="flex flex-wrap gap-2 pb-1">
                      {services.slice(0, 5).map((s) => {
                        const isSelected = form.service === s.id;
                        const Icon = s.icon;
                        return (
                          <button
                            key={s.id}
                            type="button"
                            onClick={() => update('service', isSelected ? '' : s.id)}
                            className={`chip-option ${isSelected ? 'chip-option-active' : 'chip-option-inactive'}`}
                          >
                            <Icon className="h-3.5 w-3.5" />
                            <span>{s.title}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <Field id="contact-service" label={t.contact.serviceOfInterest}>
                    <select
                      id="contact-service"
                      name="service"
                      value={form.service}
                      onChange={(e) => update('service', e.target.value)}
                      className={inputClass}
                    >
                      <option value="">{t.contact.selectService}</option>
                      {services.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.title}
                        </option>
                      ))}
                    </select>
                  </Field>

                  <Field id="contact-message" label={t.contact.projectDetails} error={fieldErrors.message} required>
                    <textarea
                      id="contact-message"
                      name="message"
                      value={form.message}
                      onChange={(e) => update('message', e.target.value)}
                      rows={5}
                      placeholder={t.contact.detailsPlaceholder}
                      className={`${inputClass} resize-none`}
                      aria-invalid={!!fieldErrors.message}
                      aria-describedby={fieldErrors.message ? 'contact-message-error' : undefined}
                    />
                  </Field>

                  {status === 'error' && errorMsg && (
                    <div
                      className="flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                      role="alert"
                      aria-live="assertive"
                    >
                      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                      <span>{errorMsg}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={status === 'submitting'}
                    className="btn-primary group w-full disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {status === 'submitting' ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        {t.contact.sending}
                      </>
                    ) : (
                      <>
                        {t.contact.sendMessage}
                        <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 rtl:-scale-x-100 rtl:group-hover:-translate-x-0.5" />
                      </>
                    )}
                  </button>

                  <div className="pt-2 text-center">
                    <div className="relative my-3 flex items-center justify-center">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-ink-100" />
                      </div>
                      <span className="relative bg-white px-3 text-xs font-medium text-ink-400">
                        {t.contact.orChatWhatsApp}
                      </span>
                    </div>

                    <a
                      href={getWhatsAppUrl(t.whatsapp.quickMessage)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-emerald-300/80 bg-emerald-50/70 px-5 py-3 text-sm font-semibold text-emerald-800 shadow-sm transition-all duration-300 hover:border-emerald-400 hover:bg-emerald-100/70 active:scale-98"
                    >
                      <MessageCircle className="h-4.5 w-4.5 fill-emerald-600 text-emerald-600" />
                      <span>{t.whatsapp.chatOnWhatsApp}</span>
                      <ArrowUpRight className="h-4 w-4 text-emerald-600 rtl:-scale-x-100" />
                    </a>
                  </div>
                </form>
              )}
            </div>
          </Reveal>

          {/* Details */}
          <Reveal className="lg:col-span-5" delay={0.14} y={44} scale={0.97} amount={0.15}>
            <div className="space-y-5">
              <div className="card-surface p-7">
                <h3 className="card-title text-lg md:text-xl">{t.contact.directContact}</h3>
                <ul className="mt-5 space-y-4 text-sm">
                  <DetailRow
                    icon={Mail}
                    label={t.contact.emailLabel}
                    value={CONTACT_EMAIL}
                    href={CONTACT_EMAIL_HREF}
                    ltr
                  />
                  <DetailRow
                    icon={Phone}
                    label={t.contact.phoneLabel}
                    value={CONTACT_PHONE_DISPLAY}
                    href={CONTACT_PHONE_HREF}
                    ltr
                  />
                  <DetailRow icon={MapPin} label={t.contact.studioLabel} value={t.contact.studioValue} />
                  <DetailRow icon={Clock} label={t.contact.responseLabel} value={t.contact.responseValue} />
                </ul>
              </div>

              <div className="card-surface p-7">
                <h3 className="card-title text-lg md:text-xl">{t.contact.nextTitle}</h3>
                <ol className="mt-5 space-y-4">
                  {[t.contact.nextStep1, t.contact.nextStep2, t.contact.nextStep3].map((step, i) => (
                    <li key={i} className="flex gap-3 text-sm text-ink-600">
                      <span className="pill h-6 w-6 justify-center px-0 tabular-nums" dir="ltr">
                        {i + 1}
                      </span>
                      <span className="leading-relaxed">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

const inputClass =
  'w-full rounded-xl border border-ink-200 bg-white px-4 py-3 text-sm text-ink-900 shadow-sm placeholder:text-ink-400 transition-colors duration-300 focus:border-accent-400 focus:outline-none focus:ring-2 focus:ring-accent-200';

function Field({
  id,
  label,
  error,
  required,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="block">
      <label htmlFor={id} className="mb-2 block text-xs font-semibold text-ink-600">
        {label}
        {required && <span className="ms-1 text-accent-700">*</span>}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} className="mt-2 text-xs font-medium text-red-700" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

function DetailRow({
  icon: Icon,
  label,
  value,
  href,
  ltr,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  href?: string;
  ltr?: boolean;
}) {
  return (
    <li className="flex items-center gap-3">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-accent-100 bg-accent-50 text-accent-700">
        <Icon className="h-4 w-4" />
      </span>
      <div>
        <div className="text-xs uppercase tracking-wider text-ink-500">{label}</div>
        {href ? (
          <a
            href={href}
            className="inline-block text-sm text-ink-900 transition-colors hover:text-accent-700"
            dir={ltr ? 'ltr' : undefined}
          >
            {value}
          </a>
        ) : (
          <div className="text-sm text-ink-900" dir={ltr ? 'ltr' : undefined}>{value}</div>
        )}
      </div>
    </li>
  );
}
