"use server"
import React from "react";

async function getData() {
  return await fetch("https://jsonplaceholder.typicode.com/comments").then(
    async (res) => await res.json(),
  );
}

export default async function SocialAuthMethods() {
  const data = await getData();

  return <p>Auth methods {JSON.stringify(data)}</p>;
}
