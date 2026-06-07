import { cn } from "@/lib/utils"

type PageContainerProps = {
  children: React.ReactNode
  className?: string
}

/** Shared layout shell — matches reference portfolio gutters + max width */
export const pageContainerClass = "site-container"

const PageContainer = ({ children, className }: PageContainerProps) => {
  return <div className={cn(pageContainerClass, className)}>{children}</div>
}

export default PageContainer
