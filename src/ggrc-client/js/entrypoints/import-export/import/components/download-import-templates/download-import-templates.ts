import {
  Component,
  OnInit,
} from '@angular/core';

import ImportableOption from '../../../models/importable-option';
import {ImportService} from '../../services/import.service';
import {ExportDetails, ExportDTO} from '../../../models/export-dto';

@Component({
  selector: 'download-import-templates',
  styleUrls: ['./download-import-templates.css'],
  templateUrl: './download-import-templates.html',
})
export class DownloadImportTemplatesDialogComponent implements OnInit {

  private selectedModels: string[];
  private importableOptions: ImportableOption[];

  constructor(private importService: ImportService) {
  }

  ngOnInit() {
    this.importService.getImportableOptions()
      .subscribe((options) => this.importableOptions = options);
  }

  downloadTemplates() {
    let objects: ExportDetails[] = this.selectedModels
      .map((model: string): ExportDetails => {
        return {
          object_name: model,
          fields: 'all',
        };
      });
    let exportData: ExportDTO = {
      export_to: 'csv',
      objects,
    };

    console.log(exportData);

    this.importService.exportRequest(exportData)
      .subscribe((csv: string): void => {
        console.log(csv);
      });
  }
}
