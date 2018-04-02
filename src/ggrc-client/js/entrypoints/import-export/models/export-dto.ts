
export interface ExportDetails {
  object_name: string,
  fields: string[]|string,
  filters?: object,
}

export interface ExportDTO {
  objects: ExportDetails[],
  export_to: string,
  current_time?: string,
}