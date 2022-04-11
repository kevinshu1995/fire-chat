import IconComponent from '/src/assets/icons/index.js'

export default function Icon({ icon }) {
  const Comp = IconComponent[icon]
  return <Comp />
}
