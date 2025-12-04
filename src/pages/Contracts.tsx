import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Filter, Building2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { mockContracts, getConsumptionPercentage, getConsumptionStatus } from '@/data/mockData';
import { cn } from '@/lib/utils';

const statusColors = {
  active: 'bg-success/10 text-success border-success/20',
  expired: 'bg-muted text-muted-foreground border-muted',
  suspended: 'bg-destructive/10 text-destructive border-destructive/20',
};

const statusLabels = {
  active: 'Ativo',
  expired: 'Expirado',
  suspended: 'Suspenso',
};

const consumptionColors = {
  normal: 'bg-primary',
  warning: 'bg-warning',
  critical: 'bg-destructive',
};

export default function Contracts() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredContracts = mockContracts.filter(contract => {
    const matchesSearch = contract.clientName.toLowerCase().includes(search.toLowerCase()) ||
      contract.organizations.some(org => 
        org.name.toLowerCase().includes(search.toLowerCase()) ||
        org.cnpj.includes(search)
      );
    const matchesStatus = statusFilter === 'all' || contract.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Contratos</h1>
          <p className="text-muted-foreground">
            Gerencie contratos e acompanhe o consumo
          </p>
        </div>
        <Button onClick={() => navigate('/contracts/new')} className="gap-2">
          <Plus className="h-4 w-4" />
          Novo Contrato
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar por cliente, organização ou CNPJ..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os status</SelectItem>
            <SelectItem value="active">Ativos</SelectItem>
            <SelectItem value="expired">Expirados</SelectItem>
            <SelectItem value="suspended">Suspensos</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Contracts Grid */}
      <div className="grid gap-4 md:grid-cols-2">
        {filteredContracts.map((contract, index) => {
          const percentage = getConsumptionPercentage(contract.consumed, contract.plan);
          const status = getConsumptionStatus(contract.consumed, contract.plan);

          return (
            <Card
              key={contract.id}
              className="p-6 cursor-pointer hover:shadow-card-hover transition-all animate-fade-in"
              style={{ animationDelay: `${index * 50}ms` }}
              onClick={() => navigate(`/contracts/${contract.id}`)}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-lg">{contract.clientName}</h3>
                    <Badge variant="outline" className={statusColors[contract.status]}>
                      {statusLabels[contract.status]}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Building2 className="h-3.5 w-3.5" />
                      {contract.organizations.length} org.
                    </span>
                    <span>
                      {contract.billingType === 'group' ? 'Cobrança unificada' : 'Individual'}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className={cn(
                    "text-3xl font-bold",
                    status === 'critical' && "text-destructive",
                    status === 'warning' && "text-warning"
                  )}>
                    {Math.round(percentage)}%
                  </p>
                  <p className="text-xs text-muted-foreground">consumido</p>
                </div>
              </div>

              <div className="space-y-3">
                <Progress 
                  value={Math.min(percentage, 100)} 
                  className="h-2"
                  indicatorClassName={consumptionColors[status]}
                />
                
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    {contract.consumed.toLocaleString('pt-BR')} / {contract.plan.toLocaleString('pt-BR')} documentos
                  </span>
                  <span className="font-medium">
                    R$ {contract.planValue.toLocaleString('pt-BR')}
                  </span>
                </div>

                <div className="flex justify-between text-xs text-muted-foreground pt-2 border-t">
                  <span>
                    Início: {new Date(contract.startDate).toLocaleDateString('pt-BR')}
                  </span>
                  <span>
                    Término: {new Date(contract.endDate).toLocaleDateString('pt-BR')}
                  </span>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {filteredContracts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Nenhum contrato encontrado</p>
        </div>
      )}
    </div>
  );
}
