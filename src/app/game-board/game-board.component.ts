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
      transition("* <=> *", animate("500ms steps(5)")),
    ]),
  ],
})
export class GameBoardComponent implements OnInit {
  private ws: WebSocketSubject<any>;
  constructor(private dialog: MatDialog) {
    let user = sessionStorage.getItem("user");
    let color = sessionStorage.getItem("color");
    let room = sessionStorage.getItem("roomname");
    this.ws = new WebSocketSubject(
      "ws://localhost:8080/games/" + room + "/play?username=" + user
    );

    this.ws.subscribe(
      (message) => {
        // console.log("Msg from server...", message);
        this.renderBoard(message);
      },
      (err) => console.log("Error from server...", err)
    );
  }
  map = new Map();
  renderBoard(message) {
    console.log(message.states);
    for (let i = 0; i < message.states.length; i += 3) {
      if (message.states[i] == -1) {
        console.log("Done updating...");
      } else {
        this.updateBoard(
          message.states[i],
          message.states[i + 1],
          message.states[i + 2] == 0 ? "black" : message.color,
          message.states[i + 2]
        );
      }
    }
    this.currTurn = message.new_currturn;
  }
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
    console.log({ xpos: i, ypos: j, player_username: this.currTurn });
    if (this.user === this.currTurn)
      this.ws.next({ xpos: i, ypos: j, player_username: this.currTurn });
  }
  updateBoard(row, col, color, count) {
    this.grid[row][col] = count;
    this.colorState[row][col] = color;
  }
}
