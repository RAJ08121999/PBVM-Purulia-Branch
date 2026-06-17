"use client"

import React, { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useLanguage } from "@/context/LanguageContext"
import { cn } from "@/lib/utils"
import { Globe, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

export const Navbar = () => {
  const { language, toggleLanguage, t } = useLanguage()
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  const navItems = [
    { href: "/", labelEn: "Home", labelBn: "মূল পাতা" },
    { href: "/about", labelEn: "About Us", labelBn: "আমাদের সম্পর্কে" },
    { href: "/activities", labelEn: "Activities", labelBn: "কর্মসূচি" },
    { href: "/events", labelEn: "Events", labelBn: "ইভেন্টসমূহ" },
    { href: "/gallery", labelEn: "Gallery", labelBn: "গ্যালারি" },
    { href: "/publications", labelEn: "Publications", labelBn: "প্রকাশনা" },
    { href: "/policy-issues", labelEn: "Policy Issues", labelBn: "নীতিমালা" },
    { href: "/downloads", labelEn: "Downloads", labelBn: "ডাউনলোড" },
    { href: "/contact", labelEn: "Contact", labelBn: "যোগাযোগ" },
  ]

  const isActive = (path: string) => {
    if (path === "/") {
      return pathname === "/"
    }
    return pathname.startsWith(path)
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-200 bg-white/95 backdrop-blur-md dark:border-zinc-800 dark:bg-black/95">
      <div className="page-container" style={{ display: "flex", height: "4rem", alignItems: "center", justifyContent: "space-between" }}>
        
        {/* Brand Logo & Name */}
        <Link href="/" className="flex items-center gap-2.5" style={{ textDecoration: "none" }}>
          <img
            src="/logo.png"
            alt="PBVM Logo"
            className="h-10 w-10 object-contain hover:scale-105 transition-transform"
          />
          <div className="flex flex-col" style={{ textAlign: "left" }}>
            <span className="font-heading text-sm font-bold tracking-tight text-blue-900 dark:text-blue-400 sm:text-base" style={{ lineHeight: 1.2 }}>
              {t("PBVM Purulia", "পশ্চিমবঙ্গ বিজ্ঞান মঞ্চ")}
            </span>
            <span className="text-xs font-medium text-teal-600 dark:text-teal-400 leading-none" style={{ marginTop: "0.125rem" }}>
              {t("Purulia District Branch", "পুরুলিয়া জেলা শাখা")}
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex lg:gap-x-6 items-center">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "font-body text-xs font-semibold uppercase tracking-wider transition-colors hover:text-blue-600 dark:hover:text-blue-400",
                isActive(item.href)
                  ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 pb-1"
                  : "text-zinc-600 dark:text-zinc-300 pb-1"
              )}
              style={{ textDecoration: "none" }}
            >
              {language === "bn" ? item.labelBn : item.labelEn}
            </Link>
          ))}
        </nav>

        {/* CTA & Language Toggle */}
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          {/* Join Us Button (Desktop) */}
          <Link href="/join-us" className="hidden sm:inline-block" style={{ textDecoration: "none" }}>
            <Button
              style={{
                background: "#0D9488",
                color: "#ffffff",
                fontWeight: 600,
                borderRadius: "9999px",
                padding: "0.5rem 1.25rem",
                fontSize: "0.85rem",
                border: "none",
                cursor: "pointer",
                height: "2.25rem",
                boxSizing: "border-box",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center"
              }}
              className="hover:bg-teal-700"
            >
              {t("Join Us", "যোগদান করুন")}
            </Button>
          </Link>

          {/* Language Switcher */}
          <Button
            variant="outline"
            onClick={toggleLanguage}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.35rem",
              borderRadius: "9999px",
              border: "1px solid #E2E8F0",
              background: "#ffffff",
              color: "#3F3F46",
              padding: "0.5rem 1rem",
              fontSize: "0.85rem",
              cursor: "pointer",
              height: "2.25rem",
              boxSizing: "border-box",
              justifyContent: "center"
            }}
            className="hover:bg-zinc-50"
          >
            <Globe style={{ height: "1rem", width: "1rem", color: "#0D9488" }} />
            <span style={{ fontSize: "0.75rem", fontWeight: 700, fontFamily: "sans-serif" }}>
              {language === "en" ? "বাংলা" : "EN"}
            </span>
          </Button>

          {/* Mobile Menu Trigger (Hamburger) */}
          <div className="lg:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[280px] sm:w-[350px] p-6 bg-white dark:bg-black">
                <SheetHeader className="text-left border-b border-zinc-100 pb-4 mb-4 dark:border-zinc-900">
                  <SheetTitle className="flex items-center gap-2">
                    <img
                      src="/logo.png"
                      alt="PBVM Logo"
                      className="h-8 w-8 object-contain"
                    />
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-zinc-900 dark:text-zinc-50">
                        {t("PBVM Purulia", "পশ্চিমবঙ্গ বিজ্ঞান মঞ্চ")}
                      </span>
                      <span className="text-xxs text-zinc-500 leading-none">
                        {t("Purulia District Branch", "পুরুলিয়া জেলা শাখা")}
                      </span>
                    </div>
                  </SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-4 mt-6">
                  {navItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        "font-body text-sm font-bold px-3 py-2 rounded-lg transition-colors",
                        isActive(item.href)
                          ? "bg-blue-50 text-blue-600 dark:bg-blue-950/30 dark:text-blue-400"
                          : "text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-900"
                      )}
                    >
                      {language === "bn" ? item.labelBn : item.labelEn}
                    </Link>
                  ))}
                  
                  {/* Join Us Link (Mobile) */}
                  <Link
                    href="/join-us"
                    onClick={() => setIsOpen(false)}
                    className="mt-4 px-3"
                  >
                    <Button className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 rounded-lg">
                      {t("Join Us", "যোগদান করুন")}
                    </Button>
                  </Link>
                </div>
              </SheetContent>
            </Sheet>
          </div>

        </div>

      </div>
    </header>
  )
}
export default Navbar
