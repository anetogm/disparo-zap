import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { WhatsAppCredentials } from '@/types/template';
import { Shield, Eye, EyeOff, Check, X } from 'lucide-react';

interface CredentialsConfigProps {
  credentials: WhatsAppCredentials | null;
  onSave: (credentials: WhatsAppCredentials) => void;
  onClear: () => void;
}

export function CredentialsConfig({ credentials, onSave, onClear }: CredentialsConfigProps) {
  const [token, setToken] = useState(credentials?.token || '');
  const [wabaId, setWabaId] = useState(credentials?.wabaId || '');
  const [showToken, setShowToken] = useState(false);
  const [isEditing, setIsEditing] = useState(!credentials);

  const handleSave = () => {
    if (token.trim() && wabaId.trim()) {
      onSave({ token: token.trim(), wabaId: wabaId.trim() });
      setIsEditing(false);
    }
  };

  const handleClear = () => {
    onClear();
    setToken('');
    setWabaId('');
    setIsEditing(true);
  };

  const isConfigured = credentials?.token && credentials?.wabaId;

  return (
    <Card className="border-border/50 shadow-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <Shield className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1">
            <CardTitle className="text-lg">Credenciais WhatsApp</CardTitle>
            <CardDescription>
              Configure seu token de acesso e WABA ID
            </CardDescription>
          </div>
          {isConfigured && !isEditing && (
            <div className="flex items-center gap-2 rounded-full bg-success/10 px-3 py-1 text-sm text-success">
              <Check className="h-4 w-4" />
              Configurado
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {isEditing ? (
          <>
            <div className="space-y-2">
              <Label htmlFor="token">Token de Acesso</Label>
              <div className="relative">
                <Input
                  id="token"
                  type={showToken ? 'text' : 'password'}
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  placeholder="EAAxxxxxxxxxxxxxxx..."
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowToken(!showToken)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showToken ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="wabaId">WABA ID</Label>
              <Input
                id="wabaId"
                value={wabaId}
                onChange={(e) => setWabaId(e.target.value)}
                placeholder="1234567890123456"
              />
            </div>
            <div className="flex gap-2 pt-2">
              <Button onClick={handleSave} disabled={!token.trim() || !wabaId.trim()}>
                Salvar Credenciais
              </Button>
              {credentials && (
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                  Cancelar
                </Button>
              )}
            </div>
          </>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center justify-between rounded-lg bg-muted/50 px-4 py-3">
              <div>
                <p className="text-sm font-medium">Token</p>
                <p className="text-sm text-muted-foreground">
                  {credentials?.token.slice(0, 12)}...{credentials?.token.slice(-4)}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">WABA ID</p>
                <p className="text-sm text-muted-foreground">{credentials?.wabaId}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setIsEditing(true)}>
                Editar
              </Button>
              <Button variant="ghost" onClick={handleClear} className="text-destructive hover:text-destructive">
                <X className="mr-2 h-4 w-4" />
                Remover
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
