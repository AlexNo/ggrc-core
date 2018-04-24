export interface ImportExportResult {
  block_errors: string[],
  block_warnings: string[],
  created: number,
  deleted: number,
  deprecated: number,
  ignored: number,
  name: string,
  row_errors: string[],
  row_warnings: string[],
  rows: number,
  updated: number,
}
export interface ImportExportJob {
  id: number,
  created_at: string,
  created_by_id: number,
  description: string,
  job_type: string,
  results: ImportExportResult[],
  start_at: string,
  status: string,
  title: string,
}