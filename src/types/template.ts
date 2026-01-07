export interface WhatsAppCredentials {
  token: string;
  wabaId: string;
}

export interface TemplateVariable {
  key: string;
  example: string;
}

export interface MessageTemplate {
  id: string;
  name: string;
  category: 'marketing' | 'utility' | 'authentication';
  language: string;
  content: string;
  variables: TemplateVariable[];
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
}
