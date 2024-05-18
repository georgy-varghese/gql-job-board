import { getCompany } from "./db/companies.js";
import { GraphQLError } from "graphql";
import { getJob, getJobs, getCompanyJobs, createJob, deleteJob, updateJob} from "./db/jobs.js";

export const resolvers = {
  Query: {
    job: async (_root, { id }) => {
      const job = await getJob(id);
      if (!job) {
        notFoundError('No job with id ' + id)
      }
      return job;
    },
    jobs: () => getJobs(),
    company: async (_root, args) => {
      const company = await getCompany(args.id);
      if (!company) {
        notFoundError('No company with id ' + args.id)
      }
      return company
    }
  },

  Mutation: {
    createJob: async (_root, { input: { title, description } }, { user }) => {
      if (!user) {
        throw authenticationError('Not authenticated!')
      }
      return await createJob({companyId: user.companyId, title, description});
    },
    deleteJob: async(_root, { id }, { user }) => {
      if (!user) {
        throw authenticationError('Not authenticated')
      }
      const job = await deleteJob(id, user.companyId);
      if (!job) {
        notFoundError('No job with id ' + args.id)
      }
      return job;
    },
    updateJob: async (_root, { input: { id, title, description } }, { user }) => {
      if (!user) {
        throw authenticationError('Not authenticated!')
      }
      const job = await updateJob({id, title, description, companyId: user.companyId});
      if (!job) {
        notFoundError('No job with id ' + args.id)
      }
      return job;
    },
  },

  Job: {
    date: (job) => toIsoDate(job.createdAt),
    company: (job, _args, { companyLoader }) => companyLoader.load(job.companyId),
  },

  Company: {
    jobs: (company) => getCompanyJobs(company.id)
  }
}

function notFoundError(message) {
  throw new GraphQLError(message, {
    extensions: { code: 'NOT_FOUND' },
  });
}

function authenticationError(message) {
  throw new GraphQLError(message, {
    extensions: { code: 'NOT_AUTHENTICATED' },
  });
}

function toIsoDate(value) {
  return value.slice(0, 'yyyy-mm-dd'.length);
}
