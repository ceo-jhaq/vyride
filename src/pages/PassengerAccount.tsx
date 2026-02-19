import { useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { mockReports, mockDrivers } from "@/data/mockData";
import { PassengerReport } from "@/types/vyride";

// ─── Types ───────────────────────────────────────────────────────────────────

type AdminResponse = {
  message: string;
  respondedAt: string;
  adminName?: string;
};

type Driver = (typeof mockDrivers)[number];

// ─── Helpers ─────────────────────────────────────────────────────────────────

const StatusBadge = ({ status }: { status: string }) => {
  const map: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
    resolved: "bg-green-100 text-green-800 border-green-200",
    rejected: "bg-red-100 text-red-800 border-red-200",
    "under review": "bg-blue-100 text-blue-800 border-blue-200",
  };
  const cls = map[status?.toLowerCase()] ?? "bg-secondary text-secondary-foreground";
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${cls}`}>
      {status ?? "Pending"}
    </span>
  );
};

const Backdrop = ({ onClose }: { onClose: () => void }) => (
  <div
    className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
    onClick={onClose}
    aria-hidden="true"
  />
);

// ─── Admin Response Modal ─────────────────────────────────────────────────────

const AdminResponseModal = ({
  report,
  adminResponse,
  onClose,
}: {
  report: PassengerReport;
  adminResponse: AdminResponse;
  onClose: () => void;
}) => (
  <>
    <Backdrop onClose={onClose} />
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
      <Card className="w-full max-w-lg shadow-2xl pointer-events-auto">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-2">
            <div>
              <CardTitle className="text-base">Admin Response</CardTitle>
              <p className="text-xs text-muted-foreground mt-0.5">Re: {report.reportType}</p>
            </div>
            <button
              onClick={onClose}
              className="text-muted-foreground hover:text-foreground transition-colors mt-0.5"
              aria-label="Close"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Original report context */}
          <div className="bg-muted/40 rounded-lg p-3 space-y-1 border border-border/30">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Your Report</p>
            <p className="text-sm">{report.description}</p>
            <p className="text-xs text-muted-foreground">
              Filed:{" "}
              {new Date(report.createdAt).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </p>
          </div>

          <Separator />

          {/* Admin message */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary shrink-0">
                A
              </div>
              <div>
                <p className="text-xs font-semibold">{adminResponse.adminName ?? "Vyride Support"}</p>
                <p className="text-xs text-muted-foreground">
                  {new Date(adminResponse.respondedAt).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  } as Intl.DateTimeFormatOptions)}
                </p>
              </div>
            </div>
            <p className="text-sm leading-relaxed pl-9">{adminResponse.message}</p>
          </div>

          <div className="flex justify-end pt-1">
            <Button variant="outline" size="sm" onClick={onClose}>
              Close
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  </>
);

// ─── Report Driver Modal ──────────────────────────────────────────────────────

const REPORT_TYPES = [
  "Reckless Driving",
  "Unprofessional Behaviour",
  "Overcharging / Fare Dispute",
  "Vehicle Condition",
  "Route Deviation",
  "Harassment",
  "Other",
];

const ReportDriverModal = ({
  driver,
  onClose,
  onSubmit,
}: {
  driver: Driver;
  passengerId: string;
  onClose: () => void;
  onSubmit: (type: string, description: string) => void;
}) => {
  const [reportType, setReportType] = useState("");
  const [description, setDescription] = useState("");

  const canSubmit = reportType && description.trim().length > 10;

  return (
    <>
      <Backdrop onClose={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <Card className="w-full max-w-lg shadow-2xl pointer-events-auto">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between gap-2">
              <div>
                <CardTitle className="text-base">Report a Driver</CardTitle>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {driver.fullName} · {driver.vehiclePlate}
                </p>
              </div>
              <button
                onClick={onClose}
                className="text-muted-foreground hover:text-foreground transition-colors mt-0.5"
                aria-label="Close"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="mb-1.5 block">Report Type</Label>
              <div className="flex flex-wrap gap-2">
                {REPORT_TYPES.map((type) => (
                  <button
                    key={type}
                    onClick={() => setReportType(type)}
                    className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                      reportType === type
                        ? "bg-primary text-primary-foreground border-primary"
                        : "border-border/60 text-muted-foreground hover:border-border hover:text-foreground"
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <Label className="mb-1.5 block">Description</Label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Please describe what happened in detail…"
                rows={4}
              />
              <p className="text-xs text-muted-foreground mt-1">Minimum 10 characters.</p>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
              <p className="text-xs text-amber-700">
                Reports are reviewed by our safety team within 24–48 hours. False reports may result in account suspension and possible legal action.
              </p>
            </div>

            <div className="flex gap-2 justify-end pt-1">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button
                disabled={!canSubmit}
                onClick={() => {
                  onSubmit(reportType, description);
                  onClose();
                }}
              >
                Submit Report
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

// ─── Change Request Modal ─────────────────────────────────────────────────────

const ChangeRequestModal = ({
  field,
  onClose,
  onSubmit,
}: {
  field: string;
  onClose: () => void;
  onSubmit: (reason: string) => void;
}) => {
  const [reason, setReason] = useState("");
  return (
    <>
      <Backdrop onClose={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <Card className="w-full max-w-md shadow-2xl pointer-events-auto">
          <CardHeader>
            <CardTitle className="text-base">Request Change: {field}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Changes to <strong>{field}</strong> require admin approval for security reasons. An admin will review
              your request within 1–2 business days.
            </p>
            <div>
              <Label className="mb-1 block">Reason for change</Label>
              <Textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="e.g. Legal name change, typo correction…"
                rows={3}
              />
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button
                disabled={!reason.trim()}
                onClick={() => {
                  onSubmit(reason);
                  onClose();
                }}
              >
                Submit Request
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

// ─── Locked Field ─────────────────────────────────────────────────────────────

const LockedField = ({
  label,
  value,
  onRequestChange,
}: {
  label: string;
  value: string;
  onRequestChange: () => void;
}) => (
  <div>
    <Label className="mb-1 block">{label}</Label>
    <div className="flex items-center gap-2">
      <Input value={value} readOnly className="bg-muted/50 cursor-not-allowed text-muted-foreground" />
      <Button
        variant="ghost"
        size="sm"
        className="shrink-0 text-xs text-muted-foreground hover:text-foreground border border-border/60 hover:border-border"
        onClick={onRequestChange}
      >
        Request Change
      </Button>
    </div>
  </div>
);

// ─── Main Page ────────────────────────────────────────────────────────────────

const PassengerAccount = () => {
  // Editable fields
  const [phone, setPhone] = useState("+254 712 345 678");
  const [email, setEmail] = useState("alex.kimani@email.com");
  const [notifications, setNotifications] = useState(true);

  // Locked fields
  const lockedName = "Alex Kimani";
  const lockedPassengerId = "PSG001";
  const lockedDob = "14 / 03 / 1994";

  // Modal state
  const [changeRequestField, setChangeRequestField] = useState<string | null>(null);
  const [selectedAdminResponse, setSelectedAdminResponse] = useState<{
    report: PassengerReport;
    adminResponse: AdminResponse;
  } | null>(null);
  const [reportTargetDriver, setReportTargetDriver] = useState<Driver | null>(null);

  // Data
  const passengerId = lockedPassengerId;
  const reportsForPassenger: PassengerReport[] = mockReports
    .filter((r) => r.passengerId === passengerId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const verifiedDriverIds = [
    ...new Set(mockReports.filter((r) => r.passengerId === passengerId).map((r) => r.driverId)),
  ];
  const verifiedDrivers = verifiedDriverIds
    .map((id) => mockDrivers.find((d) => d.id === id))
    .filter(Boolean) as Driver[];

  // Handlers
  const handleSaveContact = () => alert("Contact details updated (demo)");
  const handleChangeRequest = (field: string, reason: string) =>
    alert(`Change request submitted for "${field}": ${reason} (demo)`);
  const handleDriverReport = (type: string, _description: string) =>
    alert(`Report submitted — Type: ${type} (demo)`);

  return (
    <AppLayout>
      {/* Modals */}
      {changeRequestField && (
        <ChangeRequestModal
          field={changeRequestField}
          onClose={() => setChangeRequestField(null)}
          onSubmit={(reason) => handleChangeRequest(changeRequestField, reason)}
        />
      )}
      {selectedAdminResponse && (
        <AdminResponseModal
          report={selectedAdminResponse.report}
          adminResponse={selectedAdminResponse.adminResponse}
          onClose={() => setSelectedAdminResponse(null)}
        />
      )}
      {reportTargetDriver && (
        <ReportDriverModal
          driver={reportTargetDriver}
          passengerId={passengerId}
          onClose={() => setReportTargetDriver(null)}
          onSubmit={handleDriverReport}
        />
      )}

      <section className="container mx-auto px-4 py-10">
        <div className="max-w-3xl mx-auto space-y-8">

          {/* ── Header ── */}
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 border-2 border-primary/20 flex items-center justify-center text-2xl font-bold text-primary select-none">
              {lockedName.charAt(0)}
            </div>
            <div>
              <h1 className="text-2xl font-display font-semibold">{lockedName}</h1>
              <p className="text-sm text-muted-foreground">Passenger ID: {lockedPassengerId}</p>
            </div>
            <Badge variant="outline" className="ml-auto border-green-300 text-green-700 bg-green-50">
              Verified
            </Badge>
          </div>

          {/* ── Quick Stats ── */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Reports Filed", value: reportsForPassenger.length },
              { label: "Drivers Verified", value: verifiedDrivers.length },
              {
                label: "Admin Responses",
                value: reportsForPassenger.filter((r) => (r as any).adminResponse).length,
              },
            ].map((stat) => (
              <Card key={stat.label} className="text-center py-4">
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{stat.label}</div>
              </Card>
            ))}
          </div>

          {/* ── Identity (Locked) ── */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-display">Identity Information</CardTitle>
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m0 0v2m0-2h2m-2 0H10m10-6a8 8 0 11-16 0 8 8 0 0116 0z" />
                  </svg>
                  Admin approval required to change
                </span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <LockedField label="Full Name" value={lockedName} onRequestChange={() => setChangeRequestField("Full Name")} />
                <LockedField label="Date of Birth" value={lockedDob} onRequestChange={() => setChangeRequestField("Date of Birth")} />
                <LockedField label="Passenger ID" value={lockedPassengerId} onRequestChange={() => setChangeRequestField("Passenger ID")} />
              </div>
              <p className="text-xs text-muted-foreground pt-1">
                These fields are locked to protect your account security. Click "Request Change" and an admin will review your request within 1–2 business days.
              </p>
            </CardContent>
          </Card>

          {/* ── Contact Details (Editable) ── */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-display">Contact Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label className="mb-1 block">Email Address</Label>
                  <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
                </div>
                <div>
                  <Label className="mb-1 block">Phone Number</Label>
                  <Input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+254 7xx xxx xxx" />
                </div>
              </div>

              <div className="flex items-center gap-3 pt-1">
                <input
                  id="notifications"
                  type="checkbox"
                  checked={notifications}
                  onChange={(e) => setNotifications(e.target.checked)}
                  className="h-4 w-4 accent-primary"
                />
                <label htmlFor="notifications" className="text-sm">
                  Receive SMS and email notifications for ride updates and report responses
                </label>
              </div>

              <div className="flex flex-wrap gap-3 pt-1">
                <Button onClick={handleSaveContact}>Save Changes</Button>
                <Button
                  variant="outline"
                  className="text-red-500 border-red-300 hover:bg-red-50"
                  onClick={() => setChangeRequestField("Account Deletion")}
                >
                  Delete Account
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* ── Recently Verified Drivers ── */}
          <section className="space-y-3">
            <div>
              <h2 className="text-lg font-display font-semibold">Recently Verified Drivers</h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Click a driver card to file a report against them.
              </p>
            </div>
            {verifiedDrivers.length === 0 ? (
              <div className="p-4 rounded-lg bg-secondary/40 border border-border/40 text-center text-sm text-muted-foreground">
                No drivers associated with your account yet.
              </div>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2">
                {verifiedDrivers.map((driver) => (
                  <button
                    key={driver.id}
                    onClick={() => setReportTargetDriver(driver)}
                    className="text-left w-full"
                    aria-label={`Report driver ${driver.fullName}`}
                  >
                    <Card className="flex items-center gap-3 px-4 py-3 bg-card/60 hover:bg-card hover:shadow-md hover:border-destructive/30 transition-all group cursor-pointer">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary shrink-0">
                        {driver.fullName.charAt(0)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="font-medium text-sm truncate">{driver.fullName}</div>
                        <div className="text-xs text-muted-foreground">{driver.vehiclePlate}</div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <Badge variant="outline" className="text-xs">Verified</Badge>
                        <span className="text-xs text-muted-foreground group-hover:text-destructive transition-colors font-medium hidden sm:inline">
                          Report
                        </span>
                        <svg
                          className="w-3.5 h-3.5 text-muted-foreground group-hover:text-destructive transition-colors"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                        </svg>
                      </div>
                    </Card>
                  </button>
                ))}
              </div>
            )}
          </section>

          {/* ── Reports ── */}
          <section className="space-y-4">
            <h2 className="text-lg font-display font-semibold">Your Reports</h2>

            {reportsForPassenger.length === 0 ? (
              <div className="p-6 rounded-lg bg-secondary/40 border border-border/40 text-center text-sm text-muted-foreground">
                You have not submitted any reports yet.
              </div>
            ) : (
              <div className="space-y-3">
                {reportsForPassenger.map((r) => {
                  const driver = mockDrivers.find((d) => d.id === r.driverId);
                  const adminResponse: AdminResponse | undefined = (r as any).adminResponse;
                  return (
                    <Card key={r.id} className="bg-card/50 hover:shadow-md transition-shadow">
                      <CardContent className="pt-4 space-y-3">
                        {/* Report Header */}
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                          <div>
                            <div className="font-medium text-sm">{r.reportType}</div>
                            <div className="text-xs text-muted-foreground mt-0.5">
                              {new Date(r.createdAt).toLocaleDateString("en-GB", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              } as Intl.DateTimeFormatOptions)}
                            </div>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <StatusBadge status={(r as any).status} />
                            {driver && (
                              <span className="text-xs text-muted-foreground hidden sm:inline">
                                {driver.fullName} · {driver.vehiclePlate}
                              </span>
                            )}
                          </div>
                        </div>

                        {driver && (
                          <div className="text-xs text-muted-foreground sm:hidden">
                            Driver: {driver.fullName} · {driver.vehiclePlate}
                          </div>
                        )}

                        <p className="text-sm text-muted-foreground">{r.description}</p>

                        {/* Admin Response — clickable */}
                        {adminResponse ? (
                          <>
                            <Separator />
                            <button
                              onClick={() => setSelectedAdminResponse({ report: r, adminResponse })}
                              className="w-full text-left group"
                              aria-label="View admin response"
                            >
                              <div className="bg-secondary/30 border border-border/30 group-hover:border-primary/30 group-hover:bg-secondary/50 rounded-lg p-3 space-y-1 transition-colors">
                                <div className="text-xs font-semibold text-foreground/80 flex items-center justify-between">
                                  <span className="flex items-center gap-1">
                                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M21 16c0 1.1-.9 2-2 2H5l-4 4V5a2 2 0 012-2h16a2 2 0 012 2v11z" />
                                    </svg>
                                    Admin Response
                                  </span>
                                  <span className="text-xs text-primary font-normal flex items-center gap-0.5 group-hover:underline">
                                    View full response
                                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                    </svg>
                                  </span>
                                </div>
                                <p className="text-sm text-muted-foreground line-clamp-2">{adminResponse.message}</p>
                                <div className="text-xs text-muted-foreground">
                                  {new Date(adminResponse.respondedAt).toLocaleDateString("en-GB", {
                                    day: "numeric",
                                    month: "short",
                                    year: "numeric",
                                  })}
                                </div>
                              </div>
                            </button>
                          </>
                        ) : (
                          <div className="text-xs text-muted-foreground italic">Awaiting admin response…</div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </section>

        </div>
      </section>
    </AppLayout>
  );
};

export default PassengerAccount;
