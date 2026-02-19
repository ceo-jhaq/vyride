import { AppLayout } from "@/components/AppLayout";
import { MetricCard } from "@/components/MetricCard";
import { StatusBadge } from "@/components/StatusBadge";
import { mockMetrics, mockDrivers, mockReports } from "@/data/mockData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Car, ShieldCheck, FileWarning, AlertTriangle, TrendingUp } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, Legend,
} from "recharts";

const AdminDashboard = () => {
  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-1">System overview and analytics</p>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard title="Total Passengers" value={mockMetrics.totalPassengers.toLocaleString()} icon={Users} accentColor="primary" />
          <MetricCard title="Total Drivers" value={mockMetrics.totalDrivers.toLocaleString()} icon={Car} accentColor="primary" />
          <MetricCard
            title="Verified Drivers"
            value={mockMetrics.verifiedDrivers.toLocaleString()}
            subtitle={`${mockMetrics.verifiedPercentage}% verified`}
            icon={ShieldCheck}
            accentColor="safe"
          />
          <MetricCard title="Reports Submitted" value={mockMetrics.reportsSubmitted} icon={FileWarning} accentColor="warning" />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="font-display flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                Monthly Trends
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={mockMetrics.monthlyTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 13% 91%)" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="hsl(220 9% 46%)" />
                  <YAxis tick={{ fontSize: 12 }} stroke="hsl(220 9% 46%)" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(0 0% 100%)",
                      border: "1px solid hsl(220 13% 91%)",
                      borderRadius: "0.75rem",
                      fontSize: 13,
                    }}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="flagged" stroke="hsl(0 84% 60%)" strokeWidth={2} name="Flagged Drivers" dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="reports" stroke="hsl(45 93% 56%)" strokeWidth={2} name="Reports" dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="font-display flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-warning" />
                Weekly Flagged Drivers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={mockMetrics.weeklyTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 13% 91%)" />
                  <XAxis dataKey="week" tick={{ fontSize: 12 }} stroke="hsl(220 9% 46%)" />
                  <YAxis tick={{ fontSize: 12 }} stroke="hsl(220 9% 46%)" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(0 0% 100%)",
                      border: "1px solid hsl(220 13% 91%)",
                      borderRadius: "0.75rem",
                      fontSize: 13,
                    }}
                  />
                  <Bar dataKey="flagged" fill="hsl(0 84% 60%)" radius={[6, 6, 0, 0]} name="Flagged" />
                  <Bar dataKey="reports" fill="hsl(224 76% 33%)" radius={[6, 6, 0, 0]} name="Reports" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Drivers table */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="font-display">All Drivers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Driver</th>
                    <th className="text-left py-3 px-4 font-semibold text-muted-foreground hidden sm:table-cell">Vehicle</th>
                    <th className="text-left py-3 px-4 font-semibold text-muted-foreground hidden md:table-cell">Location</th>
                    <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {mockDrivers.map((driver) => (
                    <tr key={driver.id} className="border-b border-border/50 hover:bg-secondary/50 transition-colors">
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-medium text-foreground">{driver.fullName}</p>
                          <p className="text-xs text-muted-foreground">{driver.driverId}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4 hidden sm:table-cell">
                        <p className="text-foreground">{driver.vehiclePlate}</p>
                        <p className="text-xs text-muted-foreground">{driver.vehicleModel}</p>
                      </td>
                      <td className="py-3 px-4 hidden md:table-cell text-muted-foreground">{driver.city}, {driver.state}</td>
                      <td className="py-3 px-4">
                        <StatusBadge status={driver.verificationStatus} size="sm" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Recent reports */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="font-display">Recent Reports</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {mockReports.map((report) => {
              const driver = mockDrivers.find((d) => d.id === report.driverId);
              return (
                <div key={report.id} className="flex items-start gap-4 p-4 rounded-xl bg-secondary/50 border border-border/50">
                  <div className="w-10 h-10 rounded-xl bg-destructive/10 flex items-center justify-center shrink-0">
                    <FileWarning className="w-5 h-5 text-destructive" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium text-foreground">{report.reportType}</span>
                      {driver && <StatusBadge status={driver.verificationStatus} size="sm" />}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{report.description}</p>
                    <p className="text-xs text-muted-foreground mt-2">
                      Driver: {driver?.fullName ?? "Unknown"} · {new Date(report.createdAt).toLocaleDateString("en-NG")}
                    </p>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default AdminDashboard;
