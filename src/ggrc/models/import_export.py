# Copyright (C) 2018 Google Inc.
# Licensed under http://www.apache.org/licenses/LICENSE-2.0 <see LICENSE file>

""" ImportExport model."""

import json
from datetime import datetime

from sqlalchemy.dialects import mysql

from ggrc import db
from ggrc.models.mixins.base import Identifiable
from ggrc.login import get_current_user


class ImportExport(Identifiable, db.Model):
  """ImportExport Model."""

  __tablename__ = 'import_exports'

  IMPORT_EXPORT_STATUSES = [
      'Not Started',
      'Analysis',
      'In Progress',
      'Blocked',
      'Analysis Failed',
      'Stopped',
      'Failed',
      'Finished',
  ]

  job_type = db.Column(db.Enum('Import', 'Export'), nullable=False)
  status = db.Column(db.Enum(*IMPORT_EXPORT_STATUSES), nullable=False,
                     default='Not Started')
  description = db.Column(db.Text)
  created_at = db.Column(db.DateTime, nullable=False)
  start_at = db.Column(db.DateTime)
  end_at = db.Column(db.DateTime)
  created_by_id = db.Column(db.Integer,
                            db.ForeignKey('people.id'), nullable=False)
  created_by = db.relationship('Person',
                               foreign_keys='ImportExport.created_by_id',
                               uselist=False)
  results = db.Column(mysql.LONGTEXT)
  title = db.Column(db.Text)
  content = db.Column(mysql.LONGTEXT)
  gdrive_metadata = db.Column('gdrive_metadata', db.Text)

  def log_json(self):
    """JSON representation"""
    res = {column.name: getattr(self, column.name)
           for column in self.__table__.columns
           if column.name not in ('content', 'gdrive_metadata')}
    return res


def create_import_export_entry(content=None, meta=None, job_type='Import'):
  """Create ImportExport entry"""
  ie_job = ImportExport(job_type=job_type,
                        status='Not Started',
                        created_at=datetime.now(),
                        created_by=get_current_user(),
                        title=meta.get("name") if meta else None,
                        content=content,
                        gdrive_metadata=json.dumps(meta) if meta else None)

  db.session.add(ie_job)
  db.session.commit()
  return ie_job


def get_jobs(ie_id, job_type):
  """Get list of jobs by type and/or id"""
  result = []
  if ie_id:
    ie_job = ImportExport.query.get(ie_id)
    if ie_job and ie_job.created_by == get_current_user():
      result.append(ie_job.log_json())
  else:
    result = [ie.log_json() for ie in ImportExport.query.filter(
        ImportExport.created_by == get_current_user(),
        ImportExport.job_type == job_type)]
  return result


def get(ie_id):
  return ImportExport.query.get(ie_id)
