# coding: utf-8

# Copyright (C) 2017 Google Inc.
# Licensed under http://www.apache.org/licenses/LICENSE-2.0 <see LICENSE file>

"""Tests for /query api endpoint."""

from sqlalchemy import func
from flask import json

from ggrc import app
from ggrc import views
from ggrc import models
from ggrc import db

from integration.ggrc import TestCase
from integration.ggrc.models import factories


# pylint: disable=super-on-old-class
class TestAuditSnapshotQueries(TestCase):
  """Tests for /query api for Audit snapshots"""

  def setUp(self):
    """Log in before performing queries."""
    self.client.get("/login")

  def _post(self, data):
    return self.client.post(
        "/query",
        data=json.dumps(data),
        headers={"Content-Type": "application/json", }
    )

  @classmethod
  def setUpClass(cls):
    TestCase.clear_data()
    with app.app.app_context():
      cls._setup_objects()

  @staticmethod
  def _setup_objects():
    """Create and reindex objects needed for tests"""
    text_cad = factories.CustomAttributeDefinitionFactory(
        title="text cad",
        definition_type="market",
    )
    date_cad = factories.CustomAttributeDefinitionFactory(
        title="date cad",
        definition_type="market",
        attribute_type="Date",
    )

    audit = factories.AuditFactory()

    for i in range(5):
      factories.ControlFactory(title="Control {}".format(i + 1))
      factories.OrgGroupFactory()
      market = factories.MarketFactory(title="Market {}".format(i + 1))
      factories.CustomAttributeValueFactory(
          custom_attribute=date_cad,
          attributable=market,
          attribute_value="2016-11-0{}".format(i + 3),
      )
      factories.CustomAttributeValueFactory(
          custom_attribute=text_cad,
          attributable=market,
          attribute_value="2016-11-0{}".format(i + 1),
      )

    revisions = models.Revision.query.filter(
        models.Revision.resource_type.in_(["OrgGroup", "Market", "Control"]),
        models.Revision.id.in_(
            db.session.query(func.max(models.Revision.id)).group_by(
                models.Revision.resource_type,
                models.Revision.resource_id,
            )
        ),
    )

    snapshots = [
        factories.SnapshotFactory(
            child_id=revision.resource_id,
            child_type=revision.resource_type,
            revision=revision,
            parent=audit,
        )
        for revision in revisions
    ]

    snapshot_map = {snapshot.revision.content["title"]: snapshot
                    for snapshot in snapshots}

    # create Assessments and issues and map some snapshots to them
    # Markets and Controls represent snapshots of those objects.

    # Assessment 1 -- Market 1,
    # Assessment 2 -- Market 2, Control 1,
    # Assessment 3 -- Market 3, Control 1, Control 2
    # Assessment 4 -- Market 4, Control 1, Control 2, Control 3

    # Issue 1 -- Market 1,
    # Issue 2 -- Market 2, Control 1,
    # Issue 3 -- Market 3, Control 1, Control 2
    # Issue 4 -- Market 4, Control 1, Control 2, Control 3

    assessment_issues = (
        factories.AssessmentFactory,
        factories.IssueFactory,
    )
    for i in range(4):
      for factory in assessment_issues:
        obj = factory(
            title="{} {}".format(factory._meta.model.__name__, i + 1),
        )
        factories.RelationshipFactory(
            source=audit if i % 2 == 0 else obj,
            destination=audit if i % 2 == 1 else obj,
        )

        market = snapshot_map["Market {}".format(i + 1)]
        factories.RelationshipFactory(
            source=market if i % 2 == 0 else obj,
            destination=market if i % 2 == 1 else obj,
        )
        for j in range(i):
          control = snapshot_map["Control {}".format(j + 1)]
          factories.RelationshipFactory(
              source=control if i % 2 == 0 else obj,
              destination=control if i % 2 == 1 else obj,
          )

    views.do_reindex()

  def test_basic_snapshot_query(self):
    """Test fetching all snapshots for a given Audit."""
    result = self._post([
        {
            "object_name": "Snapshot",
            "filters": {
                "expression": self._get_model_expression(),
                "keys": [],
                "order_by": {"keys": [], "order": "", "compare": None}
            }
        }
    ])
    self.assertEqual(len(result.json[0]["Snapshot"]["values"]), 5)

    result = self._post([
        {
            "object_name": "Snapshot",
            "filters": {
                "expression": self._get_model_expression("OrgGroup"),
                "keys": [],
                "order_by": {"keys": [], "order": "", "compare": None}
            }
        }
    ])
    self.assertEqual(len(result.json[0]["Snapshot"]["values"]), 5)

  def test_snapshot_attribute_filter(self):
    """Test filtering snapshots on object attributes."""
    market_title = models.Market.query.first().title
    result = self._post([
        {
            "object_name": "Snapshot",
            "filters": {
                "expression": {
                    "left": self._get_model_expression(),
                    "op": {"name": "AND"},
                    "right": {
                        "left": "title",
                        "op": {"name": "="},
                        "right": market_title,
                    },
                },
                "keys": [],
                "order_by": {"keys": [], "order": "", "compare": None}
            }
        }
    ])
    self.assertEqual(len(result.json[0]["Snapshot"]["values"]), 1)
    content = result.json[0]["Snapshot"]["values"][0]["revision"]["content"]
    self.assertEqual(
        content["title"],
        market_title,
    )

    result = self._post([
        {
            "object_name": "Snapshot",
            "filters": {
                "expression": {
                    "left": self._get_model_expression("OrgGroup"),
                    "op": {"name": "AND"},
                    "right": {
                        "left": "title",
                        "op": {"name": "!="},
                        "right": models.OrgGroup.query.first().title,
                    },
                },
                "keys": [],
                "order_by": {"keys": [], "order": "", "compare": None}
            }
        }
    ])
    self.assertEqual(len(result.json[0]["Snapshot"]["values"]), 4)

  def test_snapshot_ca_filter(self):
    """Test filtering snapshots on custom attributes."""
    result = self._post([
        {
            "object_name": "Snapshot",
            "filters": {
                "expression": {
                    "left": self._get_model_expression(),
                    "op": {"name": "AND"},
                    "right": {
                        "left": {
                            "left": "text cad",
                            "op": {"name": "="},
                            "right": "2016-11-01",  # one match
                        },
                        "op": {"name": "OR"},
                        "right": {
                            "left": "date cad",
                            "op": {"name": ">"},
                            "right": "11/05/2016",  # 2 matches
                        },
                    },
                },
                "keys": [],
                "order_by": {"keys": [], "order": "", "compare": None}
            }
        }
    ])
    self.assertEqual(len(result.json[0]["Snapshot"]["values"]), 3)

  def test_assesessment_relationships(self):
    """Test relationships between Assessments and original objects."""
    control_id_map = {control.title: control.id
                      for control in models.Control.query}

    # assessment 1 --
    # assessment 2 -- control 1,
    # assessment 3 -- control 1, control 2
    # assessment 4 -- control 1, control 2, control 3
    expected_counts = {
        "Control 1": 3,
        "Control 2": 2,
        "Control 3": 1,
        "Control 4": 0,
        "Control 5": 0,
    }

    for title, count in expected_counts.items():
      result = self._post([
          {
              "object_name": "Assessment",
              "filters": {
                  "expression": {
                      "object_name": "Control",
                      "op": {"name": "relevant"},
                      "ids": [control_id_map[title]]
                  },
                  "keys": [],
                  "order_by": {"keys": [], "order": "", "compare": None}
              }
          }
      ])
      self.assertEqual(
          len(result.json[0]["Assessment"]["values"]),
          count,
          "Invalid related Assessment count for '{}'."
          "Expected {}, got {}".format(
              title,
              count,
              len(result.json[0]["Assessment"]["values"]),
          )
      )

  def test_original_objects(self):
    """Test relationships between original objects and Assessments."""
    assessment_id_map = {assessment.title: assessment.id
                      for assessment in models.Assessment.query}

    # assessment 1 --
    # assessment 2 -- control 1,
    # assessment 3 -- control 1, control 2
    # assessment 4 -- control 1, control 2, control 3
    expected_counts = {
        "Assessment 1": 0,
        "Assessment 2": 1,
        "Assessment 3": 2,
        "Assessment 4": 3,
    }

    for title, count in expected_counts.items():
      result = self._post([
          {
              "object_name": "Control",
              "filters": {
                  "expression": {
                      "object_name": "Assessment",
                      "op": {"name": "relevant"},
                      "ids": [assessment_id_map[title]]
                  },
                  "keys": [],
                  "order_by": {"keys": [], "order": "", "compare": None}
              }
          }
      ])
      self.assertEqual(
          len(result.json[0]["Control"]["values"]),
          count,
          "Invalid related Control count for '{}'."
          "Expected {}, got {}".format(
              title,
              count,
              len(result.json[0]["Control"]["values"]),
          )
      )

  @staticmethod
  def _get_model_expression(model_name="Market"):
    return {
        "left": {
            "left": "child_type",
            "op": {"name": "="},
            "right": model_name,
        },
        "op": {"name": "AND"},
        "right": {
            "object_name": "Audit",
            "op": {"name": "relevant"},
            "ids": [models.Audit.query.first().id]
        }
    }
