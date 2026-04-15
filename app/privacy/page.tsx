import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy — Shared Leash",
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

function BulletList({ items }: { items: React.ReactNode[] }) {
  return (
    <ul className="list-disc pl-6 space-y-1.5 mb-4">
      {items.map((item, i) => <li key={i}>{item}</li>)}
    </ul>
  );
}

export default function PrivacyPage() {
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
          </div>
          <h1 className="text-4xl font-bold text-amber-950 mb-4 leading-tight">
            Privacy Policy
          </h1>
          <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-amber-700">
            <span>Effective date: <strong className="text-amber-900 font-medium">April 15, 2026</strong></span>
            <span>Website: <strong className="text-amber-900 font-medium">sharedleash.com</strong></span>
          </div>
          <p className="mt-6 text-amber-800">
            We built Shared Leash for one reason: to be a safe, gentle space for people grieving the loss
            of a pet. We are not a data company. We do not sell your information. We do not mine your
            conversations. What you share here stays here.
          </p>
        </header>

        <div className="bg-white/60 border border-amber-100 rounded-2xl px-6 py-5 mb-12">
          <div className="text-xs uppercase tracking-wider text-amber-700 font-medium mb-3">
            Contents
          </div>
          <ol className="list-decimal pl-5 text-sm text-amber-700 sm:columns-2 gap-x-8 space-y-1.5">
            <li><a href="#who-we-are" className="hover:underline">Who we are</a></li>
            <li><a href="#what-we-collect" className="hover:underline">What information we collect</a></li>
            <li><a href="#what-we-dont-collect" className="hover:underline">What we do NOT collect</a></li>
            <li><a href="#how-we-use" className="hover:underline">How we use your information</a></li>
            <li><a href="#conversation-protections" className="hover:underline">Conversation data protections</a></li>
            <li><a href="#retention" className="hover:underline">Data retention</a></li>
            <li><a href="#third-parties" className="hover:underline">Third-party services</a></li>
            <li><a href="#your-rights" className="hover:underline">Your rights</a></li>
            <li><a href="#childrens-privacy" className="hover:underline">Children&apos;s privacy</a></li>
            <li><a href="#changes" className="hover:underline">Changes to this policy</a></li>
            <li><a href="#contact" className="hover:underline">Contact us</a></li>
          </ol>
        </div>

        <div className="space-y-12 [&_p]:mb-4 [&_p:last-child]:mb-0 [&_strong]:font-semibold [&_strong]:text-amber-950 [&_section]:scroll-mt-24">

          <section id="who-we-are">
            <H2>1. Who We Are</H2>
            <p>
              Shared Leash is a pet grief support platform operated as an independent service. We provide
              AI-assisted emotional support for individuals who have experienced the loss of a companion
              animal. References to &ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo; in this Policy refer to Shared Leash and its operators.
            </p>
          </section>

          <section id="what-we-collect">
            <H2>2. What Information We Collect</H2>
            <p className="font-semibold text-amber-950">When You Register</p>
            <p>We collect only what is necessary to create your account:</p>
            <BulletList items={[
              "First and last name",
              "Email address",
              "City, state, and country",
              "Date and time of registration",
            ]} />

            <p className="font-semibold text-amber-950">During Your Sessions</p>
            <p>When you use the grief support chat, we store:</p>
            <BulletList items={[
              "The content of your conversations (your messages and the AI responses)",
              "Session timestamps",
              "Your account identifier to link sessions to your profile",
            ]} />

            <p className="font-semibold text-amber-950">Automatically Collected Data</p>
            <p>Like most websites, we collect basic technical data when you visit:</p>
            <BulletList items={[
              "IP address (used for security and abuse prevention only)",
              "Browser type and device type",
              "Pages visited and time spent",
            ]} />
            <p>
              This data is used solely for security, platform stability, and preventing abuse. It is not
              used for advertising or profiling.
            </p>
          </section>

          <section id="what-we-dont-collect">
            <H2>3. What We Do NOT Collect</H2>
            <p>
              We never ask for and never store: payment information, Social Security numbers, government
              IDs, biometric data, or any information about the pet you lost beyond what you choose to
              share in conversation.
            </p>
          </section>

          <section id="how-we-use">
            <H2>4. How We Use Your Information</H2>
            <p>We use the information we collect for these purposes only:</p>
            <BulletList items={[
              "To provide you access to the grief support chat",
              "To send your login link when you request access",
              "To maintain your conversation history so you can return to previous sessions",
              "To detect and prevent abuse, spam, or harmful use of the platform",
              "To understand general usage patterns and improve the service (in aggregate, never individual-level)",
            ]} />

            <p className="font-semibold text-amber-950">What We Never Do</p>
            <BulletList items={[
              "We never sell your personal information to any third party",
              "We never share your conversation content with advertisers, data brokers, or marketing companies",
              "We never use your conversations to train AI models without your explicit, separate written consent",
              "We never use your information for targeted advertising",
              "We never share your information with employers, insurers, or government agencies except as required by law",
            ]} />
          </section>

          <section id="conversation-protections">
            <H2>5. Your Conversation Data — Special Protections</H2>
            <p>
              We understand that what you share in grief support conversations is deeply personal. Your
              session content receives the following protections:
            </p>

            <p className="font-semibold text-amber-950">Encryption</p>
            <p>
              All conversation data is encrypted at rest in our database. Your messages are not stored
              as plain readable text.
            </p>

            <p className="font-semibold text-amber-950">Access Controls</p>
            <p>
              Your conversation history is only accessible to you when you are logged into your account.
              Our team does not routinely access individual conversation content. In the rare event that
              a safety concern requires review (for example, an imminent risk of harm), access is limited
              to what is necessary and is handled with the highest level of discretion.
            </p>

            <p className="font-semibold text-amber-950">No AI Training</p>
            <p>
              Your conversations are not used to train, fine-tune, or improve any AI model — including
              the one powering Shared Leash — without your explicit consent. We will always ask separately
              and clearly before any such use, and you can decline without affecting your access to the service.
            </p>
          </section>

          <section id="retention">
            <H2>6. Data Retention</H2>
            <p>
              Your account and conversation history are retained for as long as your account is active.
              You may request deletion of your account and all associated data at any time by contacting
              us at the address below. We will process deletion requests within 30 days.
            </p>
            <p>When you delete your account, we permanently delete:</p>
            <BulletList items={[
              "Your registration information (name, email, location)",
              "All conversation history",
              "All session logs linked to your account",
            ]} />
            <p>
              Aggregate, anonymized usage statistics that cannot be linked to you may be retained for
              platform improvement purposes.
            </p>
          </section>

          <section id="third-parties">
            <H2>7. Third-Party Services</H2>
            <p>
              Shared Leash uses a small number of third-party services to operate. These providers are
              bound by their own privacy policies and are not permitted to use your data for their own purposes:
            </p>

            <p className="font-semibold text-amber-950">AI Provider</p>
            <p>
              The conversational AI is powered by Anthropic&apos;s Claude API. Messages you send are processed
              by Anthropic&apos;s systems to generate responses. Anthropic&apos;s API usage policies prohibit the
              use of API data for model training by default. You can review Anthropic&apos;s privacy policy at{" "}
              <a href="https://www.anthropic.com/privacy" target="_blank" rel="noreferrer" className="text-amber-700 hover:underline">
                anthropic.com/privacy
              </a>.
            </p>

            <p className="font-semibold text-amber-950">Email Delivery</p>
            <p>
              We use a transactional email provider to send your login links. Your email address is
              transmitted to this provider solely for the purpose of delivering your login link. It is
              not used for marketing or shared further.
            </p>

            <p className="font-semibold text-amber-950">Hosting Infrastructure</p>
            <p>
              Our platform is hosted on secured server infrastructure. Your data is stored in the
              United States.
            </p>
          </section>

          <section id="your-rights">
            <H2>8. Your Rights</H2>
            <p>You have the following rights regarding your personal information:</p>
            <BulletList items={[
              <><strong>Access:</strong> You may request a copy of the personal data we hold about you</>,
              <><strong>Correction:</strong> You may update your name, email, or location at any time from your account settings</>,
              <><strong>Deletion:</strong> You may request permanent deletion of your account and all associated data</>,
              <><strong>Portability:</strong> You may request an export of your conversation history in a readable format</>,
              <><strong>Objection:</strong> You may object to any processing of your data beyond what is strictly necessary to provide the service</>,
            ]} />
            <p>
              To exercise any of these rights, contact us at the address in Section 11. We will respond
              within 30 days.
            </p>
          </section>

          <section id="childrens-privacy">
            <H2>9. Children&apos;s Privacy</H2>
            <p>
              Shared Leash is not directed at children under the age of 13. We do not knowingly collect
              personal information from children under 13. If we become aware that a child under 13 has
              provided us with personal information, we will delete it promptly. If you believe a child
              under 13 has registered, please contact us immediately.
            </p>
          </section>

          <section id="changes">
            <H2>10. Changes to This Policy</H2>
            <p>
              We may update this Privacy Policy from time to time. When we do, we will notify you by
              email at the address on your account and update the Effective Date at the top of this
              document. Continued use of the platform after notification constitutes acceptance of the
              updated policy. If changes are material, we will provide at least 30 days notice before
              they take effect.
            </p>
          </section>

          <section id="contact">
            <H2>11. Contact Us</H2>
            <p>
              If you have questions about this Privacy Policy, want to exercise your rights, or have
              concerns about how your data is handled, please contact us:
            </p>
            <div className="bg-white border border-amber-100 rounded-2xl px-6 py-5 mt-4 text-sm text-amber-800 leading-loose">
              <strong className="block text-amber-950 text-base mb-1">Shared Leash</strong>
              Email:{" "}
              <a href="mailto:privacy@sharedleash.com" className="text-amber-700 hover:underline">
                privacy@sharedleash.com
              </a><br />
              Website:{" "}
              <a href="https://sharedleash.com" target="_blank" rel="noreferrer" className="text-amber-700 hover:underline">
                sharedleash.com
              </a>
            </div>
            <p className="mt-6">
              We built this platform because pet loss is real grief and deserves real support. Your trust
              is the foundation of everything we do here. We take that seriously.
            </p>
          </section>
        </div>

        <div className="border-t border-amber-100 mt-16 pt-6 text-center text-xs text-amber-700/70 leading-relaxed">
          Effective April 15, 2026 · Shared Leash · All rights reserved
        </div>
      </main>
    </div>
  );
}
