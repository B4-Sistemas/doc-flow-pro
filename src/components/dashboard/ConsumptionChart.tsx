import { Card } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { mockContracts } from '@/data/mockData';

const chartData = mockContracts.map(contract => ({
  name: contract.clientName.length > 15 
    ? contract.clientName.substring(0, 15) + '...' 
    : contract.clientName,
  consumido: contract.consumed,
  plano: contract.plan,
  percentual: Math.round((contract.consumed / contract.plan) * 100),
}));

export function ConsumptionChart() {
  return (
    <Card className="p-6 animate-slide-up">
      <div className="mb-6">
        <h3 className="text-lg font-semibold">Consumo por Contrato</h3>
        <p className="text-sm text-muted-foreground">Documentos consumidos vs plano contratado</p>
      </div>
      
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} layout="vertical" margin={{ left: 20, right: 20 }}>
            <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="hsl(var(--border))" />
            <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <YAxis 
              type="category" 
              dataKey="name" 
              stroke="hsl(var(--muted-foreground))" 
              fontSize={12}
              width={120}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--card))', 
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
              }}
              formatter={(value: number, name: string) => [
                value.toLocaleString('pt-BR'),
                name === 'consumido' ? 'Consumido' : 'Plano'
              ]}
            />
            <Bar dataKey="plano" fill="hsl(var(--muted))" radius={[0, 4, 4, 0]} name="plano" />
            <Bar dataKey="consumido" radius={[0, 4, 4, 0]} name="consumido">
              {chartData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`}
                  fill={
                    entry.percentual >= 100 
                      ? 'hsl(var(--destructive))' 
                      : entry.percentual >= 80 
                        ? 'hsl(var(--warning))' 
                        : 'hsl(var(--primary))'
                  }
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
