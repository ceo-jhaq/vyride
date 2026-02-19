import { Driver } from "@/types/vyride";
import { StatusBadge } from "./StatusBadge";
import { Card, CardContent } from "@/components/ui/card";
import { User, IdCard, Car, Building2, MapPin, Calendar } from "lucide-react";

interface DriverCardProps {
  driver: Driver;
}

export function DriverCard({ driver }: DriverCardProps) {
  return (
    <Card className="glass-card overflow-hidden animate-slide-up">
      <div className={`h-2 w-full ${
        driver.verificationStatus === "safe" ? "bg-safe-gradient" :
        driver.verificationStatus === "warning" ? "bg-warning-gradient" :
        "bg-unsafe-gradient"
      }`} />
      <CardContent className="p-6">
        <div className="flex flex-col sm:flex-row items-start gap-5">
          {/* Avatar */}
          <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
            <User className="w-10 h-10 text-primary" />
          </div>

          <div className="flex-1 min-w-0 space-y-4 w-full">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="font-display text-xl font-bold text-foreground">{driver.fullName}</h3>
                <p className="text-muted-foreground text-sm">{driver.cabCompany}</p>
              </div>
              <StatusBadge status={driver.verificationStatus} size="lg" />
            </div>

            {/* Details grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <InfoRow icon={IdCard} label="Driver ID" value={driver.driverId} />
              <InfoRow icon={IdCard} label="License" value={driver.licenseNumber} />
              <InfoRow icon={Car} label="Vehicle" value={`${driver.vehicleModel} · ${driver.vehiclePlate}`} />
              <InfoRow icon={Building2} label="Company" value={driver.cabCompany} />
              <InfoRow icon={MapPin} label="Location" value={`${driver.city}, ${driver.state}`} />
              <InfoRow icon={Calendar} label="Last Verified" value={new Date(driver.lastVerifiedDate).toLocaleDateString("en-NG", { year: "numeric", month: "short", day: "numeric" })} />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function InfoRow({ icon: Icon, label, value }: { icon: typeof User; label: string; value: string }) {
  return (
    <div className="flex items-center gap-2 text-sm">
      <Icon className="w-4 h-4 text-muted-foreground shrink-0" />
      <span className="text-muted-foreground">{label}:</span>
      <span className="font-medium text-foreground truncate">{value}</span>
    </div>
  );
}
