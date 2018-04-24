import {
  Component,
  Input,
  EventEmitter,
  Output,
} from '@angular/core';

import {ImportExportJob} from '../../../models/ImportExportJob';

@Component({
  selector: 'import-history',
  styleUrls: ['./import-history.css'],
  templateUrl: 'import-history.component.html'
})

export class ImportHistoryComponent {
  @Input()
  history: ImportExportJob[];

  @Output()
  onRemove = new EventEmitter<number>();

  @Output()
  onDownload = new EventEmitter<ImportExportJob>();

  remove(id: number): void {
    this.onRemove.emit(id);
  }

  download(job: ImportExportJob): void {
    this.onDownload.emit(job);
  }
}