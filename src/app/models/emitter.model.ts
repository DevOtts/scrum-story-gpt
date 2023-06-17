import { EventEmitter } from '@angular/core';

export interface Emitter {
  loading: EventEmitter<boolean>;
}
