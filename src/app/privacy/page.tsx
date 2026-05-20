import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Shield } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | AS Trusted Consultancy',
  description: 'Privacy Policy for AS Trusted Consultancy — how we collect, use, and protect your personal data.',
};

export default function PrivacyPage() {
  const year = new Date().getFullYear();
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 container max-w-4xl mx-auto px-4 py-16">
        <div className="flex items-center gap-3 mb-8">
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
            <Shield className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-black font-headline">Privacy Policy</h1>
            <p className="text-sm text-muted-foreground">Last updated: May {year}</p>
          </div>
        </div>

        <div className="prose prose-slate dark:prose-invert max-w-none space-y-8 text-muted-foreground leading-relaxed">

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">1. Who We Are</h2>
            <p>
              AS Trusted Consultancy (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;) is a licensed real estate advisory firm registered under
              RERA No. REG-004129. Our registered office is located at Nizamsagar Rd, Vidhya Nagar Colony,
              Kamareddy, Telangana 503111. We specialize in strategic land acquisition and property investments
              in Telangana, India.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">2. Information We Collect</h2>
            <p>We collect the following types of personal information when you use our website:</p>
            <ul className="list-disc pl-6 space-y-2 mt-3">
              <li><strong>Contact information:</strong> Name, phone number, email address provided via registration or inquiry forms.</li>
              <li><strong>Site visit data:</strong> Preferred dates, times, and locations submitted through our booking form.</li>
              <li><strong>Account data:</strong> Username and encrypted password for investor portal accounts.</li>
              <li><strong>Usage data:</strong> Pages visited, time spent, device type, and browser information collected automatically.</li>
              <li><strong>Cookies:</strong> Session tokens and preference cookies for login and user experience.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">3. How We Use Your Information</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>To respond to your property inquiries and contact requests.</li>
              <li>To schedule and confirm site visits.</li>
              <li>To provide access to premium property listings through your investor portal.</li>
              <li>To send WhatsApp notifications about property updates and visit confirmations.</li>
              <li>To improve our website and services based on usage analytics.</li>
              <li>To comply with our legal obligations under Indian law.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">4. Google AdSense &amp; Third-Party Advertising</h2>
            <p>
              Our website uses Google AdSense to display advertisements. Google, as a third-party vendor,
              uses cookies (including the DoubleClick cookie) to serve ads based on your prior visits to our
              website or other websites. You may opt out of personalized advertising by visiting{' '}
              <a href="https://www.google.com/settings/ads" target="_blank" rel="noreferrer" className="text-primary hover:underline">
                Google Ad Settings
              </a>. For more information about how Google uses your data, please visit{' '}
              <a href="https://policies.google.com/privacy" target="_blank" rel="noreferrer" className="text-primary hover:underline">
                Google&apos;s Privacy Policy
              </a>.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">5. Data Storage &amp; Security</h2>
            <p>
              Your personal data is stored securely on MongoDB Atlas cloud servers hosted in a region compliant
              with applicable data protection laws. We use industry-standard encryption (bcrypt for passwords,
              JWT for sessions) and HTTPS for all data in transit. We do not sell or share your personal
              information with third parties except as required by law.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">6. Your Rights</h2>
            <p>You have the right to:</p>
            <ul className="list-disc pl-6 space-y-2 mt-3">
              <li>Request access to the personal data we hold about you.</li>
              <li>Request correction of inaccurate personal data.</li>
              <li>Request deletion of your personal data (subject to legal obligations).</li>
              <li>Withdraw consent for marketing communications at any time.</li>
            </ul>
            <p className="mt-3">
              To exercise these rights, contact us at{' '}
              <a href="mailto:swamygoud2775@gmail.com" className="text-primary hover:underline">swamygoud2775@gmail.com</a> or
              call <a href="tel:+919866404090" className="text-primary hover:underline">+91 98664 04090</a>.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">7. Cookies</h2>
            <p>
              We use essential cookies for authentication and session management. We also use third-party cookies
              from Google AdSense for advertising. By continuing to use our site, you consent to our use of
              cookies as described in our <a href="/cookies" className="text-primary hover:underline">Cookie Policy</a>.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">8. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. Any changes will be posted on this page
              with an updated revision date. We encourage you to review this page periodically.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">9. Contact Us</h2>
            <div className="bg-muted/30 rounded-xl p-6 border border-border">
              <p className="font-semibold text-foreground">AS Trusted Consultancy</p>
              <p>Nizamsagar Rd, Vidhya Nagar Colony, Kamareddy, Telangana 503111</p>
              <p>Phone: <a href="tel:+919866404090" className="text-primary hover:underline">+91 98664 04090</a></p>
              <p>Email: <a href="mailto:swamygoud2775@gmail.com" className="text-primary hover:underline">swamygoud2775@gmail.com</a></p>
              <p>RERA Registration: REG-004129</p>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
