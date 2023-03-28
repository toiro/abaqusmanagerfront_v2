const MenuElements = {
  job: 'job',
  admin: 'admin',
} as const
type MenuElements = (typeof MenuElements)[keyof typeof MenuElements]
export default MenuElements
