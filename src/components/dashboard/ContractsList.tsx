import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { mockContracts, getConsumptionPercentage, getConsumptionStatus } from '@/data/mockData';
import { cn } from '@/lib/utils';
import { ArrowRight, AlertTriangle, Building2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

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

export function ContractsList() {
  const navigate = useNavigate();
  const recentContracts = mockContracts.slice(0, 4);

  return (
    <Card className="p-6 animate-slide-up">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold">Contratos Recentes</h3>
          <p className="text-sm text-muted-foreground">Acompanhe o consumo dos contratos</p>
        </div>
        <Button variant="ghost" onClick={() => navigate('/contracts')} className="gap-2">
          Ver todos <ArrowRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-4">
        {recentContracts.map((contract, index) => {
          const percentage = getConsumptionPercentage(contract.consumed, contract.plan);
          const status = getConsumptionStatus(contract.consumed, contract.plan);

          return (
            <div
              key={contract.id}
              className="p-4 rounded-lg border bg-card hover:shadow-card-hover transition-shadow cursor-pointer"
              style={{ animationDelay: `${index * 100}ms` }}
              onClick={() => navigate(`/contracts/${contract.id}`)}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold">{contract.clientName}</h4>
                    <Badge variant="outline" className={statusColors[contract.status]}>
                      {statusLabels[contract.status]}
                    </Badge>
                    {status !== 'normal' && (
                      <AlertTriangle className={cn(
                        "h-4 w-4",
                        status === 'critical' ? 'text-destructive' : 'text-warning'
                      )} />
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Building2 className="h-3.5 w-3.5" />
                    {contract.organizations.length} {contract.organizations.length === 1 ? 'organização' : 'organizações'}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold">{Math.round(percentage)}%</p>
                  <p className="text-xs text-muted-foreground">do plano</p>
                </div>
              </div>

              <div className="space-y-2">
                <Progress 
                  value={Math.min(percentage, 100)} 
                  className="h-2"
                  indicatorClassName={consumptionColors[status]}
                />
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    {contract.consumed.toLocaleString('pt-BR')} / {contract.plan.toLocaleString('pt-BR')} docs
                  </span>
                  {contract.consumed > contract.plan && (
                    <span className="text-destructive font-medium">
                      +{(contract.consumed - contract.plan).toLocaleString('pt-BR')} excedente
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
