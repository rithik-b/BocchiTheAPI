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
import { Copy, MoreHorizontal, ShareIcon } from "lucide-react"
import {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react"
import { SiX } from "@icons-pack/react-simple-icons"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@rithik/bocchi-the-website/components/ui/card"
import { Avatar } from "@rithik/bocchi-the-website/components/ui/avatar"
import { AvatarFallback, AvatarImage } from "@radix-ui/react-avatar"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@rithik/bocchi-the-website/components/ui/dialog"
import { toast } from "sonner"
import thumbnail from "@public/static/bocchle-thumbnail.webp"
import Image from "next/image"

interface Props {
  shareMessage: string
  shareUrl: string
}

const PropsContext = createContext<Props | null>(null)

const TwittaPost = () => {
  const { shareMessage } = useContext(PropsContext)!
  return (
    <Card>
      <div className="flex flex-row items-center gap-2 p-6">
        <Avatar>
          <AvatarImage src="https://pbs.twimg.com/profile_images/1164155338980904960/LZq_sIDy_400x400.jpg" />
          <AvatarFallback>gh</AvatarFallback>
        </Avatar>
        <CardHeader className="gap-1 p-0">
          <CardTitle>guitarhero</CardTitle>
          <CardDescription>@guitarhero_0221</CardDescription>
        </CardHeader>
      </div>
      <CardContent>
        <p className="whitespace-pre-line break-words">{shareMessage}</p>
      </CardContent>
      <CardFooter>
        <div className="relative overflow-hidden rounded-md">
          <Image src={thumbnail} alt="Bocchle Thumbnail" />
          <div className="absolute bottom-0 w-full bg-black/50 px-2 py-1 text-xs text-white">
            Bocchle - Guess the Bocchi the Rock episode!
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}

interface ShareDialogContentProps {
  close: () => void
}

const ShareDialogContent = (props: ShareDialogContentProps) => {
  const { close } = props
  const [canShare, setCanShare] = useState(false)
  const { shareMessage, shareUrl } = useContext(PropsContext)!
  const shareMessageWithUrl = useMemo(
    () => `${shareMessage}\n${shareUrl}`,
    [shareMessage, shareUrl],
  )
  const xUrl = useMemo(() => {
    const encodedTweet = encodeURIComponent(shareMessage)
    const encodedUrl = encodeURIComponent(shareUrl)
    return `https://twitter.com/intent/tweet?text=${encodedTweet}&url=${encodedUrl}`
  }, [shareMessage, shareUrl])

  const copy = useCallback(async () => {
    await navigator.clipboard.writeText(shareMessageWithUrl)
    close()
    toast("Copied to clipboard")
  }, [close, shareMessageWithUrl])

  const nativeShare = useCallback(async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          text: shareMessageWithUrl,
        })
        close()
      } catch (err) {}
    }
  }, [close, shareMessageWithUrl])

  useEffect(() => {
    setCanShare(!!navigator.share)
  }, [])

  return (
    <div className="flex w-full flex-col gap-5 px-5">
      <TwittaPost />
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

const Share = (props: Props) => {
  const [open, setOpen] = useState(false)
  const isDesktop = useMediaQuery("(min-width: 640px)")

  const close = useCallback(() => {
    setOpen(false)
  }, [])

  return (
    <PropsContext.Provider value={props}>
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
            <ShareDialogContent close={close} />
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
              <DialogTitle>Share</DialogTitle>
            </DialogHeader>
            <ShareDialogContent close={close} />
            <DialogFooter>
              <Button className="w-full" onClick={close}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </PropsContext.Provider>
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
