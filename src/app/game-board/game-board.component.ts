import { Component, OnInit } from "@angular/core";
import { webSocket, WebSocketSubject } from "rxjs/webSocket";
import p5 from "p5";
import { GameService } from "../_services/game.service";
import { MatDialog } from "@angular/material";
import { WinnerDialog } from "../app.component";
import {
  trigger,
  state,
  style,
  transition,
  animate,
} from "@angular/animations";
import { resolve } from "url";
import { Router } from "@angular/router";
// const user = sessionStorage.getItem("user");
// const color = sessionStorage.getItem("color");
// const room = sessionStorage.getItem("roomname");
// console.log(user, color, room);
// const ws = webSocket(
//   "ws://localhost:8080/play?username=" + user + "&roomname=" + room
// );
@Component({
  selector: "app-game-board",
  templateUrl: "./game-board.component.html",
  styleUrls: ["./game-board.component.scss"],
  animations: [
    trigger("colorState", [
      state(
        "black",
        style({
          background: "lightblue",
        })
      ),
      state(
        "#FF1744",
        style({
          background: "#FF1744",
        })
      ),
      state(
        "#3D5AFE",
        style({
          background: "#3D5AFE",
        })
      ),
      state(
        "#37474F",
        style({
          background: "#37474F",
        })
      ),
      state(
        "#00E5FF",
        style({
          background: "#00E5FF",
        })
      ),
      state(
        "#1DE9B6",
        style({
          background: "#1DE9B6",
        })
      ),
      state(
        "#00E676",
        style({
          background: "#00E676",
        })
      ),
      state(
        "#FFEA00",
        style({
          background: "#FFEA00",
        })
      ),
      state(
        "#FF9100",
        style({
          background: "#FF9100",
        })
      ),
      transition("* => *", animate("300ms steps(3)")),
    ]),
  ],
})
export class GameBoardComponent implements OnInit {
  private ws: WebSocketSubject<any>;

  setupWebSocket() {
    let user = sessionStorage.getItem("user");
    let color = sessionStorage.getItem("color");
    this.room = sessionStorage.getItem("roomname");
    this.ws = new WebSocketSubject(
      "ws://localhost:8080/games/" + this.room + "/play?username=" + user
    );

    this.ws.subscribe(
      (message) => {
        // console.log("Msg from server...", message);
        this.renderBoard(message);
      },
      (err) => console.log("Error from server...", err)
    );

    if (this.ws.isStopped) {
      this.setupWebSocket();
    }
  }
  constructor(private dialog: MatDialog, private router: Router) {
    this.setupWebSocket();
  }
  map = new Map();
  room: string;
  async renderBoard(message) {
    console.log(message);
    if (message.msg_type == 2) {
      for (let i = 0; i < message.states.length; i += 3) {
        if (message.states[i] == -1) {
          console.log("Done updating...");
          await this.updateBoard();
          i -= 2;
        } else {
          let obj = {};
          obj["row"] = message.states[i];
          obj["col"] = message.states[i + 1];
          obj["color"] = message.states[i + 2] == 0 ? "black" : message.color;
          obj["count"] = message.states[i + 2];
          this.queue.push(obj);
        }
      }
      this.updateBoard();
      this.currTurn = message.new_currturn;
      this.currColor = message.new_curr_color;
    }
    if (message.msg_type == 3) {
      let dialogRef = this.dialog.open(WinnerDialog, {
        width: "500px",
        data: { name: message.user_name + " won" },
      });

      dialogRef.afterClosed().subscribe(() => this.router.navigate(["home"]));
    }
  }
  currColor: string = "black";
  queue = [];
  canvas: any;
  width = 400;
  height = 400;
  grid: number[][];
  cnt: number[] = [];
  cols: number;
  rows: number;
  color: string[] = [];
  currTurn: string;
  user: string;
  colorState: string[][] = [];
  ngOnInit() {
    // this.color = sessionStorage.getItem("color");
    this.cols = +sessionStorage.getItem("dimension");
    this.rows = +sessionStorage.getItem("dimension");
    this.grid = [];
    this.user = sessionStorage.getItem("currUser");
    this.currTurn = sessionStorage.getItem("currTurn");
    this.currColor = sessionStorage.getItem("currColor");
    let idx = 0;
    for (let i = 0; i < this.rows; i++) {
      this.grid[i] = [];
      this.colorState[i] = [];
      for (let j = 0; j < this.cols; j++) {
        this.grid[i][j] = 0;
        this.cnt[i * this.cols + j] = 0;
        this.colorState[i][j] = "black";
      }
    }
    // console.log(this.cnt.length + this.grid[0].length);
  }
  check(i, j) {
    let color = sessionStorage.getItem("color");
    console.log({ xpos: i, ypos: j, player_username: this.currTurn });
    if (
      this.user === this.currTurn &&
      (color === this.colorState[i][j] || this.colorState[i][j] === "black")
    ) {
      this.ws.next({ xpos: i, ypos: j, player_username: this.currTurn });
      console.log("msg sent to server...");
    }
  }
  updateBoard() {
    var promise = new Promise((resolve) => {
      while (this.queue.length > 0) {
        let move = this.queue.shift();
        this.grid[move.row][move.col] = move.count;
        this.colorState[move.row][move.col] = move.color;
      }
      setTimeout(() => {
        this.playaudio();
        resolve();
      }, 300);
    });
    return promise;
  }

  playaudio() {
    let audio = new Audio();
    audio.src = "../../assets/Explosion+1.wav";
    audio.load();
    audio.play();
  }
}
