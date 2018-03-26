/*
  Copyright (C) 2018 Google Inc.
  Licensed under http://www.apache.org/licenses/LICENSE-2.0 <see LICENSE file>
*/

import template from './current-exports.mustache';

export default can.Component.extend({
  tag: 'current-exports',
  template,
  viewModel: {
    exports: [],
    inProgress: false,
    tryAgain(id) {

    },
    remove(id) {
      this.dispatch({
        type: 'removeItem',
        id,
      });
    },
    downloadCSV(id, fileName) {
      this.dispatch({
        type: 'viewContent',
        format: 'csv',
        fileName,
        id,
      });
    },
    openSheet(id) {
      this.dispatch({
        type: 'viewContent',
        format: 'gdrive',
        id,
      });
    },
  },
});
