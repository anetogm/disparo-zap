import { useState } from 'react';
import { MessageTemplate } from '@/types/template';
import { TemplateCard } from './TemplateCard';
import { Input } from '@/components/ui/input';
import { Search, FileText } from 'lucide-react';

interface TemplateListProps {
  templates: MessageTemplate[];
  onDelete: (id: string) => void;
  onSend: (template: MessageTemplate) => void;
}

export function TemplateList({ templates, onDelete, onSend }: TemplateListProps) {
  const [search, setSearch] = useState('');

  const filteredTemplates = templates.filter(
    (t) =>
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.content.toLowerCase().includes(search.toLowerCase()) ||
      t.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Pesquisar templates por nome, conteúdo ou categoria..."
          className="pl-10"
        />
      </div>

      {filteredTemplates.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border/60 bg-muted/20 py-16">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted">
            <FileText className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="mt-4 text-lg font-semibold">Nenhum template encontrado</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {search ? 'Tente uma pesquisa diferente' : 'Crie seu primeiro template de mensagem'}
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredTemplates.map((template) => (
            <TemplateCard
              key={template.id}
              template={template}
              onDelete={onDelete}
              onSend={onSend}
            />
          ))}
        </div>
      )}
    </div>
  );
}
