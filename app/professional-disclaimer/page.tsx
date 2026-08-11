import type { Metadata } from "next";
import { ContentPage } from "@/components/content-page";
import { pageMetadata, relatedLinks } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Professional Services Disclaimer",
  description:
    "The Parenting Belief Score is an educational, reflective tool. It is not medical, psychological, legal, or family-therapy services, it does not assess or diagnose your child, and it promises no change in a child.",
  route: "professionalDisclaimer",
});

export default function ProfessionalDisclaimerPage() {
  return (
    <ContentPage
      route="professionalDisclaimer"
      title="Professional Services Disclaimer"
      description="The Parenting Belief Score is an educational, reflective tool. It is not medical, psychological, legal, or family-therapy services, it does not assess or diagnose your child, and it promises no change in a child."
      related={relatedLinks("faq", "terms", "aiDataDisclosure", "accessibility")}
    >
      <section>
        <h2 className="text-title">Educational and reflective use only</h2>
        <p className="mt-3">
          The Parenting Belief Score, AI Merge, and all content on this website
          are provided for educational and reflective purposes only. The result
          is a hypothesis offered for your consideration, not a finding, an
          evaluation, or a professional opinion. You remain the authority on
          your own parenting.
        </p>
      </section>

      <section>
        <h2 className="text-title">It examines your pattern, not your child</h2>
        <p className="mt-3">
          The Parenting Belief Score examines your own interpretation, meaning,
          response, and recurring loop in one parenting moment you choose to
          describe. It does not assess, score, evaluate, or diagnose your child.
          It does not report what your child thinks, feels, intends, or is
          capable of, and it makes no claim about your child&rsquo;s
          development, health, behaviour, or future.
        </p>
        <p className="mt-3">
          A result that appeared to describe or rate a child would be outside
          the scope of this tool.
        </p>
      </section>

      <section>
        <h2 className="text-title">What this is not</h2>
        <p className="mt-3">The Parenting Belief Score is not:</p>
        <ul className="mt-3 list-disc space-y-2 pl-5">
          <li>medical advice;</li>
          <li>psychological or mental-health treatment;</li>
          <li>diagnosis of any person, including a child;</li>
          <li>psychotherapy or counselling;</li>
          <li>family therapy;</li>
          <li>child development assessment;</li>
          <li>educational assessment or placement advice;</li>
          <li>legal advice, including custody or family-law advice;</li>
          <li>financial advice;</li>
          <li>professional supervision;</li>
          <li>crisis support.</li>
        </ul>
        <p className="mt-3">
          Using this website or completing the reflection does not create a
          therapeutic, clinical, counselling, medical, legal, or any other
          professional relationship.
        </p>
      </section>

      <section>
        <h2 className="text-title">No promised outcome</h2>
        <p className="mt-3">
          Nothing on this site promises more contact, improved performance,
          greater independence, better behaviour, different decisions, or any
          other change in a child or in a relationship. Parenting is shaped by
          many real factors, including a child&rsquo;s development,
          circumstances, personality, health, temperament, peers, school,
          family finances, history, and culture. The Parenting Belief Score
          examines one possible layer - what may be shaping your own response.
          It does not claim belief is the sole cause of anything that happens in
          your family.
        </p>
      </section>

      <section>
        <h2 className="text-title">Individual experiences vary</h2>
        <p className="mt-3">
          Any participant experiences shared on this site are individual
          accounts. They are not promises or guarantees, and they do not
          indicate that another parent will receive the same result or the same
          experience.
        </p>
      </section>

      <section>
        <h2 className="text-title">Seek qualified support</h2>
        <p className="mt-3">
          Use your own judgment and seek qualified professional support when you
          need it. Consult an appropriately licensed or accredited professional
          for medical, mental-health, developmental, educational, legal, or
          financial matters affecting you or your child.
        </p>
        <p className="mt-3">
          Where immediate safety, severe distress, or a clinical concern is
          present, seek support from an appropriate qualified professional or
          emergency service. If you or your child are in immediate danger or
          experiencing a mental-health emergency, contact local emergency
          services. In the United States and Canada, call or text 988 (Suicide
          and Crisis Lifeline) or dial 911. Outside North America, contact your
          local emergency number or a crisis-support service in your country.
        </p>
      </section>
    </ContentPage>
  );
}
