import { Dispatch, FC, SetStateAction, useState } from "react";
import { FaCheck } from "react-icons/fa";
import { FaPencil, FaTrash } from "react-icons/fa6";
import { GrClose } from "react-icons/gr";

import { Applicant } from "../pages/api/lib/applicant";
import styles from "./Row.module.css";

export const Row: FC<Props> = ({
  id,
  name,
  phone,
  applicants,
  setApplicants,
}) => {
  const [editMode, setEditMode] = useState<boolean>(false);
  const [applicantInfo, setApplicantInfo] = useState<Applicant>({
    id,
    name,
    phone,
  });

  const handleInputChange = (key: keyof Props, value: string) => {
    setApplicantInfo((currentState) => ({
      ...currentState,
      [key]: value,
    }));
  };

  const submitApplicantUpdate = async (data: Applicant) => {
    await fetch("/api/update", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    setEditMode(false);
  };

  const cancelApplicantUpdate = () => {
    const originalApplicantInfo = applicants.find(
      (applicant) => applicant.id === applicantInfo.id
    )!;
    setApplicantInfo(originalApplicantInfo);
    setEditMode(false);
  };

  const submitApplicantCreation = async (data: {
    name: string;
    phone: string;
  }) => {
    // TODO: Consider the value of only updating edited fields instead of entire records (PATCH requests)
    const response = await fetch("/api/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const parsedResponse = await response.json();
    const newApplicant = { ...applicantInfo, id: parsedResponse.id };
    setApplicants((currentApplicants) =>
      currentApplicants.map((applicant) =>
        applicant.id === 0 ? newApplicant : applicant
      )
    );
    setEditMode(false);
  };

  const submitApplicantDeletion = async (id: number) => {
    await fetch("/api/delete", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    });

    setApplicants((currentApplicants) =>
      currentApplicants.filter((applicant) => applicant.id !== id)
    );
  };

  return (
    <li className={styles.applicant}>
      {editMode ? (
        <>
          <input
            type="text"
            value={applicantInfo.name}
            onChange={(event) => handleInputChange("name", event.target.value)}
            // TODO: add useOutsideClick functionality for sending update?
          />
          <input
            type="text"
            value={applicantInfo.phone}
            onChange={(event) => handleInputChange("phone", event.target.value)}
          />
          <div className={styles["button-cell"]}>
            <button
              className={styles.button}
              onClick={() =>
                applicantInfo.id === 0
                  ? submitApplicantCreation({
                      name: applicantInfo.name,
                      phone: applicantInfo.phone,
                    })
                  : submitApplicantUpdate(applicantInfo)
              }
            >
              {/* TODO: Add user feedback on update success and error; revert optimistic update on error. */}
              <FaCheck className={styles.check} />
            </button>
            <button className={styles.button} onClick={cancelApplicantUpdate}>
              <GrClose className={styles.close} />
            </button>
          </div>
        </>
      ) : (
        <>
          <div>{applicantInfo.name}</div>
          <div>{applicantInfo.phone}</div>
          <div className={styles["button-cell"]}>
            <button className={styles.button} onClick={() => setEditMode(true)}>
              <FaPencil className={styles.pencil} />
            </button>
            <button className={styles.button}>
              <FaTrash
                className={styles.trash}
                onClick={() => submitApplicantDeletion(applicantInfo.id)}
              />
            </button>
          </div>
        </>
      )}
    </li>
  );
};

interface Props {
  id: number;
  name: string;
  phone: string;
  applicants: Applicant[];
  setApplicants: Dispatch<SetStateAction<Applicant[]>>;
}
