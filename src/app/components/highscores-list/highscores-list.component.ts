import { Component, OnInit } from '@angular/core';
import { GameService } from 'src/app/services/game.service';
import { HttpClient } from '@angular/common/http';
import { GameRecord } from 'src/app/data_models/gamerecord.model.ts';

@Component({
  selector: 'app-highscores-list',
  templateUrl: './highscores-list.component.html',
  styleUrls: ['./highscores-list.component.css']
})


export class HighscoresListComponent implements OnInit {

  headers=new Array("Rank","Name","Time","Date")
  highscores_list:GameRecord[];

  constructor(private gameService:GameService,private httpClient:HttpClient) { }

 async ngOnInit() {

  //this.loadDummyList(); //For Tests

    await this.gameService.loadHighScores();
    this.highscores_list=this.gameService.highscores;
  }


loadDummyList()
{

this.httpClient.get("assets/dummy-list.json").subscribe(data =>{
 // console.log(data);
  
  this.highscores_list = Object.values(data);
  this.highscores_list.sort((a, b) => (a.timeInSeconds > b.timeInSeconds) ? 1 : -1)

   console.log(this.highscores_list)
});
}

}
