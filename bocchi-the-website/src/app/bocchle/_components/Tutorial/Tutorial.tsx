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
import { useCallback, useEffect, useState } from "react"
import TutorialContent from "./Tutorial.mdx"
import { atomWithStorage } from "jotai/utils"
import { useAtom } from "jotai"

interface Props {
  className?: string
}

const hasSeenTutorialBeforeAtom = atomWithStorage(
  "hasSeenTutorialBefore",
  false,
  undefined,
  {
    getOnInit: true,
  },
)

const Tutorial = (props: Props) => {
  const { className } = props
  const [open, setOpen] = useState(false)
  const [hasSeenTutorialBefore, setHasSeenTutorialBefore] = useAtom(
    hasSeenTutorialBeforeAtom,
  )
  const isDesktop = useMediaQuery("(min-width: 640px)")

  const close = useCallback(() => setOpen(false), [])

  useEffect(() => {
    if (!hasSeenTutorialBefore) {
      setOpen(true)
      setHasSeenTutorialBefore(true)
    }
  }, [hasSeenTutorialBefore, setHasSeenTutorialBefore])

  return (
    <>
      <Button
        className={className}
        variant="secondary"
        onClick={() => setOpen(!open)}
      >
        <CircleHelp className="size-5" />
        <span className="sr-only">How to play</span>
      </Button>
      {!isDesktop ? (
        <Drawer open={open} onOpenChange={setOpen}>
          <DrawerContent>
            <DrawerHeader className="flex w-full justify-center gap-1">
              <CircleHelp className="size-5" />
              <DrawerTitle>How to play</DrawerTitle>
            </DrawerHeader>
            <div className="flex flex-col gap-4 px-4">
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
            <DialogHeader className="flex flex-row items-center gap-1 space-y-0">
              <CircleHelp className="size-5" />
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
