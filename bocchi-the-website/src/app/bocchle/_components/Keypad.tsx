import { Button } from "@rithik/bocchi-the-website/components/ui/button"
import { type SetStateAction, memo, type Dispatch } from "react"
import { useEffect } from "react"

interface Props {
  value: string
  onChange: Dispatch<SetStateAction<string>>
  disabled?: boolean
}

const Keypad = (props: Props) => {
  const { value, onChange, disabled = false } = props

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key

      if (key === "Backspace") {
        onChange((value) => value.slice(0, -1))
        return
      }

      const numericValue = parseInt(key)

      if (!isNaN(numericValue)) {
        onChange((value) => {
          if (!value || value === "0" || value === "1") {
            return `${value}${numericValue}`
          }

          return value
        })
      }
    }

    window.addEventListener("keydown", handleKeyDown)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [onChange])

  return (
    <div className="grid grid-cols-3 gap-2 rounded-md border border-pink-900 p-4 dark:border-slate-200">
      <Button
        onClick={() => onChange((v) => `${v}1`)}
        disabled={disabled || (value !== "" && value !== "0" && value !== "1")}
      >
        1
      </Button>
      <Button
        onClick={() => onChange((v) => `${v}2`)}
        disabled={disabled || (value !== "0" && value !== "1")}
      >
        2
      </Button>
      <Button
        onClick={() => onChange((v) => `${v}3`)}
        disabled={disabled || value !== "0"}
      >
        3
      </Button>
      <Button
        onClick={() => onChange((v) => `${v}4`)}
        disabled={disabled || value !== "0"}
      >
        4
      </Button>
      <Button
        onClick={() => onChange((v) => `${v}5`)}
        disabled={disabled || value !== "0"}
      >
        5
      </Button>
      <Button
        onClick={() => onChange((v) => `${v}6`)}
        disabled={disabled || value !== "0"}
      >
        6
      </Button>
      <Button
        onClick={() => onChange((v) => `${v}7`)}
        disabled={disabled || value !== "0"}
      >
        7
      </Button>
      <Button
        onClick={() => onChange((v) => `${v}8`)}
        disabled={disabled || value !== "0"}
      >
        8
      </Button>
      <Button
        onClick={() => onChange((v) => `${v}9`)}
        disabled={disabled || value !== "0"}
      >
        9
      </Button>
      <div></div>
      <Button
        onClick={() => onChange((v) => `${v}0`)}
        disabled={disabled || (value !== "" && value !== "1")}
      >
        0
      </Button>
      <div></div>
    </div>
  )
}

export default memo(Keypad)
