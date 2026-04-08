import { FooterBrand } from "./FooterBrand";
import { FooterCopyright } from "./FooterCopyright";
import { FooterLinks } from "./FooterLinks";
import { FooterSocials } from "./FooterSocials";

export default function Footer() {
  return (
    <footer className="mt-10 border-t border-white/10 bg-transparent py-10 text-white">
      <div className="container mx-auto flex flex-col items-center justify-between gap-6 px-6 md:flex-row">
        <FooterBrand />
        <FooterLinks />
        <FooterSocials />
      </div>

      <FooterCopyright />
    </footer>
  );
}
