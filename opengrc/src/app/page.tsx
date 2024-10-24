"use client";

import { Suspense } from "react";
import { Authenticated } from "@refinedev/core";
import { NavigateToResource } from "@refinedev/nextjs-router";
import Head from 'next/head';

export default function IndexPage() {
  return (
    <Suspense>
      <Head>
        <title>libre-grc</title>
        <link rel="icon" href="/libre-grc-icon.ico" />
      </Head>
      <Authenticated key="home-page">
        <NavigateToResource />
      </Authenticated>
    </Suspense>
  );
}
