import { useState, useRef, useCallback } from "react";
import { AppLayout } from "@/components/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

// ─── Types ───────────────────────────────────────────────────────────────────

type FormData = {
  fullName: string;
  email: string;
  phone: string;
  dob: string;
  password: string;
  confirmPassword: string;
  nin: string;
  selfie: string | null; // base64 data URL
};

// ─── Step Config ──────────────────────────────────────────────────────────────

const STEPS = [
  { id: 1, label: "Account", title: "Create your account", description: "Start with your basic details." },
  { id: 2, label: "Selfie", title: "Take a selfie", description: "We need to confirm it's really you." },
  { id: 3, label: "Identity", title: "Verify your identity", description: "Enter your National Identification Number." },
  { id: 4, label: "Done", title: "You're almost in", description: "Review and submit your registration." },
];

// ─── Step Indicator ───────────────────────────────────────────────────────────

const StepIndicator = ({ currentStep }: { currentStep: number }) => (
  <div className="flex items-center justify-center gap-0 mb-10">
    {STEPS.map((step, i) => (
      <div key={step.id} className="flex items-center">
        <div className="flex flex-col items-center">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 border-2 ${
              currentStep > step.id
                ? "bg-primary border-primary text-primary-foreground"
                : currentStep === step.id
                ? "bg-background border-primary text-primary"
                : "bg-background border-border text-muted-foreground"
            }`}
          >
            {currentStep > step.id ? (
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              step.id
            )}
          </div>
          <span
            className={`mt-1 text-[10px] font-medium hidden sm:block transition-colors ${
              currentStep >= step.id ? "text-primary" : "text-muted-foreground"
            }`}
          >
            {step.label}
          </span>
        </div>
        {i < STEPS.length - 1 && (
          <div
            className={`w-12 sm:w-20 h-0.5 mb-4 mx-1 transition-all duration-500 ${
              currentStep > step.id ? "bg-primary" : "bg-border"
            }`}
          />
        )}
      </div>
    ))}
  </div>
);

// ─── Field ────────────────────────────────────────────────────────────────────

const Field = ({
  label,
  id,
  error,
  children,
}: {
  label: string;
  id: string;
  error?: string;
  children: React.ReactNode;
}) => (
  <div className="space-y-1.5">
    <Label htmlFor={id} className="text-sm font-medium">
      {label}
    </Label>
    {children}
    {error && <p className="text-xs text-red-500">{error}</p>}
  </div>
);

// ─── Step 1: Account Details ──────────────────────────────────────────────────

const StepAccount = ({
  data,
  onChange,
  errors,
}: {
  data: FormData;
  onChange: (k: keyof FormData, v: string) => void;
  errors: Partial<Record<keyof FormData, string>>;
}) => (
  <div className="space-y-4">
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div className="sm:col-span-2">
        <Field label="Full Legal Name" id="fullName" error={errors.fullName}>
          <Input
            id="fullName"
            value={data.fullName}
            onChange={(e) => onChange("fullName", e.target.value)}
            placeholder="As it appears on your ID"
          />
        </Field>
      </div>
      <Field label="Email Address" id="email" error={errors.email}>
        <Input
          id="email"
          type="email"
          value={data.email}
          onChange={(e) => onChange("email", e.target.value)}
          placeholder="you@example.com"
        />
      </Field>
      <Field label="Phone Number" id="phone" error={errors.phone}>
        <Input
          id="phone"
          type="tel"
          value={data.phone}
          onChange={(e) => onChange("phone", e.target.value)}
          placeholder="+234 8xx xxx xxxx"
        />
      </Field>
      <Field label="Date of Birth" id="dob" error={errors.dob}>
        <Input
          id="dob"
          type="date"
          value={data.dob}
          onChange={(e) => onChange("dob", e.target.value)}
        />
      </Field>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
      <Field label="Password" id="password" error={errors.password}>
        <Input
          id="password"
          type="password"
          value={data.password}
          onChange={(e) => onChange("password", e.target.value)}
          placeholder="Min. 8 characters"
        />
      </Field>
      <Field label="Confirm Password" id="confirmPassword" error={errors.confirmPassword}>
        <Input
          id="confirmPassword"
          type="password"
          value={data.confirmPassword}
          onChange={(e) => onChange("confirmPassword", e.target.value)}
          placeholder="Repeat password"
        />
      </Field>
    </div>
  </div>
);

// ─── Step 2: Selfie ───────────────────────────────────────────────────────────

const StepSelfie = ({
  selfie,
  onCapture,
}: {
  selfie: string | null;
  onCapture: (dataUrl: string) => void;
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [streaming, setStreaming] = useState(false);
  const [cameraError, setCameraError] = useState("");

  const startCamera = useCallback(async () => {
    setCameraError("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setStreaming(true);
      }
    } catch {
      setCameraError("Camera access denied. Please upload a photo instead.");
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (videoRef.current?.srcObject) {
      (videoRef.current.srcObject as MediaStream).getTracks().forEach((t) => t.stop());
      videoRef.current.srcObject = null;
    }
    setStreaming(false);
  }, []);

  const capture = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d")!.drawImage(video, 0, 0);
    const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
    onCapture(dataUrl);
    stopCamera();
  }, [onCapture, stopCamera]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => onCapture(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const retake = () => {
    onCapture("");
    startCamera();
  };

  return (
    <div className="space-y-5">
      {/* Tips */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <p className="text-xs font-semibold text-blue-800 mb-2">For a clear selfie:</p>
        <ul className="space-y-1">
          {["Face a well-lit area", "Remove sunglasses or hats", "Look directly at the camera", "Make sure your face fills the frame"].map((tip) => (
            <li key={tip} className="text-xs text-blue-700 flex items-center gap-1.5">
              <svg className="w-3 h-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              {tip}
            </li>
          ))}
        </ul>
      </div>

      {/* Camera / Preview */}
      <div className="flex flex-col items-center gap-4">
        {selfie ? (
          <div className="space-y-3 text-center">
            <div className="relative inline-block">
              <img
                src={selfie}
                alt="Your selfie"
                className="w-48 h-48 object-cover rounded-full border-4 border-primary/30 shadow-md"
              />
              <div className="absolute bottom-2 right-2 w-8 h-8 rounded-full bg-green-500 flex items-center justify-center shadow">
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <p className="text-sm font-medium text-green-700">Selfie captured!</p>
            <Button variant="outline" size="sm" onClick={retake}>
              Retake
            </Button>
          </div>
        ) : streaming ? (
          <div className="space-y-3 text-center">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-64 h-64 object-cover rounded-2xl border border-border shadow-md"
              style={{ transform: "scaleX(-1)" }}
            />
            <div className="flex gap-2 justify-center">
              <Button onClick={capture}>
                <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <circle cx="12" cy="12" r="10" />
                  <circle cx="12" cy="12" r="4" fill="currentColor" />
                </svg>
                Take Photo
              </Button>
              <Button variant="outline" onClick={stopCamera}>Cancel</Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row gap-3">
            <Button onClick={startCamera} className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Open Camera
            </Button>
            <Button variant="outline" onClick={() => fileInputRef.current?.click()} className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              Upload Photo
            </Button>
          </div>
        )}

        {cameraError && <p className="text-xs text-red-500 text-center">{cameraError}</p>}
      </div>

      {/* Hidden elements */}
      <canvas ref={canvasRef} className="hidden" />
      <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
    </div>
  );
};

// ─── Step 3: NIN ──────────────────────────────────────────────────────────────

const StepNIN = ({
  nin,
  onChange,
  error,
}: {
  nin: string;
  onChange: (v: string) => void;
  error?: string;
}) => {
  const formatted = nin.replace(/\D/g, "").slice(0, 11);

  return (
    <div className="space-y-6">
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 space-y-2">
        <p className="text-xs font-semibold text-amber-800 flex items-center gap-1.5">
          <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Why we need this
        </p>
        <p className="text-xs text-amber-700">
          Your National Identification Number (NIN) is used solely for identity verification to keep all passengers and drivers safe. It is encrypted and never shared with third parties.
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="nin" className="text-sm font-medium">
          National Identification Number (NIN)
        </Label>
        <Input
          id="nin"
          value={formatted}
          onChange={(e) => onChange(e.target.value.replace(/\D/g, "").slice(0, 11))}
          placeholder="00000000000"
          className="text-center tracking-[0.25em] text-lg font-mono"
          maxLength={11}
          inputMode="numeric"
        />
        <div className="flex justify-between items-center">
          {error ? (
            <p className="text-xs text-red-500">{error}</p>
          ) : (
            <p className="text-xs text-muted-foreground">11-digit number on your NIN slip or National e-ID card.</p>
          )}
          <span className="text-xs text-muted-foreground tabular-nums">{formatted.length}/11</span>
        </div>
      </div>

      {/* NIN visual hint */}
      <div className="rounded-xl border border-border/60 bg-muted/20 p-4">
        <p className="text-xs text-muted-foreground mb-3 font-medium">Where to find your NIN</p>
        <div className="grid grid-cols-2 gap-3 text-xs text-muted-foreground">
          {[
            { icon: "🪪", label: "NIN Slip", desc: "Issued by NIMC" },
            { icon: "📱", label: "NIMC App", desc: "Self-service portal" },
            { icon: "🏦", label: "Bank records", desc: "Linked to BVN" },
            { icon: "📋", label: "FRSC / Passport", desc: "On your documents" },
          ].map((item) => (
            <div key={item.label} className="flex items-start gap-2">
              <span className="text-base leading-none mt-0.5">{item.icon}</span>
              <div>
                <p className="font-medium text-foreground/80">{item.label}</p>
                <p>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ─── Step 4: Review ───────────────────────────────────────────────────────────

const StepReview = ({ data }: { data: FormData }) => (
  <div className="space-y-5">
    <div className="flex flex-col sm:flex-row gap-5 items-start">
      {/* Selfie preview */}
      {data.selfie && (
        <img
          src={data.selfie}
          alt="Your selfie"
          className="w-20 h-20 object-cover rounded-full border-2 border-primary/30 shadow shrink-0"
        />
      )}
      <div className="flex-1 space-y-3 w-full">
        {[
          { label: "Full Name", value: data.fullName },
          { label: "Email", value: data.email },
          { label: "Phone", value: data.phone },
          { label: "Date of Birth", value: data.dob },
          { label: "NIN", value: data.nin ? `••••••${data.nin.slice(-5)}` : "—" },
          { label: "Selfie", value: data.selfie ? "Provided ✓" : "Not provided" },
        ].map(({ label, value }) => (
          <div key={label} className="flex justify-between items-center py-1.5 border-b border-border/40 last:border-0">
            <span className="text-xs text-muted-foreground">{label}</span>
            <span className="text-sm font-medium">{value || "—"}</span>
          </div>
        ))}
      </div>
    </div>

    <div className="bg-secondary/40 border border-border/40 rounded-xl p-4 space-y-2">
      <p className="text-xs font-semibold">What happens next?</p>
      <ol className="space-y-1.5">
        {[
          "Your NIN and selfie are sent to our verification partner.",
          "Verification typically takes a few minutes to 72 hours.",
          "You'll receive an email confirmation once approved.",
          "Until verified, ride booking will be limited.",
        ].map((item, i) => (
          <li key={i} className="text-xs text-muted-foreground flex gap-2">
            <span className="font-bold text-primary shrink-0">{i + 1}.</span>
            {item}
          </li>
        ))}
      </ol>
    </div>

    <div className="flex items-start gap-2 pt-1">
      <input type="checkbox" id="terms" className="mt-0.5 h-4 w-4 accent-primary shrink-0" />
      <label htmlFor="terms" className="text-xs text-muted-foreground leading-relaxed">
        I agree to Vyride's{" "}
        <a href="#" className="text-primary underline-offset-2 hover:underline">Terms of Service</a> and{" "}
        <a href="#" className="text-primary underline-offset-2 hover:underline">Privacy Policy</a>.
        I consent to my NIN and selfie being used for identity verification.
      </label>
    </div>
  </div>
);

// ─── Main Page ────────────────────────────────────────────────────────────────

const PassengerRegister = () => {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState<FormData>({
    fullName: "",
    email: "",
    phone: "",
    dob: "",
    password: "",
    confirmPassword: "",
    nin: "",
    selfie: null,
  });
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});

  const update = (key: keyof FormData, value: string) => {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const validateStep = (): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};

    if (step === 1) {
      if (!form.fullName.trim()) newErrors.fullName = "Full name is required.";
      if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) newErrors.email = "Enter a valid email.";
      if (!form.phone.trim() || form.phone.replace(/\D/g, "").length < 10) newErrors.phone = "Enter a valid phone number.";
      if (!form.dob) newErrors.dob = "Date of birth is required.";
      if (form.password.length < 8) newErrors.password = "Password must be at least 8 characters.";
      if (form.password !== form.confirmPassword) newErrors.confirmPassword = "Passwords do not match.";
    }

    if (step === 2 && !form.selfie) {
      newErrors.selfie = "Please take or upload a selfie.";
    }

    if (step === 3) {
      if (!form.nin || form.nin.length !== 11) newErrors.nin = "NIN must be exactly 11 digits.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const next = () => {
    if (validateStep()) setStep((s) => s + 1);
  };

  const back = () => setStep((s) => s - 1);

  const submit = () => {
    // Wire to your API here
    setSubmitted(true);
  };

  // ── Success screen ──
  if (submitted) {
    return (
      <AppLayout>
        <section className="container mx-auto px-4 py-20 flex items-center justify-center">
          <div className="max-w-md w-full text-center space-y-6">
            <div className="w-20 h-20 rounded-full bg-green-100 border-4 border-green-200 flex items-center justify-center mx-auto">
              <svg className="w-9 h-9 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-display font-bold">Registration submitted!</h1>
              <p className="text-muted-foreground mt-2 text-sm">
                Thanks, <strong>{form.fullName.split(" ")[0]}</strong>. Your details are under review. We'll email{" "}
                <strong>{form.email}</strong> once your account is verified.
              </p>
            </div>
            <div className="bg-secondary/40 border border-border/40 rounded-xl p-4 text-left space-y-1.5">
              <p className="text-xs font-semibold">Verification in progress</p>
              {["Identity documents submitted", "NIN verification pending", "Selfie biometric check pending"].map(
                (item) => (
                  <div key={item} className="flex items-center gap-2 text-xs text-muted-foreground">
                    <div className="w-3 h-3 rounded-full border-2 border-amber-400 bg-amber-100 shrink-0" />
                    {item}
                  </div>
                )
              )}
            </div>
            <Button variant="outline" onClick={() => (window.location.href = "/login")}>
              Back to Login
            </Button>
          </div>
        </section>
      </AppLayout>
    );
  }

  const currentStep = STEPS[step - 1];

  return (
    <AppLayout>
      <section className="container mx-auto px-4 py-10">
        <div className="max-w-xl mx-auto">

          {/* ── Page Header ── */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-display font-bold tracking-tight">Join Vyride</h1>
            <p className="text-sm text-muted-foreground mt-1">Safe rides start with verified passengers.</p>
          </div>

          {/* ── Step Indicator ── */}
          <StepIndicator currentStep={step} />

          {/* ── Card ── */}
          <Card className="shadow-md">
            <CardContent className="pt-6 pb-7 px-6 sm:px-8">
              {/* Step header */}
              <div className="mb-6">
                <h2 className="text-lg font-display font-semibold">{currentStep.title}</h2>
                <p className="text-sm text-muted-foreground mt-0.5">{currentStep.description}</p>
              </div>

              {/* Step content */}
              {step === 1 && <StepAccount data={form} onChange={update} errors={errors} />}
              {step === 2 && (
                <div className="space-y-2">
                  <StepSelfie selfie={form.selfie} onCapture={(v) => update("selfie", v)} />
                  {errors.selfie && <p className="text-xs text-red-500">{errors.selfie}</p>}
                </div>
              )}
              {step === 3 && <StepNIN nin={form.nin} onChange={(v) => update("nin", v)} error={errors.nin} />}
              {step === 4 && <StepReview data={form} />}

              {/* Navigation */}
              <div className="flex justify-between items-center mt-8 pt-4 border-t border-border/40">
                {step > 1 ? (
                  <Button variant="ghost" onClick={back} className="text-muted-foreground">
                    <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                    Back
                  </Button>
                ) : (
                  <a href="/login" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                    Already have an account? <span className="text-primary font-medium">Sign in</span>
                  </a>
                )}

                {step < 4 ? (
                  <Button onClick={next}>
                    Continue
                    <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </Button>
                ) : (
                  <Button onClick={submit} className="bg-green-600 hover:bg-green-700 text-white">
                    Submit Registration
                    <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* ── Security note ── */}
          <p className="text-center text-xs text-muted-foreground mt-5 flex items-center justify-center gap-1.5">
            <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            Your data is encrypted and securely stored. We never sell your information.
          </p>

        </div>
      </section>
    </AppLayout>
  );
};

export default PassengerRegister;
