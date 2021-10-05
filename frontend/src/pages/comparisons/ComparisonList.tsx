import React, { useState, useEffect } from 'react';
import { useLocation, useHistory } from 'react-router-dom';

import type { Comparison } from 'src/services/openapi';
import { selectLogin } from 'src/features/login/loginSlice';
import { fetchComparisons } from 'src/features/comparisons/comparisonsAPI';
import ComparisonList from 'src/features/comparisons/ComparisonList';
import Pagination from 'src/components/Pagination';

import { useAppSelector } from '../../app/hooks';

function ComparisonsPage() {
  const token = useAppSelector(selectLogin);
  const [comparisons, setComparisons]: [
    Comparison[] | undefined,
    (l: Comparison[] | undefined) => void
  ] = useState();
  const [count, setCount] = useState(0);
  const history = useHistory();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const offset = Number(searchParams.get('offset') || 0);
  const limit = 30;

  function handleOffsetChange(newOffset: number) {
    history.push(`/comparisons/?offset=${newOffset}`);
  }

  useEffect(() => {
    fetchComparisons(token?.access_token ?? '', limit, offset).then((data) => {
      setComparisons(data.results);
      setCount(data.count || 0);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [offset]);

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
        paddingBottom: 32,
        paddingTop: 32,
      }}
    >
      <Pagination
        offset={offset}
        count={count}
        onOffsetChange={handleOffsetChange}
        limit={limit}
      />
      <ComparisonList comparisons={comparisons} />
    </div>
  );
}

export default ComparisonsPage;