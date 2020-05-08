import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { GameBoardComponent } from "./game-board/game-board.component";
import { HomeComponent } from "./home/home.component";

const routes: Routes = [
  { path: "board", component: GameBoardComponent },
  { path: "home", component: HomeComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
