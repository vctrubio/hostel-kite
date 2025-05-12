import type { Metadata } from "next";
import "./globals.css";
import { ConvexAuthNextjsServerProvider } from "@convex-dev/auth/nextjs/server";
import ConvexClientProvider from "@/components/ConvexClientProvider";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { ConfigProvider } from "antd";

// Import Ant Design compatibility patch for React 19
import '@ant-design/v5-patch-for-react-19';

export const metadata: Metadata = {
  title: "Kite Management",
  description: "The Kite Hostel Management App",
  icons: {
    icon: "/convex.svg",
  },
};

const AntTokenTheme = {
  token: {
    colorPrimary: "#01196b",
    colorPrimaryHover: "#2642a6",
    borderRadius: 8,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AntdRegistry>
      <ConfigProvider theme={AntTokenTheme}>
        <ConvexAuthNextjsServerProvider>
          <html lang="en">
            <body
            >
              <ConvexClientProvider>{children}</ConvexClientProvider>
            </body>
          </html>
        </ConvexAuthNextjsServerProvider>
      </ConfigProvider>
    </AntdRegistry>
  );
}
