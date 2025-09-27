import type { Metadata } from "next";

import { Manrope } from "next/font/google";
import { GeistMono } from "geist/font/mono";
import { CopilotKit } from "@copilotkit/react-core";
import "./globals.css";
import "@copilotkit/react-ui/styles.css";
import ClientOnly from "@/components/ClientOnly";
import HydrationFix from "@/components/HydrationFix";

const manrope = Manrope({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-manrope",
});

export const metadata: Metadata = {
  title: "SnapCart Assistant | AI-Powered Shopping Assistant",
  description: "Upload photos to detect items and compare prices on Amazon and Walmart with AI assistance",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${manrope.variable} ${GeistMono.variable}`}>
      <head>
        <title>SnapCart Assistant | AI-Powered Shopping Assistant</title>
      </head>
      <body className="subpixel-antialiased" suppressHydrationWarning={true}>
        <HydrationFix />
        <ClientOnly>
          <CopilotKit
            runtimeUrl="/api/copilotkit"
            agent="sample_agent" // TODO: Change to new agent name (e.g., "photo_analysis_agent")
            publicApiKey={process.env.COPILOT_CLOUD_PUBLIC_API_KEY} // optional (for CopilotKit Cloud features)
          >
            {children}
          </CopilotKit>
        </ClientOnly>
      </body>
    </html>
  );
}
