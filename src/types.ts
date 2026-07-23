export type Role = "trainee" | "admin";
export type Status = "pending" | "approved";

export interface TraineeProfile {
  uid: string;
  name: string;
  email: string;
  role: Role;
  status: Status;
  totalPoints: number;
  createdAt: number;
}

export interface Mission {
  id: string;
  title: string;
  description: string;
  points: number;
  active: boolean;
  createdAt: number;
}

export interface Award {
  id: string;
  userId: string;
  userName: string;
  missionId: string;
  missionTitle: string;
  points: number;
  note?: string;
  awardedAt: number;
  awardedBy: string;
}
