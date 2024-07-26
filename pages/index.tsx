import type { NextPage } from "next";
import Head from "next/head";
import { useEffect, useState } from "react";
import styles from "../styles/Home.module.css";
import type { Applicant, ApplicantDisplay, ScreenerOptions } from "./api/lib/applicant";
import debounce from "debounce";

const debouncedGetSearchResults = debounce(
  async (
    name: string,
    sortColumn: string,
    sortOrder: string,
    filter: string,
    setApplicants: (applicants: Applicant[]) => void
  ) => {
    let response = await fetch("/api/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, sortColumn, sortOrder, filter }),
    });

    const awaitedResponse = await response.json();
    console.log({ awaitedResponse });
    setApplicants(awaitedResponse);
  },
  250
);

const columns: (keyof ApplicantDisplay)[] = ["name", "phone", "screener"]
const filterOptions: ("all" | ScreenerOptions)[] = ["all", "pending", "approved", "rejected"];

const Home: NextPage = () => {
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [search, setSearch] = useState<string>("");
  const [filter, setFilter] = useState<string>("");
  const [sortColumn, setSortColumn] = useState<string>("name");
  const [sortOrder, setSortOrder] = useState<string>("asc");

  useEffect(() => {
    (async () => {
      const response = await fetch("/api/all");
      setApplicants((await response.json()) as Applicant[]);
    })();
  }, []);

  const handleChange = (string: string) => {
    setSearch(string);
    debouncedGetSearchResults(string, sortColumn, sortOrder, filter, setApplicants);
  };

  const handleSort = (column: keyof ApplicantDisplay, order: "asc" | "desc") => {
    setSortColumn(column);
    setSortOrder(order);
    debouncedGetSearchResults(search, column, order, filter, setApplicants);
  };

  const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setFilter(value);
    debouncedGetSearchResults(search, sortColumn, sortOrder, value, setApplicants);
  };

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
            {applicants?.map((applicant) => (
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
