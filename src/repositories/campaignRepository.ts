/**
 * PulseBrand Agency OS - Campaign Repository
 * Phase 02: Project Architecture
 */

import { BaseRepository } from './baseRepository';
import { Campaign } from '../types';
import { INITIAL_CAMPAIGNS } from '../data/seedData';

export class CampaignRepository extends BaseRepository<Campaign> {
  constructor() {
    super('campaigns', INITIAL_CAMPAIGNS);
  }

  public getByClient(clientId: string): Campaign[] {
    return this.getAll().filter(c => c.clientId === clientId);
  }

  public getActive(tenantId: string): Campaign[] {
    return this.getAll().filter(c => c.tenantId === tenantId && c.status === 'in_progress');
  }
}

export const campaignRepository = new CampaignRepository();
