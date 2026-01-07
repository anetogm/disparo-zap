import { MessageTemplate } from '@/types/template';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Trash2, Clock, CheckCircle, XCircle } from 'lucide-react';
import { SendTemplateDialog } from './SendTemplateDialog';

interface Contact {
  phone: string;
  name?: string;
  [key: string]: string | undefined;
}

interface TemplateCardProps {
  template: MessageTemplate;
  webhookUrl: string | null;
  onDelete: (id: string) => void;
  onSend: (template: MessageTemplate, contacts: Contact[]) => void;
}

const categoryLabels = {
  marketing: 'Marketing',
  utility: 'Utilitário',
  authentication: 'Autenticação',
};

const statusConfig = {
  pending: { label: 'Pendente', icon: Clock, className: 'bg-warning/10 text-warning border-warning/20' },
  approved: { label: 'Aprovado', icon: CheckCircle, className: 'bg-success/10 text-success border-success/20' },
  rejected: { label: 'Rejeitado', icon: XCircle, className: 'bg-destructive/10 text-destructive border-destructive/20' },
};

export function TemplateCard({ template, webhookUrl, onDelete, onSend }: TemplateCardProps) {
  const status = statusConfig[template.status];
  const StatusIcon = status.icon;

  const renderContent = () => {
    let content = template.content;
    template.variables.forEach((v, i) => {
      content = content.replace(`{{${i + 1}}}`, `[${v.key}]`);
    });
    return content;
  };

  return (
    <Card className="group border-border/50 transition-all hover:border-primary/30 hover:shadow-md">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 space-y-1">
            <h3 className="font-semibold leading-none tracking-tight">{template.name}</h3>
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary" className="text-xs">
                {categoryLabels[template.category]}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {template.language}
              </Badge>
              <Badge variant="outline" className={`text-xs ${status.className}`}>
                <StatusIcon className="mr-1 h-3 w-3" />
                {status.label}
              </Badge>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-lg bg-muted/50 p-3">
          <p className="text-sm leading-relaxed text-foreground/80">{renderContent()}</p>
        </div>
        {template.variables.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {template.variables.map((v, i) => (
              <span
                key={i}
                className="inline-flex items-center rounded-md bg-accent px-2 py-1 text-xs font-medium text-accent-foreground"
              >
                {v.key}: {v.example}
              </span>
            ))}
          </div>
        )}
        <div className="flex items-center justify-between border-t border-border/50 pt-3">
          <span className="text-xs text-muted-foreground">
            {new Date(template.createdAt).toLocaleDateString('pt-BR')}
          </span>
          <div className="flex gap-2 opacity-0 transition-opacity group-hover:opacity-100">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onDelete(template.id)}
              className="h-8 text-muted-foreground hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
            <SendTemplateDialog
              template={template}
              webhookUrl={webhookUrl}
              onSend={onSend}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
