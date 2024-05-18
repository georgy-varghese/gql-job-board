import DataLoader from 'dataloader';
import { connection } from './connection.js';

const getCompanyTable = () => connection.table('company');

export async function getCompany(id) {
  return await getCompanyTable().first().where({ id });
}

export function companyLoaderFunction() {
  return (
    new DataLoader(async (ids) => {
      const companies = await getCompanyTable().select().whereIn('id', ids);
      return ids.map((key) => companies.find(({ id }) => id === key))
    })
  )
}
