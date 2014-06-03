# Copyright (C) 2013 Google Inc., authors, and contributors <see AUTHORS file>
# Licensed under http://www.apache.org/licenses/LICENSE-2.0 <see LICENSE file>
# Created By: dan@reciprocitylabs.com
# Maintained By: dan@reciprocitylabs.com


from ggrc import db
from ggrc.models.associationproxy import association_proxy
from ggrc.models.mixins import (
    deferred, Base, Titled, Slugged, Described, Timeboxed, Stateful
    )
from ggrc.models.reflection import PublishOnly
from ggrc.models.object_owner import Ownable


class Workflow(Ownable, Timeboxed, Described, Titled, Slugged, Base, db.Model):
  __tablename__ = 'workflows'

  #Use these states for WorkflowCycle when it is implemented
  #VALID_STATES = [u"Planned", u"Future", u"In Progress", u"Overdue", u"Finished"]

  VALID_FREQUENCIES = ["one_time", "weekly", "monthly", "quarterly", "annually", "continuous"]

  frequency = deferred(db.Column(db.Enum(*VALID_FREQUENCIES),
      nullable=False, default='continuous'),
    'Workflow')

  workflow_objects = db.relationship(
      'WorkflowObject', backref='workflow', cascade='all, delete-orphan')
  objects = association_proxy(
      'workflow_objects', 'object', 'WorkflowObject')

  workflow_people = db.relationship(
      'WorkflowPerson', backref='workflow', cascade='all, delete-orphan')
  people = association_proxy(
      'workflow_people', 'person', 'WorkflowPerson')

  workflow_tasks = db.relationship(
      'WorkflowTask', backref='workflow', cascade='all, delete-orphan')
  tasks = association_proxy(
      'workflow_tasks', 'task', 'WorkflowTask')

  task_groups = db.relationship(
      'TaskGroup', backref='workflow', cascade='all, delete-orphan')

  #cycles = db.relationship(
  #    'Cycle', backref='workflow', cascade='all, delete-orphan')

  _fulltext_attrs = []

  _publish_attrs = [
      'workflow_objects',
      PublishOnly('objects'),
      'workflow_people',
      PublishOnly('people'),
      'workflow_tasks',
      PublishOnly('tasks'),
      'task_groups',
      'frequency',
      #'cycles',
      ]
