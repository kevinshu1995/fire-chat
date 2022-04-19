import IconComponent from '/src/assets/icons/index.js'

export default function Icon({ icon, className }) {
  const Comp = IconComponent[icon]
  return <Comp className={className} />
}
