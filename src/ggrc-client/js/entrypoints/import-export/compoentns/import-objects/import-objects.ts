import {
    Component,
    OnInit,
    Inject,
} from '@angular/core';
import {MatDialog} from '@angular/material';
import {DownloadImportTemplatesDialogComponent} from '../download-import-templates/download-import-templates';

@Component({
    selector: 'import-objects',
    styleUrls: ['./import-objects.css'],
    templateUrl: './import-objects.html',
})
export class ImportObjectsComponent{
    constructor(public dialog: MatDialog) {}

    // ngOnInit() {
    //
    // }

    openDownloadTemplatesDialog(): void {
        const dialogRef = this.dialog.open(DownloadImportTemplatesDialogComponent, {
            width: '350px'
        });

        console.log('Open');
    }
}
