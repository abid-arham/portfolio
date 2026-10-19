export interface EducationEntry {
  institution: string
  credential: string
  detail?: string
  note?: string
  date: string
}

export const education: EducationEntry[] = [
  {
    institution: "American International University-Bangladesh",
    credential: "B.Sc. in Computer Science and Engineering",
    detail: "CGPA 3.78",
    note: "Software Architecture coursework: creational and behavioural design patterns applied to database configuration and payment modules.",
    date: "Expected April 2027",
  },
]
