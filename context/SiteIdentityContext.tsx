"use client"

import { createContext, useContext, type PropsWithChildren } from "react"
import type { ISiteIdentity } from "@/lib/types/site-identity/site-identity"

const SiteIdentityContext = createContext<ISiteIdentity | undefined>(undefined)

type SiteIdentityProviderProps = PropsWithChildren<{
    site: ISiteIdentity
}>

export const SiteIdentityProvider = ({ site, children }: SiteIdentityProviderProps) => (
    <SiteIdentityContext.Provider value={site}>
        {children}
    </SiteIdentityContext.Provider>
)

export const useSiteIdentity = () => {
    const site = useContext(SiteIdentityContext)
    if (!site) throw new Error("useSiteIdentity must be used inside SiteIdentityProvider")
    return site
}
