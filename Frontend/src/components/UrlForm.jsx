import { useState } from "react"
import { createCustomShortUrl, createShortUrl } from "../api/shortUrl.api.js"
import { useSelector } from "react-redux"
import { queryClient } from "../main.jsx"

// Define the URL form component
const UrlForm = () => {
  // Store the original URL
  const [url, setUrl] = useState("")

  // Store the shortened URL
  const [shortUrl, setShortUrl] = useState()

  // Track the copy status
  const [copied, setCopied] = useState(false)

  // Store error messages
  const [error, setError] = useState(null)

  // Track the request state
  const [loading, setLoading] = useState(false)

  // Store the custom slug
  const [customSlug, setCustomSlug] = useState("")

  // Get authentication status
  const { isAuthenticated } = useSelector((state) => state.auth)

  // Handle URL shortening
  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!url.trim()) {
      setError("Enter a URL to shorten.")
      return
    }

    setLoading(true)
    setError(null)
    try {
      const shortUrl = customSlug.trim()
        ? await createCustomShortUrl(url, customSlug.trim())
        : await createShortUrl(url)
      setShortUrl(shortUrl)
      queryClient.invalidateQueries({ queryKey: ['userUrls'] })
    }
    catch (err) {
      setError(err.message || "We could not create the short URL.")
    }
    finally {
      setLoading(false)
    }
  }

  // Handle copying the URL
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shortUrl)
      setCopied(true)
      setTimeout(() => {
        setCopied(false)
      }, 2000)
    }
    catch {
      setError("We could not copy the shortened URL.")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">

      {/* Original URL input section */}
      <div>
        <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-1">
          Enter your URL
        </label>

        {/* Accept the original URL */}
        <input
          onInput={(event) => setUrl(event.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          type="url" id="url" value={url} placeholder="https://example.com" required />
      </div>

      {/* Create the shortening button */}
      <button
        className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
        type="submit" disabled={loading} >
        {loading ? "Shortening..." : "Shorten URL"}
      </button>

      {/* Display errors when present */}
      {error && (
        <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}

      {/* Show custom slug input to logged-in users */}
      {isAuthenticated && (
        <div className="mt-4">
          <label htmlFor="customSlug" className="block text-sm font-medium text-gray-700 mb-1">
            Custom URL (optional)
          </label>

          {/* Accept the custom slug */}
          <input
            onChange={(event) => setCustomSlug(event.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            type="text" id="customSlug" value={customSlug} placeholder="Enter custom slug" />
        </div>
      )}

      {/* Display the shortened URL when available */}
      {shortUrl && (
        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-2">Your shortened URL:</h2>
          <div className="flex items-center">

            {/* Show the shortened URL */}
            <input
              className="flex-1 p-2 border border-gray-300 rounded-l-md bg-gray-50"
              type="text" readOnly value={shortUrl} />

            {/* Copy the shortened URL */}
            <button
              onClick={handleCopy}
              className={`px-4 py-2 rounded-r-md transition-colors duration-200 ${copied
                ? 'bg-green-500 text-white hover:bg-green-600'
                : 'bg-gray-200 hover:bg-gray-300'
                }`}>
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
        </div>
      )}
    </form>
  )
}

export default UrlForm