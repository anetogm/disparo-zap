import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, X } from 'lucide-react';
import { MessageTemplate, TemplateVariable } from '@/types/template';

interface CreateTemplateDialogProps {
  onSubmit: (template: Omit<MessageTemplate, 'id' | 'createdAt' | 'status'>) => void;
}

export function CreateTemplateDialog({ onSubmit }: CreateTemplateDialogProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [category, setCategory] = useState<'marketing' | 'utility' | 'authentication'>('utility');
  const [language, setLanguage] = useState('pt_BR');
  const [content, setContent] = useState('');
  const [variables, setVariables] = useState<TemplateVariable[]>([]);

  const addVariable = () => {
    setVariables([...variables, { key: '', example: '' }]);
  };

  const updateVariable = (index: number, field: 'key' | 'example', value: string) => {
    const updated = [...variables];
    updated[index][field] = value;
    setVariables(updated);
  };

  const removeVariable = (index: number) => {
    setVariables(variables.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && content.trim()) {
      onSubmit({
        name: name.trim(),
        category,
        language,
        content: content.trim(),
        variables: variables.filter(v => v.key.trim()),
      });
      resetForm();
      setOpen(false);
    }
  };

  const resetForm = () => {
    setName('');
    setCategory('utility');
    setLanguage('pt_BR');
    setContent('');
    setVariables([]);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Novo Template
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Criar Template de Mensagem</DialogTitle>
          <DialogDescription>
            Crie um novo template para envio via WhatsApp. Use {"{{1}}"}, {"{{2}}"}, etc. para variáveis.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="name">Nome do Template</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="ex: confirmacao_pedido"
              required
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Categoria</Label>
              <Select value={category} onValueChange={(v: typeof category) => setCategory(v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="utility">Utilitário</SelectItem>
                  <SelectItem value="marketing">Marketing</SelectItem>
                  <SelectItem value="authentication">Autenticação</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Idioma</Label>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pt_BR">Português (BR)</SelectItem>
                  <SelectItem value="en_US">English (US)</SelectItem>
                  <SelectItem value="es">Español</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Conteúdo da Mensagem</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Olá {{1}}! Seu pedido {{2}} foi confirmado."
              rows={4}
              required
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Variáveis</Label>
              <Button type="button" variant="outline" size="sm" onClick={addVariable}>
                <Plus className="mr-1 h-3.5 w-3.5" />
                Adicionar
              </Button>
            </div>
            {variables.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Nenhuma variável adicionada. Use {"{{1}}"}, {"{{2}}"} no conteúdo.
              </p>
            ) : (
              <div className="space-y-2">
                {variables.map((variable, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <span className="flex h-9 w-12 shrink-0 items-center justify-center rounded-md bg-muted text-sm font-medium">
                      {`{{${index + 1}}}`}
                    </span>
                    <Input
                      value={variable.key}
                      onChange={(e) => updateVariable(index, 'key', e.target.value)}
                      placeholder="Nome da variável"
                      className="flex-1"
                    />
                    <Input
                      value={variable.example}
                      onChange={(e) => updateVariable(index, 'example', e.target.value)}
                      placeholder="Exemplo"
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeVariable(index)}
                      className="shrink-0 text-muted-foreground hover:text-destructive"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit">Criar Template</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
