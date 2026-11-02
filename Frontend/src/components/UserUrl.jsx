import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { getAllUserUrls } from "../api/user.api.js"

// Define the UserUrl component
const UserUrl = () => {
  // Fetch user URLs and track request status
  const { data: urls, isLoading, isError, error } = useQuery({
    queryKey: ["userUrls"],
    queryFn: getAllUserUrls,
    refetchInterval: 30000,
    staleTime: 0,
  })

  // Store the ID of the copied URL
  const [copiedId, setCopiedId] = useState(null)

  // Handle copying a shortened URL
  const handleCopy = (url, id) => {
    navigator.clipboard.writeText(url)
    setCopiedId(id)
    setTimeout(() => {
      setCopiedId(null)
    }, 2000)
  }

  // Show a loading spinner while fetching URLs
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center my-8 text-gray-500">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        <p className="mt-3 text-sm">Loading your URLs...</p>
      </div>
    )
  }

  // Show an error message if fetching fails
  if (isError) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded my-4">
        {error?.message || "We could not load your URLs. Please try again."}
      </div>
    )
  }

  // Show a message when no URLs are available
  if (!urls?.urls || urls.urls.length === 0) {
    return (
      <div className="text-center text-gray-500 my-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <svg className="w-12 h-12 mx-auto text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
        </svg>
        <p className="text-lg font-medium">No URLs found</p>
        <p className="mt-1">You haven't created any shortened URLs yet.</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg mt-5 shadow-md overflow-hidden">

      {/* Enable horizontal scrolling for the table */}
      <div className="overflow-x-auto h-56">

        {/* Display URL information in a table */}
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>

              {/* Display the original URL column */}
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Original URL
              </th>

              {/* Display the shortened URL column */}
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Short URL
              </th>

              {/* Display the click count column */}
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Clicks
              </th>

              {/* Display the actions column */}
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>

          {/* Display the user's URL records */}
          <tbody className="bg-white divide-y divide-gray-200">

            {/* Reverse the URL list and create a row for each URL */}
            {[...urls.urls].reverse().map((url) => (

              // Create a row using the unique URL ID
              <tr key={url._id} className="hover:bg-gray-50">

                {/* Display the original URL */}
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900 truncate max-w-xs">
                    {url.full_url}
                  </div>
                </td>

                {/* Display the shortened URL link */}
                <td className="px-6 py-4">
                  <div className="text-sm">
                    <a className="text-blue-600 hover:text-blue-900 hover:underline"
                      href={`http://localhost:3000/${url.short_url}`} target="_blank" rel="noopener noreferrer">
                      {`localhost:3000/${url.short_url}`}
                    </a>
                  </div>
                </td>

                {/* Display the number of clicks */}
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                      {url.clicks} {url.clicks === 1 ? "click" : "clicks"}
                    </span>
                  </div>
                </td>

                {/* Display the copy URL action */}
                <td className="px-6 py-4 text-sm font-medium">

                  {/* Copy the shortened URL when clicked */}
                  <button
                    onClick={() => handleCopy(`http://localhost:3000/${url.short_url}`, url._id)}
                    className={`inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm ${copiedId === url._id
                      ? "bg-green-600 text-white hover:bg-green-700"
                      : "bg-blue-600 text-white hover:bg-blue-700"
                      } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200`}>

                    {/* Show the appropriate button content */}
                    {copiedId === url._id ? (
                      <>
                        {/* Display the copy icon */}
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                        Copied!
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                            d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3">
                          </path>
                        </svg>
                        Copy URL
                      </>
                    )}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default UserUrl