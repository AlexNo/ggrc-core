/*!
   Copyright (C) 2017 Google Inc.
   Licensed under http://www.apache.org/licenses/LICENSE-2.0 <see LICENSE file>
*/

import './permission.js';
import './bootstrap/sticky-popover.js';
import './bootstrap/modal-ajax.js';
import './bootstrap/modal-form.js';
import './plugins/lodash_helpers.js';
import './plugins/persistent_notifier.js';
import './ggrc_base.js';
import './apps/base_widgets.js';
import './application.js';
import './plugins/ggrc_utils.js';
import './plugins/utils/advanced-search-utils.js';
import './plugins/utils/ca-utils.js';
import './plugins/utils/query-api-utils.js';
import './plugins/utils/current-page-utils.js';
import './plugins/utils/state-utils.js';
import './plugins/utils/ggrcq-utils.js';
import './plugins/utils/tree-view-utils.js';
import './plugins/utils/dashboards-utils.js';
import './plugins/datepicker.js';
import './plugins/can_control.js';
import './plugins/autocomplete.js';
import './plugins/ajax_extensions.js';
import './plugins/canjs_extensions.js';
import './plugins/component_registry.js';
import './plugins/openclose.js';
import './plugins/tooltip.js';
import './plugins/popover.js';
import './plugins/popover_template.js';
import './mustache_helper.js';
import './generated/ggrc_filter_query_parser.js';

// Models
import './models';

// ViewModels
import './components/view-models/advanced-search-container-vm';
import './components/view-models/tree-item-base-vm';
import './components/view-models/tree-people-base-vm';
import './components/base-objects/pagination';

// Controllers
import './controllers/filterable_controller';
import './controllers/dashboard_widgets_controller';
import './controllers/info_widget_controller';
import './controllers/summary_widget_controller';
import './controllers/dashboard_widget_controller';
import './controllers/modals_controller';
import './controllers/archive_modal_controller';
import './controllers/delete_modal_controller';
import './controllers/help_controller';
import './controllers/quick_search_controller';
import './controllers/recently_viewed_controller';
import './controllers/tree/tree-loader';
import './controllers/tree/tree-view';
import './controllers/tree/tree-view-node';
import './controllers/tree/list_view_controller';
import './controllers/unmap_modal_controller';
import './controllers/info_pin_controller';
import './controllers/automapper_controller';
import './controllers/dashboard_controller';
import './controllers/quick_form_controller';
import './controllers/mapper';

// Helpers
import './helpers/mapping_helpers';

// Modules and Apps
import './modules/widget_descriptor';
import './modules/widget_list';
import './pbc/workflow_controller';
import './apps/quick_search';
import './apps/business_objects';
import './apps/custom_attributes';

// Components
import './components/advanced-search/advanced-search-filter-container';
import './components/advanced-search/advanced-search-filter-attribute';
import './components/advanced-search/advanced-search-filter-group';
import './components/advanced-search/advanced-search-filter-operator';
import './components/advanced-search/advanced-search-filter-state';
import './components/advanced-search/advanced-search-mapping-container';
import './components/advanced-search/advanced-search-mapping-group';
import './components/advanced-search/advanced-search-mapping-criteria';
import './components/state-colors-map/state-colors-map';
import './components/spinner/spinner';
import './components/modal-connector';
import './components/collapsible-panel/collapsible-panel';
import './components/collapsible-panel/collapsible-panel-header';
import './components/collapsible-panel/collapsible-panel-body';
import './components/read-more/read-more';
import './components/assessment/urls-list';
import './components/assessment/custom-attributes';
import './components/assessment/inline';
import './components/comment/comment-add-form';
import './components/comment/comment-input';
import './components/comment/comment-add-button';
import './components/assessment/controls-toolbar/controls-toolbar';
import './components/object-list-item/business-object-list-item';
import './components/object-list-item/person-list-item';
import './components/object-list-item/comment-list-item';
import './components/object-list-item/document-object-list-item';
import './components/object-list-item/detailed-business-object-list-item';
import './components/object-popover/related-assessment-popover';
import './components/object-popover/object-popover';
import './components/mapped-objects/directly-mapped-objects';
import './components/mapped-objects/mapped-objects';
import './components/related-objects/related-audits';
import './components/related-objects/related-assessment-item';
import './components/related-objects/related-assessment-list';
import './components/related-objects/related-comments';
import './components/related-objects/related-controls-objectives';
import './components/related-objects/related-issues';
import './components/object-state-toolbar/object-state-toolbar';
import './components/object-list/object-list';
import './components/ca-object/ca-object';
import './components/form/form-validation-icon';
import './components/ca-object/ca-object-value-mapper';
import './components/ca-object/ca-object-modal-content';
import './components/related-objects/related-objects';
import './components/reusable-objects/reusable-objects-list';
import './components/reusable-objects/reusable-objects-item';
import './components/simple-modal/simple-modal';
import './components/simple-popover/simple-popover';
import './components/show-more/show-more';
import './components/show-related-assessments-button/show-related-assessments-button';
import './components/mapping-controls/mapping-type-selector';
import './components/dropdown/dropdown';
import './components/dropdown/multiselect-dropdown';
import './components/autocomplete/autocomplete';
import './components/datepicker/datepicker';
import './components/person/person';
import './components/inline_edit/inline';
import './components/inline_edit/inline_checkbox';
import './components/inline_edit/inline_dropdown';
import './components/inline_edit/inline_input';
import './components/inline_edit/inline_text';
import './components/inline_edit/inline_person';
import './components/inline_edit/inline_datepicker';
import './components/unarchive_link';
import './components/link_to_clipboard';
import './components/relevant_filters';
import './components/csv/export';
import './components/csv/import';
import './components/people_list';
import './components/mapped_tree_view';
import './components/reusable_objects';
import './components/assessment_generator';
import './components/paginate';
import './components/tabs/tab-container';
import './components/tabs/tab-panel';
import './components/assessment_attributes';
import './components/lazy_open_close';
import './components/revision-log/revision-log';
import './components/object-mapper/object-mapper';
import './components/object-generator/object-generator';
import './components/object-search/object-search';
import './components/unified-mapper/mapper-model';
import './components/unified-mapper/mapper-toolbar';
import './components/unified-mapper/mapper-filter';
import './components/unified-mapper/mapper-results';
import './components/unified-mapper/mapper-results-item';
import './components/unified-mapper/mapper-results-item-status';
import './components/unified-mapper/mapper-results-item-details';
import './components/unified-mapper/mapper-results-items-header';
import './components/unified-mapper/mapper-results-item-attrs';
import './components/unified-mapper/mapper-results-columns-configuration';
import './components/quick_form/quick_add';
import './components/quick_form/quick_update';
import './components/access_control_list/access_control_list';
import './components/assessment_templates/assessment_templates';
import './components/modal_wrappers/assessment_template_form';
import './components/modal_wrappers/checkboxes_to_list';
import './components/reminder';
import './components/rich_text/rich_text';
import './components/object_cloner/object_cloner';
import './components/tasks-counter/tasks-counter';
import './components/sort_by_sort_index/sort_by_sort_index';
import './components/tree_pagination/tree_pagination';
import './components/tree/tree-widget-container';
import './components/cycle-task-actions/cycle-task-actions';
import './components/view-object-buttons/view-object-buttons';
import './components/add-object-button/add-object-button';
import './components/add-issue-button/add-issue-button';
import './components/add-mapping-button/add-mapping-button';
import './components/effective-dates/effective-dates';
import './components/snapshotter/revisions-comparer';
import './components/snapshotter/scope-update';
import './components/info-pin-buttons/info-pin-buttons';
import './components/questions-link/questions-link';
import './components/textarea-array/textarea-array';
import './components/object-selection/object-selection';
import './components/object-selection/object-selection-item';
import './components/last-assessment-date/last-assessment-date';
import './components/tree/tree-no-results';
import './components/tree/tree-assignee-field';
import './components/tree/tree-people-list-field';
import './components/tree/tree-people-with-role-list-field';
import './components/page-header/page-header';
import './components/info-pane/info-pane-footer';
import './components/assessment/mapped-objects/mapped-control-related-objects';
import './components/assessment/mapped-objects/mapped-controls';
import './components/assessment/mapped-objects/mapped-related-information';
import './components/assessment/assessment-people';
import './components/assessment/mapped-objects/mapped-comments';
import './components/assessment/info-pane/info-pane';
import './components/auto-save-form/auto-save-form';
import './components/auto-save-form/auto-save-form-status';
import './components/auto-save-form/auto-save-form-actions';
import './components/auto-save-form/auto-save-form-field';
import './components/auto-save-form/auto-save-form-field-view';
import './components/auto-save-form/fields/text-form-field';
import './components/auto-save-form/fields/rich-text-form-field';
import './components/auto-save-form/fields/checkbox-form-field';
import './components/auto-save-form/fields/dropdown-form-field';
import './components/auto-save-form/fields/date-form-field';
import './components/auto-save-form/fields/person-form-field';
import './components/auto-save-form/field-views/text-form-field-view';
import './components/auto-save-form/field-views/rich-text-form-field-view';
import './components/auto-save-form/field-views/checkbox-form-field-view';
import './components/auto-save-form/field-views/date-form-field-view';
import './components/auto-save-form/field-views/person-form-field-view';
import './components/folder-attachments-list/folder-attachments-list';
import './components/action-toolbar/action-toolbar';
import './components/action-toolbar-control/action-toolbar-control';
import './components/unmap-button/unmap-button';
import './components/unmap-button/unmap-person-button';
import './components/object-list-item/editable-document-object-list-item';
import './components/related-objects/related-documents';
import './components/assessment/attach-button';
import './components/object-tasks/object-tasks';
import './components/mapped-counter/mapped-counter';
import './components/people/deletable-people-group';
import './components/people/editable-people-group';
import './components/related-objects/related-people-mapping';
import './components/related-objects/related-people-access-control';
import './components/related-objects/related-people-access-control-group';
import './components/custom-roles/custom-roles';
import './components/custom-roles/custom-roles-modal';

// Modules
import './modules';

// Bootstrap
import './apps/dashboard';
import './dashboard';
