import {Component} from '@angular/core';

@Component({
  selector: 'spinner-component',
  templateUrl: 'spinner-component.html',
  styleUrls: ['spinner-component.scss'],
})
export class spinnerComponent {
  color = 'warm';
  mode = 'indeterminate';
  value = 50;
}
