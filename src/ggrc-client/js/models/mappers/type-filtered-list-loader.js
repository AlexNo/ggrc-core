/*
 Copyright (C) 2018 Google Inc.
 Licensed under http://www.apache.org/licenses/LICENSE-2.0 <see LICENSE file>
 */

GGRC.ListLoaders.StubFilteredListLoader(
  'GGRC.ListLoaders.TypeFilteredListLoader', {}, {
    init: function (source, modelNames) {
      let filterFn = function (result) {
        let i;
        let modelName;
        for (i = 0; i < modelNames.length; i++) {
          modelName = modelNames[i];
          if (typeof modelName !== 'string')
            modelName = modelName.shortName;
          if (result.instance.constructor &&
            result.instance.constructor.shortName === modelName)
            return true;
        }
        return false;
      };

      this._super(source, filterFn);
    },
  });
