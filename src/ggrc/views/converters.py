# Copyright (C) 2018 Google Inc.
# Licensed under http://www.apache.org/licenses/LICENSE-2.0 <see LICENSE file>

"""Main view functions for import and export pages.

This module handles all view related function to import and export pages
including the import/export api endponts.
"""

from logging import getLogger
from StringIO import StringIO
from datetime import datetime

from apiclient.errors import HttpError
from google.appengine.ext import deferred

from flask import current_app
from flask import request
from flask import json
from flask import render_template
from flask import g
from werkzeug.exceptions import (
    BadRequest, InternalServerError, Unauthorized, Forbidden
)

from ggrc import db
from ggrc.gdrive import file_actions as fa
from ggrc.app import app
from ggrc.converters.base import Converter
from ggrc.converters.import_helper import generate_csv_string, \
    count_objects, read_csv_file
from ggrc.models import import_export, person
from ggrc.query.exceptions import BadQueryException
from ggrc.query.builder import QueryHelper
from ggrc.login import login_required, get_current_user
from ggrc.utils import benchmark


# pylint: disable=invalid-name
logger = getLogger(__name__)


def check_required_headers(required_headers):
  """Check required headers to the current request"""
  errors = []
  for header, valid_values in required_headers.items():
    if header not in request.headers:
      errors.append("Missing required header '{}'".format(header))
    elif request.headers[header] not in valid_values:
      errors.append("Invalid header value for '{}'".format(header))

  if errors:
    raise BadRequest("\n".join(errors))


def parse_export_request():
  """ Check if request contains all required fields """
  required_headers = {
      "X-Requested-By": ["GGRC"],
      "Content-Type": ["application/json"],
      "X-export-view": ["blocks", "grid"],
  }
  check_required_headers(required_headers)
  return request.json


def export_file(export_to, filename, csv_string=None):
  """Export file to csv file or gdrive file"""
  if export_to == "gdrive":
    gfile = fa.create_gdrive_file(csv_string, filename)
    headers = [('Content-Type', 'application/json'), ]
    return current_app.make_response((json.dumps(gfile), 200, headers))
  if export_to == "csv":
    headers = [
        ("Content-Type", "text/csv"),
        ("Content-Disposition",
         "attachment; filename='{}'".format(filename)),
    ]
    return current_app.make_response((csv_string, 200, headers))
  raise BadRequest("Bad params")


def handle_export_request():
  """Export request handler"""
  # pylint: disable=too-many-locals
  try:
    with benchmark("handle export request data"):
      data = parse_export_request()
      objects = data.get("objects")
      export_to = data.get("export_to")
      current_time = data.get("current_time")
    with benchmark("Generate CSV string"):
      csv_string, filename = make_export(objects, current_time)
    with benchmark("Make response."):
      return export_file(export_to, filename, csv_string)
  except BadQueryException as exception:
    raise BadRequest(exception.message)
  except Unauthorized as ex:
    raise Unauthorized("{} Try to reload /export page".format(ex.message))
  except HttpError as e:
    message = json.loads(e.content).get("error").get("message")
    if e.resp.code == 401:
      raise Unauthorized("{} Try to reload /export page".format(message))
    raise InternalServerError(message)
  except Exception as e:  # pylint: disable=broad-except
    logger.exception("Export failed: %s", e.message)
    raise InternalServerError("Export failed due to internal server error.")


def make_export(objects, current_time):
  """Make export"""
  query_helper = QueryHelper(objects)
  ids_by_type = query_helper.get_ids()
  converter = Converter(ids_by_type=ids_by_type)
  csv_data = converter.to_array()
  object_names = "_".join(converter.get_object_names())
  filename = "{}_{}.csv".format(object_names, current_time)
  return generate_csv_string(csv_data), filename


def check_import_file():
  """Check if imported file format and type is valid"""
  if "file" not in request.files or not request.files["file"]:
    raise BadRequest("Missing csv file")
  csv_file = request.files["file"]
  if not csv_file.filename.lower().endswith(".csv"):
    raise BadRequest("Invalid file type.")
  return csv_file


def parse_import_request():
  """ Check if request contains all required fields """
  required_headers = {
      "X-Requested-By": ["GGRC"],
      "X-test-only": ["true", "false"],
  }
  check_required_headers(required_headers)
  try:
    file_data = request.json
    dry_run = request.headers["X-test-only"] == "true"
    return dry_run, file_data
  except:  # pylint: disable=bare-except
    raise BadRequest("Export failed due incorrect request data.")


def handle_import_request():
  """Import request handler"""
  dry_run, file_data = parse_import_request()
  csv_data = fa.get_gdrive_file(file_data)
  return make_response(make_import(csv_data, dry_run))


def make_response(data):
  """Make response"""
  response_json = json.dumps(data)
  headers = [("Content-Type", "application/json")]
  return current_app.make_response((response_json, 200, headers))


def make_import(csv_data, dry_run):
  """Make import"""
  try:
    converter = Converter(dry_run=dry_run, csv_data=csv_data)
    converter.import_csv()
    return converter.get_info()
  except Exception as e:  # pylint: disable=broad-except
    logger.exception("Import failed: %s", e.message)
    raise BadRequest("Import failed due to server error: %s" % e.message)


def run_export(objects, current_time, ie_id, user_id):
  """Run export"""
  with app.app_context():
    try:
      user = person.Person.query.get(user_id)
      setattr(g, '_current_user', user)
      ie = import_export.get(ie_id)
      ie.status = "In Progress"
      db.session.commit()
      content, filename = make_export(objects, current_time)
      ie.status = "Finished"
      ie.content = content
      ie.title = filename
      db.session.commit()
    except Exception as e:  # pylint: disable=broad-except
      logger.exception("Export failed: %s", e.message)
      try:
        ie.results = e.message
        ie.status = "Failed"
        ie.end_date = datetime.now()
        db.session.commit()
      except Exception:  # pylint: disable=broad-except
        pass


def run_import_phases(content, ie_id, user_id):  # noqa: ignore=C901
  """Execute import phases"""
  with app.app_context():
    try:
      user = person.Person.query.get(user_id)
      setattr(g, '_current_user', user)
      csv_data = read_csv_file(StringIO(content))
      ie_job = import_export.get(ie_id)

      if ie_job.status == "Not Started":
        ie_job.status = "Analysis"
        db.session.commit()
        info = make_import(csv_data, True)
        ie_job.results = json.dumps(info)
        for block_info in info:
          if block_info["block_errors"] or block_info["row_errors"]:
            ie_job.status = "Analysis Failed"
            db.session.commit()
            return
        for block_info in info:
          if block_info["block_warnings"] or block_info["row_warnings"]:
            ie_job.status = "Blocked"
            db.session.commit()
            return

      if ie_job.status in ("Analysis", "Blocked"):
        ie_job.status = "In Progress"
        db.session.commit()
        info = make_import(csv_data, False)
        ie_job.results = json.dumps(info)
        for block_info in info:
          if block_info["block_errors"] or block_info["row_errors"]:
            ie_job.status = "Failed"
            db.session.commit()
            return
        ie_job.status = "Finished"
        db.session.commit()
    except Exception as e:  # pylint: disable=broad-except
      logger.exception("Import failed: %s", e.message)
      try:
        ie_job.results = e.message
        ie_job.status = \
            "Analysis Failed" if ie_job.status == "Analysis" else "Failed"
        ie_job.end_date = datetime.now()
        db.session.commit()
      except Exception:  # pylint: disable=broad-except
        pass


def init_converter_views():
  """Initialize views for import and export."""

  # pylint: disable=unused-variable
  # The view function trigger a false unused-variable.
  @app.route("/_service/export_csv", methods=["POST"])
  @login_required
  def handle_export_csv():
    """Calls export handler"""
    with benchmark("handle export request"):
      return handle_export_request()

  @app.route("/_service/import_csv", methods=["POST"])
  @login_required
  def handle_import_csv():
    """Calls import handler"""
    with benchmark("handle import request"):
      return handle_import_request()

  @app.route("/import")
  @login_required
  def import_view():
    """Get import view"""
    return render_template("import_export/import.haml")

  @app.route("/export")
  @login_required
  def export_view():
    """Get export view"""
    return render_template("import_export/export.haml")


def check_import_export_headers():
  """Check headers"""
  required_headers = {
      "X-Requested-By": ["GGRC"],
  }
  check_required_headers(required_headers)


def make_import_export_response(data):
  """Make response"""
  response_json = json.dumps(data)
  headers = [("Content-Type", "application/json")]
  return current_app.make_response((response_json, 200, headers))


def handle_import_post(**kwargs):
  """Handle import post"""
  command = kwargs.get("command2")
  ie_id = kwargs.get("id2")
  user = get_current_user()
  if user.system_wide_role == 'No Access':
    raise Forbidden
  if not ie_id or not command or command not in ("start", "stop", "download"):
    raise BadRequest("Import failed due incorrect request data")
  try:
    ie = import_export.get(ie_id)
    if command == 'start':
      deferred.defer(run_import_phases, ie.content, ie.id, user.id)
      return make_import_export_response(ie.log_json())
    elif command == "download":
      return handle_file_download(**kwargs)
    raise BadRequest("Bad params")
  except Exception as e:
    raise BadRequest("Import failed due incorrect request data: %s" %
                     e.message)


def handle_import_get(**kwargs):
  """Handle import get"""
  check_import_export_headers()
  try:
    res = import_export.get_jobs(kwargs.get("id2"), "Import")
    return make_import_export_response(res)
  except Exception as e:
    raise BadRequest("Import failed due incorrect request data: %s" %
                     e.message)


def handle_import_put(**kwargs):
  """ Check if request contains all required fields """
  check_import_export_headers()
  file_meta = request.json
  csv_data, csv_content = fa.get_gdrive_file_data(file_meta)
  try:
    counts = count_objects(csv_data)
    ie = import_export.create_import_export_entry(csv_content, file_meta)
    return make_import_export_response({"objects": counts,
                                        "import_export": ie.log_json()})
  except Exception as e:
    raise BadRequest("Import failed due incorrect request data: %s" %
                     e.message)


def handle_file_download(**kwargs):
  """  Download file  """
  try:
    export_to = request.json.get("export_to")
    ie = import_export.get(kwargs.get("id2"))
    return export_file(export_to, ie.title, ie.content)
  except Exception as e:
    raise BadRequest("Download failed due incorrect request data: %s" %
                     e.message)


def handle_export_post(**kwargs):
  """Handle export post"""
  command = kwargs.get("command2")
  ie_id = kwargs.get("id2")
  if not ie_id or not command or command not in ("stop", "download"):
    raise BadRequest("Export failed due incorrect request data")
  try:
    if command == "download":
      return handle_file_download(**kwargs)
    raise BadRequest("Bad params")
  except Exception as e:
    raise BadRequest("Export failed due incorrect request data: %s" %
                     e.message)


def handle_export_get(**kwargs):
  """Handle export get"""
  check_import_export_headers()
  try:
    res = import_export.get_jobs(kwargs.get("id2"), "Export")
    return make_import_export_response(res)
  except Exception as e:
    raise BadRequest("Export failed due incorrect request data: %s" %
                     e.message)


def handle_export_put(**kwargs):
  """Handle export put"""
  check_import_export_headers()
  objects = request.json.get("objects")
  current_time = request.json.get("current_time")
  user = get_current_user()
  if user.system_wide_role == 'No Access':
    raise Forbidden
  if not objects or not current_time:
    raise BadRequest("Export failed due incorrect request data")
  try:
    ie = import_export.create_import_export_entry(job_type="Export")
    deferred.defer(run_export, objects, current_time, ie.id, user.id)
    return make_import_export_response(ie.log_json())
  except Exception as e:
    raise BadRequest("Export failed due incorrect request data: %s" %
                     e.message)


def handle_delete(**kwargs):
  """ Delete import_export entry """
  check_import_export_headers()
  try:
    ie = import_export.get(kwargs.get("id2"))
    db.session.delete(ie)
    db.session.commit()
    return make_import_export_response("OK")
  except Exception as e:
    raise BadRequest("Import/Export failed due incorrect request data: %s" %
                     e.message)
