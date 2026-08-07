import Image from "next/image";
import Link from "next/link";
import { CONTACT_EMAIL, PUBLISHER, ROUTES } from "@/lib/site";

// Block 14: footer and legal.
//
// Split into two navs. The doorway page deliberately has no header menu, so the
// footer is the only place a crawler can discover anything beyond "/". Keeping
// the two answer-engine pages in their own group, above the legal set, gives
// them a distinct link context ("Learn") rather than burying them among five
// legal links where both readers and link-graph analysis discount them.
const LEARN = [
  { href: ROUTES.faq.path, label: "FAQ" },
  { href: ROUTES.glossary.path, label: "Glossary" },
];

const LEGAL = [
  { href: ROUTES.privacy.path, label: "Privacy Policy" },
  { href: ROUTES.terms.path, label: "Terms of Use" },
  { href: ROUTES.aiDataDisclosure.path, label: "AI and Data Disclosure" },
  {
    href: ROUTES.professionalDisclaimer.path,
    label: "Professional Services Disclaimer",
  },
  { href: ROUTES.accessibility.path, label: "Accessibility" },
];

// min-h-11 (44px) + centred text: these are standalone navigation targets, so
// WCAG 2.5.8 applies and py-1 left them at 28px. Inline links inside a sentence
// are exempt from that rule and stay as they are; these are not inline.
const linkClass =
  "inline-flex min-h-11 items-center py-1 text-muted transition-colors hover:text-fg";

export function SiteFooter() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-6 px-5 py-14 text-center sm:px-8">
        <Image
          src="/icon/logo.png"
          alt="AI Merge"
          width={1274}
          height={179}
          // Renders h-4 (16px) tall at a 1274/179 ratio, so ~114px wide. Same
          // reasoning as the header logo: without `sizes` the browser can pick
          // a 1920w candidate for a 114px slot.
          sizes="114px"
          className="brand-logo h-4 w-auto"
        />
        <p className="text-title">
          AI Merge — helping people make repeated patterns visible{" "}
          <span className="text-emphasis">
            so they can respond with greater clarity and choice.
          </span>
        </p>

        <nav
          aria-label="Learn more"
          className="flex flex-wrap items-center justify-center gap-x-6 text-sm"
        >
          {LEARN.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`${linkClass} font-medium`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <nav
          aria-label="Legal"
          className="flex flex-wrap items-center justify-center gap-x-6 text-sm"
        >
          {LEGAL.map((item) => (
            <Link key={item.href} href={item.href} className={linkClass}>
              {item.label}
            </Link>
          ))}
          <a href={`mailto:${CONTACT_EMAIL}`} className={linkClass}>
            Contact
          </a>
        </nav>
      </div>

      <div className="border-t border-line">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-2 px-5 py-6 text-center sm:px-8">
          <p className="text-sm text-faint">
            © {new Date().getFullYear()} {PUBLISHER}. All rights reserved.
          </p>
          <p className="max-w-3xl text-xs leading-relaxed text-faint">
            The Parenting Belief Score is an educational and reflective tool. It
            is not medical, psychological, legal, financial, or other
            professional advice, diagnosis, or treatment. Where immediate
            safety, severe distress, or a clinical concern is present, seek
            support from an appropriate qualified professional or emergency
            service.
          </p>
          <p className="max-w-2xl text-xs leading-relaxed text-faint">
            AI Merge is proprietary intellectual property created by Manuj
            Aggarwal and published in the <em>Mensa Research Journal</em>.
          </p>
        </div>
      </div>
    </footer>
  );
}
