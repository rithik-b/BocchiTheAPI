import {
  Button,
  type ButtonProps,
  buttonVariants,
} from "@rithik/bocchi-the-website/components/ui/button"
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@rithik/bocchi-the-website/components/ui/drawer"
import useMediaQuery from "@rithik/bocchi-the-website/lib/useMediaQuery"
import { cn } from "@rithik/bocchi-the-website/lib/utils"
import { atom, useAtomValue } from "jotai"
import { Copy, MoreHorizontal, ShareIcon } from "lucide-react"
import { forwardRef, useCallback, useEffect, useState } from "react"
import GameStateAtoms from "../GameStateAtoms"
import { useAtomCallback } from "jotai/utils"
import { SiX } from "@icons-pack/react-simple-icons"
import { env } from "@rithik/bocchi-the-website/env"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@rithik/bocchi-the-website/components/ui/card"
import { Avatar } from "@rithik/bocchi-the-website/components/ui/avatar"
import { AvatarFallback, AvatarImage } from "@radix-ui/react-avatar"
import {
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialog,
  AlertDialogContent,
  AlertDialogTitle,
} from "@rithik/bocchi-the-website/components/ui/alert-dialog"

const shareUrl = `${env.NEXT_PUBLIC_WEBSITE_URL}/bocchle`

const shareMessageAtom = atom((get) => {
  const attempts = get(GameStateAtoms.attemptsHistoryWithPlaceHolders)
  const attemptsString = attempts
    .map((a) => {
      switch (a.status) {
        case "correct":
          return "🟩"
        case "incorrect":
          return "🟥"
        default:
          return "⬜️"
      }
    })
    .join("")
  return "Bocchle \n" + attemptsString
})

const shareMessageWithUrlAtom = atom((get) => {
  return get(shareMessageAtom) + "\n" + shareUrl
})

const xUrlAtom = atom((get) => {
  const encodedTweet = encodeURIComponent(get(shareMessageAtom))
  const encodedUrl = encodeURIComponent(shareUrl)
  return `https://twitter.com/intent/tweet?text=${encodedTweet}&url=${encodedUrl}`
})

const FakeTweet = () => {
  const shareMessageWithUrl = useAtomValue(shareMessageWithUrlAtom)

  return (
    <Card>
      <div className="flex flex-row items-center gap-2 p-6">
        <Avatar>
          <AvatarImage src="https://pbs.twimg.com/profile_images/1164155338980904960/LZq_sIDy_400x400.jpg" />
          <AvatarFallback>gh</AvatarFallback>
        </Avatar>
        <CardHeader className="p-0">
          <CardTitle>guitarhero</CardTitle>
          <CardDescription>@guitarhero_0221</CardDescription>
        </CardHeader>
      </div>
      <CardContent>
        <p className="whitespace-pre-line break-words">{shareMessageWithUrl}</p>
      </CardContent>
    </Card>
  )
}

interface DialogContentProps {
  close: () => void
}

const DialogContent = (props: DialogContentProps) => {
  const { close } = props
  const [canShare, setCanShare] = useState(false)
  const xUrl = useAtomValue(xUrlAtom)

  const copy = useAtomCallback(
    useCallback(
      async (get) => {
        const shareMessage = get(shareMessageWithUrlAtom)
        await navigator.clipboard.writeText(shareMessage)
        close()
      },
      [close],
    ),
  )

  const nativeShare = useAtomCallback(
    useCallback(
      async (get) => {
        const shareMessage = get(shareMessageWithUrlAtom)
        if (navigator.share) {
          try {
            await navigator.share({
              text: shareMessage,
            })
            close()
          } catch (err) {}
        }
      },
      [close],
    ),
  )

  useEffect(() => {
    setCanShare(!!navigator.share)
  }, [])

  return (
    <div className="flex w-full flex-col gap-5 px-5">
      <FakeTweet />
      <div className="flex flex-wrap gap-2">
        <ShareButton onClick={copy}>
          <Copy className="size-6" />
          Copy
        </ShareButton>
        <a
          href={xUrl}
          className={shareButtonStyles}
          target="_blank"
          onClick={close}
        >
          {/* @ts-expect-error Issue with react types */}
          <SiX className="size-6" />X
        </a>
        {canShare && (
          <ShareButton onClick={nativeShare}>
            <MoreHorizontal className="size-6" />
            More
          </ShareButton>
        )}
      </div>
    </div>
  )
}

const Share = () => {
  const [open, setOpen] = useState(false)
  const isDesktop = useMediaQuery("(min-width: 640px)")

  const close = useCallback(() => {
    setOpen(false)
  }, [])

  return (
    <>
      <Button className="gap-2" onClick={() => setOpen(!open)}>
        <ShareIcon className="size-5" />
        Share
      </Button>
      {!isDesktop ? (
        <Drawer open={open} onOpenChange={setOpen}>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Share</DrawerTitle>
            </DrawerHeader>
            <DialogContent close={close} />
            <DrawerFooter>
              <Button className="w-full" onClick={close}>
                Close
              </Button>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      ) : (
        <AlertDialog open={open} onOpenChange={setOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Share</AlertDialogTitle>
            </AlertDialogHeader>
            <DialogContent close={close} />
            <AlertDialogFooter>
              <Button className="w-full" onClick={close}>
                Close
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </>
  )
}

const shareButtonStyles = cn(
  buttonVariants({ variant: "outline" }),
  "size-20 flex-col justify-center gap-2 rounded-lg",
)

const ShareButton = forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => {
  const { className, ...rest } = props
  return (
    <Button ref={ref} {...rest} className={cn(shareButtonStyles, className)} />
  )
})
ShareButton.displayName = "ShareButton"

export default Share
