import { FileText, Building2, AlertTriangle, TrendingUp } from 'lucide-react';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { ConsumptionChart } from '@/components/dashboard/ConsumptionChart';
import { ContractsList } from '@/components/dashboard/ContractsList';
import { AlertsCard } from '@/components/dashboard/AlertsCard';
import { calculateDashboardStats, mockContracts } from '@/data/mockData';

export default function Dashboard() {
  const stats = calculateDashboardStats();
  const consumptionPercentage = Math.round((stats.totalConsumed / stats.totalPlan) * 100);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Visão geral do consumo de documentos e contratos
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Contratos Ativos"
          value={stats.activeContracts}
          subtitle={`de ${stats.totalContracts} total`}
          icon={FileText}
          variant="primary"
        />
        <StatsCard
          title="Organizações"
          value={stats.totalOrganizations}
          subtitle="vinculadas"
          icon={Building2}
        />
        <StatsCard
          title="Consumo Total"
          value={`${consumptionPercentage}%`}
          subtitle={`${stats.totalConsumed.toLocaleString('pt-BR')} de ${stats.totalPlan.toLocaleString('pt-BR')} docs`}
          icon={TrendingUp}
          variant={consumptionPercentage >= 80 ? 'warning' : 'success'}
        />
        <StatsCard
          title="Alertas"
          value={stats.alertCount}
          subtitle="contratos em atenção"
          icon={AlertTriangle}
          variant={stats.alertCount > 0 ? 'destructive' : 'default'}
        />
      </div>

      {/* Charts and Lists */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ConsumptionChart />
        </div>
        <div>
          <AlertsCard />
        </div>
      </div>

      {/* Recent Contracts */}
      <ContractsList />
    </div>
  );
}
