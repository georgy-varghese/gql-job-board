import { ApolloClient, createHttpLink, gql, InMemoryCache } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { getAccessToken } from '../auth';

const httpLink = createHttpLink({
  uri: 'http://localhost:9000/graphql',
});

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = getAccessToken();
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    }
  }
});

export const apolloClient = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
})

// Fragments
export const JobsDetailsFragment = gql`
  fragment JobDetails on Job {
    id
    date
    title
    description
    company {
      id
      name
    }
  }
`;

// Queries
export const companyByIdQuery = gql`
  query companyById($id: ID!) {
    company(id: $id) {
       id
       name
       description
       jobs {
         id
         date
         title
       }
    }
  }
`;

export const jobByIdQuery = gql`
  query jobById($id: ID!) {
    job(id: $id) {
      ...JobDetails
    }
  }
  ${JobsDetailsFragment}
`;

export const jobsQuery = gql`
  query getJobs($limit: Int, $offset: Int) {
    jobs(limit: $limit, offset: $offset) {
      jobList {
        id
        date
        title
        description
        company {
          id
          name
        }
      }
      totalJobs
    }
  }
`;

// Mutation
export const createJobMutation = gql`
  mutation createJob($input: CreateJobInput!) {
    job: createJob(input: $input) {
      ...JobDetails
    }
  }
  ${JobsDetailsFragment}
`;
