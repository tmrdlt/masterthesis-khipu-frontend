const LoadingError = (): JSX.Element => {
  return (
    <div className="h-screen bg-gray-200 flex justify-center items-center">
      <div className="text-gray-600 text-4xl">An error occurred, please try again.</div>
    </div>
  )
}

export default LoadingError
