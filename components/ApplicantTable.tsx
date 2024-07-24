import { Dispatch, FC, SetStateAction } from "react";

import styles from "./ApplicantTable.module.css";
// TODO: Develop import strategy: perhaps configure absolute imports in tsconfig and move types to central directory
import { Applicant } from "../pages/api/lib/applicant";
import { Row } from "./Row";

export const ApplicantTable: FC<Props> = ({
  title,
  applicants,
  setApplicants,
}) => {
  return (
    <>
      <h1 className={styles.title}>{title}</h1>
      <ul className={styles["applicant-list"]}>
        {applicants.map(({ id, name, phone }) => (
          <Row
            key={id}
            id={id}
            name={name}
            phone={phone}
            applicants={applicants}
            setApplicants={setApplicants}
          />
        ))}
      </ul>
    </>
  );
};

interface Props {
  title: string;
  applicants: Applicant[];
  setApplicants: Dispatch<SetStateAction<Applicant[]>>;
}
