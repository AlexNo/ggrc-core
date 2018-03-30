/*
    Copyright (C) 2018 Google Inc.
    Licensed under http://www.apache.org/licenses/LICENSE-2.0 <see LICENSE file>
*/

import template from './import-history.mustache';

export default can.Component.extend({
  tag: 'import-history',
  template,
  viewModel: {
    history: [],
    disabled: {},
    remove(id) {
      if (!this.attr(`disabled.${id}`)) {
        this.dispatch({
          type: 'removeItem',
          id,
        });
      }
      this.attr(`disabled.${id}`, true);
    },
    download(id, title) {
      this.dispatch({
        type: 'downloadCsv',
        id,
        title,
      });
    },
  },
});
