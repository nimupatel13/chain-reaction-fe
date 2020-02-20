import { Component, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { MatDialog } from "@angular/material";
import {
  DialogOverviewExampleDialog,
  DialogQueryExampleDialog
} from "src/app/app.component";
import * as Rx from "rxjs";
import { share } from "rxjs/operators";
import { WebsocketService } from "src/app/websocket.service";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"]
})
export class HomeComponent implements OnInit {
  // constructor() { }

  ngOnInit() {}

  constructor(
    private http: HttpClient,
    private dialog: MatDialog,
    private web: WebsocketService
  ) {}

  createNew() {
    this.http
      .get("https://uparmar-lmzg.localhost.run/new?players_count=2")
      .subscribe(res => {
        console.log(res["Game Instance"]["InstanceID"]);
        confirm("Are you sure to delete " + res["Game Instance"]["InstanceID"]);
      });
  }

  openDialog(): void {
    this.http
      .get("https://uparmar-t655.localhost.run/new?players_count=2")
      .subscribe(res => {
        console.log(res["Game Instance"]["InstanceID"]);
        // confirm("Are you sure to delete " + res["Game Instance"]["InstanceID"]);
        const dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
          width: "500px",
          data: { name: res["Game Instance"]["InstanceID"], animal: "Harami" }
        });

        dialogRef.afterClosed().subscribe(result => {
          console.log("The dialog was closed");
          // this.animal = result;
        });
      });
  }

  getInstanceID() {
    const dialogRef = this.dialog.open(DialogQueryExampleDialog, {
      width: "500px"
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log("The dialog was closed " + result);
      // this.animal = result;
    });
  }

  joinGame() {
    this.getInstanceID();
    // this.web.connect(
    //   "wss://uparmar-t655.localhost.run/join?instance_id=51e97f7f-0b41-47a2-b1b7-839fb31b4ab2"
    // );
  }
  public messages: Rx.Subject<any>;
  private subject: Rx.Subject<any>;
  public ws: any;
  connect(url: string): Rx.Subject<any> {
    if (!this.subject) {
      this.subject = this.create(url);
    }
    console.log(this.subject);
    return this.subject;
  }

  private create(url: string): Rx.Subject<any> {
    this.ws = new WebSocket(url);
    const observable = Rx.Observable.create((obs: Rx.Observer<any>) => {
      this.ws.onmessage = obs.next.bind(obs);
      this.ws.onerror = obs.error.bind(obs);
      this.ws.onclose = obs.complete.bind(obs);
      return this.ws.close.bind(this.ws);
    }).share();

    const observer = {
      next: (data: Object) => {
        if (this.ws.readyState === WebSocket.OPEN) {
          this.ws.send(JSON.stringify(data));
        }
      }
    };
    return Rx.Subject.create(observer, observable);
  }
}
