export type Branches = Array<Branch>

export interface Branch {
  name: string
  commit: Commit
  protected: boolean
  protection: Protection
  protection_url: string
}

export interface Commit {
  sha: string
  url: string
}

export interface Protection {
  required_status_checks: RequiredStatusChecks
}

export interface RequiredStatusChecks {
  enforcement_level: string
  contexts: string[]
}
