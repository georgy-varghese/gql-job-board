import { useState } from 'react';
import JobList from '../components/JobList';
import { useJobs } from '../lib/graphql/hooks';

const JOBS_PER_PAGE = 10;

function HomePage() {
  const [currentPage, setCurrentPage] = useState(1);
  const handleClick = (event) => {
    const id = event.target.id;
    if (id == "previous") {
      setCurrentPage(currentPage - 1)
    }
    if (id == "next") {
      setCurrentPage(currentPage + 1)
    }
  }
  
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
      <div className="buttons has-addons is-centered mt-4">
          <button id='previous' className="button is-link is-small" onClick={handleClick} disabled={currentPage === 1}>Previous</button>
          <span className="button is-static is-small">{currentPage} of {totalPages}</span>
          <button id='next' className="button is-link is-small" onClick={handleClick} disabled={currentPage === totalPages}>Next</button>
      </div>
      <JobList jobs={jobList} />
    </div>
  );
}

export default HomePage;
