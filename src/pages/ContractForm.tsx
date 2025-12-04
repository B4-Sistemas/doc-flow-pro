import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, X, Building2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Badge } from '@/components/ui/badge';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { mockOrganizations } from '@/data/mockData';
import { Organization } from '@/types';
import { toast } from 'sonner';

export default function ContractForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    clientName: '',
    billingType: 'individual' as 'individual' | 'group',
    plan: '',
    planValue: '',
    excessValue: '',
    startDate: '',
    endDate: '',
    observations: '',
  });
  const [selectedOrgs, setSelectedOrgs] = useState<Organization[]>([]);
  const [orgSearchOpen, setOrgSearchOpen] = useState(false);

  const handleAddOrg = (org: Organization) => {
    if (!selectedOrgs.find(o => o.id === org.id)) {
      setSelectedOrgs([...selectedOrgs, org]);
    }
    setOrgSearchOpen(false);
  };

  const handleRemoveOrg = (orgId: string) => {
    setSelectedOrgs(selectedOrgs.filter(o => o.id !== orgId));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.clientName || !formData.plan || selectedOrgs.length === 0) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    toast.success('Contrato criado com sucesso!');
    navigate('/contracts');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/contracts')}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Novo Contrato</h1>
          <p className="text-muted-foreground">
            Cadastre um novo contrato de consumo de documentos
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">Informações do Contrato</h2>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="clientName">Nome do Cliente *</Label>
                  <Input
                    id="clientName"
                    value={formData.clientName}
                    onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                    placeholder="Ex: Grupo Alpha"
                  />
                </div>

                <div>
                  <Label>Tipo de Cobrança *</Label>
                  <RadioGroup
                    value={formData.billingType}
                    onValueChange={(value) => setFormData({ ...formData, billingType: value as 'individual' | 'group' })}
                    className="flex gap-4 mt-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="individual" id="individual" />
                      <Label htmlFor="individual" className="cursor-pointer">
                        Organização individual
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="group" id="group" />
                      <Label htmlFor="group" className="cursor-pointer">
                        Conjunto de organizações
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <Label>Organizações Vinculadas *</Label>
                  <div className="mt-2 space-y-2">
                    <Popover open={orgSearchOpen} onOpenChange={setOrgSearchOpen}>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start gap-2">
                          <Plus className="h-4 w-4" />
                          Adicionar organização
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[400px] p-0" align="start">
                        <Command>
                          <CommandInput placeholder="Buscar organização..." />
                          <CommandList>
                            <CommandEmpty>Nenhuma organização encontrada.</CommandEmpty>
                            <CommandGroup>
                              {mockOrganizations
                                .filter(org => !selectedOrgs.find(o => o.id === org.id))
                                .map((org) => (
                                  <CommandItem
                                    key={org.id}
                                    onSelect={() => handleAddOrg(org)}
                                    className="cursor-pointer"
                                  >
                                    <Building2 className="h-4 w-4 mr-2" />
                                    <div>
                                      <p className="font-medium">{org.name}</p>
                                      <p className="text-xs text-muted-foreground">{org.cnpj}</p>
                                    </div>
                                  </CommandItem>
                                ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>

                    {selectedOrgs.length > 0 && (
                      <div className="flex flex-wrap gap-2 p-3 bg-secondary rounded-lg">
                        {selectedOrgs.map((org) => (
                          <Badge key={org.id} variant="secondary" className="gap-1 py-1.5 px-3">
                            <Building2 className="h-3 w-3" />
                            {org.name}
                            <button
                              type="button"
                              onClick={() => handleRemoveOrg(org.id)}
                              className="ml-1 hover:text-destructive"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">Plano e Valores</h2>
              
              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <Label htmlFor="plan">Volumetria (documentos) *</Label>
                  <Input
                    id="plan"
                    type="number"
                    value={formData.plan}
                    onChange={(e) => setFormData({ ...formData, plan: e.target.value })}
                    placeholder="Ex: 1000"
                  />
                </div>
                <div>
                  <Label htmlFor="planValue">Valor do Plano (R$) *</Label>
                  <Input
                    id="planValue"
                    type="number"
                    step="0.01"
                    value={formData.planValue}
                    onChange={(e) => setFormData({ ...formData, planValue: e.target.value })}
                    placeholder="Ex: 500.00"
                  />
                </div>
                <div>
                  <Label htmlFor="excessValue">Valor Excedente (R$/doc)</Label>
                  <Input
                    id="excessValue"
                    type="number"
                    step="0.01"
                    value={formData.excessValue}
                    onChange={(e) => setFormData({ ...formData, excessValue: e.target.value })}
                    placeholder="Ex: 0.75"
                  />
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">Vigência</h2>
              
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="startDate">Data de Início *</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="endDate">Data de Encerramento *</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  />
                </div>
              </div>

              <div className="mt-4">
                <Label htmlFor="observations">Observações</Label>
                <Textarea
                  id="observations"
                  value={formData.observations}
                  onChange={(e) => setFormData({ ...formData, observations: e.target.value })}
                  placeholder="Observações adicionais sobre o contrato..."
                  rows={3}
                />
              </div>
            </Card>
          </div>

          {/* Summary Sidebar */}
          <div>
            <Card className="p-6 sticky top-24">
              <h2 className="text-lg font-semibold mb-4">Resumo</h2>
              
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Cliente</p>
                  <p className="font-medium">{formData.clientName || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Tipo de Cobrança</p>
                  <p className="font-medium">
                    {formData.billingType === 'group' ? 'Conjunto' : 'Individual'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Organizações</p>
                  <p className="font-medium">{selectedOrgs.length} selecionada(s)</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Volumetria</p>
                  <p className="font-medium">
                    {formData.plan ? `${parseInt(formData.plan).toLocaleString('pt-BR')} docs` : '-'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Valor do Plano</p>
                  <p className="font-medium text-lg">
                    {formData.planValue ? `R$ ${parseFloat(formData.planValue).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : '-'}
                  </p>
                </div>

                <div className="pt-4 border-t space-y-2">
                  <Button type="submit" className="w-full">
                    Criar Contrato
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="w-full"
                    onClick={() => navigate('/contracts')}
                  >
                    Cancelar
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}
