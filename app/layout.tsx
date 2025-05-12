import type { Metadata } from "next";
import "./globals.css";
import { ConvexAuthNextjsServerProvider } from "@convex-dev/auth/nextjs/server";
import ConvexClientProvider from "@/components/ConvexClientProvider";
import { AntdRegistry } from "@ant-design/nextjs-registry";


export const metadata: Metadata = {
  title: "Kite Management",
  description: "The Kite Hostel Management App",
  icons: {
    icon: "/convex.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AntdRegistry>
      <ConvexAuthNextjsServerProvider>
        <html lang="en">
          <body
          >
            <ConvexClientProvider>{children}</ConvexClientProvider>
          </body>
        </html>
      </ConvexAuthNextjsServerProvider>
    </AntdRegistry>
  );
}
