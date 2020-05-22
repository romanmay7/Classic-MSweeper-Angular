import { Injectable } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { GameRecord } from '../data_models/gamerecord.model.ts';
import { GlobalVariable } from 'src/global';


@Injectable({
  providedIn: 'root'
})
export class GameService 
{
    timeCounter: number = 0;
    interval;
    bombsAmount:number
    bombsUnMarked:number
    flagsLeft:number
    playerName:string="Anonymous";
    highscores:GameRecord[];

    currentAction:ClickActionType=ClickActionType.OpenCell;

    constructor(private router: Router,private http: HttpClient,public datepipe: DatePipe) 
    {

    }

    startNewGame()
    {
      if(typeof this.interval != 'undefined' )
      {
        clearInterval(this.interval);//resting timer
        this.timeCounter = 0;
      }
      //------------------------------------------
      this.bombsUnMarked=this.bombsAmount;
      this.flagsLeft=this.bombsAmount;

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
    gameOver()
    {
      this.stopGame();
      this.timeCounter=0;
      this.flagsLeft=this.bombsAmount;
      this.router.navigate(["/"])
    }
   
    async completeGame()
    {
      this.stopGame();
      
      //If Player's  Completion Time is less than longest 'Completion Time' in Top 10 Array
      //Send User's Game Record with Completion Time to 'HighScores API'
      if(this.timeCounter<this.highscores[9].timeInSeconds)
      {
          this.playerName = prompt("Please enter your name", "Anonymous");
          let date=Date.now();
          let current_date =this.datepipe.transform(date, 'dd/MM/yyyy');
      
          let currentGameRecord=new GameRecord(this.timeCounter,this.playerName,current_date.toString())
          await this.saveHighScore(currentGameRecord);
      }
      this.timeCounter=0;
      this.flagsLeft=this.bombsAmount;
      this.router.navigate(["/"])
      setTimeout(function(){ window.location.reload(); }, 500);

    }

    //---------------------------------------------------------------------------------------------------------------------------------
    async loadHighScores()
    {
      var data=await this.http.get<GameRecord[]>(GlobalVariable.BASE_API_URL+"api/HighScores/GetHighScoresList2",).toPromise();
      this.highscores = Object.values(data);
      this.highscores.sort((a, b) => (a.timeInSeconds > b.timeInSeconds) ? 1 : -1)
    }
   //---------------------------------------------------------------------------------------------------------------------------------
   //---------------------------------------------------------------------------------------------------------------------------------

   saveHighScore(record:GameRecord)
   {
    const headers= new HttpHeaders()
    .set('content-type', 'application/json')
    
    this.http.post<any>(GlobalVariable.BASE_API_URL+"api/HighScores/AddNewRecord2", JSON.stringify(record),{ 'headers': headers }).subscribe(data => {
      console.log("Your Record was saved on Server");


    })
   }
//-----------------------------------------------------------------------------------------------------------------------------------   
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

}

export enum ClickActionType {
  OpenCell = 1,
  MarkCell,
}