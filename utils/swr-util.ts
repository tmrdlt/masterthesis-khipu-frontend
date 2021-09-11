import useSWR from 'swr'
import { getWorkflowListsFetcher, getWorkflowListsUrl } from 'utils/workflow-api'

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
