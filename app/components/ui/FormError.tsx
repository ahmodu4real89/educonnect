import React, { HTMLAttributes } from 'react'

interface FormErrorProp extends HTMLAttributes<HTMLElement> {
  message: undefined | string
}

export default function FormError({ children, message }: FormErrorProp) {
  return (
    <>
      {children ? children : <p className="my-1 text-xs text-red-500">{message} &nbsp;</p>}
    </>
  )
}
