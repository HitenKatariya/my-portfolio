"use client"

import { Dialog, DialogContent, DialogTrigger, DialogClose, DialogTitle } from "@/components/ui/dialog"
import { profile } from "@/lib/constants/profile"
import { Download, X } from "lucide-react"

interface ResumeDialogProps {
  children: React.ReactNode
}

export function ResumeDialog({ children }: ResumeDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent
        showCloseButton={false}
        className="max-w-4xl w-[95vw] h-[90vh] p-0 gap-0 bg-[#0a0c10] border-white/10 overflow-hidden"
      >
        <DialogTitle className="sr-only">Resume</DialogTitle>
        <div className="relative w-full h-full flex flex-col">
          <div className="flex items-center justify-between px-4 py-2 border-b border-white/10 shrink-0">
            <span className="text-sm text-slate-400 font-mono">Resume — Hiten Katariya</span>
            <div className="flex items-center gap-2">
              <a
                href={profile.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-[#26d868] transition-colors p-1"
                title="Download"
              >
                <Download size={16} />
              </a>
              <DialogClose className="text-slate-400 hover:text-white transition-colors p-1 cursor-pointer">
                <X size={16} />
              </DialogClose>
            </div>
          </div>
          <div className="flex-1 min-h-0">
            <iframe
              src="/resume/Hiten_k_Resume.pdf#toolbar=0"
              className="w-full h-full"
              title="Resume"
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
