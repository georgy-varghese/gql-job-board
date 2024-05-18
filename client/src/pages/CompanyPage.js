import { useParams } from 'react-router';
import JobList from '../components/JobList';
import { useCompany } from '../lib/graphql/hooks';

function CompanyPage() {
  const { companyId } = useParams();

  const { loading, error, company } = useCompany(companyId);
  // console.log('[companyPage]', { loading, error, company });

  if (loading) {
    return <div>Loading...</div>
  }
  if (error) {
    return <div className="has-text-danger">Data unavailable</div>
  }
  return (
    <div>
      <h1 className="title">
        {company.name}
      </h1>
      <div className="box">
        {company.description}
      </div>
      <h3 className="title is-4">Current Vacancies</h3>
      <JobList jobs={company.jobs} />
    </div>
  );
}

export default CompanyPage;
