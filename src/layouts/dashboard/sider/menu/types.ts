export type MenuItem = {
  key: string
  label: string
  labelKey?: string
  to: string
  icon?: React.ReactNode
  children?: MenuItem[]
}
