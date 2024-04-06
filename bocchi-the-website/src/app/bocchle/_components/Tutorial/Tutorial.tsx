import { Button } from "@rithik/bocchi-the-website/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@rithik/bocchi-the-website/components/ui/dialog"
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@rithik/bocchi-the-website/components/ui/drawer"
import useMediaQuery from "@rithik/bocchi-the-website/lib/useMediaQuery"
import { CircleHelp } from "lucide-react"
import { useCallback, useState } from "react"
import TutorialContent from "./Tutorial.mdx"

interface Props {
  className?: string
}

const Tutorial = (props: Props) => {
  const { className } = props
  const [open, setOpen] = useState(false)
  const isDesktop = useMediaQuery("(min-width: 640px)")

  const close = useCallback(() => setOpen(false), [])

  return (
    <>
      <Button
        className={className}
        variant="secondary"
        onClick={() => setOpen(!open)}
      >
        <CircleHelp className="size-5" />
      </Button>
      {!isDesktop ? (
        <Drawer open={open} onOpenChange={setOpen}>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>How to play</DrawerTitle>
            </DrawerHeader>
            <div className="flex flex-col gap-1.5 px-4">
              <TutorialContent />
            </div>
            <DrawerFooter>
              <Button className="w-full" onClick={close}>
                Close
              </Button>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      ) : (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>How to play</DialogTitle>
            </DialogHeader>
            <TutorialContent />
            <DialogFooter>
              <Button className="w-full" onClick={close}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  )
}

export default Tutorial
