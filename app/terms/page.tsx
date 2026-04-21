import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service — Shared Leash",
};

function PawIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true" className={className} fill="currentColor">
      <ellipse cx="14" cy="10" rx="5.5" ry="7" transform="rotate(-10 14 10)" />
      <ellipse cx="28" cy="8" rx="5" ry="6.5" transform="rotate(8 28 8)" />
      <ellipse cx="8" cy="22" rx="4.5" ry="6" transform="rotate(-20 8 22)" />
      <ellipse cx="38" cy="20" rx="4.5" ry="6" transform="rotate(20 38 20)" />
      <ellipse cx="23" cy="34" rx="13" ry="12" />
    </svg>
  );
}

function H2({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-xl font-semibold text-amber-900 mb-4 pb-2 border-b border-amber-100">
      {children}
    </h2>
  );
}

function Callout({
  tone = "danger",
  children,
}: {
  tone?: "danger" | "info" | "warning";
  children: React.ReactNode;
}) {
  const tones = {
    danger: "border-red-300 bg-red-50 text-red-800",
    info: "border-blue-300 bg-blue-50 text-blue-800",
    warning: "border-amber-300 bg-amber-50 text-amber-900",
  };
  return (
    <div className={`border-l-4 ${tones[tone]} rounded-r-lg px-5 py-4 my-5 text-sm`}>
      {children}
    </div>
  );
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#fdf6ee]">
      <nav className="fixed top-0 inset-x-0 z-50 bg-white/80 backdrop-blur-sm border-b border-amber-100">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <PawIcon className="w-5 h-5 text-amber-600" />
            <span className="font-semibold text-amber-900 text-lg tracking-tight">
              Shared Leash
            </span>
          </Link>
          <Link
            href="/"
            className="text-sm text-amber-700 hover:text-amber-900 transition-colors"
          >
            Back home
          </Link>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-6 pt-32 pb-20 text-amber-900 leading-relaxed">
        <header className="border-b border-amber-100 pb-8 mb-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center">
              <PawIcon className="w-4 h-4 text-amber-600" />
            </div>
            <span className="font-semibold text-amber-900">Shared Leash</span>
            <span className="text-[10px] uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
              Beta
            </span>
          </div>
          <h1 className="text-4xl font-bold text-amber-950 mb-4 leading-tight">
            Terms of Service
          </h1>
          <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-amber-700">
            <span>Effective date: <strong className="text-amber-900 font-medium">July 1, 2025</strong></span>
            <span>Last updated: <strong className="text-amber-900 font-medium">July 1, 2025</strong></span>
            <span>Version: <strong className="text-amber-900 font-medium">1.0 (Beta)</strong></span>
          </div>
        </header>

        <div className="bg-white/60 border border-amber-100 rounded-2xl px-6 py-5 mb-12">
          <div className="text-xs uppercase tracking-wider text-amber-700 font-medium mb-3">
            Contents
          </div>
          <ol className="list-decimal pl-5 text-sm text-amber-700 sm:columns-2 gap-x-8 space-y-1.5">
            <li><a href="#acceptance" className="hover:underline">Acceptance of terms</a></li>
            <li><a href="#beta" className="hover:underline">Beta program &amp; service changes</a></li>
            <li><a href="#eligibility" className="hover:underline">Eligibility</a></li>
            <li><a href="#ai-disclaimer" className="hover:underline">AI &amp; mental health disclaimer</a></li>
            <li><a href="#subscriptions" className="hover:underline">Subscriptions &amp; payments</a></li>
            <li><a href="#content" className="hover:underline">User content &amp; data</a></li>
            <li><a href="#privacy" className="hover:underline">Privacy</a></li>
            <li><a href="#liability" className="hover:underline">Disclaimer &amp; limitation of liability</a></li>
            <li><a href="#indemnification" className="hover:underline">Indemnification</a></li>
            <li><a href="#disputes" className="hover:underline">Dispute resolution &amp; arbitration</a></li>
            <li><a href="#termination" className="hover:underline">Termination</a></li>
            <li><a href="#governing" className="hover:underline">Governing law</a></li>
            <li><a href="#contact" className="hover:underline">Contact</a></li>
          </ol>
        </div>

        <div className="space-y-12 [&_p]:mb-4 [&_p:last-child]:mb-0 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-1.5 [&_ul]:mb-4 [&_strong]:font-semibold [&_strong]:text-amber-950 [&_section]:scroll-mt-24">
          <section id="acceptance">
            <H2>1. Acceptance of terms</H2>
            <p>These Terms of Service (&quot;Terms&quot;) constitute a legally binding agreement between you (&quot;User,&quot; &quot;you,&quot; or &quot;your&quot;) and DIGITAL PIER LLC, an Ohio limited liability company (&quot;Company,&quot; &quot;we,&quot; &quot;us,&quot; or &quot;our&quot;), governing your access to and use of the Shared Leash platform, website, mobile application, and all related services (collectively, the &quot;Service&quot;).</p>
            <p>By creating an account, accessing the Service, or clicking &quot;I agree,&quot; you acknowledge that you have read, understood, and agree to be bound by these Terms and our Privacy Policy. <strong>If you do not agree, do not use the Service.</strong></p>
          </section>

          <section id="beta">
            <H2>2. Beta program &amp; service changes</H2>
            <Callout tone="warning">
              <strong>You are using a beta version of Shared Leash.</strong> The Service is provided in its current form for evaluation and early access. Features, pricing, data structures, and availability may change at any time without notice.
            </Callout>
            <p>We reserve the right to modify, suspend, or discontinue any part of the Service at any time, temporarily or permanently, with or without notice. We shall not be liable to you or any third party for any modification, suspension, or discontinuation of the Service. Data created during beta testing may not be migrated or preserved upon launch of a production version.</p>
          </section>

          <section id="eligibility">
            <H2>3. Eligibility</H2>
            <p>You must be at least 18 years of age to create an account and use the Service. By agreeing to these Terms, you represent and warrant that you are at least 18 years old, have the legal capacity to enter into a binding contract, and are not barred from using the Service under any applicable law. If you are accessing the Service on behalf of an organization, you further represent that you have authority to bind that organization to these Terms.</p>
          </section>

          <section id="ai-disclaimer">
            <H2>4. AI &amp; mental health disclaimer</H2>
            <Callout tone="danger">
              <strong>Critical notice.</strong> Shared Leash uses artificial intelligence to provide pet grief support and emotional companionship resources. The Service is NOT a licensed mental health service, therapy, counseling, crisis intervention, or medical service of any kind.
            </Callout>
            <p>The AI-generated responses and content provided through the Service:</p>
            <ul>
              <li>Are not a substitute for professional mental health care, grief counseling, or medical advice</li>
              <li>May be inaccurate, incomplete, or inappropriate for your specific situation</li>
              <li>Are generated by automated systems and do not reflect the advice of a licensed professional</li>
              <li>Should not be relied upon in crisis situations or emergencies</li>
            </ul>
            <Callout tone="info">
              <strong>If you are experiencing a mental health crisis or thoughts of self-harm, please contact the 988 Suicide &amp; Crisis Lifeline by calling or texting 988, or contact emergency services at 911.</strong>
            </Callout>
            <p>The Company expressly disclaims all liability arising from your reliance on any AI-generated content within the Service. You acknowledge that you use all AI-generated content at your sole risk.</p>
          </section>

          <section id="subscriptions">
            <H2>5. Subscriptions &amp; payments</H2>
            <p>Shared Leash offers both free and paid subscription tiers. By enrolling in a paid plan, you authorize us (through our payment processor, Stripe, Inc.) to charge the applicable fees to your payment method on a recurring basis.</p>
            <ul>
              <li><strong>Billing:</strong> Subscriptions are billed monthly or annually in advance on the subscription anniversary date.</li>
              <li><strong>Cancellation:</strong> You may cancel your subscription at any time through your account settings. Access continues through the end of the current billing period.</li>
              <li><strong>Refunds:</strong> All subscription fees are non-refundable except where required by applicable law. We do not provide prorated refunds for partial billing periods.</li>
              <li><strong>Price changes:</strong> We reserve the right to change subscription pricing with 30 days&apos; notice to your registered email address. Continued use after the notice period constitutes acceptance of the new pricing.</li>
              <li><strong>Taxes:</strong> You are responsible for all applicable taxes, duties, and fees in your jurisdiction.</li>
            </ul>
          </section>

          <section id="content">
            <H2>6. User content &amp; data</H2>
            <p>You retain ownership of any content you submit to the Service (&quot;User Content&quot;), including messages, photos, pet memorials, and profile information. By submitting User Content, you grant the Company a worldwide, non-exclusive, royalty-free license to use, store, reproduce, and display your User Content solely to the extent necessary to operate and improve the Service.</p>
            <p>You represent that you own or have sufficient rights to all User Content you submit, and that your User Content does not violate any third-party rights or applicable law. You agree not to submit content that is unlawful, harassing, defamatory, obscene, or that constitutes spam or unauthorized advertising.</p>
            <p>We reserve the right to remove any User Content at our sole discretion without notice or liability.</p>
          </section>

          <section id="privacy">
            <H2>7. Privacy</H2>
            <p>Your use of the Service is subject to our <Link href="/privacy" className="text-amber-700 hover:underline">Privacy Policy</Link>, which is incorporated into these Terms by reference. By using the Service, you consent to the collection and use of your information as described in our Privacy Policy. The Company processes emotional and grief-related data you share; please review the <Link href="/privacy" className="text-amber-700 hover:underline">Privacy Policy</Link> to understand how this sensitive data is handled, stored, and protected.</p>
          </section>

          <section id="liability">
            <H2>8. Disclaimer of warranties &amp; limitation of liability</H2>
            <p><strong>THE SERVICE IS PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; WITHOUT WARRANTIES OF ANY KIND, WHETHER EXPRESS, IMPLIED, STATUTORY, OR OTHERWISE. TO THE FULLEST EXTENT PERMITTED BY LAW, THE COMPANY EXPRESSLY DISCLAIMS ALL WARRANTIES, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE, AND NON-INFRINGEMENT.</strong></p>
            <p>We do not warrant that: (a) the Service will be uninterrupted, error-free, or secure; (b) any content or information obtained through the Service will be accurate, complete, or reliable; (c) the Service will meet your requirements; or (d) any defects will be corrected.</p>
            <p><strong>TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT SHALL THE COMPANY, ITS OFFICERS, DIRECTORS, EMPLOYEES, MEMBERS, AGENTS, LICENSORS, OR SERVICE PROVIDERS BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, PUNITIVE, OR EXEMPLARY DAMAGES, INCLUDING BUT NOT LIMITED TO LOSS OF PROFITS, GOODWILL, DATA, OR OTHER INTANGIBLE LOSSES, ARISING OUT OF OR RELATED TO YOUR USE OF OR INABILITY TO USE THE SERVICE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.</strong></p>
            <p>In jurisdictions that do not allow the exclusion or limitation of certain damages, our liability is limited to the greatest extent permitted by law. In all cases, the Company&apos;s total aggregate liability to you for any claims arising out of or related to these Terms or the Service shall not exceed the greater of (a) the total fees you paid to us in the twelve (12) months preceding the claim or (b) one hundred U.S. dollars ($100.00).</p>
          </section>

          <section id="indemnification">
            <H2>9. Indemnification</H2>
            <p>You agree to defend, indemnify, and hold harmless the Company and its officers, directors, members, employees, agents, licensors, and service providers from and against any and all claims, liabilities, damages, judgments, awards, losses, costs, expenses, or fees (including reasonable attorneys&apos; fees) arising out of or relating to: (a) your violation of these Terms; (b) your User Content; (c) your use of the Service; (d) your violation of any third-party right; or (e) your violation of any applicable law or regulation.</p>
          </section>

          <section id="disputes">
            <H2>10. Dispute resolution &amp; arbitration</H2>
            <p><strong>Binding arbitration.</strong> Except for claims that qualify for small claims court, any dispute, controversy, or claim arising out of or relating to these Terms or the Service shall be resolved exclusively by binding individual arbitration administered by the American Arbitration Association (&quot;AAA&quot;) under its Consumer Arbitration Rules, which are available at www.adr.org.</p>
            <p><strong>Class action waiver.</strong> YOU AND THE COMPANY AGREE THAT EACH MAY BRING CLAIMS AGAINST THE OTHER ONLY IN YOUR OR ITS INDIVIDUAL CAPACITY, AND NOT AS A PLAINTIFF OR CLASS MEMBER IN ANY PURPORTED CLASS OR REPRESENTATIVE PROCEEDING. The arbitrator may not consolidate more than one person&apos;s claims.</p>
            <p>Notwithstanding the foregoing, either party may seek injunctive or other equitable relief in a court of competent jurisdiction to prevent the actual or threatened infringement of intellectual property rights.</p>
          </section>

          <section id="termination">
            <H2>11. Termination</H2>
            <p>We reserve the right to suspend or terminate your account and access to the Service, with or without cause and with or without notice, at our sole discretion. Grounds for termination include but are not limited to violation of these Terms, conduct harmful to other users, or fraudulent activity.</p>
            <p>Upon termination, your right to use the Service immediately ceases. Sections 4, 8, 9, 10, 11, and 12 of these Terms shall survive termination. You may request deletion of your data in accordance with our Privacy Policy.</p>
          </section>

          <section id="governing">
            <H2>12. Governing law</H2>
            <p>These Terms and any disputes arising hereunder shall be governed by and construed in accordance with the laws of the State of Ohio, without regard to its conflict of laws provisions. To the extent any dispute is not subject to arbitration, you consent to exclusive jurisdiction and venue in the state and federal courts located in Summit County, Ohio.</p>
            <p>If any provision of these Terms is held to be invalid, illegal, or unenforceable, the remaining provisions shall continue in full force and effect. Our failure to enforce any right or provision of these Terms shall not constitute a waiver of that right or provision. These Terms constitute the entire agreement between you and the Company regarding the Service and supersede all prior agreements.</p>
          </section>

          <section id="contact">
            <H2>13. Contact</H2>
            <p>Questions about these Terms may be directed to:</p>
            <div className="bg-white border border-amber-100 rounded-2xl px-6 py-5 mt-4 text-sm text-amber-800 leading-loose">
              <strong className="block text-amber-950 text-base mb-1">DIGITAL PIER LLC</strong>
              Cleveland, OH<br />
              Email: <a href="mailto:contact@sharedleash.com" className="text-amber-700 hover:underline">contact@sharedleash.com</a>
            </div>
          </section>
        </div>

        <div className="border-t border-amber-100 mt-16 pt-6 text-center text-xs text-amber-700/70 leading-relaxed">
          These terms were last reviewed April 12, 2026 · Shared Leash  · All rights reserved<br />
          This document does not constitute legal advice. Consult a licensed attorney before relying on these terms in any legal matter.
        </div>
      </main>
    </div>
  );
}
