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
       },1000)
   
    }

    convertSecondstoDate(sec:number)
    {
        var date = new Date(null);
        date.setSeconds(sec); // specify value for SECONDS here
        return  date.toISOString().substr(11, 8);
    }
   
   

}

