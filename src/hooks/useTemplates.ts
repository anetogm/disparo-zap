import { useState, useEffect } from 'react';
import { MessageTemplate, WhatsAppCredentials } from '@/types/template';

const TEMPLATES_KEY = 'whatsapp_templates';
const CREDENTIALS_KEY = 'whatsapp_credentials';

export function useTemplates() {
  const [templates, setTemplates] = useState<MessageTemplate[]>([]);
  const [credentials, setCredentials] = useState<WhatsAppCredentials | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem(TEMPLATES_KEY);
    if (stored) {
      setTemplates(JSON.parse(stored));
    }

    const storedCreds = localStorage.getItem(CREDENTIALS_KEY);
    if (storedCreds) {
      setCredentials(JSON.parse(storedCreds));
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

  return {
    templates,
    credentials,
    addTemplate,
    deleteTemplate,
    saveCredentials,
    clearCredentials,
    hasCredentials: !!credentials?.token && !!credentials?.wabaId,
  };
}
