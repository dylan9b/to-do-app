import { createEntityAdapter, EntityAdapter } from '@ngrx/entity';
import { PriorityModel } from './priority.model';

export const priorityAdapter: EntityAdapter<PriorityModel> =
  createEntityAdapter<PriorityModel>({
    selectId: (priority) => priority?.id,
  });
