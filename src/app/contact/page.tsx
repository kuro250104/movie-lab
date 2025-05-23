import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Send, Instagram, Youtube } from "lucide-react"
import Link from "next/link"

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Main Content */}
      <main className="container mx-auto flex-1 px-4 py-12 max-w-6xl">
        <div className="text-center mb-12">
          <p className="text-orange-500 mb-2">ARE YOU READY?</p>
          <h1 className="text-5xl md:text-6xl font-bold">CONTACTEZ-NOUS !</h1>
        </div>

        {/* Info Sections */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 text-center">
          <div>
            <h2 className="text-xl font-bold mb-4">OÙ ?</h2>
            <p>2 Rue Lieutenant Guy Dedieu</p>
            <p>Toulouse, 31400</p>
          </div>
          <div>
            <h2 className="text-xl font-bold mb-4">COMMENT ?</h2>
            <p>info@movi-lab.fr</p>
          </div>
          <div>
            <h2 className="text-xl font-bold mb-4">QUAND ?</h2>
            <p>Lun-Ven : 9h - 18h</p>
          </div>
        </div>

        {/* Contact Form */}
        <div className="border border-gray-700 rounded-lg p-6 max-w-3xl mx-auto">
          <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Input
                type="text"
                placeholder="NOM"
                className="bg-transparent border-b border-t-0 border-l-0 border-r-0 rounded-none focus-visible:ring-0 px-0"
              />
            </div>
            <div>
              <Input
                type="text"
                placeholder="PRÉNOM"
                className="bg-transparent border-b border-t-0 border-l-0 border-r-0 rounded-none focus-visible:ring-0 px-0"
              />
            </div>
            <div>
              <Input
                type="email"
                placeholder="E-MAIL"
                className="bg-transparent border-b border-t-0 border-l-0 border-r-0 rounded-none focus-visible:ring-0 px-0"
              />
            </div>
            <div>
              <Input
                type="tel"
                placeholder="TÉLÉPHONE"
                className="bg-transparent border-b border-t-0 border-l-0 border-r-0 rounded-none focus-visible:ring-0 px-0"
              />
            </div>
            <div className="md:col-span-2">
              <Textarea
                placeholder="MESSAGE..."
                className="bg-transparent border-b border-t-0 border-l-0 border-r-0 rounded-none focus-visible:ring-0 resize-none min-h-[100px] px-0"
              />
            </div>
            <div className="md:col-span-2 flex justify-end">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-6">
                <Send className="mr-2 h-4 w-4" /> ENVOYER
              </Button>
            </div>
          </form>
        </div>

        {/* Map Section */}
        <div className="mt-20">
          <h2 className="text-blue-500 text-3xl font-bold mb-6 text-center">Notre localisation</h2>
          <div className="rounded-lg overflow-hidden mb-6 shadow-lg">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2889.5351025124196!2d1.4520099761462198!3d43.58799905555138!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x12aebb7e66195555%3A0x2a8f2f4b2b4f9e9a!2s2%20Rue%20du%20Lieutenant%20Guy%20Dedieu%2C%2031300%20Toulouse!5e0!3m2!1sfr!2sfr!4v1716465302000!5m2!1sfr!2sfr"
              width="100%"
              height="450"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Google Maps - 2 Rue du Lieutenant Guy Dedieu, Toulouse"
              className="w-full"
            ></iframe>
          </div>
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
            <a
              href="https://www.google.com/maps/dir//2+Rue+du+Lieutenant+Guy+Dedieu,+31300+Toulouse"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white rounded-full px-6 py-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M9 20l-5.447-2.724A1 1 0 0 1 3 16.382V5.618a1 1 0 0 1 1.447-.894L9 7" />
                <path d="M21 5.618a1 1 0 0 0-1.447-.894L15 7v13l5.447-2.724A1 1 0 0 0 21 16.382V5.618Z" />
              </svg>
              Itinéraires
            </a>
            <a
              href="https://www.google.com/maps/place/2+Rue+du+Lieutenant+Guy+Dedieu,+31300+Toulouse/@43.5879991,1.45201,17z/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white rounded-full px-6 py-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M15 3h6v6" />
                <path d="M10 14 21 3" />
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              </svg>
              Agrandir le plan
            </a>
          </div>
          <div className="text-center">
            <Link
              href="https://outlook.office365.com/book/MoviLab@humet.fr/?fbclid=PAZXh0bgNhZW0CMTEAAaaql2oCV9PRAZafGbhQETj9Amkh10X-Ar8-qrkTYEz4NivvRd_b18_hfbQ_aem_uws6QOcnAICsDDfcqqXAlw"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white rounded-full px-6 py-2 mx-auto"
            >
              PRENEZ RDV
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="container mx-auto p-4 flex justify-center gap-6 mt-8 mb-4">
        <Link href="https://instagram.com" aria-label="Instagram">
          <Instagram className="h-6 w-6 text-white hover:text-gray-300" />
        </Link>
        <Link href="https://tiktok.com" aria-label="TikTok">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-6 w-6 text-white hover:text-gray-300"
          >
            <path d="M9 12a4 4 0 1 0 0 8 4 4 0 0 0 0-8z" />
            <path d="M15 8a4 4 0 0 0 0 8" />
            <path d="M15 8a4 4 0 0 1 4 4" />
            <line x1="15" y1="8" x2="15" y2="20" />
          </svg>
        </Link>
        <Link href="https://youtube.com" aria-label="YouTube">
          <Youtube className="h-6 w-6 text-white hover:text-gray-300" />
        </Link>
      </footer>
    </div>
  )
}
