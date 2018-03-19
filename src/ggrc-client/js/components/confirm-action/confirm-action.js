/*
    Copyright (C) 2018 Google Inc.
    Licensed under http://www.apache.org/licenses/LICENSE-2.0 <see LICENSE file>
*/

import template from './confirm-action.mustache';

const DEFAULT_CONFIRM_PHRASE = 'I confirm';

export default can.Component.extend({
  tag: 'confirm-action',
  template,
  viewModel: {
    define: {
      isValid: {
        get() {
          return this.attr('value') === this.attr('confirmPhrase');
        },
      },
    },
    value: '',
    confirmPhrase: DEFAULT_CONFIRM_PHRASE,
    buttonTitle: 'Confirm',
    submit() {
      if (this.attr('isValid')) {
        this.dispatch('onConfirm');
      }
    },
  },
});
