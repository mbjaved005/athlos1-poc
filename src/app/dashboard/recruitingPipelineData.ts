// Dummy data and type for Recruiting Pipeline section
export type RecruitingPipelinePosition = {
  position: string;
  applied: number;
  shortlisted: number;
  invited: number;
  hired: number;
};

export const recruitingPipelineData: RecruitingPipelinePosition[] = [
  {
    position: "Forward",
    applied: 5,
    shortlisted: 2,
    invited: 1,
    hired: 0,
  },
  {
    position: "Goalkeeper",
    applied: 3,
    shortlisted: 1,
    invited: 0,
    hired: 0,
  },
  {
    position: "Defender",
    applied: 4,
    shortlisted: 2,
    invited: 1,
    hired: 1,
  },
  {
    position: "Midfielder",
    applied: 6,
    shortlisted: 3,
    invited: 2,
    hired: 1,
  },
];
