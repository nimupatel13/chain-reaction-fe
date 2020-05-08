import { Component, OnInit } from "@angular/core";
import { webSocket, WebSocketSubject } from "rxjs/webSocket";
import p5 from "p5";
import { GameService } from "../_services/game.service";
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
})
export class GameBoardComponent implements OnInit {
  private ws: WebSocketSubject<any>;
  constructor() {
    let user = sessionStorage.getItem("user");
    let color = sessionStorage.getItem("color");
    let room = sessionStorage.getItem("roomname");
    this.ws = new WebSocketSubject(
      "ws://localhost:8080/play?username=" + user + "&roomname=" + room
    );

    this.ws.subscribe(
      (message) => console.log("Msg from server...", message),
      (err) => console.log("Error from server...", err)
    );
  }
  canvas: any;
  width = 400;
  height = 400;
  grid: number[][];
  cnt: number[] = [];
  cols = 8;
  rows = 9;
  color: string;
  ngOnInit() {
    this.color = sessionStorage.getItem("color");
    this.grid = [];
    let idx = 0;
    for (let i = 0; i < this.rows; i++) {
      this.grid[i] = [];
      for (let j = 0; j < this.cols; j++) {
        this.grid[i][j] = 0;
        this.cnt[i * this.cols + j] = 0;
      }
    }
    // console.log(this.cnt.length + this.grid[0].length);
  }
  check(i) {
    let user = sessionStorage.getItem("user");
    let row = Math.floor(i / this.cols);
    let col = i % this.cols;
    // console.log(i, i * row + col)
    console.log(
      JSON.stringify({ xpos: row, ypos: col, player_username: user })
    );
    this.ws.next(
      JSON.stringify({ xpos: row, ypos: col, player_username: user })
    );
    if (row == 0 || col == 0 || row == this.rows - 1 || col == this.cols - 1) {
      if (
        (row == 0 && col == 0) ||
        (row == 0 && col == this.cols - 1) ||
        (row == this.rows - 1 && col == 0) ||
        (row == this.rows - 1 && col == this.cols - 1)
      ) {
        this.cnt[i] = this.cnt[i] ^ 1;
        this.grid[row][col] = this.cnt[i];
      } else {
        if (this.cnt[i] != 2) {
          this.cnt[i]++;
          this.grid[row][col] = this.cnt[i];
        } else {
          this.cnt[i] = 0;
          this.grid[row][col] = 0;
        }
      }
    } else {
      if (this.cnt[i] != 3) {
        this.cnt[i]++;
        this.grid[row][col] = this.cnt[i];
      } else {
        this.cnt[i] = 0;
        this.grid[row][col] = 0;
      }
    }
  }
}
