import React, { FunctionComponent, useEffect, useState } from 'react'
import { getUserFetcher } from 'utils/workflow-api'
import { useRouter } from 'next/router'
import Home from 'pages/home'

const HomeWrapper: FunctionComponent = (): JSX.Element => {
  const [userApiId, setUserApiId] = useState(null)
  const router = useRouter()
  useEffect(() => {
    if (router.isReady && userApiId == null) {
      const userApiId = router.query.userId.toString()
      getUserFetcher(userApiId).then((user) => {
        if (user) setUserApiId(user.apiId)
      })
    }
  }, [router.isReady, router.query.userId, userApiId])

  if (userApiId == null) return null

  return <Home userApiId={userApiId} />
}

export default HomeWrapper
