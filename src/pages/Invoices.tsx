import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, Download, FileText, Filter, Eye, CheckCircle, Clock, AlertTriangle, XCircle } from 'lucide-react';
import { mockInvoices, mockOrganizations } from '@/data/mockData';
import { Invoice } from '@/types';

const statusConfig = {
  pending: { label: 'Pendente', variant: 'secondary' as const, icon: Clock },
  paid: { label: 'Pago', variant: 'default' as const, icon: CheckCircle },
  overdue: { label: 'Vencida', variant: 'destructive' as const, icon: AlertTriangle },
  cancelled: { label: 'Cancelada', variant: 'outline' as const, icon: XCircle },
};

export default function Invoices() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [organizationFilter, setOrganizationFilter] = useState<string>('all');

  const filteredInvoices = mockInvoices.filter((invoice) => {
    const matchesSearch =
      invoice.organizationName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.cnpj.includes(searchTerm) ||
      invoice.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || invoice.status === statusFilter;
    const matchesOrganization = organizationFilter === 'all' || invoice.organizationId === organizationFilter;
    return matchesSearch && matchesStatus && matchesOrganization;
  });

  const totalPending = filteredInvoices
    .filter((i) => i.status === 'pending')
    .reduce((sum, i) => sum + i.totalValue, 0);
  const totalOverdue = filteredInvoices
    .filter((i) => i.status === 'overdue')
    .reduce((sum, i) => sum + i.totalValue, 0);
  const totalPaid = filteredInvoices
    .filter((i) => i.status === 'paid')
    .reduce((sum, i) => sum + i.totalValue, 0);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatMonth = (yearMonth: string) => {
    const [year, month] = yearMonth.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('pt-BR');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Faturas</h1>
          <p className="text-muted-foreground">Gerencie as faturas por organização</p>
        </div>
        <Button className="gap-2">
          <Download className="h-4 w-4" />
          Exportar Relatório
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="border-yellow-500/20 bg-yellow-500/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Clock className="h-4 w-4 text-yellow-500" />
              Pendentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-yellow-500">{formatCurrency(totalPending)}</p>
            <p className="text-xs text-muted-foreground">
              {filteredInvoices.filter((i) => i.status === 'pending').length} faturas
            </p>
          </CardContent>
        </Card>
        <Card className="border-destructive/20 bg-destructive/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-destructive" />
              Vencidas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-destructive">{formatCurrency(totalOverdue)}</p>
            <p className="text-xs text-muted-foreground">
              {filteredInvoices.filter((i) => i.status === 'overdue').length} faturas
            </p>
          </CardContent>
        </Card>
        <Card className="border-green-500/20 bg-green-500/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              Pagas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-500">{formatCurrency(totalPaid)}</p>
            <p className="text-xs text-muted-foreground">
              {filteredInvoices.filter((i) => i.status === 'paid').length} faturas
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar por organização, CNPJ ou nº da fatura..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={organizationFilter} onValueChange={setOrganizationFilter}>
              <SelectTrigger className="w-full sm:w-[220px]">
                <SelectValue placeholder="Organização" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as organizações</SelectItem>
                {mockOrganizations.map((org) => (
                  <SelectItem key={org.id} value={org.id}>
                    {org.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os status</SelectItem>
                <SelectItem value="pending">Pendente</SelectItem>
                <SelectItem value="paid">Pago</SelectItem>
                <SelectItem value="overdue">Vencida</SelectItem>
                <SelectItem value="cancelled">Cancelada</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Invoices Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Lista de Faturas ({filteredInvoices.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nº Fatura</TableHead>
                  <TableHead>Organização</TableHead>
                  <TableHead>CNPJ</TableHead>
                  <TableHead>Referência</TableHead>
                  <TableHead>Vencimento</TableHead>
                  <TableHead className="text-right">Documentos</TableHead>
                  <TableHead className="text-right">Valor</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-center">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInvoices.map((invoice) => {
                  const StatusIcon = statusConfig[invoice.status].icon;
                  return (
                    <TableRow key={invoice.id}>
                      <TableCell className="font-mono text-sm">{invoice.id}</TableCell>
                      <TableCell className="font-medium">{invoice.organizationName}</TableCell>
                      <TableCell className="text-muted-foreground">{invoice.cnpj}</TableCell>
                      <TableCell className="capitalize">{formatMonth(invoice.referenceMonth)}</TableCell>
                      <TableCell>{formatDate(invoice.dueDate)}</TableCell>
                      <TableCell className="text-right">
                        {invoice.documentsUsed.toLocaleString('pt-BR')}
                        {invoice.excessDocuments > 0 && (
                          <span className="text-xs text-destructive ml-1">
                            (+{invoice.excessDocuments})
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="text-right font-semibold">
                        {formatCurrency(invoice.totalValue)}
                      </TableCell>
                      <TableCell>
                        <Badge variant={statusConfig[invoice.status].variant} className="gap-1">
                          <StatusIcon className="h-3 w-3" />
                          {statusConfig[invoice.status].label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <Button variant="ghost" size="icon" title="Ver detalhes">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" title="Baixar PDF">
                          <Download className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
                {filteredInvoices.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                      Nenhuma fatura encontrada com os filtros aplicados.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
