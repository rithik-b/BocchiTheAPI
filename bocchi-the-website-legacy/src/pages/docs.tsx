import { NextPage } from "next"
import Head from "next/head"
import React from "react"
import SwaggerUI from "swagger-ui-react"
import "swagger-ui-react/swagger-ui.css"

const Docs: NextPage = () => {
  return (
    <main>
      <Head>
        <title>Boccher - API Docs</title>
        <meta name="description" content="API docs for the bocch" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <section className="pb-5">
        <SwaggerUI url="api/swagger" />
      </section>

      <link rel="stylesheet" href="/styles/docs.css" />
    </main>
  )
}

export default Docs
