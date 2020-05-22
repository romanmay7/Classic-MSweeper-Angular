import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GameScreenComponent } from './components/game-screen/game-screen.component';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { HttpClientModule } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { DeviceDetectorModule } from 'ngx-device-detector';
import { HighscoresListComponent } from './components/highscores-list/highscores-list.component';
import { TitleScreenComponent } from './components/title-screen/title-screen.component';
import { FooterComponent } from './footer/footer.component';


@NgModule({
  declarations: [
    AppComponent,
    GameScreenComponent,
    NavBarComponent,
    HighscoresListComponent,
    TitleScreenComponent,
    FooterComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    DeviceDetectorModule.forRoot(),
    HttpClientModule
  ],
  providers: [DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
