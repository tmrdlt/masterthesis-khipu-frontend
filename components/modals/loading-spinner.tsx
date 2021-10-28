const LoadingSpinner = (): JSX.Element => {
  return (
    <div className="h-screen bg-gray-200 flex justify-center items-center">
      <div className="animate-spin rounded-full h-32 w-32 border-b-4 border-gray-600" />
    </div>
  )
}

export default LoadingSpinner
