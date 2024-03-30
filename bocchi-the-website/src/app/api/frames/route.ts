import getRandomFrame from "@rithik/bocchi-the-website/server/getRandomFrame"
import { getTRPCErrorFromUnknown } from "@trpc/server"
import { type NextRequest } from "next/server"

export async function GET(req: NextRequest) {
  const episode = req.nextUrl.searchParams.get("episode")

  try {
    const randomFrame = await getRandomFrame(episode)
    return Response.json(randomFrame, {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET",
      },
    })
  } catch (e) {
    const trpcError = getTRPCErrorFromUnknown(e)
    return new Response(trpcError.message, {
      status: trpcError.code === "BAD_REQUEST" ? 400 : 500,
    })
  }
}
