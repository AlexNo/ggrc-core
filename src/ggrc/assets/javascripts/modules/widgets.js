/*!
    Copyright (C) 2017 Google Inc.
    Licensed under http://www.apache.org/licenses/LICENSE-2.0 <see LICENSE file>
*/

export function initWidgets() {
  // Ensure each extension has had a chance to initialize widgets
  can.each(GGRC.extensions, function (extension) {
    if (extension.init_widgets) {
      extension.init_widgets();
    }
  });
}
