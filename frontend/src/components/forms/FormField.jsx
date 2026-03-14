import Input from '../ui/Input'

export default function FormField({ label, error, ...props }) {
  return <Input label={label} error={error} {...props} />
}