// components/common/footer/FooterDescription.tsx
"use client"

import { AnchorBtn } from '@/components/common/btns/Button';
import { socialIconMap } from '@/data/appData';
import { ISocialMedia } from '@/lib/types/site-identity/site-identity';
import Image from 'next/image';
import Link from 'next/link';

type Props = {
    logoUrl?: string;
    siteName?: string;
    socialMedia?: ISocialMedia;
}

const FooterDescription = ({ logoUrl, siteName, socialMedia = {} }: Props) => {
    const activeSocials = (Object.keys(socialMedia) as Array<keyof ISocialMedia>)
        .filter((key) => socialMedia[key]);

    return (
        <div className="flex flex-col gap-5">
            <Link href={'/'}>
                <Image
                    src={logoUrl || '/assets/headerLogo.svg'}
                    alt={siteName ? `${siteName} footer logo` : 'footerLogo'}
                    width={58}
                    height={58}
                    className='hover:-translate-y-0.5 default-transition'
                />
            </Link>

            <p className="para-small text-text-secondary-muted leading-[22.7px]">
                File your taxes the smart way with FilerNow. From
                NTN registration to company setup, tax returns and
                business compliance we make the process fast,
                easy and reliable. Grow as a filer and enjoy all the
                benefits you deserve.
            </p>

            <div className="flex gap-3">
                {activeSocials.map((key) => (
                    <AnchorBtn
                        key={key}
                        href={socialMedia[key]!}
                        icon={socialIconMap[key]}
                        variant='primary-light'
                        className='border-transparent p-2.5 hover:-translate-y-0.5'
                    />
                ))}
            </div>
        </div>
    )
}

export default FooterDescription