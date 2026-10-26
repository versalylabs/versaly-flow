/**
 * PulseBrand Agency OS - Client Repository
 * Phase 02: Project Architecture
 */

import { BaseRepository } from './baseRepository';
import { ClientBrand } from '../types';
import { INITIAL_CLIENTS } from '../data/seedData';

export class ClientRepository extends BaseRepository<ClientBrand> {
  constructor() {
    super('clients', INITIAL_CLIENTS);
  }

  public getByTenant(tenantId: string): ClientBrand[] {
    return this.getAll().filter(client => client.tenantId === tenantId);
  }

  public getActiveClients(tenantId: string): ClientBrand[] {
    return this.getByTenant(tenantId).filter(c => c.status === 'active');
  }

  public updateRetainer(clientId: string, monthlyValue: number, quota: number): ClientBrand | null {
    return this.update(clientId, {
      retainerMonthlyValue: monthlyValue,
      monthlyPostQuota: quota
    }, 'client:updated');
  }

  public updateStatus(clientId: string, status: ClientBrand['status'], actor?: { actorId: string; actorName: string }): ClientBrand | null {
    return this.update(clientId, { status }, 'client:status_changed', actor);
  }
}

export const clientRepository = new ClientRepository();
