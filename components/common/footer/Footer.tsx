"use client"

import FooterMain from './FooterMain'
import FooterCopyright from './FooterCopyright'
import { useSiteIdentity } from '@/context/SiteIdentityContext'


type Props = {}

const Footer = (props: Props) => {

  const site = useSiteIdentity()

  return (
    <footer className="relative flex flex-col bg-background">
      <FooterMain
        logoUrl={site.logoUrl}
        siteName={site.siteName}
        socialMedia={site.socialMedia}
      />

      <FooterCopyright />
    </footer>
  )
}

export default Footer