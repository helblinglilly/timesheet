import React, { type HTMLProps } from 'react'
import iconImport from '../../app/icon.svg'

import Image from 'next/image'
export const Favicon = (props: HTMLProps<HTMLImageElement>) => {

  return (
    // @ts-expect-error Unhappy prop type
    <Image
      {...props}
      width={20}
      height={20}
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      src={iconImport}
      alt="Favicon"
    />
  )
}
