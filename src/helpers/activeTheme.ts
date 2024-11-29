"use client"

import React from "react"

export default function activeTheme() {
  return localStorage.getItem('theme');
}
