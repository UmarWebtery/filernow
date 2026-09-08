// components/header/MenuBar.tsx
"use client"

import { useState } from "react"
import { IconSmallBtn, LinkBtn } from "@/components/common/btns/Button"
import SectionContainer from "../section/SectionContainer"
import Image from "next/image"
import { FileBadge, Menu, UserRound } from "lucide-react"
import Link from "next/link"
import DeskMenu from "./DeskMenu"
import ThemeToggle from "@/components/theme/ThemeToggle"
import { cn } from "@/utils/cn"
import { useStickyHeader } from "@/hooks/useStickyHeader"
import { useAuthDrawer } from "@/context/AuthDrawerContext"
import MobileMenuDrawer from "./mobileMenu/MobileMenuDrawer"

type Props = {
    logoUrl?: string,
    siteName?: string,
}

const MenuBar = ({ logoUrl = '/assets/headerLogo.svg', siteName }: Props) => {
    const { isScrolled } = useStickyHeader(".menubar")
    const { openAuthDrawer } = useAuthDrawer()
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    return (
        <SectionContainer
            sectionClass={cn(
                "menubar bg-background border-b border-border-clr/25",
                isScrolled && "scrolled",
            )}
            containerClass="py-1.5"
        >
            <div className="flex justify-between items-center">
                <Link href={'/'} className="hover:-translate-y-0.5 default-transition">
                    <Image
                        src={logoUrl}
                        alt={siteName ? `${siteName} Logo` : "header_logo"}
                        width={58}
                        height={58}
                        priority
                        className="-ml-1"
                    />
                </Link>

                <DeskMenu />

                <div className="flex items-center gap-4">
                    <IconSmallBtn
                        // onClick={() => openAuthDrawer("signin")}
                        onClick={() => setIsMobileMenuOpen(true)}
                        ariaLabel="Sign in or register"
                        className="hidden md:flex"
                    >
                        <UserRound size={20} />
                    </IconSmallBtn>

                    <ThemeToggle />

                    <LinkBtn
                        href="/become-filer"
                        label="Become a filer"
                        icon={<FileBadge size={16} />}
                        className="hidden md:flex"
                    />

                    <IconSmallBtn
                        onClick={() => setIsMobileMenuOpen(true)}
                        ariaLabel="toggle mobile menu"
                        className="md:hidden p-2 bg-primary-lighter"
                    >
                        <Menu size={20} className="text-primary" />
                    </IconSmallBtn>
                </div>
            </div>

            <MobileMenuDrawer
                isOpen={isMobileMenuOpen}
                onClose={() => setIsMobileMenuOpen(false)}
            />
        </SectionContainer>
    )
}

export default MenuBar