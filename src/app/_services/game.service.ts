import { Injectable } from "@angular/core";
import { WebsocketService } from "./websocket.service";
import { Observable, Subject } from "rxjs";
import { webSocket, WebSocketSubject } from "rxjs/webSocket";

@Injectable({
  providedIn: "root",
})
export class GameService {
  user = sessionStorage.getItem("user");
  color = sessionStorage.getItem("color");
  room = sessionStorage.getItem("roomname");

  ws: WebSocketSubject<any>;
  // ws: WebSocketSubject<any> = webSocket("wss://echo.websocket.org");
  constructor() {
    this.ws = webSocket(
      "ws://localhost:8080/play?username=" +
        this.user +
        "&roomname=" +
        this.room
    );
    // this.ws = webSocket("wss://echo.websocket.org");
    console.log(this.ws.isStopped);
  }
}
