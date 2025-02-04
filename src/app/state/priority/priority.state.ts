import { EntityState } from '@ngrx/entity';
import { PriorityModel } from './priority.model';

export interface PriorityState extends EntityState<PriorityModel> {
  error: string | null;
  status: string;
}
