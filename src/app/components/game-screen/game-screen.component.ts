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

      gameField: Cell[][];

      bobmsAmount:number=50;

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

    this.drawGameFieldLines();
    this.drawFieldCells();




  }

  createGameField()
  {
    this.gameField=new Array<Array<Cell>>();

    for(var n=0;n<this.N;n++)
    {    
      let row:Cell[]  = new Array<Cell>(); 
      this.gameField.push(row)

      for(var m=0;m<this.M;m++)
      {
        this.gameField[n][m]=new Cell();
        this.gameField[n][m].value=0
        this.gameField[n][m].visible=true

      }
      
    }

  }


  setRandomBombsLocations()
  {
    let x=0,y=0

    for(var n=0;n<this.bobmsAmount;n++)
    {

      while(this.gameField[x][y].value!=0)
      {
         x=Math.floor(Math.random() * this.N); 
         y=Math.floor(Math.random() * this.M);
      }
      //console.log("X:"+x+" Y:"+y)
      this.gameField[x][y].value=10;
      
    }

  }
  

  initializeGameField()
  {

    for(var n=0;n<this.N;n++)
    {
      for(var m=0;m<this.M;m++)
      {
         if(this.gameField[n][m].value==10)
         {
          if (( typeof this.gameField[n-1] != 'undefined')&&( typeof this.gameField[n-1][m-1] != 'undefined')&&(this.gameField[n-1][m-1].value!=10))
          {
            this.gameField[n-1][m-1].value++;
          }

          if (( typeof this.gameField[n][m-1]!= 'undefined')&&(this.gameField[n][m-1].value!=10))
          {
            this.gameField[n][m-1].value++;
          }

          if (( typeof this.gameField[n+1] != 'undefined')&&( typeof this.gameField[n+1][m-1] != 'undefined')&&(this.gameField[n+1][m-1].value!=10))
          {
            this.gameField[n+1][m-1].value++;
          }

          //----------------------------------------------------------------------------------
          if (( typeof this.gameField[n+1] != 'undefined')&&(this.gameField[n+1][m].value!=10))
          {
            this.gameField[n+1][m].value++;
          }
          if (( typeof this.gameField[n-1] != 'undefined')&&(this.gameField[n-1][m].value!=10))
          {
            this.gameField[n-1][m].value++;
          }
          //----------------------------------------------------------------------------------


          if (( typeof this.gameField[n-1] != 'undefined')&&( typeof this.gameField[n-1][m+1] != 'undefined')&&(this.gameField[n-1][m+1].value!=10))
          {
            this.gameField[n-1][m+1].value++;
          }

          if (( typeof this.gameField[n][m+1]!= 'undefined')&&(this.gameField[n][m+1].value!=10))
          {
            this.gameField[n][m+1].value++;
          }

          if (( typeof this.gameField[n+1] != 'undefined')&&( typeof this.gameField[n+1][m+1] != 'undefined')&&(this.gameField[n+1][m+1].value!=10))
          {
            this.gameField[n+1][m+1].value++;
          }

         }

      }
    }
    
  }


  drawLine(x1: number,y1: number,x2: number,y2: number)
  {
    this.ctx.moveTo(x1, y1);
    this.ctx.lineTo(x2, y2);
    this.ctx.strokeStyle = "white";
    this.ctx.stroke();
  }

  drawGameFieldLines()
  {
    for( var i=0;i<this.fieldWidth;i+=this.Scale)
    {
      
       this.drawLine(i,0,i,this.fieldHeight);
    }

    for( var j=0;j<this.fieldHeight;j+=this.Scale)
    {
      
       this.drawLine(0,j,this.fieldWidth,j);
    }

  }

  drawFieldCells()
  {

    for(var n=0;n<this.N;n++)
    {
     console.log("Row Number:"+n)
      for(var m=0;m<this.M;m++)
      {
         let _cell=this.gameField[n][m].value
         console.log(_cell)

         switch(_cell)
         {
 
         case 10: { 
            //Draw Bomb;

            this.ctx.fillStyle = 'red';
            //console.log("Drawing bomb at:"+m+","+m);
            this.ctx.fillRect((n)*this.Scale, (m)*this.Scale,this.Scale-2, this.Scale-2) 
            break;  
           
         } 
          case 1: { 
            //Draw Cell with Number "1" Label
            this.ctx.fillStyle = 'blue';
            this.ctx.font = "20px Arial";
            this.ctx.fillText(""+this.gameField[n][m].value, (n)*this.Scale+8, (m)*this.Scale+21);
            break; 
          } 
          case 2: { 
            //Draw Cell with Number "2" Label
            this.ctx.fillStyle = 'green';
            this.ctx.font = "20px Arial";
            this.ctx.fillText(""+this.gameField[n][m].value, (n)*this.Scale+8, (m)*this.Scale+21);
           break; 
          }
          case 3: { 
            //Draw Cell with Number "3" Label
            this.ctx.fillStyle = 'red';
            this.ctx.font = "20px Arial";
            this.ctx.fillText(""+this.gameField[n][m].value, (n)*this.Scale+8, (m)*this.Scale+21);
            break;       
          } 
          case 4: { 
            //Draw Cell with Number "4" Label
             this.ctx.fillStyle = 'violet';
             this.ctx.font = "20px Arial";
             this.ctx.fillText(""+this.gameField[n][m].value, (n)*this.Scale+8, (m)*this.Scale+21);
             break;       
          } 
          case 5: { 
             //Draw Cell with Number "5" Label
             this.ctx.fillStyle = 'maroon';
             this.ctx.font = "20px Arial";
             this.ctx.fillText(""+this.gameField[n][m].value, (n)*this.Scale+8, (m)*this.Scale+21);
             break;       
          } 
         }
          
      }
    }


  }



}

export class Cell 
{
  flagged:boolean;
  visible:boolean;
  value:number;
}
