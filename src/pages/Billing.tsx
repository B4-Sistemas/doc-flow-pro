import { useState } from 'react';
import { Search, Filter, Download, DollarSign, TrendingUp, AlertCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { mockContracts } from '@/data/mockData';
import { toast } from 'sonner';

export default function Billing() {
  const [search, setSearch] = useState('');
  const [periodFilter, setPeriodFilter] = useState('current');

  const billingData = mockContracts
    .filter(c => c.status === 'active')
    .map(contract => {
      const excessDocs = Math.max(0, contract.consumed - contract.plan);
      const excessTotal = excessDocs * contract.excessValue;
      return {
        id: contract.id,
        clientName: contract.clientName,
        cnpj: contract.organizations[0]?.cnpj || '-',
        planValue: contract.planValue,
        consumed: contract.consumed,
        plan: contract.plan,
        excessDocs,
        excessTotal,
        total: contract.planValue + excessTotal,
        hasExcess: excessDocs > 0,
      };
    });

  const filteredData = billingData.filter(item =>
    item.clientName.toLowerCase().includes(search.toLowerCase()) ||
    item.cnpj.includes(search)
  );

  const totals = {
    planValue: filteredData.reduce((sum, item) => sum + item.planValue, 0),
    excessTotal: filteredData.reduce((sum, item) => sum + item.excessTotal, 0),
    total: filteredData.reduce((sum, item) => sum + item.total, 0),
  };

  const handleExport = (format: 'excel' | 'pdf') => {
    toast.success(`Relatório exportado em ${format.toUpperCase()}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Financeiro</h1>
          <p className="text-muted-foreground">
            Gestão de faturamento e cobrança
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => handleExport('excel')} className="gap-2">
            <Download className="h-4 w-4" />
            Excel
          </Button>
          <Button variant="outline" onClick={() => handleExport('pdf')} className="gap-2">
            <Download className="h-4 w-4" />
            PDF
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Valor dos Planos</p>
              <p className="text-3xl font-bold mt-1">
                R$ {totals.planValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-primary/10">
              <DollarSign className="h-6 w-6 text-primary" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Excedente</p>
              <p className="text-3xl font-bold mt-1 text-warning">
                R$ {totals.excessTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {filteredData.filter(d => d.hasExcess).length} contratos com excedente
              </p>
            </div>
            <div className="p-3 rounded-xl bg-warning/10">
              <TrendingUp className="h-6 w-6 text-warning" />
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-primary/5 border-primary/20">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total a Faturar</p>
              <p className="text-3xl font-bold mt-1">
                R$ {totals.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-primary">
              <DollarSign className="h-6 w-6 text-primary-foreground" />
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar por cliente ou CNPJ..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={periodFilter} onValueChange={setPeriodFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Período" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="current">Mês atual</SelectItem>
            <SelectItem value="last">Mês anterior</SelectItem>
            <SelectItem value="quarter">Trimestre</SelectItem>
            <SelectItem value="year">Ano</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Cliente</TableHead>
              <TableHead>CNPJ</TableHead>
              <TableHead className="text-right">Consumo</TableHead>
              <TableHead className="text-right">Valor Plano</TableHead>
              <TableHead className="text-right">Excedente</TableHead>
              <TableHead className="text-right">Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{item.clientName}</span>
                    {item.hasExcess && (
                      <Badge variant="outline" className="bg-warning/10 text-warning border-warning/20">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        Excedente
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell className="font-mono text-sm">{item.cnpj}</TableCell>
                <TableCell className="text-right">
                  <span className={item.hasExcess ? 'text-warning font-medium' : ''}>
                    {item.consumed.toLocaleString('pt-BR')} / {item.plan.toLocaleString('pt-BR')}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  R$ {item.planValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </TableCell>
                <TableCell className="text-right">
                  {item.excessTotal > 0 ? (
                    <span className="text-warning font-medium">
                      R$ {item.excessTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                  ) : (
                    <span className="text-muted-foreground">-</span>
                  )}
                </TableCell>
                <TableCell className="text-right font-bold">
                  R$ {item.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* Footer Totals */}
      <Card className="p-4">
        <div className="flex justify-end gap-8 text-sm">
          <div>
            <span className="text-muted-foreground">Subtotal Planos:</span>
            <span className="ml-2 font-medium">
              R$ {totals.planValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
          </div>
          <div>
            <span className="text-muted-foreground">Subtotal Excedentes:</span>
            <span className="ml-2 font-medium text-warning">
              R$ {totals.excessTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
          </div>
          <div>
            <span className="text-muted-foreground">Total Geral:</span>
            <span className="ml-2 font-bold text-lg">
              R$ {totals.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>
      </Card>
    </div>
  );
}
