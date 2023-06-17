import { Component, EventEmitter, Output } from '@angular/core';
import { Emitter } from '../models/emitter.model';

@Component({
  selector: 'app-sub-task',
  templateUrl: './sub-task.component.html',
  styleUrls: ['./sub-task.component.css']
})
export class SubTaskComponent implements Emitter  {
  @Output() loading: EventEmitter<boolean> = new EventEmitter<boolean>();

}
