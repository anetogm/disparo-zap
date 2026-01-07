import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Webhook, Check, Edit2, Trash2 } from 'lucide-react';

interface WebhookConfigProps {
  webhookUrl: string | null;
  onSave: (url: string) => void;
  onClear: () => void;
}

export function WebhookConfig({ webhookUrl, onSave, onClear }: WebhookConfigProps) {
  const [url, setUrl] = useState(webhookUrl || '');
  const [isEditing, setIsEditing] = useState(!webhookUrl);

  const handleSave = () => {
    if (url.trim()) {
      onSave(url.trim());
      setIsEditing(false);
    }
  };

  const handleClear = () => {
    onClear();
    setUrl('');
    setIsEditing(true);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Webhook className="h-5 w-5" />
          Webhook n8n
        </CardTitle>
        <CardDescription>
          Configure a URL do webhook do n8n para enviar os templates
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isEditing ? (
          <>
            <div className="space-y-2">
              <Label htmlFor="webhook-url">URL do Webhook</Label>
              <Input
                id="webhook-url"
                type="url"
                placeholder="https://seu-n8n.com/webhook/..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
            </div>
            <Button onClick={handleSave} disabled={!url.trim()} className="w-full">
              <Check className="mr-2 h-4 w-4" />
              Salvar Webhook
            </Button>
          </>
        ) : (
          <div className="space-y-4">
            <div className="rounded-lg border border-border bg-muted/50 p-4">
              <p className="text-sm font-medium text-muted-foreground">URL configurada</p>
              <p className="mt-1 truncate font-mono text-sm">{webhookUrl}</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setIsEditing(true)} className="flex-1">
                <Edit2 className="mr-2 h-4 w-4" />
                Editar
              </Button>
              <Button variant="destructive" onClick={handleClear} className="flex-1">
                <Trash2 className="mr-2 h-4 w-4" />
                Remover
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
