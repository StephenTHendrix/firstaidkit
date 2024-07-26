import type { NextPage } from "next";
import Head from "next/head";
import { useEffect, useState } from "react";
import styles from "../styles/Home.module.css";
import type { Applicant, ApplicantDisplay } from "./api/lib/applicant";
import debounce from "debounce";

const debouncedGetSearchResults = debounce(
  async (name: string, setApplicants: (applicants: Applicant[]) => void) => {
    let response;
    // Return original results when user clears search
    if (name === "") {
      response = await fetch("/api/all");
    } else {
      response = await fetch("/api/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name }),
      });
    }

    const awaitedResponse = await response.json();
    // TODO: Remove this when done. Leaving it in during development to monitor debounce.
    console.log({ awaitedResponse });
    setApplicants(awaitedResponse);
  },
  1000
);

const Home: NextPage = () => {
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [search, setSearch] = useState<string>("");
  const [filter, setFilter] = useState<string>("");

  useEffect(() => {
    (async () => {
      setApplicants((await (await fetch("/api/all")).json()) as Applicant[]);
    })();
  }, []);

  const handleChange = (string: string) => {
    setSearch(string);
    debouncedGetSearchResults(string, setApplicants);
  };

  const handleSort = (column: keyof ApplicantDisplay, order: "asc" | "desc") => {
    const sortedApplicants = [...applicants].sort((a, b) => {
      if (order === "asc") {
        return a[column].localeCompare(b[column]);
      } else {
        return b[column].localeCompare(a[column]);
      }
    });
    setApplicants(sortedApplicants);
  };

  const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilter(event.target.value);
  };

  const filteredApplicants = filter
    ? applicants.filter((applicant) => applicant.screener === filter)
    : applicants;

  const columns = Object.keys(applicants[0] || {}).filter(key => key !== 'id') as (keyof ApplicantDisplay)[];
  const filterOptions = ["all", ...Array.from(new Set(applicants.map((applicant) => applicant.screener)))];

  return (
    <div className={styles.container}>
      <Head>
        <title>FirstAidKit</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>(First) AidKit Task</h1>
        <input
          placeholder="Search"
          value={search}
          onChange={(event) => handleChange(event.target.value)}
        />
        <div className={styles.filters}>
          Filter by Screener:
          {filterOptions.map((option) => (
            <label key={option}>
              <input
                type="radio"
                name="filter"
                value={option === "all" ? "" : option}
                checked={filter === (option === "all" ? "" : option)}
                onChange={handleFilterChange}
              />
              {option.charAt(0).toUpperCase() + option.slice(1)}
            </label>
          ))}
        </div>
        <div className={styles["table-container"]}>
          <ul className={styles["applicant-list"]}>
            <li className={styles["table-heading"]}>
              {columns.map((column) => (
                <div key={column}>
                  <span className={styles["column-name"]}>
                    {column.charAt(0).toUpperCase() + column.slice(1)}
                  </span>
                  <button onClick={() => handleSort(column, "asc")}>Asc</button>
                  <button onClick={() => handleSort(column, "desc")}>Desc</button>
                </div>
              ))}
            </li>
            {filteredApplicants?.map((applicant) => (
              <li className={styles.applicant} key={applicant.name}>
                {columns.map((column) => (
                  <div key={column} className={styles[column]}>
                    {applicant[column]}
                  </div>
                ))}
              </li>
            ))}
          </ul>
        </div>
      </main>
    </div>
  );
};

export default Home;
