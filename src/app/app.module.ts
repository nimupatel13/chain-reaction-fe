import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MaterialModule } from "./material/material.module";
import { HttpClientModule } from "@angular/common/http";
import { DialogOverviewExampleDialog } from "./app.component";
import { DialogQueryExampleDialog } from "./app.component";
import { ClipboardModule } from "ngx-clipboard";
import { GameBoardComponent } from "./game-board/game-board.component";
import { HomeComponent } from "./home/home.component";
import { WebsocketService } from "./_services/websocket.service";
import { FormsModule } from "@angular/forms";
import { GameService } from "./_services/game.service";

@NgModule({
  declarations: [
    AppComponent,
    DialogOverviewExampleDialog,
    DialogQueryExampleDialog,
    GameBoardComponent,
    HomeComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    HttpClientModule,
    FormsModule,
    ClipboardModule,
  ],
  entryComponents: [DialogOverviewExampleDialog, DialogQueryExampleDialog],
  providers: [WebsocketService, GameService],
  bootstrap: [AppComponent],
})
export class AppModule {}
