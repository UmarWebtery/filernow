import { footerQuickLinks, footerServicesData } from "@/data/appData"
import SectionContainer from "../section/SectionContainer"
import FooterColumn from "./FooterColumn"
import FooterDescription from "./FooterDescription"
import TopBarContactItem from "@/components/ui-custom/TopBarContactItem"
import { FiMessageCircle } from "react-icons/fi"
import { IoCallOutline, IoMailUnreadOutline } from "react-icons/io5"
import NewsletterForm from "./NewsletterForm"

import RevealOnScroll from "@/components/ui-custom/RevealOnScroll"
import { ISocialMedia } from "@/lib/types/site-identity/site-identity"

type Props = {
    logoUrl?: string;
    siteName?: string;
    socialMedia?: ISocialMedia;
}

const FooterMain = ({ logoUrl, siteName, socialMedia }: Props) => {
    return (
        <SectionContainer
            sectionClass="relative"
            containerClass='relative container-y-padding'
        >
            {/* <Image
                src={'/assets/footerBg.svg'}
                alt="footerBg"
                // width={100%}
                // height={100%}
                fill
                // quality={100}
                loading="eager"
                style={{ objectFit: "contain" }}
                className="z-0"
            /> */}

            <div
                className="relative z-50x grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[350px_minmax(150px,_1fr)_minmax(150px,_1fr)_1fr] gap-6 md:gap-12"
            >
                <RevealOnScroll delay={0}>
                    <FooterDescription logoUrl={logoUrl} siteName={siteName} socialMedia={socialMedia} />

                </RevealOnScroll>

                <RevealOnScroll delay={100}>
                    <FooterColumn
                        title="services"
                        links={footerServicesData}
                    />
                </RevealOnScroll>

                <RevealOnScroll delay={200}>
                    <FooterColumn
                        title="Quick Links"
                        links={footerQuickLinks}
                    />
                </RevealOnScroll>

                <RevealOnScroll delay={300}>
                    <div className="flex flex-col gap-4">
                        <h6 className="heading-h6 font-bold capitalize">
                            Need any help?
                        </h6>
                        <div className="flex flex-col gap-3 text-text-secondary">
                            <TopBarContactItem
                                icon={<FiMessageCircle
                                    size={18}
                                    className="text-primary"
                                />}
                                label="Click here – WhatsApp"
                                href="https://wa.me/923041110555" openOnNewTab
                                paraClass="para-small hover:text-primary"
                            />
                            <TopBarContactItem
                                icon={<IoMailUnreadOutline
                                    size={18}
                                    className="text-primary"
                                />}
                                label="support@filernow.com"
                                href="mailto:support@filernow.com"
                                paraClass="para-small hover:text-primary"
                            />
                            <TopBarContactItem
                                icon={<IoCallOutline
                                    size={18}
                                    className="text-primary"
                                />}
                                label="0304 1110555"
                                href="tel:+923041110555"
                                paraClass="para-small hover:text-primary"
                            />
                        </div>

                        <h6 className="heading-h6 mt-2">
                            Subscribe to our newsletter
                        </h6>

                        <NewsletterForm />
                    </div>
                </RevealOnScroll>
            </div>
        </SectionContainer>
    )
}

export default FooterMain