import React, { FunctionComponent, useEffect, useState } from 'react'
import { getUserFetcher } from 'utils/workflow-api'
import { useRouter } from 'next/router'
import Home from 'pages/home'
import LoadingSpinner from 'components/loading-spinner'
import LoadingError from 'components/loading-error'

const HomeWrapper: FunctionComponent = (): JSX.Element => {
  const [userApiId, setUserApiId] = useState(null)
  const [isError, setIsError] = useState(false)
  const router = useRouter()
  useEffect(() => {
    if (router.isReady && userApiId == null) {
      const userApiId = router.query.userId.toString()
      getUserFetcher(userApiId).then((user) => {
        if (user) setUserApiId(user.apiId)
        else setIsError(true)
      })
    }
  }, [router.isReady, router.query.userId, userApiId])

  if (userApiId == null && !isError) return <LoadingSpinner />
  if (isError) return <LoadingError />
  return <Home userApiId={userApiId} />
}

export default HomeWrapper
