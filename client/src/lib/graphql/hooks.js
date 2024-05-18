import { useMutation, useQuery } from '@apollo/client';
import { companyByIdQuery, createJobMutation, jobByIdQuery, jobsQuery } from './query';

export function useCompany(id) {
  const { loading, error, data } = useQuery(companyByIdQuery, {
    variables: { id },
  });
  return { company: data?.company, loading, error: Boolean(error) }
}

export function useJob(id) {
  const { loading, error, data } = useQuery(jobByIdQuery, {
    variables: { id },
  });
  return { job: data?.job, loading, error: Boolean(error) }
}

export function useJobs(limit, offset) {
  const { loading, error, data } = useQuery(jobsQuery, {
    variables: { limit, offset },
    fetchPolicy: 'network-only',
  });
  console.log("jobs: ", data)
  return { jobs: data?.jobs, loading, error: Boolean(error) }
}

export function useCreateJob() {
  const [mutateFunction, { loading }] = useMutation(createJobMutation);

  const createJob = async (title, description) => {
    const { data: { job } } = await mutateFunction({
      variables: { input: { title, description } },
      update: (cache, { data }) => {
        cache.writeQuery({
          query: jobByIdQuery,
          data: data,
          variables: { id: data.job.id }
        })
      }
    })
    return job;
  }

  return {
    createJob,
    loading
  }

}
