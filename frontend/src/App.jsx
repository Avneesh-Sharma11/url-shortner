import axios from "axios";
import { useState } from "react"
import { QRCodeCanvas } from "qrcode.react";
import qrCodeGenrate from "qrcode"

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL
function App() {
  const [url, setUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const [qrImage, setQrImage] = useState("");

  const handleShorten = async () => {
    if (!url) return;
    
    try {
      const res = await axios.post(`${API_BASE_URL}/shorten`, { originalUrl: url })

      const newShortUrl = res.data.shortURL;
      setShortUrl(newShortUrl)
      setCopied(false)
      const qr = await qrCodeGenrate.toDataURL(newShortUrl)
      setQrImage(qr);
    } catch (error) {
      console.log(error)
      alert('Something went wrong')
    }
  }
  const handleCopy = async () => {
    navigator.clipboard.writeText(shortUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000);
  }
  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-indigo-900 p-4">

        <div className="bg-white/20 backdrop-blur-lg shadow-xl rounded-2xl p-8 w-full max-w-md text-center border border-white/30">

          <h1 className="text-3xl font-bold text-white mb-6">
            🔗 URL Shortener
          </h1>

          <div className="flex gap-2 mb-6">
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Enter your long URL..."
              className="flex-1 px-4 py-2 rounded-lg outline-none border border-white/30 bg-white/30 text-white placeholder-white/70"
            />

            <button
              onClick={handleShorten}
              className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition"
            >
              Shorten
            </button>
          </div>

          {shortUrl && (
            <div className="bg-white/20 p-4 rounded-xl border border-white/30">

              <p className="text-white mb-2">✨ Your Short URL</p>

              <a
                href={shortUrl}
                target="_blank"
                className="block text-blue-200 underline break-all mb-3"
              >
                {shortUrl}
              </a>

              <button
                onClick={handleCopy}
                className="bg-green-500 text-white px-4 py-1 rounded-md hover:bg-green-600 transition mb-4"
              >
                {copied ? "Copied!" : "Copy"}
              </button>

              <div className="flex flex-col items-center">
                <p className="text-white mb-2">📱 Scan QR Code</p>

                <div className="bg-white p-2 rounded-lg">
                  <QRCodeCanvas value={shortUrl} size={160} />
                </div>

                {qrImage && (
                  <a
                    href={qrImage}
                    download="qr-code.png"
                    className="mt-3 text-sm text-yellow-200 underline hover:text-yellow-300"
                  >
                    Download QR Code
                  </a>
                )}
              </div>

            </div>
          )}

        </div>
      </div>
    </>
  )
}

export default App
