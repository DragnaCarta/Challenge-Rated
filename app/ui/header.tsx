import Image from 'next/image'
import Link from 'next/link'

function Header() {
  return (
    <header className="sticky top-0 z-50 flex h-14 w-full items-center bg-neutral shadow-lg">
      <nav className="mx-auto flex w-full max-w-screen-md items-center justify-between p-4">
        <Link href="/" className="text-2xl inline-flex items-center gap-2">
          <Image
            src={'/favicon-32x32.png'}
            width="24"
            height="24"
            alt="Challenge Rated"
          />
          Challenge Rated
        </Link>
        <Link href="/info" className="link link-hover">
          How It Works
        </Link>
      </nav>
    </header>
  )
}

export default Header
