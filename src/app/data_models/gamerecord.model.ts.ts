

export class GameRecord {

    timeInSeconds: number;
    playerName: string ;
    date: string ;

    constructor (_timeInSeconds: number,_playerName:string,_date:string) {
      this.timeInSeconds = _timeInSeconds;
      this.playerName=_playerName;
      this.date=_date;
  }
  }