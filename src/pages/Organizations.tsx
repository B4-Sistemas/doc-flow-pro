import { useState } from 'react';
import { Search, Building2, RefreshCw, ExternalLink } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { mockOrganizations, mockContracts } from '@/data/mockData';
import { toast } from 'sonner';

export default function Organizations() {
  const [search, setSearch] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const filteredOrgs = mockOrganizations.filter(org => 
    org.name.toLowerCase().includes(search.toLowerCase()) ||
    org.cnpj.includes(search)
  );

  const getOrgContracts = (orgId: string) => {
    return mockContracts.filter(c => 
      c.organizations.some(o => o.id === orgId)
    );
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsRefreshing(false);
    toast.success('Organizações atualizadas com sucesso!');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Organizações</h1>
          <p className="text-muted-foreground">
            Organizações importadas da API externa
          </p>
        </div>
        <Button 
          variant="outline" 
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          Sincronizar API
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Building2 className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{mockOrganizations.length}</p>
              <p className="text-sm text-muted-foreground">Total de organizações</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-success/10">
              <Building2 className="h-5 w-5 text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {mockOrganizations.filter(o => getOrgContracts(o.id).length > 0).length}
              </p>
              <p className="text-sm text-muted-foreground">Com contrato ativo</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-warning/10">
              <Building2 className="h-5 w-5 text-warning" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {mockOrganizations.filter(o => getOrgContracts(o.id).length === 0).length}
              </p>
              <p className="text-sm text-muted-foreground">Sem contrato</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Buscar por nome ou CNPJ..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Organização</TableHead>
              <TableHead>CNPJ</TableHead>
              <TableHead>Contratos</TableHead>
              <TableHead>Cadastro</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrgs.map((org) => {
              const contracts = getOrgContracts(org.id);
              return (
                <TableRow key={org.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-secondary">
                        <Building2 className="h-4 w-4" />
                      </div>
                      <span className="font-medium">{org.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-sm">{org.cnpj}</TableCell>
                  <TableCell>
                    {contracts.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {contracts.map(c => (
                          <Badge key={c.id} variant="outline" className="text-xs">
                            {c.clientName}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <span className="text-muted-foreground text-sm">Sem contrato</span>
                    )}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {new Date(org.createdAt).toLocaleDateString('pt-BR')}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" className="gap-1">
                      <ExternalLink className="h-3.5 w-3.5" />
                      Detalhes
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Card>

      {filteredOrgs.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Nenhuma organização encontrada</p>
        </div>
      )}
    </div>
  );
}
