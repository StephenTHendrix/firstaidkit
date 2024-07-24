import type { NextPage } from "next";
import Head from "next/head";
import { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";

import styles from "../styles/Home.module.css";
import type { Applicant } from "./api/lib/applicant";
import { ApplicantTable } from "../components/ApplicantTable";

const Home: NextPage = () => {
  const [applicants, setApplicants] = useState<Applicant[]>([]);

  useEffect(() => {
    const fetchApplicants = async () => {
      //TODO: Avoid redundant migrations
      await fetch("/api/migrations");
      const response = await fetch("/api/all");
      const data = (await response.json()) as Applicant[];
      setApplicants(data);
    };

    fetchApplicants();
  }, []);

  const createBlankApplicant = () => {
    setApplicants((currentApplicants) => [
      ...currentApplicants,
      { id: 0, name: "", phone: "", screener: null },
    ]);
  };

  const disabled = applicants.some((applicant) => applicant.id === 0);

  return (
    <div className={styles.container}>
      <Head>
        <title>FirstAidKit</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <div>
          {!!applicants.length ? (
            <>
              <ApplicantTable
                title="(First) AidKit Task"
                applicants={applicants}
                setApplicants={setApplicants}
              />
              <button
                className={styles.button}
                onClick={createBlankApplicant}
                disabled={disabled}
              >
                <FaPlus
                  className={disabled ? styles["plus-disabled"] : styles.plus}
                />
              </button>
            </>
          ) : (
            <div>Loading Applicants...</div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Home;
