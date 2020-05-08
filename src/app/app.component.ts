import { Component, Inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";

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
  copyInputMessage(inputElement) {
    console.log("here " + inputElement);
    inputElement.select();
    document.execCommand("copy");
    inputElement.setSelectionRange(0, 0);
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
