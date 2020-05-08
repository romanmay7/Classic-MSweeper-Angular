import { Component,ViewChild, ElementRef,OnInit } from '@angular/core';

@Component({
  selector: 'app-game-screen',
  templateUrl: './game-screen.component.html',
  styleUrls: ['./game-screen.component.css']
})
export class GameScreenComponent implements OnInit {

    //In the component class, we can use the @ViewChild() decorator to inject a reference to the canvas.
    @ViewChild('canvas', { static: true })
    canvas: ElementRef<HTMLCanvasElement>;
  
    private ctx: CanvasRenderingContext2D;
  
    title = 'Classic MSweeper-Angular';

      //Game Screen Dimensions

      N:number;  //number of Cells in the Row
      M:number;  //number of Rows
      Scale:number;
      fieldWidth:number;
      fieldHeight:number;

      gameField: Cell[][] 

  constructor() { }

  ngOnInit()
  {
    this.N=32;
    this.M=24;
    this.Scale=25;
    this.fieldWidth=this.Scale*this.N;
    this.fieldHeight=this.Scale*this.M;

    this.createGameField();

    this.setRandomBombsLocations();

    this.initializeGameField();
  
    //Once the component has initialized, we’ll have access to the Canvas DOM node, as well
    //as its drawing context:
    this.ctx = this.canvas.nativeElement.getContext('2d');
    
    this.ctx.fillStyle = 'grey';
    this.ctx.fillRect(0, 0, this.fieldWidth, this.fieldHeight);




  }

  createGameField()
  {
    for(var n=0;n<this.N;n++)
    {
      for(var m=0;m<this.M;m++)
      {
        this.gameField[n][m]=new Cell();

      }
    }

  }

  setRandomBombsLocations(){}

  initializeGameField(){}


}

export class Cell 
{
  flagged:boolean;
  visible:boolean;
  value:number;
}
