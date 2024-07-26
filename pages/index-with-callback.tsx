import type { NextPage } from 'next';
import Head from 'next/head';
import { useCallback, useEffect, useState, useMemo } from 'react';
import styles from '../styles/Home.module.css';
import type { Applicant } from './api/lib/applicant';
import debounce from 'debounce';

const HomeWithCallback: NextPage = () => {
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [search, setSearch] = useState<string>('');

  useEffect(() => {
    (async () => {
      setApplicants(await (await fetch('/api/all')).json() as Applicant[]);
    })();
  }, []);

  const getSearchResults = async (name: string) => {
    if (name === '') return;
    const response = await fetch('/api/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name }),
    });

    const awaitedResponse = await response.json();
    setApplicants(awaitedResponse);
  };

  const debouncedGetSearchResults = useMemo(() => debounce((name: string) => {
    getSearchResults(name);
  }, 1000), []);

  const handleChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setSearch(value);
    debouncedGetSearchResults(value);
  }, [debouncedGetSearchResults]);

  return (
    <div className={styles.container}>
      <Head>
        <title>FirstAidKit</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          (First) AidKit Task
        </h1>
        <input value={search} onChange={handleChange} />
        <ul className={styles['applicant-list']}>
          {applicants?.map(a => (
            <li className={styles.applicant} key={a.name}>
              <div className={styles.name}>{a.name}</div>
              <div className={styles.phone}>{a.phone}</div>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}

export default HomeWithCallback;
