// ─── Driver ───────────────────────────────────────────────────────────────────

export type VerificationStatus = "verified" | "unverified" | "rejected";

export type Driver = {
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
  // Added: contact info for driver profile panel
  email?: string;
  phone?: string;
  verificationStatus: VerificationStatus;
  lastVerifiedDate: string;
};

// ─── Report ───────────────────────────────────────────────────────────────────

export type ReportStatus = "open" | "under_review" | "resolved" | "dismissed";

export type AdminResponse = {
  message: string;
  respondedAt: string;
  responderId: string;
};

export type PassengerReport = {
  id: string;
  driverId: string;
  passengerId: string;
  reportType: string;
  description: string;
  createdAt: string;
  // Added: status for report management tab
  status?: ReportStatus;
  adminResponse?: AdminResponse;
};

// ─── Metrics ──────────────────────────────────────────────────────────────────

export type MonthlyTrendPoint = {
  month: string;
  flagged: number;
  reports: number;
  // Added: for the monthly trends line chart
  passengers?: number;
  drivers?: number;
};

export type WeeklyTrendPoint = {
  week: string;
  flagged: number;
  reports: number;
};

export type SystemMetrics = {
  totalPassengers: number;
  totalDrivers: number;
  verifiedDrivers: number;
  verifiedPercentage: number;
  reportsSubmitted: number;
  flaggedDrivers: number;
  weeklyTrend: WeeklyTrendPoint[];
  monthlyTrend: MonthlyTrendPoint[];
};
