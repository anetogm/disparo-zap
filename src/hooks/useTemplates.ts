import { useState, useEffect } from 'react';
import { MessageTemplate, WhatsAppCredentials } from '@/types/template';

const TEMPLATES_KEY = 'whatsapp_templates';
const CREDENTIALS_KEY = 'whatsapp_credentials';
const WEBHOOK_KEY = 'n8n_webhook_url';

export function useTemplates() {
  const [templates, setTemplates] = useState<MessageTemplate[]>([]);
  const [credentials, setCredentials] = useState<WhatsAppCredentials | null>(null);
  const [webhookUrl, setWebhookUrl] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem(TEMPLATES_KEY);
    if (stored) {
      setTemplates(JSON.parse(stored));
    }

    const storedCreds = localStorage.getItem(CREDENTIALS_KEY);
    if (storedCreds) {
      setCredentials(JSON.parse(storedCreds));
    }

    const storedWebhook = localStorage.getItem(WEBHOOK_KEY);
    if (storedWebhook) {
      setWebhookUrl(storedWebhook);
    }
  }, []);

  const saveTemplates = (newTemplates: MessageTemplate[]) => {
    setTemplates(newTemplates);
    localStorage.setItem(TEMPLATES_KEY, JSON.stringify(newTemplates));
  };

  const addTemplate = (template: Omit<MessageTemplate, 'id' | 'createdAt' | 'status'>) => {
    const newTemplate: MessageTemplate = {
      ...template,
      id: crypto.randomUUID(),
      status: 'pending',
      createdAt: new Date(),
    };
    saveTemplates([...templates, newTemplate]);
    return newTemplate;
  };

  const deleteTemplate = (id: string) => {
    saveTemplates(templates.filter(t => t.id !== id));
  };

  const saveCredentials = (creds: WhatsAppCredentials) => {
    setCredentials(creds);
    localStorage.setItem(CREDENTIALS_KEY, JSON.stringify(creds));
  };

  const clearCredentials = () => {
    setCredentials(null);
    localStorage.removeItem(CREDENTIALS_KEY);
  };

  const saveWebhookUrl = (url: string) => {
    setWebhookUrl(url);
    localStorage.setItem(WEBHOOK_KEY, url);
  };

  const clearWebhookUrl = () => {
    setWebhookUrl(null);
    localStorage.removeItem(WEBHOOK_KEY);
  };

  return {
    templates,
    credentials,
    webhookUrl,
    addTemplate,
    deleteTemplate,
    saveCredentials,
    clearCredentials,
    saveWebhookUrl,
    clearWebhookUrl,
    hasCredentials: !!credentials?.token && !!credentials?.wabaId,
  };
}
