import Link from "next/link"
import Image from "next/image"
import { Facebook, Instagram } from "lucide-react"

export function SiteFooter() {
  return (
    <footer className="bg-black text-white">
      <div className="container px-4 py-8">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <h3 className="mb-4 text-sm font-medium uppercase">Mentions légales</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link href="#" className="hover:text-white">
                  Politique de confidentialité
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white">
                  Conditions générales
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-medium uppercase">Mentions légales</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link href="#" className="hover:text-white">
                  Politique de cookies
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white">
                  Mentions légales
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-medium uppercase">Mentions légales</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link href="#" className="hover:text-white">
                  Politique de confidentialité
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white">
                  Conditions générales
                </Link>
              </li>
            </ul>
          </div>

          <div className="flex flex-col items-center md:items-end">
            <div className="relative mb-4 h-10 w-10">
              <Image src="/placeholder.svg?height=40&width=40" alt="Logo" fill className="object-contain" />
            </div>
            <div className="flex gap-4">
              <Link href="#" className="hover:text-blue-400">
                <Instagram className="h-5 w-5" />
              </Link>
              <Link href="#" className="hover:text-blue-400">
                <Facebook className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
