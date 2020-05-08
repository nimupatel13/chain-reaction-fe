import { Component, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { MatDialog } from "@angular/material";
import {
  DialogOverviewExampleDialog,
  DialogQueryExampleDialog,
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

  createNew() {
    this.http
      .get("http://localhost:8080/new?players_count=2&dimension=4")
      .subscribe((res) => {
        console.log(res["Game Instance"]["InstanceID"]);
        confirm("Are you sure to delete " + res["Game Instance"]["InstanceID"]);
      });
  }

  openDialog(): void {
    this.http
      .get("http://localhost:8080/new?players_count=2&dimension=4")
      .subscribe((res) => {
        console.log(res["GameRoomName"]);
        // confirm("Are you sure to delete " + res["Game Instance"]["InstanceID"]);
        const dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
          width: "500px",
          data: { name: res["GameRoomName"], animal: "Harami" },
        });

        dialogRef.afterClosed().subscribe((result) => {
          console.log("The dialog was closed");
          // this.animal = result;
        });
      });
  }

  joinGame() {
    console.log("till here");
    const dialogRef = this.dialog.open(DialogQueryExampleDialog, {
      width: "500px",
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(result);
      this.getCurrentBoard(result).then((res) => {
        sessionStorage.setItem("user", result.username);
        sessionStorage.setItem("color", result.color);
        sessionStorage.setItem("roomname", result.roomname);
        this.router.navigate(["board"]);
      });
    });
  }

  getCurrentBoard(result) {
    var promise = new Promise((resolve, reject) => {
      console.log("here");
      this.http
        .get(
          "http://localhost:8080/join?roomname=" +
            result.roomname +
            "&username=" +
            result.username +
            "&color=" +
            result.color
        )
        .subscribe(
          (res) => {
            console.log(res);
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
