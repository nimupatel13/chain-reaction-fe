import { Component, OnInit } from "@angular/core";
import { webSocket, WebSocketSubject } from "rxjs/webSocket";
import p5 from "p5";
import { GameService } from "../_services/game.service";
import { MatDialog } from "@angular/material";
import { WinnerDialog } from "../app.component";
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
  constructor(private dialog: MatDialog) {
    let user = sessionStorage.getItem("user");
    let color = sessionStorage.getItem("color");
    let room = sessionStorage.getItem("roomname");
    this.ws = new WebSocketSubject(
      "ws://localhost:8080/play?username=" + user + "&roomname=" + room
    );

    this.ws.subscribe(
      (message) => {
        console.log("Msg from server...", message);
        this.renderBoard(message);
      },
      (err) => console.log("Error from server...", err)
    );
  }
  map = new Map();
  renderBoard(message) {
    let user = sessionStorage.getItem("user");
    console.log(message.msg_type);
    this.map.set(message.msg_type, message);
    if (this.map.size == 2) {
      let move = this.map.get(1);
      let board = this.map.get(2).new_board;
      this.currTurn = this.map.get(2).new_currturn;
      console.log(board, board.length);
      for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[i].length; j++) {
          this.cnt[i * this.cols + j] = board[i][j].dot_count;
          this.color[i * this.cols + j] = board[i][j].color;
        }
      }
    }
    if (this.map.size == 3) {
      let winner = this.map.get(3).winner;
      const dialogRef = this.dialog.open(WinnerDialog, {
        width: "500px",
        data: { name: winner["UserName"] + " won" },
      });
    }
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

  ngOnInit() {
    // this.color = sessionStorage.getItem("color");
    this.cols = +sessionStorage.getItem("dimension");
    this.rows = +sessionStorage.getItem("dimension");
    this.grid = [];
    this.currTurn = sessionStorage.getItem("currUser");
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
    let color = sessionStorage.getItem("color");
    let row = Math.floor(i / this.cols);
    let col = i % this.cols;
    // console.log(i, i * row + col)
    console.log(
      JSON.stringify({ xpos: row, ypos: col, player_username: user })
    );
    console.log(this.currTurn);
    if (
      this.currTurn === user &&
      (color === this.color[i] ||
        this.color[i] === "" ||
        this.color[i] === undefined)
    )
      this.ws.next({ xpos: row, ypos: col, player_username: user });
    // if (row == 0 || col == 0 || row == this.rows - 1 || col == this.cols - 1) {
    //   if (
    //     (row == 0 && col == 0) ||
    //     (row == 0 && col == this.cols - 1) ||
    //     (row == this.rows - 1 && col == 0) ||
    //     (row == this.rows - 1 && col == this.cols - 1)
    //   ) {
    //     this.cnt[i] = this.cnt[i] ^ 1;
    //     this.grid[row][col] = this.cnt[i];
    //   } else {
    //     if (this.cnt[i] != 2) {
    //       this.cnt[i]++;
    //       this.grid[row][col] = this.cnt[i];
    //     } else {
    //       this.cnt[i] = 0;
    //       this.grid[row][col] = 0;
    //     }
    //   }
    // } else {
    //   if (this.cnt[i] != 3) {
    //     this.cnt[i]++;
    //     this.grid[row][col] = this.cnt[i];
    //   } else {
    //     this.cnt[i] = 0;
    //     this.grid[row][col] = 0;
    //   }
    // }
  }
}
