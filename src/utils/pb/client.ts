"use client";

import Pocketbase from "pocketbase";
import { useEffect, useState } from "react";
import { getCookieClient } from "../cookies";

export function usePocketbase() {
  const [pb, setPb] = useState<Pocketbase>(
    new Pocketbase(process.env.POCKETBASE_URL),
  );

  useEffect(() => {
    if (typeof document !== "undefined") {
      const pbCookie = getCookieClient("pb_auth");
      const newPb = new Pocketbase(process.env.POCKETBASE_URL);

      if (pbCookie) {
        const data = JSON.parse(pbCookie ?? "{}");
        newPb.authStore.save(data.token, data.record || data.meta);
      } else {
        newPb.authStore.clear();
      }
      setPb(newPb);
    }
  }, []);

  return pb;
}
