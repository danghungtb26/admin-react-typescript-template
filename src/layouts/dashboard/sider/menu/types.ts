export type MenuItem = {
  key: string
  label: string
  to: string
  icon?: React.ReactNode
  children?: MenuItem[]
}
