import type { NextPage } from "next";
import Head from "next/head";
import { useEffect, useState } from "react";
import styles from "../styles/Home.module.css";
import type {
  Applicant,
  ApplicantDisplay,
  ScreenerOptions,
} from "./api/lib/applicant";
import debounce from "debounce";

const debouncedGetSearchResults = debounce(
  async (
    name: string,
    sortColumn: string,
    sortOrder: string,
    filter: string,
    page: number,
    pageSize: number,
    setApplicants: (applicants: Applicant[], total: number) => void
  ) => {
    let response = await fetch("/api/applicants", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        sortColumn,
        sortOrder,
        filter,
        page,
        pageSize,
      }),
    });

    const awaitedResponse = await response.json();
    setApplicants(awaitedResponse.applicants, awaitedResponse.total);
  },
  250
);

const columns: (keyof ApplicantDisplay)[] = ["name", "phone", "screener"];
const filterOptions: ("all" | ScreenerOptions)[] = [
  "all",
  "pending",
  "approved",
  "rejected",
];

const Home: NextPage = () => {
  const [loading, setLoading] = useState(true);
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [totalApplicants, setTotalApplicants] = useState<number>(0);
  const [search, setSearch] = useState<string>("");
  const [filter, setFilter] = useState<string>("");
  const [sortColumn, setSortColumn] = useState<string>("name");
  const [sortOrder, setSortOrder] = useState<string>("asc");
  const [page, setPage] = useState<number>(1);
  const [pageSize] = useState<number>(10);

  useEffect(() => {
    (async () => {
      const response = await fetch("/api/applicants", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: search,
          sortColumn,
          sortOrder,
          filter,
          page,
          pageSize,
        }),
      });
      const data = await response.json();
      setApplicants(data.applicants);
      setTotalApplicants(data.total);
      setLoading(false)
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (string: string) => {
    setSearch(string);
    setPage(1);
    debouncedGetSearchResults(
      string,
      sortColumn,
      sortOrder,
      filter,
      1,
      pageSize,
      (applicants, total) => {
        setApplicants(applicants);
        setTotalApplicants(total);
      }
    );
  };

  const handleSort = (
    column: keyof ApplicantDisplay,
    order: "asc" | "desc"
  ) => {
    setSortColumn(column);
    setSortOrder(order);
    setPage(1);
    debouncedGetSearchResults(
      search,
      column,
      order,
      filter,
      1,
      pageSize,
      (applicants, total) => {
        setApplicants(applicants);
        setTotalApplicants(total);
      }
    );
  };

  const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setFilter(value);
    setPage(1);
    debouncedGetSearchResults(
      search,
      sortColumn,
      sortOrder,
      value,
      1,
      pageSize,
      (applicants, total) => {
        setApplicants(applicants);
        setTotalApplicants(total);
      }
    );
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    debouncedGetSearchResults(
      search,
      sortColumn,
      sortOrder,
      filter,
      newPage,
      pageSize,
      (applicants, total) => {
        setApplicants(applicants);
        setTotalApplicants(total);
      }
    );
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>FirstAidKit</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        {loading ? (
          <div>Loading...</div>
        ) : (
          <>
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
              <ul
                className={`${styles["applicant-list"]} ${
                  !applicants.length && styles["border-bottom-none"]
                }`}
              >
                <li className={styles["table-heading"]}>
                  {columns.map((column) => (
                    <div key={column}>
                      <span className={styles["column-name"]}>
                        {column.charAt(0).toUpperCase() + column.slice(1)}
                      </span>
                      <button onClick={() => handleSort(column, "asc")}>
                        Asc
                      </button>
                      <button onClick={() => handleSort(column, "desc")}>
                        Desc
                      </button>
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
            <div className={styles.pagination}>
              <button
                onClick={() => handlePageChange(page - 1)}
                disabled={page <= 1}
              >
                Previous
              </button>
              <span>Page {page}</span>
              <button
                onClick={() => handlePageChange(page + 1)}
                disabled={page * pageSize >= totalApplicants}
              >
                Next
              </button>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default Home;
