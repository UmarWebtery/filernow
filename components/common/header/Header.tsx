"use client"

import { useSiteIdentity } from "@/context/SiteIdentityContext"
import MenuBar from "./MenuBar"
import TopBar from "./TopBar"

type Props = {}

const Header = (props: Props) => {
    const site = useSiteIdentity()

    return (<>
        <TopBar email={site.adminEmail} />

        <MenuBar logoUrl={site.logoUrl} siteName={site.siteName} />
    </>)
}

export default Header
