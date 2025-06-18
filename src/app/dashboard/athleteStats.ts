// src/app/dashboard/athleteStats.ts
// Dummy data for Athlete Stats section on the dashboard
// Follows best practices: typed, separated, descriptive keys, easy to maintain

export type AthleteStat = {
  label: string;
  value: number | string;
  description: string;
};

export const athleteStats: AthleteStat[] = [
  {
    label: "Total Athletes",
    value: 526,
    description: "Total Athletes",
  },
  {
    label: "Active Teams",
    value: 4,
    description: "Active Teams",
  },
  {
    label: "Injured Players",
    value: 9,
    description: "Injured Players",
  },
  {
    label: "Avg Team Performance",
    value: "78%",
    description: "Average Team Performance",
  },
];
