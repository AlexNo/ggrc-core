import {
  Component,
  OnInit,
  Inject,
} from '@angular/core';
import {MatDialog} from '@angular/material';
import {DownloadImportTemplatesDialogComponent} from '../download-import-templates/download-import-templates';
import {GApiClientService} from '../../../gdrive/services/gapi-client';

declare var GGRC: any;

@Component({
  selector: 'import-objects',
  styleUrls: ['./import-objects.css'],
  templateUrl: './import-objects.html',
})
export class ImportObjectsComponent implements OnInit {
  constructor(public dialog: MatDialog, public gclient: GApiClientService) {
  }

  ngOnInit() {

  }

  openDownloadTemplatesDialog(): void {
    const dialogRef = this.dialog.open(DownloadImportTemplatesDialogComponent, {
      height: '350px'
    });

    console.log('Open');
  }

  selectFile(): void {
    let allowedTypes = ['text/csv', 'application/vnd.google-apps.document',
      'application/vnd.google-apps.spreadsheet'];

    this.gclient
      .authorizeGapi(['https://www.googleapis.com/auth/drive'])
      .then(() => {
        gapi.load('picker', {
          callback() {
            let docsUploadView;
            let docsView;
            let pickerBuilder = new google.picker.PickerBuilder()
              .setOAuthToken(gapi.auth.getToken().access_token)
              .setDeveloperKey(GGRC.config.GAPI_KEY)
              .setSelectableMimeTypes(allowedTypes.join(','))
              .setCallback((data: any) => {
                let file;
                let PICKED = google.picker.Action.PICKED;
                let ACTION = google.picker.Response.ACTION;
                let DOCUMENTS = google.picker.Response.DOCUMENTS;

                if (data[ACTION] === PICKED) {
                  file = data[DOCUMENTS][0];

                  console.log(file);
                }
              });

            docsUploadView = new google.picker.DocsUploadView();
            docsView = new google.picker.DocsView();

            pickerBuilder.addView(docsUploadView)
              .addView(docsView)
              .build()
              .setVisible(true);
          },
        });
      });
  }
}
