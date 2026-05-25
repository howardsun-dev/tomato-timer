import { useId, type ChangeEvent } from 'react'

interface InputFieldProps {
  label: string
  value: number
  max?: number
  onValueChange: (value: number) => void
}

export default function InputField({
  label,
  value,
  max,
  onValueChange
}: InputFieldProps): JSX.Element {
  const inputId = useId()

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const inputValue = event.target.value

    if (inputValue !== '' && !/^\d+$/.test(inputValue)) {
      return
    }

    const parsedValue = inputValue === '' ? 0 : Number.parseInt(inputValue, 10)
    const safeValue = Number.isFinite(parsedValue) ? parsedValue : 0

    onValueChange(max === undefined ? safeValue : Math.min(safeValue, max))
  }

  return (
    <div className="text-3xl">
      <label className="text-red-50" htmlFor={inputId}>
        {label}
      </label>
      <input
        id={inputId}
        className="w-20 bg-transparent text-red-100 placeholder:text-red-200 focus:outline-none focus:ring-1 focus:ring-red-300 rounded"
        inputMode="numeric"
        min={0}
        max={max}
        type="number"
        value={value}
        onChange={handleInputChange}
      />
    </div>
  )
}
