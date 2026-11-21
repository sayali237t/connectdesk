import "./globals.css";
import Sidebar from "@/components/layout/Sidebar";

export const metadata = { title: "ConnectDesk", description: "Lightweight contact & relationship management" };

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen md:flex">
          <Sidebar />
          <main className="min-w-0 flex-1 p-4 md:p-8">{children}</main>
        </div>
      </body>
    </html>
  );
}
