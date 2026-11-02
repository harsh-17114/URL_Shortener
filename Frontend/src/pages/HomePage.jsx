import UrlForm from "../components/UrlForm"

const HomePage = () => {

  return (
    // Center the content on the screen
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">

      {/* Main content container */}
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">

        {/* Display the page heading */}
        <h1 className="text-2xl font-bold text-center mb-6">URL Shortener</h1>
        <UrlForm />
      </div>
    </div>
  )
}

export default HomePage