import { Component, Inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { Router } from "@angular/router";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent {
  title = "chain-reaction-fe";
}
export interface DialogData {
  id: string;
  name: string;
}
@Component({
  selector: "dialog-overview-example-dialog",
  templateUrl: "dialog-overview-example-dialog.html",
})
export class DialogOverviewExampleDialog {
  constructor(
    public dialogRef: MatDialogRef<DialogOverviewExampleDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
  copy() {
    this.dialogRef.close();
  }
  copyInputMessage(inputElement) {
    console.log("here " + inputElement);
    inputElement.select();
    document.execCommand("copy");
    inputElement.setSelectionRange(0, 0);
  }
}
@Component({
  selector: "winnerDialog",
  templateUrl: "winnerDialog.html",
})
export class WinnerDialog {
  constructor(
    public dialogRef: MatDialogRef<DialogOverviewExampleDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  Ok() {
    this.dialogRef.close();
  }
}
@Component({
  selector: "dialog-query-example-dialog",
  templateUrl: "dialog-query-example-dialog.html",
})
export class DialogQueryExampleDialog {
  constructor(
    public dialogRef: MatDialogRef<DialogQueryExampleDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}
  roomname: string;
  username: string;
  color: string;
  onNoClick(): void {
    this.dialogRef.close();
  }
  JOIN() {
    // this.dialogRef.close();
    let joinObj = {};
    joinObj["roomname"] = this.roomname;
    joinObj["username"] = this.username;
    joinObj["color"] = this.color;
    console.log(joinObj);
    this.dialogRef.close(joinObj);
  }
}

@Component({
  selector: "createDialog",
  templateUrl: "createDialog.html",
})
export class CreateGame {
  constructor(
    public dialogRef: MatDialogRef<CreateGame>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private http: HttpClient,
    private dialog: MatDialog
  ) {}
  players: string;
  dimension: string;
  username: string;
  Create() {
    this.http
      .get(
        "http://localhost:8080/new?players_count=" +
          this.players +
          "&dimension=" +
          this.dimension
      )
      .subscribe(
        (res) => {
          console.log(res);
          const dialogBox = this.dialog.open(DialogOverviewExampleDialog, {
            width: "500px",
            data: { name: res["game_roomname"] },
          });
          this.dialogRef.close({
            dimension: this.dimension,
            username: this.username,
            roomname: res["game_roomname"],
          });
        },
        (err) => {
          console.log("Error creating game");
        }
      );
  }
}
