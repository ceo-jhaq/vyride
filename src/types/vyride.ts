export type VerificationStatus = "safe" | "warning" | "unsafe";

export interface Driver {
  id: string;
  fullName: string;
  photo: string;
  driverId: string;
  licenseNumber: string;
  vehiclePlate: string;
  vehicleModel: string;
  cabCompany: string;
  state: string;
  city: string;
  verificationStatus: VerificationStatus;
  lastVerifiedDate: string;
}

export interface Vehicle {
  id: string;
  plateNumber: string;
  model: string;
  color: string;
  linkedDriverId: string;
  verificationStatus: VerificationStatus;
}

export interface PassengerReport {
  id: string;
  driverId: string;
  passengerId: string;
  reportType: string;
  description: string;
  createdAt: string;
}

export interface SystemMetrics {
  totalPassengers: number;
  totalDrivers: number;
  verifiedDrivers: number;
  verifiedPercentage: number;
  reportsSubmitted: number;
  flaggedDrivers: number;
  weeklyTrend: { week: string; flagged: number; reports: number }[];
  monthlyTrend: { month: string; flagged: number; reports: number }[];
}
