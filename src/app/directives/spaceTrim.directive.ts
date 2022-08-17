import { Directive, ElementRef, HostListener, Input, OnInit } from '@angular/core';

@Directive({
  selector: '[spaceTrim]'
})
export class spaceTrimDirective implements OnInit{

  constructor(private el: ElementRef) { }

  @Input() spaceTrim: string;
  
   
  
  ngOnInit(){
    return this.spaceTrim.replace(/^\s+|\s+$/gm,'');
    }
}
