import { useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { DriverCard } from "@/components/DriverCard";
import { StatusBadge } from "@/components/StatusBadge";
import { mockDrivers } from "@/data/mockData";
import { Driver } from "@/types/vyride";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Shield, QrCode, AlertTriangle, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [result, setResult] = useState<Driver | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [reportText, setReportText] = useState("");
  const [reportType, setReportType] = useState("");
  const { toast } = useToast();

  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    const found = mockDrivers.find(
      (d) =>
        d.vehiclePlate.toLowerCase().replace(/[-\s]/g, "").includes(searchQuery.toLowerCase().replace(/[-\s]/g, "")) ||
        d.driverId.toLowerCase().includes(searchQuery.toLowerCase())
    );
    if (found) {
      setResult(found);
      setNotFound(false);
    } else {
      setResult(null);
      setNotFound(true);
    }
    setShowReport(false);
    setReportText("");
    setReportType("");
  };

  const handleReport = () => {
    if (!reportType.trim() || !reportText.trim()) {
      toast({ title: "Please fill in all fields", variant: "destructive" });
      return;
    }
    toast({
      title: "Report Submitted",
      description: "Your report has been received and will be reviewed by our team.",
    });
    setShowReport(false);
    setReportText("");
    setReportType("");
  };

  return (
    <AppLayout>
      {/* Hero */}
      <section className="bg-hero-gradient relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,hsl(224_76%_40%/0.5),transparent_70%)]" />
        <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
          <div className="max-w-2xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-foreground/10 backdrop-blur-sm border border-primary-foreground/20 text-primary-foreground text-sm">
              <Shield className="w-4 h-4" />
              Trusted Cab Verification Platform
            </div>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground leading-tight">
              Verify Your Ride,{" "}
              <span className="text-safe">Stay Safe</span>
            </h1>
            <p className="text-primary-foreground/70 text-lg max-w-lg mx-auto">
              Enter a plate number or driver ID to instantly check if your cab is verified and safe.
            </p>

            {/* Search bar */}
            <div className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto mt-8">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  placeholder="Enter plate number (e.g. KJA-234-AB)"
                  className="pl-12 h-13 bg-card text-foreground border-0 shadow-lg text-base rounded-xl"
                />
              </div>
              <Button
                onClick={handleSearch}
                size="lg"
                className="bg-safe hover:bg-safe/90 text-safe-foreground font-semibold rounded-xl shadow-lg h-13 px-8"
              >
                <Search className="w-4 h-4 mr-2" />
                Verify
              </Button>
            </div>

            <button className="inline-flex items-center gap-2 text-primary-foreground/60 hover:text-primary-foreground/90 text-sm transition-colors">
              <QrCode className="w-4 h-4" />
              Scan QR Code instead
            </button>
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="container mx-auto px-4 py-10 max-w-3xl">
        {result && (
          <div className="space-y-4">
            <DriverCard driver={result} />
            {!showReport ? (
              <Button
                variant="outline"
                onClick={() => setShowReport(true)}
                className="w-full border-destructive/30 text-destructive hover:bg-destructive/5"
              >
                <AlertTriangle className="w-4 h-4 mr-2" />
                Report an Issue
              </Button>
            ) : (
              <Card className="glass-card animate-slide-up">
                <CardHeader>
                  <CardTitle className="text-lg font-display flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-destructive" />
                    Submit a Report
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">Report Type</label>
                    <Input
                      value={reportType}
                      onChange={(e) => setReportType(e.target.value)}
                      placeholder="e.g. Reckless Driving, Harassment, Vehicle Condition"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">Description</label>
                    <Textarea
                      value={reportText}
                      onChange={(e) => setReportText(e.target.value)}
                      placeholder="Describe the issue in detail..."
                      rows={4}
                    />
                  </div>
                  <div className="flex gap-3">
                    <Button onClick={handleReport} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                      <Send className="w-4 h-4 mr-2" />
                      Submit Report
                    </Button>
                    <Button variant="outline" onClick={() => setShowReport(false)}>
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {notFound && (
          <Card className="glass-card border-destructive/20 animate-slide-up">
            <CardContent className="p-8 text-center space-y-3">
              <div className="w-16 h-16 rounded-2xl bg-destructive/10 flex items-center justify-center mx-auto">
                <AlertTriangle className="w-8 h-8 text-destructive" />
              </div>
              <h3 className="font-display text-xl font-bold text-foreground">Vehicle Not Found</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                No verified driver or vehicle matches this plate number. Exercise caution and consider using a verified ride service.
              </p>
            </CardContent>
          </Card>
        )}

        {!result && !notFound && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
            {[
              { icon: Search, title: "Enter Plate Number", desc: "Type the vehicle's plate number to look up verification status." },
              { icon: Shield, title: "Instant Verification", desc: "Get real-time driver and vehicle safety status in seconds." },
              { icon: AlertTriangle, title: "Report Issues", desc: "Submit reports for any safety concerns during your ride." },
            ].map((item) => (
              <Card key={item.title} className="glass-card text-center">
                <CardContent className="p-6 space-y-3">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto">
                    <item.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-display font-semibold text-foreground">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>
    </AppLayout>
  );
};

export default Index;
