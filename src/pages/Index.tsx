import { useTemplates } from '@/hooks/useTemplates';
import { CredentialsConfig } from '@/components/CredentialsConfig';
import { TemplateList } from '@/components/TemplateList';
import { CreateTemplateDialog } from '@/components/CreateTemplateDialog';
import { MessageTemplate } from '@/types/template';
import { useToast } from '@/hooks/use-toast';
import { MessageSquare, Settings, FileText } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Index = () => {
  const {
    templates,
    credentials,
    addTemplate,
    deleteTemplate,
    saveCredentials,
    clearCredentials,
    hasCredentials,
  } = useTemplates();
  const { toast } = useToast();

  const handleSendTemplate = (template: MessageTemplate) => {
    if (!hasCredentials) {
      toast({
        title: 'Credenciais não configuradas',
        description: 'Configure seu token e WABA ID na aba Configurações.',
        variant: 'destructive',
      });
      return;
    }

    toast({
      title: 'Template pronto para envio',
      description: `Template "${template.name}" selecionado. Implemente a integração com a API do WhatsApp.`,
    });
  };

  const handleDeleteTemplate = (id: string) => {
    deleteTemplate(id);
    toast({
      title: 'Template excluído',
      description: 'O template foi removido com sucesso.',
    });
  };

  const handleCreateTemplate = (template: Omit<MessageTemplate, 'id' | 'createdAt' | 'status'>) => {
    addTemplate(template);
    toast({
      title: 'Template criado',
      description: 'Seu novo template foi criado com sucesso.',
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border/50 bg-card/80 backdrop-blur-sm">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <MessageSquare className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-semibold tracking-tight">WhatsApp Templates</h1>
              <p className="text-xs text-muted-foreground">Gerencie seus templates de mensagem</p>
            </div>
          </div>
          <CreateTemplateDialog onSubmit={handleCreateTemplate} />
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-8">
        <Tabs defaultValue="templates" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="templates" className="gap-2">
              <FileText className="h-4 w-4" />
              Templates
              {templates.length > 0 && (
                <span className="ml-1 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                  {templates.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="settings" className="gap-2">
              <Settings className="h-4 w-4" />
              Configurações
              {!hasCredentials && (
                <span className="ml-1 h-2 w-2 rounded-full bg-warning" />
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="templates" className="space-y-4">
            <TemplateList
              templates={templates}
              onDelete={handleDeleteTemplate}
              onSend={handleSendTemplate}
            />
          </TabsContent>

          <TabsContent value="settings" className="max-w-2xl">
            <CredentialsConfig
              credentials={credentials}
              onSave={saveCredentials}
              onClear={clearCredentials}
            />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;
