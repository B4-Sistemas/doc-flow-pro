import { Organization, Contract, User, DashboardStats, Invoice } from '@/types';

export const mockOrganizations: Organization[] = [
  { id: '1', name: 'Tech Solutions Ltda', cnpj: '12.345.678/0001-90', createdAt: '2024-01-15' },
  { id: '2', name: 'Construções ABC S.A.', cnpj: '23.456.789/0001-01', createdAt: '2024-02-20' },
  { id: '3', name: 'Comércio Digital ME', cnpj: '34.567.890/0001-12', createdAt: '2024-03-10' },
  { id: '4', name: 'Indústria XYZ Ltda', cnpj: '45.678.901/0001-23', createdAt: '2024-04-05' },
  { id: '5', name: 'Serviços Integrados S.A.', cnpj: '56.789.012/0001-34', createdAt: '2024-05-12' },
  { id: '6', name: 'Logística Express Ltda', cnpj: '67.890.123/0001-45', createdAt: '2024-06-18' },
  { id: '7', name: 'Financeira Capital ME', cnpj: '78.901.234/0001-56', createdAt: '2024-07-22' },
  { id: '8', name: 'Educação Premium S.A.', cnpj: '89.012.345/0001-67', createdAt: '2024-08-30' },
];

export const mockContracts: Contract[] = [
  {
    id: '1',
    clientName: 'Grupo Alpha',
    billingType: 'group',
    organizations: [mockOrganizations[0], mockOrganizations[1], mockOrganizations[2]],
    plan: 5000,
    consumed: 4250,
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    observations: 'Cliente premium com suporte dedicado',
    status: 'active',
    planValue: 2500,
    excessValue: 0.75,
  },
  {
    id: '2',
    clientName: 'Tech Solutions Ltda',
    billingType: 'individual',
    organizations: [mockOrganizations[3]],
    plan: 1000,
    consumed: 1050,
    startDate: '2024-03-01',
    endDate: '2024-12-31',
    status: 'active',
    planValue: 800,
    excessValue: 1.00,
  },
  {
    id: '3',
    clientName: 'Holding Beta',
    billingType: 'group',
    organizations: [mockOrganizations[4], mockOrganizations[5]],
    plan: 3000,
    consumed: 2100,
    startDate: '2024-02-15',
    endDate: '2024-12-31',
    observations: 'Contrato renovado automaticamente',
    status: 'active',
    planValue: 1500,
    excessValue: 0.85,
  },
  {
    id: '4',
    clientName: 'Financeira Capital ME',
    billingType: 'individual',
    organizations: [mockOrganizations[6]],
    plan: 500,
    consumed: 420,
    startDate: '2024-04-01',
    endDate: '2024-10-31',
    status: 'active',
    planValue: 450,
    excessValue: 1.20,
  },
  {
    id: '5',
    clientName: 'Educação Premium S.A.',
    billingType: 'individual',
    organizations: [mockOrganizations[7]],
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

export const mockInvoices: Invoice[] = [
  { id: 'INV-001', organizationId: '1', organizationName: 'Tech Solutions Ltda', cnpj: '12.345.678/0001-90', referenceMonth: '2024-10', dueDate: '2024-11-10', issueDate: '2024-10-31', documentsUsed: 450, planValue: 500, excessDocuments: 0, excessValue: 0, totalValue: 500, status: 'paid', paymentDate: '2024-11-08' },
  { id: 'INV-002', organizationId: '1', organizationName: 'Tech Solutions Ltda', cnpj: '12.345.678/0001-90', referenceMonth: '2024-11', dueDate: '2024-12-10', issueDate: '2024-11-30', documentsUsed: 520, planValue: 500, excessDocuments: 20, excessValue: 15, totalValue: 515, status: 'pending' },
  { id: 'INV-003', organizationId: '2', organizationName: 'Construções ABC S.A.', cnpj: '23.456.789/0001-01', referenceMonth: '2024-10', dueDate: '2024-11-10', issueDate: '2024-10-31', documentsUsed: 800, planValue: 750, excessDocuments: 50, excessValue: 37.50, totalValue: 787.50, status: 'paid', paymentDate: '2024-11-05' },
  { id: 'INV-004', organizationId: '2', organizationName: 'Construções ABC S.A.', cnpj: '23.456.789/0001-01', referenceMonth: '2024-11', dueDate: '2024-12-10', issueDate: '2024-11-30', documentsUsed: 720, planValue: 750, excessDocuments: 0, excessValue: 0, totalValue: 750, status: 'pending' },
  { id: 'INV-005', organizationId: '3', organizationName: 'Comércio Digital ME', cnpj: '34.567.890/0001-12', referenceMonth: '2024-09', dueDate: '2024-10-10', issueDate: '2024-09-30', documentsUsed: 200, planValue: 300, excessDocuments: 0, excessValue: 0, totalValue: 300, status: 'overdue' },
  { id: 'INV-006', organizationId: '3', organizationName: 'Comércio Digital ME', cnpj: '34.567.890/0001-12', referenceMonth: '2024-10', dueDate: '2024-11-10', issueDate: '2024-10-31', documentsUsed: 280, planValue: 300, excessDocuments: 0, excessValue: 0, totalValue: 300, status: 'paid', paymentDate: '2024-11-09' },
  { id: 'INV-007', organizationId: '4', organizationName: 'Indústria XYZ Ltda', cnpj: '45.678.901/0001-23', referenceMonth: '2024-10', dueDate: '2024-11-10', issueDate: '2024-10-31', documentsUsed: 350, planValue: 400, excessDocuments: 0, excessValue: 0, totalValue: 400, status: 'paid', paymentDate: '2024-11-10' },
  { id: 'INV-008', organizationId: '4', organizationName: 'Indústria XYZ Ltda', cnpj: '45.678.901/0001-23', referenceMonth: '2024-11', dueDate: '2024-12-10', issueDate: '2024-11-30', documentsUsed: 420, planValue: 400, excessDocuments: 20, excessValue: 24, totalValue: 424, status: 'pending' },
  { id: 'INV-009', organizationId: '5', organizationName: 'Serviços Integrados S.A.', cnpj: '56.789.012/0001-34', referenceMonth: '2024-10', dueDate: '2024-11-10', issueDate: '2024-10-31', documentsUsed: 600, planValue: 650, excessDocuments: 0, excessValue: 0, totalValue: 650, status: 'paid', paymentDate: '2024-11-07' },
  { id: 'INV-010', organizationId: '6', organizationName: 'Logística Express Ltda', cnpj: '67.890.123/0001-45', referenceMonth: '2024-11', dueDate: '2024-12-10', issueDate: '2024-11-30', documentsUsed: 550, planValue: 500, excessDocuments: 50, excessValue: 42.50, totalValue: 542.50, status: 'pending' },
  { id: 'INV-011', organizationId: '7', organizationName: 'Financeira Capital ME', cnpj: '78.901.234/0001-56', referenceMonth: '2024-10', dueDate: '2024-11-10', issueDate: '2024-10-31', documentsUsed: 140, planValue: 200, excessDocuments: 0, excessValue: 0, totalValue: 200, status: 'cancelled' },
  { id: 'INV-012', organizationId: '8', organizationName: 'Educação Premium S.A.', cnpj: '89.012.345/0001-67', referenceMonth: '2024-10', dueDate: '2024-11-10', issueDate: '2024-10-31', documentsUsed: 900, planValue: 800, excessDocuments: 100, excessValue: 90, totalValue: 890, status: 'paid', paymentDate: '2024-11-06' },
];
