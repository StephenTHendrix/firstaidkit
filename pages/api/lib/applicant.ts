export type ScreenerOptions = "pending" | "approved" | "rejected"

export type Applicant = {
    id: number,
    name: string,
    phone: string
    screener: ScreenerOptions
};

export type ApplicantDisplay = Omit<Applicant, "id">