/*
    Copyright (C) 2018 Google Inc.
    Licensed under http://www.apache.org/licenses/LICENSE-2.0 <see LICENSE file>
*/

import '../../plugins/utils/controllers';
import {
  jobStatuses,
  analyseBeforeImport,
  startImport,
  getImportJobInfo,
  getImportHistory,
  downloadContent,
} from './import-export-utils';
import '../show-more/show-more';
import '../import-export/download-template/download-template';
import '../collapsible-panel/collapsible-panel';
import '../confirm-action/confirm-action';
import quickTips from './templates/quick-tips.mustache';
import template from './templates/csv-import.mustache';
import {
  backendGdriveClient,
  gapiClient,
} from '../../plugins/ggrc-gapi-client';
import errorTemplate from './templates/import-error.mustache';

const messages = {
  VALIDATION_ERROR: `Your file could not be imported due to
  the following errors that were found.`,
  IMPORT_IN_PROGRESS: `Your import request has been submitted. You may close 
  this page or continue your work. We will send you an email notification when 
  it completes or if there are errors or warnings.`,
  EMPTY_FILE: 'You are going to import: <span class="gray">0 rows</span>',
  PLEASE_CONFIRM: `Please type "I confirm" below to confirm that 
  data being imported is complete and accurate. Please note importing 
  incomplete or accurate data can result in data corruption.`,
  IN_PROGRESS: `Your import request has been submitted. 
  You may close this page or continue your work. We will send you an email 
  notification when it completes or if there are errors or warnings.`,
  ANALYSIS_FAILED: `Your file could not be imported due to the following errors 
  that were found. You can download your file, fix the errors 
  and try importing again.`,
  FILE_STATS: (objects) => {
    const stats = Object.keys(objects).map((model) => {
      return `${objects[model]} ${model}`;
    }).join(', ');
    return `You are going to import: <span class="gray">${stats}</span>
      <div>${messages.PLEASE_CONFIRM}</div>`;
  },
};

export default can.Component.extend({
  tag: 'csv-import',
  template: template,
  requestData: null,
  viewModel: {
    define: {
      isImportStopped: {
        get() {
          return [jobStatuses.BLOCKED, jobStatuses.ANALYSIS_FAILED]
            .includes(this.attr('state'));
        },
      },
    },
    importUrl: '/_service/import_csv',
    quickTips,
    importDetails: null,
    fileId: '',
    fileName: '',
    isLoading: false,
    state: 'Select',
    jobId: null,
    history: [],
    importStatus: '',
    message: '',
    helpUrl: GGRC.config.external_import_help_url,
    processLoadedInfo: function (data) {
      let rows = 0;
      let errorLevel = '';
      this.attr('importDetails', _.map(data, (element) => {
        element.data = [];

        rows += element.rows;
        if (element.block_warnings.length + element.row_warnings.length) {
          let messages = [...element.block_warnings, ...element.row_warnings];

          if (!errorLevel) {
            errorLevel = 'warning';
          }

          element.data.push({
            title: `WARNINGS (${messages.length})`,
            messages,
          });
        }
        if (element.block_errors.length + element.row_errors.length) {
          let messages = [...element.block_errors, ...element.row_errors];

          errorLevel = 'error';

          this.attr('message', messages.VALIDATION_ERROR);

          element.data.push({
            title: `ERRORS (${messages.length})`,
            messages,
          });
        }
        return element;
      }));

      if (!rows) {
        this.attr('importStatus', 'error');
        this.attr('message', messages.EMPTY_FILE);
      } else {
        this.attr('importStatus', errorLevel);
      }
    },
    resetFile: function () {
      this.attr({
        state: 'Select',
        fileId: '',
        fileName: '',
        importStatus: '',
        message: '',
        'import': null,
      });
    },
    analyseSelectedFile(file) {
      this.attr('isLoading', true);
      this.attr('fileId', file.id);
      this.attr('fileName', file.name);

      return backendGdriveClient.withAuth(()=> {
        return analyseBeforeImport(file.id);
      }, {responseJSON: {message: 'Unable to Authorize'}})
        .then((response) => {
          const counts = Object.values(response.objects);

          if (counts.some((number) => number > 0)) {
            this.attr('state', jobStatuses.CONFIRM);
            this.attr('message', messages.FILE_STATS(response.objects));
            this.attr('jobId', response.import_export.id);
          } else {
            this.attr('state', jobStatuses.SELECT);
            this.attr('importStatus', 'error');
            this.attr('message', messages.EMPTY_FILE);
          }
        }, (error) => {
          this.attr('state', jobStatuses.SELECT);
          this.attr('importStatus', 'error');

          if (error && error.responseJSON && error.responseJSON.message) {
            GGRC.Errors.notifier('error', error.responseJSON.message);
          } else {
            GGRC.Errors.notifier('error', errorTemplate, true);
          }
        });
    },
    onImportSubmit() {
      startImport(this.attr('jobId'))
        .then((info) => {
          this.attr('state', jobStatuses.IN_PROGRESS);
          this.attr('message', messages.IN_PROGRESS);
          this.trackStatusOfImport(info.id);
        });
    },
    trackStatusOfImport(jobId, timeout = 2000) {
      setTimeout(() => {
        getImportJobInfo(jobId)
          .then((info) => {
            info = info[0];

            if (info.status === jobStatuses.IN_PROGRESS ||
              info.status === jobStatuses.NOT_STARTED) {
              this.trackStatusOfImport(jobId, timeout * 2);
            } else if (info.status === jobStatuses.BLOCKED) {
              this.attr('message', '');
              this.attr('state', jobStatuses.BLOCKED);
              this.processLoadedInfo(JSON.parse(info.results));
            } else if (info.status === jobStatuses.ANALYSIS_FAILED) {
              this.attr('message', messages.ANALYSIS_FAILED);
              this.attr('state', jobStatuses.ANALYSIS_FAILED);
              this.processLoadedInfo(JSON.parse(info.results));
            } else if (info.status === jobStatuses.FINISHED) {
              this.attr('state', jobStatuses.SELECT);
              this.getImportHistory();
            }
          });
      }, timeout);
    },
    getImportHistory() {
      getImportHistory()
        .then((imports) => {
          let finished = imports.filter((jobInfo) => {
            return jobInfo.status === jobStatuses.FINISHED;
          });
          this.attr('history').replace(finished);
        }, () => {

        });
    },
    downloadImportContent() {

    },
    proceedWithWarnings() {

    },
    selectFile() {
      let that = this;
      let allowedTypes = ['text/csv', 'application/vnd.google-apps.document',
        'application/vnd.google-apps.spreadsheet'];

      this.resetFile();

      return gapiClient.authorizeGapi(['https://www.googleapis.com/auth/drive'])
        .then(() => {
          gapi.load('picker', {callback: createPicker});
        });

      function createPicker() {
        let dialog;
        let docsUploadView;
        let docsView;
        let picker = new google.picker.PickerBuilder()
          .setOAuthToken(gapi.auth.getToken().access_token)
          .setDeveloperKey(GGRC.config.GAPI_KEY)
          .setCallback(pickerCallback);

        docsUploadView = new google.picker.DocsUploadView();
        docsView = new google.picker.DocsView()
          .setMimeTypes(allowedTypes);

        picker.addView(docsUploadView)
          .addView(docsView);

        picker = picker.build();
        picker.setVisible(true);

        $('div.picker-dialog-bg').css('zIndex', 4000);

        dialog = GGRC.Utils.getPickerElement(picker);
        if (dialog) {
          dialog.style.zIndex = 4001;
        }
      }

      function pickerCallback(data) {
        let file;
        let PICKED = google.picker.Action.PICKED;
        let ACTION = google.picker.Response.ACTION;
        let DOCUMENTS = google.picker.Response.DOCUMENTS;

        if (data[ACTION] === PICKED) {
          file = data[DOCUMENTS][0];

          if (file && _.any(allowedTypes, function (type) {
            return type === file.mimeType;
          })) {
            that.analyseSelectedFile(file);
          } else {
            that.attr('fileName', file.name);
            that.attr('importStatus', 'error');
            GGRC.Errors.notifier('error',
              'The file is not in a recognized format. ' +
              'Please import a Google sheet or a file in .csv format.');
          }
        }
      }
    },
  },
});
