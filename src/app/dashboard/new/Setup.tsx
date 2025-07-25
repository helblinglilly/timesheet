"use client";

import { useRef, useState } from "react";
import OfficeHours from "./Hours";
import Kind from "./Kind";
import Name from "./Name";

export default function DashboardSetup() {
  const [screen, setScreen] = useState<"start" | "hours" | "name">("start");
  const kindRef = useRef<HTMLInputElement>(null);
  const minutesPerDayRef = useRef<HTMLInputElement>(null);
  const daysPerWeekRef = useRef<HTMLInputElement>(null);
  const lunchMinutesRef = useRef<HTMLInputElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const submitRef = useRef<HTMLButtonElement>(null);

  return (
    <>
      <input hidden name="kind" ref={kindRef} />
      <input hidden name="minutesPerDay" ref={minutesPerDayRef} />
      <input hidden name="daysPerWeek" ref={daysPerWeekRef} />
      <input hidden name="lunchMinutes" ref={lunchMinutesRef} />
      <input hidden name="name" ref={nameRef} />


      <button hidden type="submit" ref={submitRef}>Finish</button>

      <div className="grid gap-4">
        {["start"].some((a) => {
          return a === screen;
        }) && (
          <Kind
            action={(value) => {
              if (kindRef.current) {
                kindRef.current.value = value;
                setScreen("hours");
              }
            }}
          />
        )}

        {screen === "hours" && (
          <OfficeHours
            action={(minutesPerDay, daysPerWeek, lunchMinutes) => {
              if (minutesPerDayRef.current) {
                minutesPerDayRef.current.value = minutesPerDay.toString();
              }
              if (daysPerWeekRef.current) {
                daysPerWeekRef.current.value = daysPerWeek.toString();
              }
              if (lunchMinutesRef.current) {
                lunchMinutesRef.current.value = lunchMinutes.toString();
              }
              setScreen("name");
            }}
          />
        )}
        {screen === "name" && (
          <Name
            action={(name) => {
              if (nameRef.current) {
                nameRef.current.value = name;
              }

              if (submitRef.current) {
                submitRef.current.click();
              }
            }}
            copy={
              kindRef.current?.value === "office"
                ? "What's the name of the company?"
                : "What do you want to call this gig?"
            }
          />
        )}
      </div>
    </>
  );
}
