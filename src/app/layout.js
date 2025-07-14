import "./globals.css";
import AuthProvider from "@/components/AuthProvider";

export const metadata = {
  title: "Virtual Credit Card Generator",
  description:
    "Generate secure virtual credit cards for safer online transactions",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
