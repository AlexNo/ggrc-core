/*!
  Copyright (C) 2017 Google Inc.
  Licensed under http://www.apache.org/licenses/LICENSE-2.0 <see LICENSE file>
*/

import {initWidgets} from '../modules/widgets';

(function ($, can, CMS, GGRC) {
  var $area = $('.area').first();
  var defaults;
  var extraPageOptions;
  var instance;
  var location = window.location.pathname;
  var isAssessmentsView;
  var isObjectBrowser;
  var modelName;
  var widgetList;
  var widgetModels;
  var pageUtils = GGRC.Utils.CurrentPage;

  extraPageOptions = {
    Program: {
      header_view: GGRC.mustache_path + '/base_objects/page_header.mustache',
      page_title: function (controller) {
        return 'GRC Program: ' + controller.options.instance.title;
      }
    },
    Person: {
      header_view: GGRC.mustache_path + '/base_objects/page_header.mustache',
      page_title: function (controller) {
        var instance = controller.options.instance;
        return /dashboard/.test(window.location) ?
          'GRC: My Work' :
          'GRC Profile: ' +
              (instance.name && instance.name.trim()) ||
              (instance.email && instance.email.trim());
      }
    }
  };

  isAssessmentsView = /^\/assessments_view/.test(location);
  isObjectBrowser = /^\/objectBrowser\/?$/.test(location);

  if (/^\/\w+\/\d+($|\?|\#)/.test(location) || /^\/dashboard/.test(location) ||
      isAssessmentsView || isObjectBrowser) {
    instance = GGRC.page_instance();
    modelName = instance.constructor.shortName;

    initWidgets();

    widgetList = pageUtils.getWidgetList(modelName, location);
    defaults = pageUtils.getDefaultWidgets(widgetList, location);
    widgetModels = pageUtils.getWidgetModels(modelName, location);

    if (!isAssessmentsView && pageUtils.getPageType() !== 'Workflow') {
      pageUtils.initCounts(widgetModels, instance.type, instance.id);
    }

    $area.cms_controllers_page_object(can.extend({
      widget_descriptors: widgetList,
      default_widgets: defaults || GGRC.default_widgets || [],
      instance: GGRC.page_instance(),
      header_view: GGRC.mustache_path + '/base_objects/page_header.mustache',
      GGRC: GGRC,  // make the global object available in Mustache templates
      page_title: function (controller) {
        return controller.options.instance.title;
      },
      page_help: function (controller) {
        return controller.options.instance.constructor.table_singular;
      },
      current_user: GGRC.current_user
    }, extraPageOptions[modelName]));
  } else if (/^\/import|export/i.test(location)) {
    initWidgets();
  } else {
    $area.cms_controllers_dashboard({
      widget_descriptors: GGRC.widget_descriptors,
      default_widgets: GGRC.default_widgets
    });
  }

  // We remove loading class
  $(window).on('load', function () {
    $('html').removeClass('no-js');
  });
})(window.can.$, window.can, window.CMS, window.GGRC);
