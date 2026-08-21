import { useState } from 'react';
import { ArrowUpRight, Check, Loader2, AlertCircle, Mail, Phone, MapPin, Clock } from 'lucide-react';
import { SectionHeading } from '@/components/SectionHeading';
import { Reveal } from '@/components/motion';
import { getServices } from '@/data/content';
import {
  CONTACT_EMAIL,
  CONTACT_EMAIL_HREF,
  CONTACT_PHONE_DISPLAY,
  CONTACT_PHONE_HREF,
} from '@/data/contact';
import { supabase } from '@/lib/supabase';
import { useLang } from '@/i18n';

type Status = 'idle' | 'submitting' | 'success' | 'error';

export function ContactPage() {
  const { lang, t } = useLang();
  const services = getServices(lang);

  const [status, setStatus] = useState<Status>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const [form, setForm] = useState({
    name: '',
    email: '',
    company: '',
    service: '',
    message: '',
  });

  const update = (key: keyof typeof form, value: string) =>
    setForm((f) => ({ ...f, [key]: value }));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === 'submitting') return;

    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setStatus('error');
      setErrorMsg(t.contact.errRequired);
      return;
    }

    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email);
    if (!emailOk) {
      setStatus('error');
      setErrorMsg(t.contact.errEmail);
      return;
    }

    if (!supabase) {
      setStatus('error');
      setErrorMsg(t.contact.errUnavailable.replace('{email}', CONTACT_EMAIL));
      return;
    }

    setStatus('submitting');
    setErrorMsg('');

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
                    <Field label={t.contact.fullName} required>
                      <input
                        type="text"
                        value={form.name}
                        onChange={(e) => update('name', e.target.value)}
                        placeholder={t.contact.namePlaceholder}
                        className={inputClass}
                      />
                    </Field>
                    <Field label={t.contact.email} required>
                      <input
                        type="email"
                        value={form.email}
                        onChange={(e) => update('email', e.target.value)}
                        placeholder={t.contact.emailPlaceholder}
                        className={inputClass}
                        dir="ltr"
                      />
                    </Field>
                  </div>

                  <Field label={t.contact.company}>
                    <input
                      type="text"
                      value={form.company}
                      onChange={(e) => update('company', e.target.value)}
                      placeholder={t.contact.companyPlaceholder}
                      className={inputClass}
                    />
                  </Field>

                  <Field label={t.contact.serviceOfInterest}>
                    <select
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

                  <Field label={t.contact.projectDetails} required>
                    <textarea
                      value={form.message}
                      onChange={(e) => update('message', e.target.value)}
                      rows={5}
                      placeholder={t.contact.detailsPlaceholder}
                      className={`${inputClass} resize-none`}
                    />
                  </Field>

                  {status === 'error' && (
                    <div className="flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
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
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-semibold text-ink-600">
        {label}
        {required && <span className="ms-1 text-accent-700">*</span>}
      </span>
      {children}
    </label>
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
