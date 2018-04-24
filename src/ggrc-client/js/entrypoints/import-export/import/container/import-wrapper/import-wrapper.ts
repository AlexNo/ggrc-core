import {
  Component,
  ChangeDetectionStrategy,
  OnInit,
} from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromRoot from '../../reducers';
import * as history from '../../actions/history.actions';

import { Observable } from 'rxjs/Observable';
import {ImportExportJob} from "../../../models/ImportExportJob";

@Component({
  selector: 'import-wrapper',
  // changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./import-wrapper.css'],
  templateUrl: './import-wrapper.html',
})
export class ImportWrapperComponent implements OnInit {
  history$: Observable<ImportExportJob[]>;
  currentJob$: Observable<ImportExportJob>;

  constructor(public store: Store<fromRoot.State>) {
    this.history$ = store.select(fromRoot.getFinishedJobs);
    this.currentJob$ = store.select(fromRoot.getCurrentJob);
  }

  ngOnInit () {
    this.store.dispatch(new history.LoadHistoryAction());
  }
}
