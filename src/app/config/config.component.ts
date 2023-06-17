import { Component, EventEmitter, Output } from '@angular/core';
import { Emitter } from '../models/emitter.model';

@Component({
  selector: 'app-config',
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.css']
})
export class ConfigComponent implements Emitter  {
  @Output() loading: EventEmitter<boolean> = new EventEmitter<boolean>();


}
