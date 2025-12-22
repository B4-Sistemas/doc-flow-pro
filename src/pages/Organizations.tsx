import { useState } from 'react';
import { Search, Building2, RefreshCw, Link2, ChevronDown, ChevronRight, Building, FileText, Crown } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  mockOrganizations, 
  getPrincipalOrganizations, 
  getLinkedOrganizations,
  getStandaloneOrganizations,
  getTotalConsumedByPrincipal,
  getContractByPrincipalOrganization
} from '@/data/mockData';
import { toast } from 'sonner';

export default function Organizations() {
  const [search, setSearch] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [expandedPrincipals, setExpandedPrincipals] = useState<string[]>([]);
  const [linkDialogOpen, setLinkDialogOpen] = useState(false);
  const [selectedOrganization, setSelectedOrganization] = useState<string>('');
  const [selectedPrincipal, setSelectedPrincipal] = useState<string>('');

  const principalOrganizations = getPrincipalOrganizations();
  const standaloneOrganizations = getStandaloneOrganizations();
  const linkedCount = mockOrganizations.filter(org => org.parentOrganizationId).length;

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsRefreshing(false);
    toast.success('Organizações atualizadas com sucesso!');
  };

  const toggleExpand = (principalId: string) => {
    setExpandedPrincipals(prev => 
      prev.includes(principalId) 
        ? prev.filter(id => id !== principalId)
        : [...prev, principalId]
    );
  };

  const handleLinkOrganization = () => {
    if (selectedOrganization && selectedPrincipal) {
      const principalName = principalOrganizations.find(p => p.id === selectedPrincipal)?.name;
      toast.success(`Organização vinculada com sucesso à ${principalName}`);
      setLinkDialogOpen(false);
      setSelectedOrganization('');
      setSelectedPrincipal('');
    }
  };

  const filteredPrincipals = principalOrganizations.filter(org =>
    org.name.toLowerCase().includes(search.toLowerCase()) ||
    org.cnpj.includes(search)
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Organizações</h1>
          <p className="text-muted-foreground">
            Gerencie organizações principais e vinculadas
          </p>
        </div>
        <div className="flex gap-2">
          <Dialog open={linkDialogOpen} onOpenChange={setLinkDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Link2 className="h-4 w-4" />
                Vincular Organização
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Vincular Organização</DialogTitle>
                <DialogDescription>
                  Vincule uma organização a uma organização principal para compartilhar o pacote contratado
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Organização Principal</label>
                  <Select value={selectedPrincipal} onValueChange={setSelectedPrincipal}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a organização principal" />
                    </SelectTrigger>
                    <SelectContent>
                      {principalOrganizations.map(org => (
                        <SelectItem key={org.id} value={org.id}>
                          <div className="flex items-center gap-2">
                            <Crown className="h-3 w-3 text-primary" />
                            {org.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Organização a Vincular</label>
                  <Select value={selectedOrganization} onValueChange={setSelectedOrganization}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a organização" />
                    </SelectTrigger>
                    <SelectContent>
                      {standaloneOrganizations.length > 0 ? (
                        standaloneOrganizations.map(org => (
                          <SelectItem key={org.id} value={org.id}>
                            {org.name}
                          </SelectItem>
                        ))
                      ) : (
                        <div className="p-2 text-sm text-muted-foreground">
                          Todas as organizações já estão vinculadas
                        </div>
                      )}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setLinkDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleLinkOrganization} disabled={!selectedOrganization || !selectedPrincipal}>
                  Vincular
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
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
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-4">
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
            <div className="p-2 rounded-lg bg-amber-500/10">
              <Crown className="h-5 w-5 text-amber-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{principalOrganizations.length}</p>
              <p className="text-sm text-muted-foreground">Org. Principais</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-500/10">
              <Link2 className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{linkedCount}</p>
              <p className="text-sm text-muted-foreground">Org. Vinculadas</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-green-500/10">
              <FileText className="h-5 w-5 text-green-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {mockOrganizations.reduce((acc, org) => acc + (org.consumed || 0), 0).toLocaleString()}
              </p>
              <p className="text-sm text-muted-foreground">Docs. Consumidos</p>
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

      {/* Organizations List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Organizações Principais e Vinculadas
          </CardTitle>
          <CardDescription>
            Clique em uma organização principal para ver o detalhamento do consumo
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredPrincipals.map(principal => {
              const linkedOrgs = getLinkedOrganizations(principal.id);
              const consumptionData = getTotalConsumedByPrincipal(principal.id);
              const contract = getContractByPrincipalOrganization(principal.id);
              const isExpanded = expandedPrincipals.includes(principal.id);
              const consumptionPercentage = contract 
                ? Math.round((consumptionData.totalConsumed / contract.plan) * 100)
                : 0;

              return (
                <div key={principal.id} className="border border-border rounded-lg overflow-hidden">
                  {/* Principal Organization Row */}
                  <div 
                    className="bg-muted/30 p-4 cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => toggleExpand(principal.id)}
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3 min-w-0">
                        <button className="p-1 flex-shrink-0">
                          {isExpanded ? (
                            <ChevronDown className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <ChevronRight className="h-4 w-4 text-muted-foreground" />
                          )}
                        </button>
                        <div className="rounded-lg bg-primary/10 p-2 flex-shrink-0">
                          <Crown className="h-5 w-5 text-primary" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-semibold truncate">{principal.name}</span>
                            <Badge variant="default" className="bg-primary/20 text-primary hover:bg-primary/30 flex-shrink-0">
                              Principal
                            </Badge>
                            {linkedOrgs.length > 0 && (
                              <Badge variant="outline" className="flex-shrink-0">
                                +{linkedOrgs.length} vinculada{linkedOrgs.length > 1 ? 's' : ''}
                              </Badge>
                            )}
                          </div>
                          <span className="text-sm text-muted-foreground">{principal.cnpj}</span>
                        </div>
                      </div>
                      
                      {contract && (
                        <div className="text-right min-w-[220px] flex-shrink-0">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm text-muted-foreground">Consumo do Pacote</span>
                            <span className="text-sm font-medium">
                              {consumptionData.totalConsumed.toLocaleString()} / {contract.plan.toLocaleString()}
                            </span>
                          </div>
                          <Progress 
                            value={Math.min(consumptionPercentage, 100)} 
                            className="h-2"
                            indicatorClassName={
                              consumptionPercentage >= 100 
                                ? 'bg-destructive' 
                                : consumptionPercentage >= 80 
                                  ? 'bg-orange-500' 
                                  : 'bg-primary'
                            }
                          />
                          <p className="text-xs text-muted-foreground mt-1 text-right">
                            {consumptionPercentage}% utilizado
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Expanded Content */}
                  {isExpanded && (
                    <div className="border-t border-border bg-background p-4">
                      <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        Detalhamento do Consumo por Organização
                      </h4>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Organização</TableHead>
                            <TableHead>CNPJ</TableHead>
                            <TableHead>Tipo</TableHead>
                            <TableHead className="text-right">Consumo Individual</TableHead>
                            <TableHead className="text-right">% do Pacote</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {/* Principal Organization */}
                          <TableRow className="bg-muted/20">
                            <TableCell className="font-medium">
                              <div className="flex items-center gap-2">
                                <Crown className="h-4 w-4 text-primary" />
                                {principal.name}
                              </div>
                            </TableCell>
                            <TableCell className="font-mono text-sm">{principal.cnpj}</TableCell>
                            <TableCell>
                              <Badge variant="default" className="bg-primary/20 text-primary">
                                Principal
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right font-medium">
                              {(principal.consumed || 0).toLocaleString()} docs
                            </TableCell>
                            <TableCell className="text-right">
                              {contract ? Math.round(((principal.consumed || 0) / contract.plan) * 100) : 0}%
                            </TableCell>
                          </TableRow>
                          
                          {/* Linked Organizations */}
                          {linkedOrgs.map(linked => (
                            <TableRow key={linked.id}>
                              <TableCell className="font-medium">
                                <div className="flex items-center gap-2">
                                  <Link2 className="h-4 w-4 text-blue-500" />
                                  {linked.name}
                                </div>
                              </TableCell>
                              <TableCell className="font-mono text-sm">{linked.cnpj}</TableCell>
                              <TableCell>
                                <Badge variant="outline" className="border-blue-500/50 text-blue-500">
                                  Vinculada
                                </Badge>
                              </TableCell>
                              <TableCell className="text-right font-medium">
                                {(linked.consumed || 0).toLocaleString()} docs
                              </TableCell>
                              <TableCell className="text-right">
                                {contract ? Math.round(((linked.consumed || 0) / contract.plan) * 100) : 0}%
                              </TableCell>
                            </TableRow>
                          ))}
                          
                          {/* Total Row */}
                          <TableRow className="bg-muted/40 font-bold border-t-2">
                            <TableCell colSpan={3}>
                              <span className="flex items-center gap-2">
                                Total Consolidado do Pacote
                              </span>
                            </TableCell>
                            <TableCell className="text-right text-primary">
                              {consumptionData.totalConsumed.toLocaleString()} docs
                            </TableCell>
                            <TableCell className="text-right text-primary">
                              {contract ? Math.round((consumptionData.totalConsumed / contract.plan) * 100) : 0}%
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>

                      {/* Contract Summary */}
                      {contract && (
                        <div className="mt-4 p-4 bg-muted/30 rounded-lg">
                          <div className="flex flex-wrap items-center justify-between gap-4">
                            <div className="flex flex-wrap gap-6">
                              <div>
                                <span className="text-sm text-muted-foreground">Plano Contratado</span>
                                <p className="font-semibold text-lg">{contract.plan.toLocaleString()} documentos</p>
                              </div>
                              <div>
                                <span className="text-sm text-muted-foreground">Consumido</span>
                                <p className="font-semibold text-lg text-primary">{consumptionData.totalConsumed.toLocaleString()} documentos</p>
                              </div>
                              <div>
                                <span className="text-sm text-muted-foreground">Saldo Disponível</span>
                                <p className={`font-semibold text-lg ${contract.plan - consumptionData.totalConsumed < 0 ? 'text-destructive' : 'text-green-500'}`}>
                                  {(contract.plan - consumptionData.totalConsumed).toLocaleString()} documentos
                                </p>
                              </div>
                            </div>
                            <Badge 
                              variant={contract.status === 'active' ? 'default' : 'secondary'}
                              className={contract.status === 'active' ? 'bg-green-500/20 text-green-500 hover:bg-green-500/30' : ''}
                            >
                              {contract.status === 'active' ? 'Contrato Ativo' : contract.status === 'expired' ? 'Expirado' : 'Suspenso'}
                            </Badge>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}

            {filteredPrincipals.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Nenhuma organização principal encontrada</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
