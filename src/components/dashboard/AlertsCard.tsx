import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, AlertCircle, CheckCircle } from 'lucide-react';
import { mockContracts, getConsumptionPercentage, getConsumptionStatus } from '@/data/mockData';
import { cn } from '@/lib/utils';

interface Alert {
  id: string;
  type: 'warning' | 'critical' | 'info';
  title: string;
  description: string;
  contract: string;
}

export function AlertsCard() {
  const alerts: Alert[] = mockContracts
    .filter(c => c.status === 'active')
    .map(contract => {
      const percentage = getConsumptionPercentage(contract.consumed, contract.plan);
      const status = getConsumptionStatus(contract.consumed, contract.plan);
      
      if (status === 'critical') {
        return {
          id: contract.id,
          type: 'critical' as const,
          title: 'Limite excedido',
          description: `${Math.round(percentage)}% do plano utilizado`,
          contract: contract.clientName,
        };
      }
      if (status === 'warning') {
        return {
          id: contract.id,
          type: 'warning' as const,
          title: 'Alerta de consumo',
          description: `${Math.round(percentage)}% do plano utilizado`,
          contract: contract.clientName,
        };
      }
      return null;
    })
    .filter(Boolean) as Alert[];

  const alertIcons = {
    warning: AlertTriangle,
    critical: AlertCircle,
    info: CheckCircle,
  };

  const alertColors = {
    warning: 'text-warning bg-warning/10 border-warning/20',
    critical: 'text-destructive bg-destructive/10 border-destructive/20',
    info: 'text-info bg-info/10 border-info/20',
  };

  return (
    <Card className="p-6 animate-slide-up">
      <div className="mb-4">
        <h3 className="text-lg font-semibold">Alertas</h3>
        <p className="text-sm text-muted-foreground">Contratos que requerem atenção</p>
      </div>

      {alerts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <CheckCircle className="h-12 w-12 text-success mb-3" />
          <p className="font-medium">Tudo em ordem!</p>
          <p className="text-sm text-muted-foreground">Nenhum alerta no momento</p>
        </div>
      ) : (
        <div className="space-y-3">
          {alerts.map((alert, index) => {
            const Icon = alertIcons[alert.type];
            return (
              <div
                key={alert.id}
                className={cn(
                  "flex items-start gap-3 p-3 rounded-lg border",
                  alertColors[alert.type]
                )}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <Icon className="h-5 w-5 mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="font-medium">{alert.title}</p>
                    <Badge variant="outline" className="text-xs">
                      {alert.type === 'critical' ? 'Crítico' : 'Atenção'}
                    </Badge>
                  </div>
                  <p className="text-sm opacity-80">{alert.contract}</p>
                  <p className="text-xs opacity-60">{alert.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}
