import useSWR from 'swr'
import {
  getUsersFetcher,
  getUsersUrl,
  getWorkflowListsFetcher,
  getWorkflowListsUrl,
} from 'utils/workflow-api'

export const useUsers = () => {
  const { data, error } = useSWR(getUsersUrl(), getUsersFetcher, {
    revalidateOnFocus: false,
  })
  return {
    users: data,
    isLoading: !error && !data,
    isError: error,
  }
}

export const useWorkflowLists = (userApiId) => {
    const { data, error } = useSWR(getWorkflowListsUrl(userApiId), getWorkflowListsFetcher, {
        revalidateOnFocus: false,
    })
    return {
        workflowLists: data,
        isLoading: !error && !data,
        isError: error,
    }
}
