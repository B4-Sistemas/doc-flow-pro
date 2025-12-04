import { useState } from 'react';
import { Plus, Search, Shield, User, Eye, MoreHorizontal } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { mockUsers } from '@/data/mockData';
import { toast } from 'sonner';

const roleConfig = {
  admin: {
    label: 'Admin',
    description: 'Acesso total ao sistema',
    icon: Shield,
    color: 'bg-primary/10 text-primary border-primary/20',
  },
  financial: {
    label: 'Financeiro',
    description: 'Contratos, consumo e cobrança',
    icon: User,
    color: 'bg-info/10 text-info border-info/20',
  },
  viewer: {
    label: 'Visualização',
    description: 'Apenas leitura',
    icon: Eye,
    color: 'bg-muted text-muted-foreground border-muted',
  },
};

export default function Users() {
  const [search, setSearch] = useState('');

  const filteredUsers = mockUsers.filter(user =>
    user.name.toLowerCase().includes(search.toLowerCase()) ||
    user.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddUser = () => {
    toast.info('Funcionalidade de adicionar usuário será implementada com backend');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Usuários</h1>
          <p className="text-muted-foreground">
            Gerencie os usuários e permissões do sistema
          </p>
        </div>
        <Button onClick={handleAddUser} className="gap-2">
          <Plus className="h-4 w-4" />
          Novo Usuário
        </Button>
      </div>

      {/* Role Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        {Object.entries(roleConfig).map(([role, config]) => {
          const count = mockUsers.filter(u => u.role === role).length;
          return (
            <Card key={role} className="p-4">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${config.color.split(' ')[0]}`}>
                  <config.icon className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="font-medium">{config.label}</p>
                    <span className="text-2xl font-bold">{count}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{config.description}</p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Buscar por nome ou email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Users List */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredUsers.map((user, index) => {
          const role = roleConfig[user.role];
          return (
            <Card 
              key={user.id} 
              className="p-4 animate-fade-in"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                      {user.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">{user.name}</p>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Editar</DropdownMenuItem>
                    <DropdownMenuItem>Alterar permissão</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-destructive">Remover</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="mt-4">
                <Badge variant="outline" className={role.color}>
                  <role.icon className="h-3 w-3 mr-1" />
                  {role.label}
                </Badge>
              </div>
            </Card>
          );
        })}
      </div>

      {filteredUsers.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Nenhum usuário encontrado</p>
        </div>
      )}
    </div>
  );
}
