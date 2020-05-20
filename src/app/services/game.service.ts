import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class GameService 
{
    timeCounter: number = 0;
    interval;
    bombsUnMarked:number
    flagsLeft:number


    startNewGame()
    {
       this.interval = setInterval(() => {
         this.timeCounter++;
         if(this.bombsUnMarked==0)
          {
            this.completeGame();
          }
       },1000)
   
    }

     stopGame() {
      clearInterval(this.interval);
    }

    convertSecondstoDate(sec:number)
    {
        var date = new Date(null);
        date.setSeconds(sec); // specify value for SECONDS here
        return  date.toISOString().substr(11, 8);
    }
   
    completeGame()
    {
      this.stopGame();
      //todo:Write Logic to send User Data and Completion Time to 'HighScores API'
      //do it only in the case: his Completion Time is less than longest 'Completion Time' in Top 10 Array
    }
   

}

