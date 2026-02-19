import { useState, useEffect, useRef } from "react";
import { AppLayout } from "@/components/AppLayout";
import { StatusBadge } from "@/components/StatusBadge";
import { mockMetrics, mockDrivers, mockReports } from "@/data/mockData";
import { Driver as BaseDriver } from "@/types/vyride";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import {
  Users, Car, ShieldCheck, FileWarning, AlertTriangle, TrendingUp,
  Plus, X, CheckCircle, XCircle, MessageSquare, UserCheck, Clock,
  Bell, BellOff, Ban, Flag, RotateCcw, ChevronRight, Eye,
  PieChart as PieIcon, Activity,
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, Legend, PieChart, Pie, Cell,
} from "recharts";

// ─── Types ───────────────────────────────────────────────────────────────────

type Driver = BaseDriver & {
  driverStatus?: "active" | "suspended" | "flagged";
  suspensionReason?: string;
  suspendedAt?: string;
};

type Report = (typeof mockReports)[number];

type ReportStatus = "open" | "under_review" | "resolved" | "dismissed";

type ReportState = {
  status: ReportStatus;
  adminResponse?: string;
  respondedAt?: string;
};

type PassengerRequest = {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  ninLast5: string;
  selfieInitial: string;
  submittedAt: string;
  status: "pending" | "approved" | "rejected";
};

type NewDriverForm = {
  fullName: string;
  email: string;
  phone: string;
  vehiclePlate: string;
  vehicleModel: string;
  city: string;
  state: string;
  licenseNumber: string;
};

type AlertItem = {
  id: string;
  type: "report" | "approval" | "suspension" | "flag" | "verification";
  title: string;
  detail: string;
  time: string;
  read: boolean;
};

type DriverAction = "suspend" | "flag" | "restore";

// ─── Mock Data ────────────────────────────────────────────────────────────────

const MOCK_REQUESTS: PassengerRequest[] = [
  { id: "REQ001", fullName: "Chioma Okafor", email: "chioma@email.com", phone: "+234 803 111 2233", ninLast5: "•••••44201", selfieInitial: "C", submittedAt: "2025-02-17T09:14:00Z", status: "pending" },
  { id: "REQ002", fullName: "Emeka Nwosu", email: "emeka.n@mail.com", phone: "+234 708 992 0011", ninLast5: "•••••87634", selfieInitial: "E", submittedAt: "2025-02-17T11:30:00Z", status: "pending" },
  { id: "REQ003", fullName: "Fatima Aliyu", email: "fatima.a@inbox.ng", phone: "+234 812 774 5500", ninLast5: "•••••11920", selfieInitial: "F", submittedAt: "2025-02-18T08:05:00Z", status: "pending" },
  { id: "REQ004", fullName: "Tunde Badmus", email: "tunde.b@webmail.com", phone: "+234 907 334 8821", ninLast5: "•••••66473", selfieInitial: "T", submittedAt: "2025-02-18T14:22:00Z", status: "pending" },
];

const INITIAL_ALERTS: AlertItem[] = [
  { id: "a1", type: "report", title: "New Report Filed", detail: "Reckless driving report against Kwame Asante", time: "2 min ago", read: false },
  { id: "a2", type: "approval", title: "Passenger Verification Pending", detail: "Chioma Okafor submitted NIN & selfie for review", time: "14 min ago", read: false },
  { id: "a3", type: "flag", title: "Driver Flagged", detail: "Multiple reports against Bola Tinubu — 3 in 7 days", time: "1 hr ago", read: false },
  { id: "a4", type: "verification", title: "Driver Docs Uploaded", detail: "James Okon uploaded licence and vehicle docs", time: "2 hr ago", read: true },
  { id: "a5", type: "report", title: "New Report Filed", detail: "Harassment complaint against Amara Dike", time: "3 hr ago", read: true },
  { id: "a6", type: "suspension", title: "Driver Suspended", detail: "Admin suspended Uche Eze following 5 reports", time: "5 hr ago", read: true },
];

// ─── Chart Constants ──────────────────────────────────────────────────────────

const TOOLTIP_STYLE = {
  backgroundColor: "hsl(0 0% 100%)",
  border: "1px solid hsl(220 13% 91%)",
  borderRadius: "0.75rem",
  fontSize: 13,
};
const GRID_STROKE = "hsl(220 13% 91%)";
const AXIS_STROKE = "hsl(220 9% 46%)";

const MONTHLY_TREND_DATA = [
  { month: "Aug", passengers: 120, drivers: 34, reports: 8 },
  { month: "Sep", passengers: 145, drivers: 38, reports: 11 },
  { month: "Oct", passengers: 178, drivers: 45, reports: 9 },
  { month: "Nov", passengers: 210, drivers: 51, reports: 14 },
  { month: "Dec", passengers: 198, drivers: 49, reports: 18 },
  { month: "Jan", passengers: 243, drivers: 58, reports: 13 },
];

const FLAGGED_WEEKLY = [
  { label: "Mon", flagged: 2 }, { label: "Tue", flagged: 4 }, { label: "Wed", flagged: 3 },
  { label: "Thu", flagged: 6 }, { label: "Fri", flagged: 5 }, { label: "Sat", flagged: 8 }, { label: "Sun", flagged: 2 },
];
const FLAGGED_MONTHLY = [
  { label: "Week 1", flagged: 14 }, { label: "Week 2", flagged: 21 },
  { label: "Week 3", flagged: 18 }, { label: "Week 4", flagged: 25 },
];
const FLAGGED_CUSTOM = [
  { label: "Day 1", flagged: 3 }, { label: "Day 3", flagged: 7 }, { label: "Day 5", flagged: 4 },
  { label: "Day 7", flagged: 9 }, { label: "Day 9", flagged: 5 }, { label: "Day 11", flagged: 11 }, { label: "Day 13", flagged: 6 },
];

const REPORT_TYPE_DATA = [
  { name: "Reckless Driving", value: 38, color: "hsl(0 84% 60%)" },
  { name: "Harassment", value: 22, color: "hsl(25 95% 53%)" },
  { name: "Overcharging", value: 18, color: "hsl(45 93% 47%)" },
  { name: "Route Deviation", value: 14, color: "hsl(224 76% 48%)" },
  { name: "Vehicle Condition", value: 8, color: "hsl(142 71% 45%)" },
];

const REPORT_STATUS_COLORS: Record<ReportStatus, string> = {
  open: "bg-yellow-100 text-yellow-800 border-yellow-200",
  under_review: "bg-blue-100 text-blue-800 border-blue-200",
  resolved: "bg-green-100 text-green-800 border-green-200",
  dismissed: "bg-secondary text-muted-foreground border-border",
};

const REPORT_STATUS_LABELS: Record<ReportStatus, string> = {
  open: "Open", under_review: "Under Review", resolved: "Resolved", dismissed: "Dismissed",
};

const tabs = [
  { id: "overview", label: "Overview" },
  { id: "drivers", label: "Drivers" },
  { id: "reports", label: "Reports" },
  { id: "passengers", label: "Passenger Requests" },
] as const;

type Tab = (typeof tabs)[number]["id"];
type FlaggedRange = "weekly" | "monthly" | "custom";

// ─── Backdrop ─────────────────────────────────────────────────────────────────

const Backdrop = ({ onClose }: { onClose: () => void }) => (
  <div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm" onClick={onClose} aria-hidden />
);

// ─── Add Driver Modal ─────────────────────────────────────────────────────────

const EMPTY_DRIVER_FORM: NewDriverForm = {
  fullName: "", email: "", phone: "", vehiclePlate: "", vehicleModel: "", city: "", state: "", licenseNumber: "",
};

const AddDriverModal = ({ onClose, onAdd }: { onClose: () => void; onAdd: (d: NewDriverForm) => void }) => {
  const [form, setForm] = useState<NewDriverForm>(EMPTY_DRIVER_FORM);
  const [errors, setErrors] = useState<Partial<NewDriverForm>>({});

  const set = (k: keyof NewDriverForm, v: string) => {
    setForm((f) => ({ ...f, [k]: v }));
    setErrors((e) => ({ ...e, [k]: undefined }));
  };

  const validate = (): boolean => {
    const e: Partial<NewDriverForm> = {};
    if (!form.fullName.trim()) e.fullName = "Required";
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = "Invalid email";
    if (!form.phone.trim()) e.phone = "Required";
    if (!form.vehiclePlate.trim()) e.vehiclePlate = "Required";
    if (!form.vehicleModel.trim()) e.vehicleModel = "Required";
    if (!form.licenseNumber.trim()) e.licenseNumber = "Required";
    if (!form.city.trim()) e.city = "Required";
    if (!form.state.trim()) e.state = "Required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const FF = ({ id, label, placeholder, k, type = "text" }: { id: string; label: string; placeholder: string; k: keyof NewDriverForm; type?: string }) => (
    <div className="space-y-1">
      <Label htmlFor={id} className="text-xs font-medium">{label}</Label>
      <Input id={id} type={type} value={form[k]} onChange={(e) => set(k, e.target.value)} placeholder={placeholder} className="h-9" />
      {errors[k] && <p className="text-xs text-red-500">{errors[k]}</p>}
    </div>
  );

  return (
    <>
      <Backdrop onClose={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <Card className="w-full max-w-lg shadow-2xl pointer-events-auto max-h-[90vh] flex flex-col">
          <CardHeader className="pb-3 border-b border-border shrink-0">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Add New Driver</CardTitle>
              <button onClick={onClose} className="text-muted-foreground hover:text-foreground" aria-label="Close"><X className="w-4 h-4" /></button>
            </div>
          </CardHeader>
          <CardContent className="pt-5 overflow-y-auto flex-1 space-y-5">
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Personal Details</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2"><FF id="fullName" label="Full Legal Name" placeholder="Driver's full name" k="fullName" /></div>
                <FF id="email" label="Email" placeholder="driver@email.com" k="email" type="email" />
                <FF id="phone" label="Phone" placeholder="+234 8xx xxx xxxx" k="phone" type="tel" />
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Vehicle Details</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <FF id="vehiclePlate" label="Plate Number" placeholder="e.g. LND 123 GH" k="vehiclePlate" />
                <FF id="vehicleModel" label="Vehicle Model" placeholder="e.g. Toyota Camry 2020" k="vehicleModel" />
                <div className="sm:col-span-2"><FF id="licenseNumber" label="Driver's Licence Number" placeholder="Licence number" k="licenseNumber" /></div>
                <FF id="city" label="City" placeholder="Lagos" k="city" />
                <FF id="state" label="State" placeholder="Lagos State" k="state" />
              </div>
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
              <p className="text-xs text-amber-700">Driver will receive an email invitation to complete their profile and upload verification documents.</p>
            </div>
            <div className="flex gap-2 justify-end pb-1">
              <Button variant="outline" onClick={onClose}>Cancel</Button>
              <Button onClick={() => { if (validate()) { onAdd(form); onClose(); } }}>
                <Plus className="w-4 h-4 mr-1" /> Add Driver
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

// ─── Driver Action Modal (Suspend / Flag / Restore) ───────────────────────────

const DriverActionModal = ({
  driver,
  action,
  onClose,
  onConfirm,
}: {
  driver: Driver;
  action: DriverAction;
  onClose: () => void;
  onConfirm: (reason: string) => void;
}) => {
  const [reason, setReason] = useState("");

  const config = {
    suspend: {
      title: "Suspend Driver",
      description: `Suspending ${driver.fullName} will prevent them from accepting rides. They will be notified by email.`,
      label: "Suspension reason",
      placeholder: "e.g. Multiple harassment complaints, pending investigation…",
      btnClass: "bg-red-600 hover:bg-red-700 text-white",
      btnLabel: "Confirm Suspension",
      icon: <Ban className="w-5 h-5 text-red-600" />,
      bg: "bg-red-50 border-red-200",
    },
    flag: {
      title: "Flag Driver",
      description: `Flagging ${driver.fullName} will mark their account for closer monitoring. They can still operate.`,
      label: "Reason for flagging",
      placeholder: "e.g. Recurring complaints, suspicious activity…",
      btnClass: "bg-amber-600 hover:bg-amber-700 text-white",
      btnLabel: "Confirm Flag",
      icon: <Flag className="w-5 h-5 text-amber-600" />,
      bg: "bg-amber-50 border-amber-200",
    },
    restore: {
      title: "Restore Driver",
      description: `Restoring ${driver.fullName} will reinstate their account to active status.`,
      label: "Reason for restoration",
      placeholder: "e.g. Investigation concluded, no evidence found…",
      btnClass: "bg-green-600 hover:bg-green-700 text-white",
      btnLabel: "Confirm Restoration",
      icon: <RotateCcw className="w-5 h-5 text-green-600" />,
      bg: "bg-green-50 border-green-200",
    },
  }[action];

  return (
    <>
      <Backdrop onClose={onClose} />
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 pointer-events-none">
        <Card className="w-full max-w-md shadow-2xl pointer-events-auto">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {config.icon}
                <CardTitle className="text-base">{config.title}</CardTitle>
              </div>
              <button onClick={onClose} className="text-muted-foreground hover:text-foreground"><X className="w-4 h-4" /></button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className={`rounded-lg border px-3 py-2.5 text-sm ${config.bg}`}>
              <p>{config.description}</p>
            </div>
            <div>
              <Label className="mb-1.5 block text-xs font-medium">{config.label}</Label>
              <Textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder={config.placeholder}
                rows={3}
              />
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={onClose}>Cancel</Button>
              <Button
                className={config.btnClass}
                disabled={!reason.trim()}
                onClick={() => { onConfirm(reason); onClose(); }}
              >
                {config.btnLabel}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

// ─── Driver Profile Slide-over ────────────────────────────────────────────────

const DriverProfilePanel = ({
  driver,
  reports,
  reportStates,
  onClose,
  onAction,
}: {
  driver: Driver;
  reports: Report[];
  reportStates: Record<string, ReportState>;
  onClose: () => void;
  onAction: (action: DriverAction) => void;
}) => {
  const driverReports = reports.filter((r) => r.driverId === driver.id);
  const status = (driver as any).driverStatus ?? "active";

  const statusConfig = {
    active: { label: "Active", cls: "bg-green-100 text-green-800 border-green-200" },
    suspended: { label: "Suspended", cls: "bg-red-100 text-red-800 border-red-200" },
    flagged: { label: "Flagged", cls: "bg-amber-100 text-amber-800 border-amber-200" },
  }[status as string] ?? { label: "Active", cls: "bg-green-100 text-green-800 border-green-200" };

  return (
    <>
      <Backdrop onClose={onClose} />
      <div className="fixed inset-y-0 right-0 z-50 w-full max-w-lg bg-background shadow-2xl flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
              {driver.fullName.charAt(0)}
            </div>
            <div>
              <h2 className="font-semibold">{driver.fullName}</h2>
              <p className="text-xs text-muted-foreground">{driver.driverId}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground p-1"><X className="w-5 h-5" /></button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
          <div className="flex flex-wrap items-center gap-2">
            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${statusConfig.cls}`}>
              {statusConfig.label}
            </span>
            <StatusBadge status={driver.verificationStatus} size="sm" />
          </div>

          <div className="flex flex-wrap gap-2">
            {status !== "suspended" && (
              <Button size="sm" variant="outline" className="text-red-600 border-red-300 hover:bg-red-50 text-xs gap-1.5" onClick={() => onAction("suspend")}>
                <Ban className="w-3.5 h-3.5" /> Suspend
              </Button>
            )}
            {status !== "flagged" && status !== "suspended" && (
              <Button size="sm" variant="outline" className="text-amber-600 border-amber-300 hover:bg-amber-50 text-xs gap-1.5" onClick={() => onAction("flag")}>
                <Flag className="w-3.5 h-3.5" /> Flag
              </Button>
            )}
            {(status === "suspended" || status === "flagged") && (
              <Button size="sm" variant="outline" className="text-green-600 border-green-300 hover:bg-green-50 text-xs gap-1.5" onClick={() => onAction("restore")}>
                <RotateCcw className="w-3.5 h-3.5" /> Restore
              </Button>
            )}
          </div>

          {status === "suspended" && (driver as any).suspensionReason && (
            <div className="bg-red-50 border border-red-200 rounded-lg px-3 py-2.5 text-xs text-red-700 space-y-1">
              <p className="font-semibold">Suspension reason</p>
              <p>{(driver as any).suspensionReason}</p>
              {(driver as any).suspendedAt && (
                <p className="text-red-500">{new Date((driver as any).suspendedAt).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" })}</p>
              )}
            </div>
          )}

          <Separator />

          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Driver Details</p>
            <div className="space-y-2">
              {[
                { label: "Email", value: (driver as any).email ?? "—" },
                { label: "Phone", value: (driver as any).phone ?? "—" },
                { label: "Vehicle", value: `${driver.vehiclePlate} — ${driver.vehicleModel}` },
                { label: "Location", value: `${driver.city}, ${driver.state}` },
                { label: "Licence No.", value: (driver as any).licenseNumber ?? "—" },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between py-1.5 border-b border-border/30 last:border-0 text-sm">
                  <span className="text-muted-foreground text-xs">{label}</span>
                  <span className="font-medium text-xs text-right">{value}</span>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
              Reports Against Driver ({driverReports.length})
            </p>
            {driverReports.length === 0 ? (
              <p className="text-xs text-muted-foreground italic">No reports filed against this driver.</p>
            ) : (
              <div className="space-y-2">
                {driverReports.map((r) => {
                  const rs = reportStates[r.id];
                  return (
                    <div key={r.id} className="bg-secondary/40 border border-border/40 rounded-lg p-3 space-y-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-medium">{r.reportType}</span>
                        {rs && (
                          <span className={`text-[10px] px-1.5 py-0.5 rounded-full border font-medium ${REPORT_STATUS_COLORS[rs.status]}`}>
                            {REPORT_STATUS_LABELS[rs.status]}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2">{r.description}</p>
                      <p className="text-[10px] text-muted-foreground">{new Date(r.createdAt).toLocaleDateString("en-NG")}</p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

// ─── Alerts Feed ──────────────────────────────────────────────────────────────

const alertIcon = (type: AlertItem["type"]) => {
  const map = {
    report: <FileWarning className="w-3.5 h-3.5 text-destructive" />,
    approval: <UserCheck className="w-3.5 h-3.5 text-amber-600" />,
    suspension: <Ban className="w-3.5 h-3.5 text-red-600" />,
    flag: <Flag className="w-3.5 h-3.5 text-amber-500" />,
    verification: <ShieldCheck className="w-3.5 h-3.5 text-green-600" />,
  };
  return map[type];
};

const alertBg = (type: AlertItem["type"]) => ({
  report: "bg-red-50 border-red-100",
  approval: "bg-amber-50 border-amber-100",
  suspension: "bg-red-50 border-red-100",
  flag: "bg-amber-50 border-amber-100",
  verification: "bg-green-50 border-green-100",
}[type]);

const AlertsFeed = ({
  alerts,
  onDismiss,
  onDismissAll,
  alertsRef,
}: {
  alerts: AlertItem[];
  onDismiss: (id: string) => void;
  onDismissAll: () => void;
  alertsRef?: React.RefObject<HTMLDivElement>;
}) => {
  const unread = alerts.filter((a) => !a.read).length;

  return (
    <Card className="glass-card h-fit" ref={alertsRef}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="font-display flex items-center gap-2 text-base">
            <Bell className="w-4 h-4 text-primary" />
            Live Alerts
            {unread > 0 && (
              <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-destructive text-destructive-foreground text-[10px] font-bold">
                {unread}
              </span>
            )}
          </CardTitle>
          {unread > 0 && (
            <button onClick={onDismissAll} className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors">
              <BellOff className="w-3 h-3" /> Mark all read
            </button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
        {alerts.length === 0 ? (
          <p className="text-xs text-muted-foreground text-center py-6">No alerts right now.</p>
        ) : (
          alerts.map((alert) => (
            <div
              key={alert.id}
              className={`flex items-start gap-3 p-3 rounded-lg border transition-all ${
                alert.read ? "bg-background border-border/30 opacity-60" : alertBg(alert.type)
              }`}
            >
              <div className="w-6 h-6 rounded-full bg-background flex items-center justify-center shrink-0 border border-border/40 mt-0.5">
                {alertIcon(alert.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-1">
                  <p className={`text-xs font-semibold leading-tight ${alert.read ? "text-muted-foreground" : "text-foreground"}`}>
                    {alert.title}
                  </p>
                  <button
                    onClick={() => onDismiss(alert.id)}
                    className="text-muted-foreground hover:text-foreground shrink-0 p-0.5 transition-colors"
                    aria-label="Dismiss"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{alert.detail}</p>
                <p className="text-[10px] text-muted-foreground mt-1 flex items-center gap-1">
                  <Clock className="w-2.5 h-2.5" />{alert.time}
                </p>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};

// ─── Report Analytics ─────────────────────────────────────────────────────────

const ReportAnalytics = ({ reports }: { reports: Report[] }) => {
  const total = REPORT_TYPE_DATA.reduce((s, d) => s + d.value, 0);

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="font-display flex items-center gap-2">
          <PieIcon className="w-5 h-5 text-primary" />
          Reports by Type
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="shrink-0">
            <ResponsiveContainer width={180} height={180}>
              <PieChart>
                <Pie
                  data={REPORT_TYPE_DATA}
                  cx="50%"
                  cy="50%"
                  innerRadius={52}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {REPORT_TYPE_DATA.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(v: number) => [`${v} reports`, ""]} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="flex-1 space-y-2 w-full">
            {REPORT_TYPE_DATA.map((item) => (
              <div key={item.name} className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                  <span className="text-xs text-muted-foreground truncate">{item.name}</span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <div className="w-20 h-1.5 rounded-full bg-secondary overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${(item.value / total) * 100}%`, backgroundColor: item.color }}
                    />
                  </div>
                  <span className="text-xs font-semibold tabular-nums w-6 text-right">{item.value}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// ─── Report Item ──────────────────────────────────────────────────────────────

const ReportItem = ({
  report, driver, state, onUpdateState,
}: {
  report: Report;
  driver: Driver | undefined;
  state: ReportState;
  onUpdateState: (patch: Partial<ReportState>) => void;
}) => {
  const [expanded, setExpanded] = useState(false);
  const [showReply, setShowReply] = useState(false);
  const [responseText, setResponseText] = useState(state.adminResponse ?? "");
  const isActionable = state.status !== "resolved" && state.status !== "dismissed";

  const sendResponse = () => {
    if (!responseText.trim()) return;
    onUpdateState({ adminResponse: responseText, respondedAt: new Date().toISOString(), status: "under_review" });
    setShowReply(false);
  };

  return (
    <div className="rounded-xl border border-border/60 bg-card overflow-hidden">
      <button
        className="w-full text-left flex items-start gap-3 p-4 hover:bg-secondary/30 transition-colors"
        onClick={() => setExpanded((v) => !v)}
      >
        <div className="w-8 h-8 rounded-lg bg-destructive/10 flex items-center justify-center shrink-0 mt-0.5">
          <FileWarning className="w-4 h-4 text-destructive" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-medium text-sm">{report.reportType}</span>
            <span className={`text-[10px] px-1.5 py-0.5 rounded-full border font-medium ${REPORT_STATUS_COLORS[state.status]}`}>
              {REPORT_STATUS_LABELS[state.status]}
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{report.description}</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            Driver: <strong>{driver?.fullName ?? "Unknown"}</strong> · {new Date(report.createdAt).toLocaleDateString("en-NG")}
          </p>
        </div>
        <ChevronRight className={`w-4 h-4 text-muted-foreground shrink-0 mt-1 transition-transform ${expanded ? "rotate-90" : ""}`} />
      </button>

      {expanded && (
        <div className="px-4 pb-4 border-t border-border/40 pt-3 space-y-3 bg-secondary/10">
          <p className="text-sm">{report.description}</p>

          {state.adminResponse && (
            <div className="bg-background border border-border/40 rounded-lg p-3 space-y-1">
              <p className="text-xs font-semibold flex items-center gap-1"><MessageSquare className="w-3 h-3" /> Admin Response</p>
              <p className="text-sm text-muted-foreground">{state.adminResponse}</p>
              {state.respondedAt && <p className="text-[10px] text-muted-foreground">{new Date(state.respondedAt).toLocaleString("en-NG")}</p>}
            </div>
          )}

          {isActionable && (
            <div className="flex flex-wrap gap-2">
              {state.status === "open" && (
                <Button size="sm" variant="outline" className="text-blue-600 border-blue-300 hover:bg-blue-50 text-xs"
                  onClick={() => onUpdateState({ status: "under_review" })}>
                  <Clock className="w-3.5 h-3.5 mr-1" /> Mark Under Review
                </Button>
              )}
              <Button size="sm" variant="outline" className="text-xs" onClick={() => setShowReply((v) => !v)}>
                <MessageSquare className="w-3.5 h-3.5 mr-1" />{state.adminResponse ? "Edit Response" : "Respond"}
              </Button>
              <Button size="sm" variant="outline" className="text-green-600 border-green-300 hover:bg-green-50 text-xs"
                onClick={() => onUpdateState({ status: "resolved" })}>
                <CheckCircle className="w-3.5 h-3.5 mr-1" /> Resolve
              </Button>
              <Button size="sm" variant="outline" className="text-muted-foreground text-xs"
                onClick={() => onUpdateState({ status: "dismissed" })}>
                <XCircle className="w-3.5 h-3.5 mr-1" /> Dismiss
              </Button>
            </div>
          )}

          {showReply && (
            <div className="space-y-2 pt-1">
              <Textarea value={responseText} onChange={(e) => setResponseText(e.target.value)}
                placeholder="Write your response to the passenger…" rows={3} className="text-sm" />
              <div className="flex gap-2">
                <Button size="sm" onClick={sendResponse} disabled={!responseText.trim()}>Send Response</Button>
                <Button size="sm" variant="ghost" onClick={() => setShowReply(false)}>Cancel</Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// ─── Passenger Request Item ───────────────────────────────────────────────────

const PassengerRequestItem = ({ req, onApprove, onReject }: {
  req: PassengerRequest;
  onApprove: () => void;
  onReject: () => void;
}) => {
  const [expanded, setExpanded] = useState(false);

  const statusStyle =
    req.status === "approved" ? "bg-green-100 text-green-800 border-green-200"
    : req.status === "rejected" ? "bg-red-100 text-red-800 border-red-200"
    : "bg-amber-100 text-amber-800 border-amber-200";

  const statusLabel =
    req.status === "approved" ? "Approved" : req.status === "rejected" ? "Rejected" : "Pending Review";

  return (
    <div className={`rounded-xl border bg-card border-border/60 ${req.status !== "pending" ? "opacity-65" : ""}`}>
      <button
        className="w-full text-left flex items-center gap-3 p-4 hover:bg-secondary/30 transition-colors rounded-xl"
        onClick={() => setExpanded((v) => !v)}
      >
        <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary text-sm shrink-0">
          {req.selfieInitial}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-medium text-sm">{req.fullName}</span>
            <span className={`text-[10px] px-1.5 py-0.5 rounded-full border font-medium ${statusStyle}`}>{statusLabel}</span>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">{req.email} · NIN: {req.ninLast5}</p>
        </div>
        <ChevronRight className={`w-4 h-4 text-muted-foreground shrink-0 transition-transform ${expanded ? "rotate-90" : ""}`} />
      </button>

      {expanded && (
        <div className="px-4 pb-4 border-t border-border/40 pt-3 space-y-3 bg-secondary/10">
          <div className="grid grid-cols-2 gap-2 text-xs">
            {[
              { label: "Phone", value: req.phone },
              { label: "NIN", value: req.ninLast5 },
              { label: "Submitted", value: new Date(req.submittedAt).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" }) },
              { label: "Status", value: statusLabel },
            ].map(({ label, value }) => (
              <div key={label}>
                <p className="text-muted-foreground">{label}</p>
                <p className="font-medium">{value}</p>
              </div>
            ))}
          </div>

          {req.status === "pending" && (
            <div className="flex gap-2 pt-1">
              <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-1.5" onClick={onApprove}>
                <UserCheck className="w-3.5 h-3.5" /> Approve
              </Button>
              <Button size="sm" variant="outline" className="text-red-600 border-red-300 hover:bg-red-50 flex items-center gap-1.5" onClick={onReject}>
                <XCircle className="w-3.5 h-3.5" /> Reject
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// ─── Inline Flagged Range Toggle (for Overview tab) ───────────────────────────

const FlaggedRangeToggle = () => {
  const [range, setRange] = useState<FlaggedRange>("weekly");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const data = range === "weekly" ? FLAGGED_WEEKLY : range === "monthly" ? FLAGGED_MONTHLY : FLAGGED_CUSTOM;
  const label = range === "weekly" ? "This Week" : range === "monthly" ? "This Month" : from && to ? `${from} → ${to}` : "Custom Range";

  return (
    <div className="w-full space-y-3">
      <div className="flex items-center gap-1 bg-secondary/60 rounded-lg p-1 self-start">
        {(["weekly", "monthly", "custom"] as FlaggedRange[]).map((r) => (
          <button key={r} onClick={() => setRange(r)}
            className={`px-2.5 py-1 rounded-md text-xs font-medium capitalize transition-colors ${range === r ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`}>
            {r}
          </button>
        ))}
      </div>
      {range === "custom" && (
        <div className="flex items-center gap-2 flex-wrap">
          <input type="date" value={from} onChange={(e) => setFrom(e.target.value)}
            className="text-xs border border-border rounded-lg px-2 py-1.5 bg-background focus:outline-none focus:ring-1 focus:ring-primary" />
          <span className="text-xs text-muted-foreground">to</span>
          <input type="date" value={to} onChange={(e) => setTo(e.target.value)}
            className="text-xs border border-border rounded-lg px-2 py-1.5 bg-background focus:outline-none focus:ring-1 focus:ring-primary" />
        </div>
      )}
      <p className="text-xs text-muted-foreground">{label}</p>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke={GRID_STROKE} />
          <XAxis dataKey="label" tick={{ fontSize: 12 }} stroke={AXIS_STROKE} />
          <YAxis tick={{ fontSize: 12 }} stroke={AXIS_STROKE} allowDecimals={false} />
          <Tooltip contentStyle={TOOLTIP_STYLE} />
          <Bar dataKey="flagged" fill="hsl(0 84% 60%)" radius={[6, 6, 0, 0]} name="Flagged Drivers" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

// ─── Main Dashboard ───────────────────────────────────────────────────────────

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [showAddDriver, setShowAddDriver] = useState(false);
  const [addedDrivers, setAddedDrivers] = useState<NewDriverForm[]>([]);
  const [driverSearch, setDriverSearch] = useState("");
  const [showVerifiedOnly, setShowVerifiedOnly] = useState(false); // ← NEW
  const [reportFilter, setReportFilter] = useState<"all" | ReportStatus>("all");
  const [passengerFilter, setPassengerFilter] = useState<"pending" | "approved" | "rejected" | "all">("pending");

  // Driver profile panel
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  const [driverAction, setDriverAction] = useState<DriverAction | null>(null);

  // Driver statuses (suspend/flag)
  const [driverStatuses, setDriverStatuses] = useState<Record<string, { status: "active" | "suspended" | "flagged"; reason?: string; at?: string }>>({});

  const [reportStates, setReportStates] = useState<Record<string, ReportState>>(
    Object.fromEntries(
      mockReports.map((r) => [
        r.id,
        {
          status: ((r as any).status as ReportStatus) ?? "open",
          adminResponse: (r as any).adminResponse?.message,
          respondedAt: (r as any).adminResponse?.respondedAt,
        },
      ])
    )
  );

  const [passengerRequests, setPassengerRequests] = useState<PassengerRequest[]>(MOCK_REQUESTS);
  const [alerts, setAlerts] = useState<AlertItem[]>(INITIAL_ALERTS);

  // Ref to scroll to alerts section
  const alertsRef = useRef<HTMLDivElement>(null);

  // FIX 1: Bell button handler — navigate to overview and scroll to alerts
  const handleBellClick = () => {
    setActiveTab("overview");
    // Wait for tab content to render, then scroll
    setTimeout(() => {
      alertsRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 100);
  };

  // Simulate a new alert arriving
  useEffect(() => {
    const timer = setTimeout(() => {
      setAlerts((prev) => [
        {
          id: `auto-${Date.now()}`,
          type: "report",
          title: "New Report Filed",
          detail: "Passenger reported overcharging by a Lagos driver",
          time: "just now",
          read: false,
        },
        ...prev,
      ]);
    }, 12000);
    return () => clearTimeout(timer);
  }, []);

  const updateReportState = (id: string, patch: Partial<ReportState>) =>
    setReportStates((s) => ({ ...s, [id]: { ...s[id], ...patch } }));

  const updatePassengerStatus = (id: string, status: "approved" | "rejected") =>
    setPassengerRequests((reqs) => reqs.map((r) => (r.id === id ? { ...r, status } : r)));

  const handleDriverActionConfirm = (reason: string) => {
    if (!selectedDriver || !driverAction) return;
    const newStatus = driverAction === "restore" ? "active" : driverAction === "suspend" ? "suspended" : "flagged";
    setDriverStatuses((s) => ({
      ...s,
      [selectedDriver.id]: { status: newStatus, reason, at: new Date().toISOString() },
    }));
    setAlerts((prev) => [{
      id: `action-${Date.now()}`,
      type: driverAction === "suspend" ? "suspension" : "flag",
      title: driverAction === "restore" ? "Driver Restored" : driverAction === "suspend" ? "Driver Suspended" : "Driver Flagged",
      detail: `${selectedDriver.fullName} — ${reason}`,
      time: "just now",
      read: false,
    }, ...prev]);
    setDriverAction(null);
  };

  const allDrivers: Driver[] = [
    ...mockDrivers.map((d) => ({
      ...d,
      driverStatus: driverStatuses[d.id]?.status ?? "active",
      suspensionReason: driverStatuses[d.id]?.reason,
      suspendedAt: driverStatuses[d.id]?.at,
    })),
    ...addedDrivers.map((d, i) => ({
      id: `NEW${i}`, driverId: `DRV-NEW${String(i).padStart(3, "0")}`,
      fullName: d.fullName, vehiclePlate: d.vehiclePlate, vehicleModel: d.vehicleModel,
      city: d.city, state: d.state, verificationStatus: "unverified" as const,
      driverStatus: "active" as const,
      email: d.email, phone: d.phone, licenseNumber: d.licenseNumber,
      photo: "", cabCompany: "", lastVerifiedDate: "",
    })),
  ];

  const verifiedDriverCount = allDrivers.filter((d) => d.verificationStatus === "verified").length;

  // FIX 3: Verified Drivers card click — navigate to drivers tab and filter to verified only
  const handleVerifiedCardClick = () => {
    setActiveTab("drivers");
    setShowVerifiedOnly(true);
    setDriverSearch("");
  };

  const filteredDrivers = allDrivers.filter((d) => {
    const matchesSearch =
      d.fullName.toLowerCase().includes(driverSearch.toLowerCase()) ||
      d.vehiclePlate.toLowerCase().includes(driverSearch.toLowerCase()) ||
      d.driverId.toLowerCase().includes(driverSearch.toLowerCase());
    const matchesVerified = showVerifiedOnly ? d.verificationStatus === "verified" : true;
    return matchesSearch && matchesVerified;
  });

  const filteredReports = mockReports.filter((r) =>
    reportFilter === "all" ? true : reportStates[r.id]?.status === reportFilter
  );

  const filteredPassengers =
    passengerFilter === "all" ? passengerRequests : passengerRequests.filter((r) => r.status === passengerFilter);

  const openReports = Object.values(reportStates).filter((s) => s.status === "open").length;
  const pendingPassengers = passengerRequests.filter((r) => r.status === "pending").length;
  const unreadAlerts = alerts.filter((a) => !a.read).length;

  return (
    <AppLayout>
      {showAddDriver && (
        <AddDriverModal onClose={() => setShowAddDriver(false)} onAdd={(d) => setAddedDrivers((prev) => [...prev, d])} />
      )}

      {selectedDriver && !driverAction && (
        <DriverProfilePanel
          driver={selectedDriver}
          reports={mockReports as Report[]}
          reportStates={reportStates}
          onClose={() => setSelectedDriver(null)}
          onAction={(action) => setDriverAction(action)}
        />
      )}

      {selectedDriver && driverAction && (
        <DriverActionModal
          driver={selectedDriver}
          action={driverAction}
          onClose={() => setDriverAction(null)}
          onConfirm={handleDriverActionConfirm}
        />
      )}

      <div className="container mx-auto px-4 py-8 space-y-6">

        {/* ── Page Header ── */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground">Admin Dashboard</h1>
            <p className="text-muted-foreground mt-1 text-sm">System overview and management</p>
          </div>
          <div className="flex items-center gap-2">
            {/* FIX 1: Bell button is now clickable and navigates to alerts */}
            <button
              onClick={handleBellClick}
              className="relative p-2 rounded-lg hover:bg-secondary/60 transition-colors"
              aria-label="View live alerts"
            >
              <Bell className="w-5 h-5 text-muted-foreground" />
              {unreadAlerts > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-destructive text-white text-[9px] font-bold flex items-center justify-center">
                  {unreadAlerts}
                </span>
              )}
            </button>
            <Button onClick={() => setShowAddDriver(true)} className="flex items-center gap-1.5">
              <Plus className="w-4 h-4" /> Add Driver
            </Button>
          </div>
        </div>

        {/* ── Metric Cards ── */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
          {[
            {
              label: "Total Passengers", value: mockMetrics.totalPassengers.toLocaleString(), sub: "Registered",
              icon: <Users className="w-5 h-5" />, color: "hover:border-primary/40 hover:bg-primary/3", iconColor: "text-primary bg-primary/10",
              onClick: () => setActiveTab("passengers"),
            },
            {
              label: "Total Drivers", value: allDrivers.length.toLocaleString(), sub: "All statuses",
              icon: <Car className="w-5 h-5" />, color: "hover:border-primary/40 hover:bg-primary/3", iconColor: "text-primary bg-primary/10",
              onClick: () => { setActiveTab("drivers"); setShowVerifiedOnly(false); },
            },
            {
              // FIX 3: Verified Drivers card now filters to verified only
              label: "Verified Drivers", value: verifiedDriverCount.toLocaleString(),
              sub: `${mockMetrics.verifiedPercentage}% of total`,
              icon: <ShieldCheck className="w-5 h-5" />, color: "hover:border-green-300 hover:bg-green-50/50", iconColor: "text-green-700 bg-green-100",
              onClick: handleVerifiedCardClick,
            },
            {
              label: "Open Reports", value: openReports, sub: "Needs attention",
              icon: <FileWarning className="w-5 h-5" />, color: "hover:border-destructive/30 hover:bg-destructive/3", iconColor: "text-destructive bg-destructive/10",
              onClick: () => setActiveTab("reports"),
            },
            {
              label: "Pending Approvals", value: pendingPassengers, sub: "Awaiting review",
              icon: <UserCheck className="w-5 h-5" />, color: "hover:border-amber-300 hover:bg-amber-50/50", iconColor: "text-amber-700 bg-amber-100",
              onClick: () => setActiveTab("passengers"),
            },
          ].map((card) => (
            <button
              key={card.label}
              onClick={card.onClick}
              className={`text-left rounded-xl border border-border bg-card px-4 py-4 transition-all hover:shadow-md group ${card.color}`}
            >
              <div className="mb-3">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${card.iconColor}`}>
                  {card.icon}
                </div>
              </div>
              <div className="text-2xl font-bold tabular-nums">{card.value}</div>
              <div className="text-xs font-medium text-foreground/80 mt-0.5">{card.label}</div>
              <div className="text-xs text-muted-foreground mt-0.5">{card.sub}</div>
            </button>
          ))}
        </div>

        {/* ── Tabs ── */}
        <div className="flex gap-0 border-b border-border overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-3 text-sm font-medium whitespace-nowrap transition-colors relative ${
                activeTab === tab.id
                  ? "text-primary border-b-2 border-primary -mb-px bg-primary/3"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/40"
              }`}
            >
              {tab.label}
              {tab.id === "reports" && openReports > 0 && (
                <span className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full bg-destructive text-destructive-foreground text-[9px] font-bold">{openReports}</span>
              )}
              {tab.id === "passengers" && pendingPassengers > 0 && (
                <span className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full bg-amber-500 text-white text-[9px] font-bold">{pendingPassengers}</span>
              )}
            </button>
          ))}
        </div>

        {/* ════════════════════════════════════
            OVERVIEW TAB
        ════════════════════════════════════ */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Monthly Trends */}
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="font-display flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-primary" />
                    Monthly Trends
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={260}>
                    <LineChart data={mockMetrics.monthlyTrend}>
                      <CartesianGrid strokeDasharray="3 3" stroke={GRID_STROKE} />
                      <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke={AXIS_STROKE} />
                      <YAxis tick={{ fontSize: 12 }} stroke={AXIS_STROKE} />
                      <Tooltip contentStyle={TOOLTIP_STYLE} />
                      <Legend />
                      <Line type="monotone" dataKey="passengers" stroke="hsl(224 76% 48%)" strokeWidth={2} name="Passengers" dot={{ r: 3 }} />
                      <Line type="monotone" dataKey="drivers" stroke="hsl(142 71% 45%)" strokeWidth={2} name="Drivers" dot={{ r: 3 }} />
                      <Line type="monotone" dataKey="reports" stroke="hsl(0 84% 60%)" strokeWidth={2} name="Reports" dot={{ r: 3 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Flagged Drivers */}
              <Card className="glass-card">
                <CardHeader>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <CardTitle className="font-display flex items-center gap-2 shrink-0">
                      <AlertTriangle className="w-5 h-5 text-warning" />
                      Flagged Drivers
                    </CardTitle>
                    <FlaggedRangeToggle />
                  </div>
                </CardHeader>
              </Card>
            </div>

            {/* Analytics + Alerts row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ReportAnalytics reports={mockReports as Report[]} />
              {/* FIX 2: AlertsFeed receives alertsRef so it can be scrolled to */}
              <AlertsFeed
                alerts={alerts}
                alertsRef={alertsRef}
                onDismiss={(id) => setAlerts((a) => a.map((x) => x.id === id ? { ...x, read: true } : x))}
                onDismissAll={() => setAlerts((a) => a.map((x) => ({ ...x, read: true })))}
              />
            </div>
          </div>
        )}

        {/* ════════════════════════════════════
            DRIVERS TAB
        ════════════════════════════════════ */}
        {activeTab === "drivers" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-2 flex-wrap">
                <Input
                  placeholder="Search by name, plate, or ID…"
                  value={driverSearch}
                  onChange={(e) => { setDriverSearch(e.target.value); }}
                  className="max-w-sm"
                />
                {/* FIX 3: Verified filter pill — shows when active, clearable */}
                {showVerifiedOnly && (
                  <button
                    onClick={() => setShowVerifiedOnly(false)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-100 text-green-800 border border-green-300 text-xs font-medium hover:bg-green-200 transition-colors"
                  >
                    <ShieldCheck className="w-3 h-3" />
                    Verified Only
                    <X className="w-3 h-3 ml-0.5" />
                  </button>
                )}
              </div>
              <Button onClick={() => setShowAddDriver(true)} className="flex items-center gap-1.5">
                <Plus className="w-4 h-4" /> Add Driver
              </Button>
            </div>

            <Card className="glass-card">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 px-4 font-semibold text-muted-foreground text-xs">Driver</th>
                        <th className="text-left py-3 px-4 font-semibold text-muted-foreground text-xs hidden sm:table-cell">Vehicle</th>
                        <th className="text-left py-3 px-4 font-semibold text-muted-foreground text-xs hidden md:table-cell">Location</th>
                        <th className="text-left py-3 px-4 font-semibold text-muted-foreground text-xs">Status</th>
                        <th className="text-left py-3 px-4 font-semibold text-muted-foreground text-xs hidden sm:table-cell">Driver Status</th>
                        <th className="py-3 px-4 text-xs" />
                      </tr>
                    </thead>
                    <tbody>
                      {filteredDrivers.length === 0 ? (
                        <tr><td colSpan={6} className="text-center py-12 text-muted-foreground text-sm">No drivers found.</td></tr>
                      ) : (
                        filteredDrivers.map((driver) => {
                          const ds = driver.driverStatus ?? "active";
                          const dsBadge = {
                            active: "bg-green-100 text-green-700 border-green-200",
                            suspended: "bg-red-100 text-red-700 border-red-200",
                            flagged: "bg-amber-100 text-amber-700 border-amber-200",
                          }[ds];
                          return (
                            <tr key={driver.id} className="border-b border-border/50 hover:bg-secondary/50 transition-colors">
                              <td className="py-3 px-4">
                                <div className="flex items-center gap-2.5">
                                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary shrink-0">
                                    {driver.fullName.charAt(0)}
                                  </div>
                                  <div>
                                    <p className="font-medium">{driver.fullName}</p>
                                    <p className="text-xs text-muted-foreground">{driver.driverId}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="py-3 px-4 hidden sm:table-cell">
                                <p>{driver.vehiclePlate}</p>
                                <p className="text-xs text-muted-foreground">{driver.vehicleModel}</p>
                              </td>
                              <td className="py-3 px-4 hidden md:table-cell text-muted-foreground text-xs">{driver.city}, {driver.state}</td>
                              <td className="py-3 px-4"><StatusBadge status={driver.verificationStatus} size="sm" /></td>
                              <td className="py-3 px-4 hidden sm:table-cell">
                                <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium capitalize ${dsBadge}`}>{ds}</span>
                              </td>
                              <td className="py-3 px-4">
                                <button
                                  onClick={() => setSelectedDriver(driver)}
                                  className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                  <span className="hidden sm:inline">View</span>
                                </button>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* ════════════════════════════════════
            REPORTS TAB
        ════════════════════════════════════ */}
        {activeTab === "reports" && (
          <div className="space-y-4">
            <div className="flex gap-2 flex-wrap">
              {(["all", "open", "under_review", "resolved", "dismissed"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setReportFilter(f)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                    reportFilter === f ? "bg-primary text-primary-foreground border-primary" : "border-border/60 text-muted-foreground hover:border-border hover:text-foreground"
                  }`}
                >
                  {f === "all" ? "All Reports" : REPORT_STATUS_LABELS[f as ReportStatus]}
                  {f === "open" && openReports > 0 && (
                    <span className="ml-1.5 inline-flex items-center justify-center w-3.5 h-3.5 rounded-full bg-destructive text-white text-[9px] font-bold">{openReports}</span>
                  )}
                </button>
              ))}
            </div>
            <div className="space-y-3">
              {filteredReports.length === 0 ? (
                <div className="text-center py-12 text-sm text-muted-foreground">No reports in this category.</div>
              ) : (
                filteredReports.map((report) => (
                  <ReportItem
                    key={report.id}
                    report={report}
                    driver={allDrivers.find((d) => d.id === report.driverId)}
                    state={reportStates[report.id] ?? { status: "open" }}
                    onUpdateState={(patch) => updateReportState(report.id, patch)}
                  />
                ))
              )}
            </div>
          </div>
        )}

        {/* ════════════════════════════════════
            PASSENGER REQUESTS TAB
        ════════════════════════════════════ */}
        {activeTab === "passengers" && (
          <div className="space-y-4">
            <div className="flex gap-2 flex-wrap">
              {(["pending", "approved", "rejected", "all"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setPassengerFilter(f)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border capitalize transition-colors ${
                    passengerFilter === f ? "bg-primary text-primary-foreground border-primary" : "border-border/60 text-muted-foreground hover:border-border hover:text-foreground"
                  }`}
                >
                  {f === "all" ? "All" : f.charAt(0).toUpperCase() + f.slice(1)}
                  {f === "pending" && pendingPassengers > 0 && (
                    <span className="ml-1.5 inline-flex items-center justify-center w-3.5 h-3.5 rounded-full bg-amber-500 text-white text-[9px] font-bold">{pendingPassengers}</span>
                  )}
                </button>
              ))}
            </div>
            <div className="space-y-3">
              {filteredPassengers.length === 0 ? (
                <div className="text-center py-12 text-sm text-muted-foreground">No requests in this category.</div>
              ) : (
                filteredPassengers.map((req) => (
                  <PassengerRequestItem
                    key={req.id}
                    req={req}
                    onApprove={() => updatePassengerStatus(req.id, "approved")}
                    onReject={() => updatePassengerStatus(req.id, "rejected")}
                  />
                ))
              )}
            </div>
          </div>
        )}

      </div>
    </AppLayout>
  );
};

export default AdminDashboard;
