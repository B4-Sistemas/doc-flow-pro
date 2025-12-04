import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Bell, Globe, Shield, Database } from 'lucide-react';
import { toast } from 'sonner';

export default function Settings() {
  const handleSave = () => {
    toast.success('Configurações salvas com sucesso!');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Configurações</h1>
        <p className="text-muted-foreground">
          Gerencie as configurações do sistema
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* API Settings */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-primary/10">
              <Globe className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="font-semibold">Integração com API</h2>
              <p className="text-sm text-muted-foreground">
                Configurações de conexão com a API externa
              </p>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <Label htmlFor="apiUrl">URL da API</Label>
              <Input
                id="apiUrl"
                placeholder="https://api.exemplo.com"
                defaultValue="https://api.b4sign.com.br/v1"
              />
            </div>
            <div>
              <Label htmlFor="apiKey">Chave de API</Label>
              <Input
                id="apiKey"
                type="password"
                placeholder="••••••••••••••••"
                defaultValue="sk_live_xxxxxxxxxxxxx"
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Sincronização automática</p>
                <p className="text-sm text-muted-foreground">
                  Atualizar organizações automaticamente
                </p>
              </div>
              <Switch defaultChecked />
            </div>
          </div>
        </Card>

        {/* Notification Settings */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-info/10">
              <Bell className="h-5 w-5 text-info" />
            </div>
            <div>
              <h2 className="font-semibold">Notificações</h2>
              <p className="text-sm text-muted-foreground">
                Configurações de alertas e avisos
              </p>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Alerta em 80%</p>
                <p className="text-sm text-muted-foreground">
                  Notificar quando atingir 80% do plano
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Alerta em 100%</p>
                <p className="text-sm text-muted-foreground">
                  Notificar quando atingir limite do plano
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Email de resumo</p>
                <p className="text-sm text-muted-foreground">
                  Receber resumo semanal por email
                </p>
              </div>
              <Switch />
            </div>
          </div>
        </Card>

        {/* Security Settings */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-success/10">
              <Shield className="h-5 w-5 text-success" />
            </div>
            <div>
              <h2 className="font-semibold">Segurança</h2>
              <p className="text-sm text-muted-foreground">
                Configurações de segurança da conta
              </p>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Autenticação em dois fatores</p>
                <p className="text-sm text-muted-foreground">
                  Adicionar camada extra de segurança
                </p>
              </div>
              <Switch />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Sessão única</p>
                <p className="text-sm text-muted-foreground">
                  Permitir apenas uma sessão ativa
                </p>
              </div>
              <Switch defaultChecked />
            </div>
          </div>
        </Card>

        {/* Data Settings */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-warning/10">
              <Database className="h-5 w-5 text-warning" />
            </div>
            <div>
              <h2 className="font-semibold">Dados</h2>
              <p className="text-sm text-muted-foreground">
                Gerenciamento de dados do sistema
              </p>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Backup automático</p>
                <p className="text-sm text-muted-foreground">
                  Realizar backup diário dos dados
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div>
              <p className="font-medium mb-2">Retenção de logs</p>
              <Input type="number" defaultValue="90" className="w-32" />
              <p className="text-xs text-muted-foreground mt-1">dias</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="flex justify-end">
        <Button onClick={handleSave}>Salvar Configurações</Button>
      </div>
    </div>
  );
}
