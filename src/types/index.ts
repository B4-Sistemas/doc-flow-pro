export interface Organization {
  id: string;
  name: string;
  cnpj: string;
  createdAt: string;
}

export interface Contract {
  id: string;
  clientName: string;
  billingType: 'individual' | 'group';
  organizations: Organization[];
  plan: number; // volume de documentos
  consumed: number;
  startDate: string;
  endDate: string;
  observations?: string;
  status: 'active' | 'expired' | 'suspended';
  planValue: number; // valor do plano em R$
  excessValue: number; // valor do excedente por documento
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'financial' | 'viewer';
  avatar?: string;
}

export interface DashboardStats {
  totalContracts: number;
  activeContracts: number;
  totalOrganizations: number;
  totalConsumed: number;
  totalPlan: number;
  alertCount: number;
}

export interface BillingItem {
  contractId: string;
  clientName: string;
  cnpj: string;
  planValue: number;
  excessDocuments: number;
  excessValue: number;
  totalValue: number;
  period: string;
}

export interface Invoice {
  id: string;
  organizationId: string;
  organizationName: string;
  cnpj: string;
  referenceMonth: string;
  dueDate: string;
  issueDate: string;
  documentsUsed: number;
  planValue: number;
  excessDocuments: number;
  excessValue: number;
  totalValue: number;
  status: 'pending' | 'paid' | 'overdue' | 'cancelled';
  paymentDate?: string;
}
