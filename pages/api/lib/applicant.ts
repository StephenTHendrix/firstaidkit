export type Applicant = {
    id: number,
    name: string,
    phone: string
    screener: string
};

export type ApplicantDisplay = Omit<Applicant, "id">