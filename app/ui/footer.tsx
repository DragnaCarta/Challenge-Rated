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
      <div className="footer justify-center max-w-screen-md mx-auto px-4">
        <aside className="text-center">
          <p className="text-center">
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
          <p>
            Got questions, feedback, or an interest in contributing? Email&nbsp;
            <a href="mailto:dragnacartacreations@gmail.com" className="link">
              dragnacartacreations@gmail.com
            </a>
          </p>
        </aside>
      </div>
    </div>
  )
}

export default Footer
