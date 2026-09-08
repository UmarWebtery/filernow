// app/(main)/layout.tsx
import Header from "@/components/common/header/Header";
import Footer from "@/components/common/footer/Footer";
import TaxCalculatorDrawer from "@/components/home/calculator/TaxCalculatorDrawer";
import FilerStatusDrawer from "@/components/home/filerStatus/FilerStatusDrawer";
import ScrollToTopButton from "@/components/ui-custom/ScrollToTopBtn";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      {children}
      <TaxCalculatorDrawer />
      <FilerStatusDrawer />
      <ScrollToTopButton />
      <Footer />
    </>
  );
}