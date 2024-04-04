import { Button } from "@rithik/bocchi-the-website/components/ui/button"
import { cn } from "@rithik/bocchi-the-website/lib/utils"
import { Delete } from "lucide-react"
import { type SetStateAction, type Dispatch } from "react"
import { useEffect } from "react"

interface Props {
  value: string
  onChange: Dispatch<SetStateAction<string>>
  disabled?: boolean
  className?: string
}

const Keypad = (props: Props) => {
  const { value, onChange, disabled = false, className } = props

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key

      if (key === "Backspace") {
        onChange((value) => value.slice(0, -1))
        return
      }

      const inputValue = parseInt(key)

      if (!isNaN(inputValue)) {
        onChange((currentValue) => {
          if (currentValue === "0" && inputValue !== 0) {
            return `${currentValue}${inputValue}`
          }

          if (currentValue === "1" && inputValue <= 2) {
            return `${currentValue}${inputValue}`
          }

          if (!currentValue && (inputValue === 0 || inputValue === 1)) {
            return `${inputValue}`
          }

          return currentValue
        })
      }
    }

    window.addEventListener("keydown", handleKeyDown)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [onChange])

  return (
    <div
      className={cn(
        "grid w-full grid-cols-3 gap-2 rounded-md border-pink-900 dark:border-slate-200 sm:w-auto sm:border sm:p-4",
        className,
      )}
    >
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
      <Button
        variant="destructive"
        onClick={() => onChange((value) => value.slice(0, -1))}
        disabled={disabled || value?.length === 2 || value === ""}
      >
        <Delete />
      </Button>
    </div>
  )
}

export default Keypad
