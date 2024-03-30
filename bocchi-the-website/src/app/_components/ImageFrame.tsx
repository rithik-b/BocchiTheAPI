import { type StaticImport } from "next/dist/shared/lib/get-img-props"
import { cn } from "../../lib/utils"
import { AspectRatio } from "../../components/ui/aspect-ratio"
import Image, { type ImageProps } from "next/image"

const ImageFrame = (
  props: Omit<ImageProps, "alt" | "src"> & {
    alt?: string
    src?: string | StaticImport
  },
) => {
  return (
    <div className="flex w-full justify-center rounded-b-md bg-pink-300 dark:bg-slate-700 md:p-8">
      <AspectRatio ratio={16 / 9}>
        {!!props.src && (
          <Image
            {...props}
            src={props.src}
            alt="A frame from the show Bocchi the Rock!"
            fill
            unoptimized
            className={cn("object-cover md:rounded-md", props.className)}
          />
        )}
      </AspectRatio>
    </div>
  )
}

export default ImageFrame
