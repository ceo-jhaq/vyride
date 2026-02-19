import React from "react";
import { QrCode } from "lucide-react";

export default function ScanButton() {
  const openCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
      const video = document.createElement("video");
      video.srcObject = stream;
      video.autoplay = true;
      video.style.width = "100%";
      video.style.height = "100%";
      document.body.appendChild(video);
    } catch (err) {
      console.error("Camera error:", err);
      alert("Unable to access camera. Please allow permissions!");
    }
  };

  return (
    <button
      onClick={openCamera}
      className="inline-flex items-center gap-2 text-primary-foreground/60 hover:text-primary-foreground/90 text-sm transition-colors"
    >
      <QrCode className="w-4 h-4" />
      Scan QR Code instead
    </button>
  );
}
