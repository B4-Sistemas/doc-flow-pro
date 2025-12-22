import { Organization, Contract, User, DashboardStats, Invoice } from '@/types';

export const mockOrganizations: Organization[] = [
  // Organização Principal 1 com vinculadas
  { id: '1', name: 'Tech Solutions Ltda', cnpj: '12.345.678/0001-90', createdAt: '2024-01-15', isPrincipal: true, consumed: 1200 },
  { id: '2', name: 'Tech Solutions Filial SP', cnpj: '12.345.678/0002-71', createdAt: '2024-02-20', parentOrganizationId: '1', consumed: 850 },
  { id: '3', name: 'Tech Solutions Filial RJ', cnpj: '12.345.678/0003-52', createdAt: '2024-03-10', parentOrganizationId: '1', consumed: 620 },
  
  // Organização Principal 2 com vinculadas
  { id: '4', name: 'Grupo Alpha S.A.', cnpj: '45.678.901/0001-23', createdAt: '2024-04-05', isPrincipal: true, consumed: 1800 },
  { id: '5', name: 'Alpha Logística Ltda', cnpj: '45.678.901/0002-04', createdAt: '2024-05-12', parentOrganizationId: '4', consumed: 950 },
  { id: '6', name: 'Alpha Comércio ME', cnpj: '45.678.901/0003-85', createdAt: '2024-06-18', parentOrganizationId: '4', consumed: 720 },
  { id: '7', name: 'Alpha Indústria Ltda', cnpj: '45.678.901/0004-66', createdAt: '2024-06-25', parentOrganizationId: '4', consumed: 430 },
  
  // Organização Principal 3 - Individual (sem vinculadas)
  { id: '8', name: 'Financeira Capital ME', cnpj: '78.901.234/0001-56', createdAt: '2024-07-22', isPrincipal: true, consumed: 420 },
  
  // Organização Principal 4 - Individual
  { id: '9', name: 'Educação Premium S.A.', cnpj: '89.012.345/0001-67', createdAt: '2024-08-30', isPrincipal: true, consumed: 1800 },
];

export const mockContracts: Contract[] = [
  {
    id: '1',
    clientName: 'Tech Solutions Ltda',
    billingType: 'group',
    organizations: mockOrganizations.filter(o => o.id === '1' || o.parentOrganizationId === '1'),
    plan: 5000,
    consumed: 2670, // Soma: 1200 + 850 + 620
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    observations: 'Cliente premium com suporte dedicado - 3 organizações',
    status: 'active',
    planValue: 2500,
    excessValue: 0.75,
  },
  {
    id: '2',
    clientName: 'Grupo Alpha S.A.',
    billingType: 'group',
    organizations: mockOrganizations.filter(o => o.id === '4' || o.parentOrganizationId === '4'),
    plan: 5000,
    consumed: 3900, // Soma: 1800 + 950 + 720 + 430
    startDate: '2024-04-01',
    endDate: '2024-12-31',
    observations: 'Contrato corporativo com 4 organizações',
    status: 'active',
    planValue: 3500,
    excessValue: 0.85,
  },
  {
    id: '3',
    clientName: 'Financeira Capital ME',
    billingType: 'individual',
    organizations: [mockOrganizations[7]],
    plan: 500,
    consumed: 420,
    startDate: '2024-07-01',
    endDate: '2024-12-31',
    status: 'active',
    planValue: 450,
    excessValue: 1.20,
  },
  {
    id: '4',
    clientName: 'Educação Premium S.A.',
    billingType: 'individual',
    organizations: [mockOrganizations[8]],
    plan: 2000,
    consumed: 1800,
    startDate: '2024-01-01',
    endDate: '2024-06-30',
    status: 'expired',
    planValue: 1200,
    excessValue: 0.90,
  },
];

export const mockUsers: User[] = [
  { id: '1', name: 'Admin Master', email: 'admin@b4.com', role: 'admin' },
  { id: '2', name: 'Maria Financeiro', email: 'maria@b4.com', role: 'financial' },
  { id: '3', name: 'João Viewer', email: 'joao@b4.com', role: 'viewer' },
];

export const mockCurrentUser: User = mockUsers[0];

export const calculateDashboardStats = (): DashboardStats => {
  const activeContracts = mockContracts.filter(c => c.status === 'active');
  const totalConsumed = mockContracts.reduce((sum, c) => sum + c.consumed, 0);
  const totalPlan = mockContracts.reduce((sum, c) => sum + c.plan, 0);
  const alertCount = mockContracts.filter(c => (c.consumed / c.plan) >= 0.8).length;

  return {
    totalContracts: mockContracts.length,
    activeContracts: activeContracts.length,
    totalOrganizations: mockOrganizations.length,
    totalConsumed,
    totalPlan,
    alertCount,
  };
};

export const getConsumptionPercentage = (consumed: number, plan: number): number => {
  return Math.min((consumed / plan) * 100, 100);
};

export const getConsumptionStatus = (consumed: number, plan: number): 'normal' | 'warning' | 'critical' => {
  const percentage = getConsumptionPercentage(consumed, plan);
  if (percentage >= 100) return 'critical';
  if (percentage >= 80) return 'warning';
  return 'normal';
};

// Funções para organizações principais e vinculadas
export const getPrincipalOrganizations = () => {
  return mockOrganizations.filter(org => org.isPrincipal);
};

export const getLinkedOrganizations = (principalId: string) => {
  return mockOrganizations.filter(org => org.parentOrganizationId === principalId);
};

export const getStandaloneOrganizations = () => {
  return mockOrganizations.filter(org => !org.isPrincipal && !org.parentOrganizationId);
};

export const getTotalConsumedByPrincipal = (principalId: string) => {
  const principal = mockOrganizations.find(org => org.id === principalId);
  const linked = getLinkedOrganizations(principalId);
  
  const principalConsumed = principal?.consumed || 0;
  const linkedConsumed = linked.reduce((acc, org) => acc + (org.consumed || 0), 0);
  
  return {
    principalConsumed,
    linkedConsumed,
    totalConsumed: principalConsumed + linkedConsumed,
    breakdown: [
      { id: principal?.id, name: principal?.name, consumed: principalConsumed, isPrincipal: true },
      ...linked.map(org => ({ id: org.id, name: org.name, consumed: org.consumed || 0, isPrincipal: false }))
    ]
  };
};

export const getContractByPrincipalOrganization = (principalId: string) => {
  return mockContracts.find(contract => 
    contract.organizations.some(org => org.id === principalId && org.isPrincipal)
  );
};

export const mockInvoices: Invoice[] = [
  { id: 'INV-001', organizationId: '1', organizationName: 'Tech Solutions Ltda', cnpj: '12.345.678/0001-90', referenceMonth: '2024-10', dueDate: '2024-11-10', issueDate: '2024-10-31', documentsUsed: 450, planValue: 500, excessDocuments: 0, excessValue: 0, totalValue: 500, status: 'paid', paymentDate: '2024-11-08' },
  { id: 'INV-002', organizationId: '1', organizationName: 'Tech Solutions Ltda', cnpj: '12.345.678/0001-90', referenceMonth: '2024-11', dueDate: '2024-12-10', issueDate: '2024-11-30', documentsUsed: 520, planValue: 500, excessDocuments: 20, excessValue: 15, totalValue: 515, status: 'pending' },
  { id: 'INV-003', organizationId: '4', organizationName: 'Grupo Alpha S.A.', cnpj: '45.678.901/0001-23', referenceMonth: '2024-10', dueDate: '2024-11-10', issueDate: '2024-10-31', documentsUsed: 800, planValue: 750, excessDocuments: 50, excessValue: 37.50, totalValue: 787.50, status: 'paid', paymentDate: '2024-11-05' },
  { id: 'INV-004', organizationId: '4', organizationName: 'Grupo Alpha S.A.', cnpj: '45.678.901/0001-23', referenceMonth: '2024-11', dueDate: '2024-12-10', issueDate: '2024-11-30', documentsUsed: 720, planValue: 750, excessDocuments: 0, excessValue: 0, totalValue: 750, status: 'pending' },
  { id: 'INV-005', organizationId: '8', organizationName: 'Financeira Capital ME', cnpj: '78.901.234/0001-56', referenceMonth: '2024-09', dueDate: '2024-10-10', issueDate: '2024-09-30', documentsUsed: 200, planValue: 300, excessDocuments: 0, excessValue: 0, totalValue: 300, status: 'overdue' },
  { id: 'INV-006', organizationId: '8', organizationName: 'Financeira Capital ME', cnpj: '78.901.234/0001-56', referenceMonth: '2024-10', dueDate: '2024-11-10', issueDate: '2024-10-31', documentsUsed: 280, planValue: 300, excessDocuments: 0, excessValue: 0, totalValue: 300, status: 'paid', paymentDate: '2024-11-09' },
  { id: 'INV-007', organizationId: '9', organizationName: 'Educação Premium S.A.', cnpj: '89.012.345/0001-67', referenceMonth: '2024-10', dueDate: '2024-11-10', issueDate: '2024-10-31', documentsUsed: 900, planValue: 800, excessDocuments: 100, excessValue: 90, totalValue: 890, status: 'paid', paymentDate: '2024-11-06' },
];
