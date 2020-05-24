import { Component, OnInit } from "@angular/core";
import { webSocket, WebSocketSubject } from "rxjs/webSocket";
import p5 from "p5";
import { GameService } from "../_services/game.service";
import { MatDialog } from "@angular/material";
import { WinnerDialog } from "../app.component";
import { resolve } from "url";
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
    trigger("heroState", [
      state(
        "black",
        style({
          background: "lightblue",
        })
      ),
      state(
        "green",
        style({
          background: "red",
        })
      ),
      transition("black => green", animate("500ms steps(5)")),
      transition("green => black", animate("500ms steps(5)")),
    ]),
  ],
})
export class GameBoardComponent implements OnInit {
  private ws: WebSocketSubject<any>;
  constructor(private dialog: MatDialog) {
    // let user = sessionStorage.getItem("user");
    // let color = sessionStorage.getItem("color");
    // let room = sessionStorage.getItem("roomname");
    // this.ws = new WebSocketSubject(
    //   "ws://localhost:8080/play?username=" + user + "&roomname=" + room
    // );
    // this.ws.subscribe(
    //   (message) => {
    //     console.log("Msg from server...", message);
    //     this.renderBoard(message);
    //   },
    //   (err) => console.log("Error from server...", err)
    // );
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
  color: string[][] = [];
  currTurn: string;

  ngOnInit() {
    // this.color = sessionStorage.getItem("color");
    // this.cols = +sessionStorage.getItem("dimension");
    // this.rows = +sessionStorage.getItem("dimension");
    this.cols = 8;
    this.rows = 8;
    this.grid = [];
    this.currTurn = sessionStorage.getItem("currUser");
    let idx = 0;
    for (let i = 0; i < this.rows; i++) {
      this.grid[i] = [];
      this.color[i] = new Array(this.cols);
      this.heroState[i] = [];
      for (let j = 0; j < this.cols; j++) {
        this.grid[i][j] = 0;
        this.cnt[i * this.cols + j] = 0;
        this.color[i][j] = "lightblue";
        this.heroState[i][j] = "black";
      }
    }
    // console.log(this.cnt.length + this.grid[0].length);
  }
  blackState: boolean = true;
  greenState: boolean = false;
  heroState: string[][] = [];
  check(i, j) {
    this.blackState = !this.blackState;
    this.greenState = !this.greenState;
    this.heroState[i][j] = "green";
    let user = sessionStorage.getItem("user");
    let color = sessionStorage.getItem("color");
    let row = Math.floor(i / this.cols);
    let col = i % this.cols;
    // console.log(i, i * row + col)
    console.log(i, j);
    // console.log(
    //   JSON.stringify({ xpos: row, ypos: col, player_username: user })
    // );
    this.render(i, j);
    this.simulate();

    // console.log(this.currTurn);
    // if (
    //   this.currTurn === user &&
    //   (color === this.color[i] ||
    //     this.color[i] === "" ||
    //     this.color[i] === undefined)
    // )
    //   this.ws.next({ xpos: row, ypos: col, player_username: user });
  }
  async simulate() {
    while (this.queue.length > 0) {
      let next = this.queue.shift();
      await this.render(next.row, next.col);
    }
  }
  queue = [];
  async render(row, col) {
    let dimension = 7;
    if (
      (row == 0 && col == 0) ||
      (row == dimension && col == dimension) ||
      (row == 0 && col == dimension) ||
      (row == dimension && col == 0)
    ) {
      if (this.grid[row][col] == 1) {
        this.grid[row][col] = 0;
        this.color[row][col] = "lightblue";
        this.heroState[row][col] = "black";
        await this.pushToQueue(row, col, dimension);
      } else {
        this.grid[row][col]++;
        this.color[row][col] = "red";
        this.heroState[row][col] = "green";
        // console.log(this.grid[0][0]);
      }
    } else if (row == 0 || row == dimension || col == 0 || col == dimension) {
      if (this.grid[row][col] == 2) {
        this.grid[row][col] = 0;
        this.color[row][col] = "lightblue";
        this.heroState[row][col] = "black";
        await this.pushToQueue(row, col, dimension);
      } else {
        this.grid[row][col]++;
        this.color[row][col] = "red";
        this.heroState[row][col] = "green";
      }
    } else {
      if (this.grid[row][col] == 3) {
        this.grid[row][col] = 0;
        this.color[row][col] = "lightblue";
        this.heroState[row][col] = "black";
        await this.pushToQueue(row, col, dimension);
      } else {
        this.grid[row][col]++;
        this.color[row][col] = "red";
        this.heroState[row][col] = "green";
      }
    }
  }
  async pushToQueue(row, col, dimension) {
    let promise = new Promise((resolve) => {
      let cnt = 0;
      if (row - 1 >= 0) {
        cnt++;
        this.queue.push({ row: row - 1, col: col });
      }
      if (col - 1 >= 0) {
        cnt++;
        this.queue.push({ row: row, col: col - 1 });
      }
      if (col + 1 <= dimension) {
        cnt++;
        this.queue.push({ row: row, col: col + 1 });
      }
      if (row + 1 <= dimension) {
        cnt++;
        this.queue.push({ row: row + 1, col: col });
      }
      setTimeout(() => {
        resolve();
      }, cnt * 200);
    });
    return promise;
  }
}
