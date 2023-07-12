import { Component, EventEmitter, Output } from '@angular/core';
import { Emitter } from '../models/emitter.model';
import { StorageService } from '../services/storage.service';

@Component({
  selector: 'app-sub-task',
  templateUrl: './sub-task.component.html',
  styleUrls: ['./sub-task.component.css']
})
export class SubTaskComponent implements Emitter  {
  @Output() loading: EventEmitter<boolean> = new EventEmitter<boolean>();
  items: string[] = [];

  constructor(private storageService: StorageService) {}

  ngOnInit(): void {
    console.log('init subtasks');
    var subTasks = this.storageService.getSubTasks()
    this.items = subTasks || []
  }

  addItem(): void {
    this.items.push('');
  }

  removeItem(index: number): void {
    this.items.splice(index, 1);
  }

  saveChanges(): void {
    // Save the edited items to localStorage
    this.storageService.saveSubTasks(this.items);
  }

  trackByFn(index: number): number {
    return index;
  }
}
