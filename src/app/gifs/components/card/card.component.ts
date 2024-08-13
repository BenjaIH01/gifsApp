import { Component, Input, OnInit } from '@angular/core';
import { Gif } from '../../interfaces';

@Component({
  selector: 'gifs-card',
  templateUrl: './card.component.html',
})
export class CardComponent implements OnInit {

  @Input()
  public gif!: Gif;

  parseInt( value: string ): number {
    return Number( value );
  }

  ngOnInit(): void {
    if( !this.gif ) throw new Error('Gif property is required');
  }

}
