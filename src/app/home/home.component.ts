import { Component, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { MatDialog } from "@angular/material";
import {
  DialogOverviewExampleDialog,
  DialogQueryExampleDialog,
  CreateGame,
} from "src/app/app.component";
import * as Rx from "rxjs";
import { share } from "rxjs/operators";
import { WebsocketService } from "../_services/websocket.service";
import { Session } from "protractor";
import { Router } from "@angular/router";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"],
})
export class HomeComponent implements OnInit {
  // constructor() { }

  ngOnInit() {
    sessionStorage.clear();
  }

  constructor(
    private http: HttpClient,
    private dialog: MatDialog,
    private web: WebsocketService,
    private router: Router
  ) {}

  openDialog(): void {
    const dialogRef = this.dialog.open(CreateGame, {
      width: "500px",
    });
    dialogRef.afterClosed().subscribe((res) => {
      console.log("Dimension...", res);
      sessionStorage.setItem("dimension", res.dimension);
      let result = { username: res.username, roomname: res.roomname };
      this.getCurrentBoard(result).then((res) => {
        sessionStorage.setItem("user", result.username);
        sessionStorage.setItem("roomname", result.roomname);
        this.router.navigate(["board"]);
      });
    });
  }

  joinGame() {
    console.log("till here");
    const dialogRef = this.dialog.open(DialogQueryExampleDialog, {
      width: "500px",
    });

    dialogRef.afterClosed().subscribe((result) => {
      // console.log(result);
      this.getCurrentBoard(result).then((res) => {
        sessionStorage.setItem("user", result.username);
        sessionStorage.setItem("roomname", result.roomname);
        this.router.navigate(["board"]);
      });
    });
  }

  getCurrentBoard(result) {
    var promise = new Promise((resolve, reject) => {
      this.http
        .get(
          "http://localhost:8080/games/" +
            result.roomname +
            "/join?" +
            "&username=" +
            result.username
        )
        .subscribe(
          (res) => {
            console.log(res);
            let idx = res["game_instance"]["current_turn"];
            // console.log(res["game instance"]["AllPlayers"][idx]["UserName"]);
            sessionStorage.setItem("currUser", result.username);
            sessionStorage.setItem("color", res["user"]["color"]);
            sessionStorage.setItem(
              "dimension",
              res["game_instance"]["dimension"]
            );
            sessionStorage.setItem(
              "currTurn",
              res["game_instance"]["all_players"][0]["username"]
            );
            sessionStorage.setItem(
              "currColor",
              res["game_instance"]["all_players"][idx]["color"]
            );
            resolve(res);
          },
          (err) => {
            console.log("Error joining game " + err);
            reject(err);
          }
        );
    });
    return promise;
  }
}
