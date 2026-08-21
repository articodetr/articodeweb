export const CONTACT_EMAIL = 'info@articode.com.tr';
export const CONTACT_PHONE_DISPLAY = '+90 535 297 32 29';
export const CONTACT_PHONE_NUMBER = '+905352973229';
export const CONTACT_EMAIL_HREF = `mailto:${CONTACT_EMAIL}`;
export const CONTACT_PHONE_HREF = `tel:${CONTACT_PHONE_NUMBER}`;

const WHATSAPP_NUMBER = CONTACT_PHONE_NUMBER.replace('+', '');

export function getWhatsAppUrl(message?: string) {
  const url = `https://wa.me/${WHATSAPP_NUMBER}`;
  return message ? `${url}?text=${encodeURIComponent(message)}` : url;
}
