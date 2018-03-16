# Copyright (C) 2018 Google Inc.
# Licensed under http://www.apache.org/licenses/LICENSE-2.0 <see LICENSE file>

"""Tests for /api/people/person_id/imports and
api/people/person_id/exports endpoints."""

import json

from collections import OrderedDict
from datetime import datetime

import ddt

from google.appengine.ext import testbed

from ggrc.models import all_models

from integration.ggrc import api_helper
from integration.ggrc.models import factories
from integration.ggrc.services import TestCase


@ddt.ddt
class TestImportExports(TestCase):
  """Tests for imports/exports endpoints."""

  def setUp(self):
    super(TestImportExports, self).setUp()
    self.client.get("/login")
    self.headers = {
        "Content-Type": "application/json",
        "X-Requested-By": ["GGRC"],
    }
    self.api = api_helper.Api()
    self.testbed = testbed.Testbed()
    self.testbed.activate()

    # root_path must be set the the location of queue.yaml.

    # Otherwise, only the 'default' queue will be available.
    self.testbed.init_taskqueue_stub()
    self.taskqueue_stub = self.testbed.get_stub(
        testbed.TASKQUEUE_SERVICE_NAME)

  def test_imports_put(self):
    """Test imports put"""
    user = all_models.Person.query.first()
    response = self.import_data2(
        user,
        OrderedDict([
            ("object_type", "Assessment"),
            ("Title", "Title1"),
        ]),
        OrderedDict([
            ("object_type", "Assessment"),
            ("Title", "Title2"),
        ]),
        OrderedDict([
            ("object_type", "Control"),
            ("Title", "Title3"),
        ]))
    self.assertEqual(response["objects"]["Assessment"], 2)
    self.assertEqual(response["objects"]["Control"], 1)

  @ddt.data("Import", "Export")
  def test_get(self, job_type):
    """Test imports/exports put"""
    user = all_models.Person.query.first()
    ie1 = factories.ImportExportFactory(job_type=job_type,
                                        created_by=user,
                                        created_at=datetime.now())
    factories.ImportExportFactory(job_type=job_type,
                                  created_by=user,
                                  created_at=datetime.now())
    response = self.client.get(
        "/api/people/{}/{}s/{}".format(user.id, job_type.lower(), ie1.id),
        headers=self.headers)
    self.assert200(response)
    self.assertEqual(len(response.json), 1)

    response = self.client.get(
        "/api/people/{}/{}s".format(user.id, job_type.lower()),
        headers=self.headers)
    self.assert200(response)
    self.assertEqual(len(response.json), 2)

  def test_imports_post(self):
    """Test imports post"""
    user = all_models.Person.query.first()
    response = self.import_data2(
        user,
        OrderedDict([
            ("object_type", "Assessment"),
            ("Title", "Title1"),
        ]))
    ie_id = response["import_export"]["id"]
    response = self.client.post(
        "/api/people/{}/imports/{}/start".format(user.id, ie_id),
        headers=self.headers)
    self.assert200(response)
    self.assertEqual(response.json["id"], ie_id)

  @ddt.data("Import", "Export")
  def test_delete(self, job_type):
    """Test imports/exports delete"""
    user = all_models.Person.query.first()
    ie1 = factories.ImportExportFactory(job_type=job_type,
                                        created_by=user,
                                        created_at=datetime.now())

    response = self.client.delete(
        "/api/people/{}/{}s/{}".format(user.id, job_type.lower(), ie1.id),
        headers=self.headers)
    self.assert200(response)
    self.assertIsNone(all_models.ImportExport.query.get(ie1.id))

  def test_exports_put(self):
    """Test exports put"""
    user = all_models.Person.query.first()
    assessment = factories.AssessmentFactory()
    response = self.client.put(
        "/api/people/{}/exports".format(user.id),
        data=json.dumps({"objects": [assessment.id],
                         "current_time": str(datetime.now())}),
        headers=self.headers)
    self.assert200(response)

  @ddt.data("Import", "Export")
  def test_download(self, job_type):
    """Test imports/exports download"""
    user = all_models.Person.query.first()
    ie1 = factories.ImportExportFactory(
        job_type=job_type,
        status='Finished',
        created_at=datetime.now(),
        created_by=user,
        title="test.csv",
        content="test content")
    response = self.client.post(
        "/api/people/{}/{}s/{}/download".format(user.id,
                                                job_type.lower(),
                                                ie1.id),
        data=json.dumps({"export_to": "csv"}),
        headers=self.headers)
    self.assert200(response)
    self.assertEqual(response.data, "test content")
