import { Component,ViewChild, ElementRef,OnInit,HostListener } from '@angular/core';
import { GameService } from 'src/app/services/game.service';

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
      fieldVisible:boolean=true

      currentAction:ClickActionType=ClickActionType.OpenCell

      gameOver:boolean=false;

  constructor(private gameService:GameService)
  { 
    gameService.bombsUnMarked=this.bobmsAmount;
    gameService.flagsLeft=this.bobmsAmount

  }

  //Listening to Mouse Click events
  @HostListener('window:click', ['$event'])
  clickEvent(event: MouseEvent)
   {
     //console.log(event+" ,button: "+event.button);
     //capturing coordinates
     var positionX = event.clientX;
     var positionY = event.clientY;
     
     //canvas offsets,relative to display
     var offsetY=this.canvas.nativeElement.offsetTop;
     var offsetX=this.canvas.nativeElement.offsetLeft;

     var cellX=Math.round((positionX-offsetX)/this.Scale-0.5)
     var cellY=Math.round((positionY-offsetY)/this.Scale-0.5)

     this.clickField(cellX,cellY);
   }



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
    
    this.ctx.fillStyle = 'lightgrey';
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
     //console.log("Row Number:"+n)
     for(var m=0;m<this.M;m++)
      {
        if(this.gameField[n][m].visible)
        {
          let _cell=this.gameField[n][m].value
          //console.log(_cell)

          //Draw Empty Cell 
          this.ctx.fillStyle = 'lightgrey';
          this.ctx.font = "20px Arial";
          this.ctx.fillRect((n)*this.Scale, (m)*this.Scale,this.Scale-2, this.Scale-2)
        
          
            switch(_cell)
            {
   
            case 10: { 
              //Draw Bomb;
              //console.log("Drawing bomb at:"+m+","+m);
  
              this.ctx.beginPath();
              this.ctx.arc((n*this.Scale+this.Scale/2),(m*this.Scale+this.Scale/2),Math.round(this.Scale*0.5)-3,0*Math.PI,2*Math.PI)
              //console.log("Drawing("+(n*this.Scale+this.Scale/2)+","+(m*this.Scale+this.Scale/2)+","+ Math.round(this.Scale*0.5) +","+0*Math.PI,","+2*Math.PI)
              this.ctx.fillStyle = 'black';
              this.ctx.stroke();
              this.ctx.fill();
          
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
            case 6: { 
              //Draw Cell with Number "6" Label
              this.ctx.fillStyle = 'orange';
              this.ctx.font = "20px Arial";
              this.ctx.fillText(""+this.gameField[n][m].value, (n)*this.Scale+8, (m)*this.Scale+21);
              break;       
            }
             case 7: { 
              //Draw Cell with Number "7" Label
              this.ctx.fillStyle = 'brown';
              this.ctx.font = "20px Arial";
              this.ctx.fillText(""+this.gameField[n][m].value, (n)*this.Scale+8, (m)*this.Scale+21);
              break;       
            }
            case 8: { 
              //Draw Cell with Number "8" Label
              this.ctx.fillStyle = 'grey';
              this.ctx.font = "20px Arial";
              this.ctx.fillText(""+this.gameField[n][m].value, (n)*this.Scale+8, (m)*this.Scale+21);
              break;       
            } 
           } 
    
        }
         
          else
         {  //If Cell is UnVisible

          if(this.gameField[n][m].flagged==true)
          {
            //Draw Flag;

            this.ctx.fillStyle = 'yellow';
            //console.log("Drawing Flag at:"+m+","+m);
            this.ctx.fillRect((n)*this.Scale, (m)*this.Scale,this.Scale-2, this.Scale-2) 
          }
          else
          {
           
            //Draw Grey Rectangle;

            this.ctx.fillStyle = 'grey';
            //console.log("Drawing Unvisible Field at:"+m+","+m);
            this.ctx.fillRect((n)*this.Scale, (m)*this.Scale,this.Scale-2, this.Scale-2) 
           }
          }
        }
          
      }
    }


setAllCellsVisible()
{

  for(var n=0;n<this.N;n++)
  {
    for(var m=0;m<this.M;m++)
    {
      this.gameField[n][m].visible=true
    }
  }

}

setAllCellsUnVisible()
{

  for(var n=0;n<this.N;n++)
  {
    for(var m=0;m<this.M;m++)
    {
      this.gameField[n][m].visible=false
    }
  }

}

ToggleVisible()
{
  if(!this.fieldVisible)
  {
    this.fieldVisible=true;
    this.setAllCellsVisible();
    this.ctx.fillStyle = 'lightgrey';
    this.ctx.fillRect(0, 0, this.fieldWidth, this.fieldHeight);
    this.drawGameFieldLines();
    this.drawFieldCells();
  }
  else
  {
    this.fieldVisible=false;
    this.setAllCellsUnVisible()
    this.drawFieldCells();
  }

}

ToggleActionType()
{
  if(this.currentAction==ClickActionType.MarkCell)
  {
    this.currentAction=ClickActionType.OpenCell;
  }
  else
  {
    this.currentAction=ClickActionType.MarkCell;
  }
}

clickField(n:number,m:number)
{
 if((n>=0 && n<=this.N)&&(m >=-0 && m<=this.M)&& typeof this.gameField[n] != 'undefined'&& typeof this.gameField[n][m] != 'undefined')
 {
  if(this.currentAction==ClickActionType.OpenCell)
  {
    if(this.gameField[n][m].value!=10)
       this.gameField[n][m].visible=true;

    //If Player clicks on Bomb
     if(this.gameField[n][m].value==10)
     {
       this.gameOver=true;
       this.setAllCellsVisible();
       this.drawFieldCells();//Redraw Cells
       
         //highlighting the bomb field and drawing it
         this.ctx.fillStyle = 'red';
         this.ctx.fillRect((n)*this.Scale, (m)*this.Scale,this.Scale-2, this.Scale-2)
         this.ctx.beginPath();
         this.ctx.arc((n*this.Scale+this.Scale/2),(m*this.Scale+this.Scale/2),Math.round(this.Scale*0.5)-3,0*Math.PI,2*Math.PI)
         this.ctx.fillStyle = 'black';
         this.ctx.stroke();
         this.ctx.fill();

        alert("Game Over! X:"+(n)+",Y:"+(m));
      }
     else
     {
      console.log("OK! X:"+(n)+",Y:"+(m));
      if((n-1)>0)
      {
        if((this.gameField[n-1][m].value!=10)&&(this.gameField[n-1][m].visible==false))
           this.clickField(n-1,m);
      }

      if((n+1)<this.N)
      {
        if((this.gameField[n+1][m].value!=10)&&(this.gameField[n+1][m].visible==false))
           this.clickField(n+1,m);
      }

        if((m-1)>0)
        {
          if((this.gameField[n][m-1].value!=10)&&(this.gameField[n][m-1].visible==false))
             this.clickField(n,m-1);
        }

      if((m+1)>this.M)
      {
        if((this.gameField[n][m+1].value!=10)&&(this.gameField[n][m+1].visible==false))
          this.clickField(n,m+1);
      }
    
      this.drawFieldCells();//Redraw Cells
   }
  }

   else //this.currentAction==ClickActionType.MarkCell
   {
     if(!this.gameField[n][m].visible)//Only if Unvisible
     {
     if(this.gameField[n][m].flagged) //If Marked
     {
      this.gameField[n][m].flagged=false;
      
        //Draw Hide Grey Cell;

        this.ctx.fillStyle = 'grey';
        //console.log("Drawing Flag at:"+m+","+m);
        this.ctx.fillRect((n)*this.Scale, (m)*this.Scale,this.Scale-2, this.Scale-2) 

      if(this.gameService.flagsLeft<this.bobmsAmount)
      {
        this.gameService.flagsLeft+=1;

        if(this.gameField[n][m].value==10) //If this Field is Bomb
        {        
          this.gameService.bombsUnMarked+=1;
        }
      }

     }
     else  //If Not Marked
     {
        if(this.gameService.flagsLeft>0)
        {

          this.gameField[n][m].flagged=true;
      
          //Draw Flag;
  
          this.ctx.fillStyle = 'yellow';
          //console.log("Drawing Flag at:"+m+","+m);
          this.ctx.fillRect((n)*this.Scale, (m)*this.Scale,this.Scale-2, this.Scale-2)

          this.gameService.flagsLeft-=1;

          if(this.gameField[n][m].value==10) //If this Field is Bomb
          {        
          this.gameService.bombsUnMarked-=1;
          }
        }
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

export enum ClickActionType {
  OpenCell = 1,
  MarkCell,
}
