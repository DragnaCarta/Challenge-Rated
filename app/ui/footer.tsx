import Link from 'next/link'
import clsx from 'clsx'

type FooterLinkSection = {
  section: string
  children: FooterLinks[]
}

type FooterLinks = {
  name: string
  url: string
  isExternal?: boolean
}

type Props = { className?: string }

function Footer({ className }: Props) {
  return (
    <div className={clsx('flex flex-col py-6 bg-base-200', className)}>
      <div className="footer justify-center items-center max-w-screen-md mx-auto px-4">
        <aside>
          <p className="text-center w-full">
            Got feedback? Submit it using our Google Form{' '}
            <a
              href="https://docs.google.com/forms/d/e/1FAIpQLSchv2zAKiBeEHJkJAYkCdDMNUws6yG_HEo4Mv7UYH63opTdLg/viewform"
              target="_blank"
              rel="noreferrer"
              className="link"
            >
              here
            </a>
            .
          </p>
          <p className="text-center w-full">
            Got questions or an interest in contributing? Email&nbsp;
            <a href="mailto:dragnacartacreations@gmail.com" className="link">
              dragnacartacreations@gmail.com
            </a>
          </p>
          <p className="text-center w-full mt-4">
            This project was made possible by the contributions of&nbsp;
            <a
              href="https://github.com/DragnaCarta/Challenge-Rated"
              target="_blank"
              rel="noreferrer"
              className="link"
            >
              open-source
            </a>
            &nbsp;developers.
          </p>
        </aside>
      </div>
    </div>
  )
}

export default Footer
