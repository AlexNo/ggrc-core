interface GGRCConfig {
  GAPI_CLIENT_ID: string,
}

declare interface GGRC {
  config: GGRCConfig,
  current_user: any
}

export = GGRC;