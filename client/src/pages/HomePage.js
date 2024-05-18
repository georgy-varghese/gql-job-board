import { useState } from 'react';
import JobList from '../components/JobList';
import PaginationBar from '../components/PaginationBar';
import { useJobs } from '../lib/graphql/hooks';

const JOBS_PER_PAGE = 10;

function HomePage() {
  const [currentPage, setCurrentPage] = useState(1);
  
  const offset = ((currentPage - 1) * JOBS_PER_PAGE);
  const { loading, error, jobs } = useJobs(JOBS_PER_PAGE, offset);

  if (loading) {
    return <div>Loading...</div>
  }
  if (error) {
    return <div className="has-text-danger">Data unavailable</div>
  }

  const { jobList, totalJobs } = jobs
  const totalPages = Math.ceil(totalJobs / JOBS_PER_PAGE);

  return (
    <div>
      <h1 className="title">
        Job Board
      </h1>
      <PaginationBar currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage}/>
      <JobList jobs={jobList} />
    </div>
  );
}

export default HomePage;
