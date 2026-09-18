"use client"

"use client"

import { Toaster as Sonner } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      className="toaster group"
      style={{ zIndex: 9999 }}
      toastOptions={{
        classNames: {
          toast:
            "group toast bg-white text-gray-900 border border-gray-200 shadow-lg",
          description: "text-gray-600",
          actionButton:
            "bg-gray-900 text-white",
          cancelButton:
            "bg-gray-100 text-gray-700",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
