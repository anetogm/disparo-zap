import { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Send, Upload, FileSpreadsheet, X, Users } from 'lucide-react';
import { MessageTemplate } from '@/types/template';
import { useToast } from '@/hooks/use-toast';

interface Contact {
  phone: string;
  name?: string;
  [key: string]: string | undefined;
}

interface SendTemplateDialogProps {
  template: MessageTemplate;
  webhookUrl: string | null;
  onSend: (template: MessageTemplate, contacts: Contact[]) => void;
}

export function SendTemplateDialog({ template, webhookUrl, onSend }: SendTemplateDialogProps) {
  const [open, setOpen] = useState(false);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [fileName, setFileName] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const parseCSV = (text: string): Contact[] => {
    const lines = text.trim().split('\n');
    if (lines.length < 2) return [];

    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
    const phoneIndex = headers.findIndex(h => h === 'phone' || h === 'telefone' || h === 'numero');
    const nameIndex = headers.findIndex(h => h === 'name' || h === 'nome');

    if (phoneIndex === -1) {
      toast({
        title: 'CSV inválido',
        description: 'O arquivo deve conter uma coluna "phone" ou "telefone"',
        variant: 'destructive',
      });
      return [];
    }

    return lines.slice(1).map(line => {
      const values = line.split(',').map(v => v.trim());
      const contact: Contact = {
        phone: values[phoneIndex] || '',
      };
      if (nameIndex !== -1) {
        contact.name = values[nameIndex];
      }
      headers.forEach((header, i) => {
        if (i !== phoneIndex && i !== nameIndex) {
          contact[header] = values[i];
        }
      });
      return contact;
    }).filter(c => c.phone);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.csv')) {
      toast({
        title: 'Arquivo inválido',
        description: 'Por favor, selecione um arquivo CSV',
        variant: 'destructive',
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const parsedContacts = parseCSV(text);
      setContacts(parsedContacts);
      setFileName(file.name);

      if (parsedContacts.length > 0) {
        toast({
          title: 'Contatos carregados',
          description: `${parsedContacts.length} contatos encontrados no arquivo`,
        });
      }
    };
    reader.readAsText(file);
  };

  const handleRemoveFile = () => {
    setContacts([]);
    setFileName(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSend = async () => {
    if (!webhookUrl) {
      toast({
        title: 'Webhook não configurado',
        description: 'Configure a URL do webhook nas configurações',
        variant: 'destructive',
      });
      return;
    }

    if (contacts.length === 0) {
      toast({
        title: 'Nenhum contato',
        description: 'Faça upload de um arquivo CSV com os contatos',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    try {
      await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'no-cors',
        body: JSON.stringify({
          template: {
            id: template.id,
            name: template.name,
            category: template.category,
            language: template.language,
            content: template.content,
            variables: template.variables,
          },
          contacts,
          timestamp: new Date().toISOString(),
        }),
      });

      toast({
        title: 'Enviado para o n8n',
        description: `Template "${template.name}" enviado para ${contacts.length} contatos`,
      });

      onSend(template, contacts);
      setOpen(false);
      handleRemoveFile();
    } catch (error) {
      console.error('Erro ao enviar:', error);
      toast({
        title: 'Erro ao enviar',
        description: 'Falha ao enviar para o webhook. Verifique a URL.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Send className="mr-2 h-4 w-4" />
          Enviar
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Enviar Template</DialogTitle>
          <DialogDescription>
            Faça upload de um CSV com os contatos para enviar o template "{template.name}"
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Arquivo de Contatos (CSV)</Label>
            <div className="flex flex-col gap-2">
              {fileName ? (
                <div className="flex items-center justify-between rounded-lg border border-border bg-muted/50 p-3">
                  <div className="flex items-center gap-2">
                    <FileSpreadsheet className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm font-medium">{fileName}</p>
                      <p className="text-xs text-muted-foreground">
                        {contacts.length} contatos
                      </p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" onClick={handleRemoveFile}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border p-6 transition-colors hover:border-primary hover:bg-muted/50">
                  <Upload className="h-8 w-8 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    Clique para selecionar ou arraste o arquivo
                  </span>
                  <span className="text-xs text-muted-foreground">
                    CSV com coluna "phone" ou "telefone"
                  </span>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".csv"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>

          {contacts.length > 0 && (
            <div className="rounded-lg border border-border bg-muted/30 p-3">
              <div className="flex items-center gap-2 text-sm">
                <Users className="h-4 w-4 text-primary" />
                <span className="font-medium">{contacts.length} contatos prontos</span>
              </div>
              <div className="mt-2 max-h-32 overflow-y-auto">
                {contacts.slice(0, 5).map((contact, i) => (
                  <p key={i} className="text-xs text-muted-foreground">
                    {contact.name ? `${contact.name} - ` : ''}{contact.phone}
                  </p>
                ))}
                {contacts.length > 5 && (
                  <p className="text-xs text-muted-foreground">
                    ... e mais {contacts.length - 5} contatos
                  </p>
                )}
              </div>
            </div>
          )}

          {!webhookUrl && (
            <p className="text-sm text-destructive">
              ⚠️ Configure a URL do webhook nas configurações antes de enviar
            </p>
          )}
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button
            onClick={handleSend}
            disabled={!webhookUrl || contacts.length === 0 || isLoading}
          >
            {isLoading ? 'Enviando...' : 'Enviar para n8n'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
