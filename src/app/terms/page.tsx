import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { FileText } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service | AS Trusted Consultancy',
  description: 'Terms and conditions for using the AS Trusted Consultancy website and services.',
};

export default function TermsPage() {
  const year = new Date().getFullYear();
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 container max-w-4xl mx-auto px-4 py-16">
        <div className="flex items-center gap-3 mb-8">
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
            <FileText className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-black font-headline">Terms of Service</h1>
            <p className="text-sm text-muted-foreground">Last updated: May {year}</p>
          </div>
        </div>

        <div className="prose prose-slate dark:prose-invert max-w-none space-y-8 text-muted-foreground leading-relaxed">

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">1. Acceptance of Terms</h2>
            <p>
              By accessing or using the AS Trusted Consultancy website (&quot;Site&quot;) and services, you agree to be
              bound by these Terms of Service. If you do not agree to these terms, please do not use our Site.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">2. Services Description</h2>
            <p>
              AS Trusted Consultancy provides real estate advisory services including property listings, site
              visit bookings, investment analysis, and related consultancy services in Telangana, India.
              We are registered under RERA No. REG-004129.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">3. User Accounts &amp; Eligibility</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>You must be at least 18 years of age to use our services.</li>
              <li>You are responsible for maintaining the confidentiality of your account credentials.</li>
              <li>You agree to provide accurate, current, and complete information during registration.</li>
              <li>Sharing your premium account access with others is strictly prohibited.</li>
              <li>We reserve the right to suspend or terminate accounts for violations of these terms.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">4. Property Information Disclaimer</h2>
            <p>
              All property listings, investment projections, ROI estimates, and market analyses on this Site
              are provided for informational purposes only. They do not constitute financial or investment
              advice. Past performance of any property or market does not guarantee future results.
              We strongly recommend consulting a qualified financial advisor before making any investment decision.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">5. Premium Services</h2>
            <p>
              Access to premium property listings and advanced features requires payment as communicated
              during the registration process. Premium access is non-transferable and non-refundable once
              credentials have been issued and the account activated.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">6. Intellectual Property</h2>
            <p>
              All content on this Site, including property images, descriptions, logos, and design elements,
              are the property of AS Trusted Consultancy and are protected by applicable intellectual property
              laws. You may not reproduce, distribute, or use any content without our prior written consent.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">7. Limitation of Liability</h2>
            <p>
              AS Trusted Consultancy shall not be liable for any direct, indirect, incidental, or consequential
              damages arising from your use of this Site or reliance on any property information provided.
              Our total liability shall not exceed the amount paid by you for our services, if any.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">8. Governing Law</h2>
            <p>
              These Terms shall be governed by and construed in accordance with the laws of India. Any
              disputes arising shall be subject to the exclusive jurisdiction of the courts of Kamareddy,
              Telangana, India.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">9. Changes to Terms</h2>
            <p>
              We reserve the right to modify these Terms at any time. Continued use of the Site after
              changes constitutes acceptance of the new Terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">10. Contact</h2>
            <div className="bg-muted/30 rounded-xl p-6 border border-border">
              <p className="font-semibold text-foreground">AS Trusted Consultancy</p>
              <p>Nizamsagar Rd, Vidhya Nagar Colony, Kamareddy, Telangana 503111</p>
              <p>Phone: <a href="tel:+919866404090" className="text-primary hover:underline">+91 98664 04090</a></p>
              <p>Email: <a href="mailto:swamygoud2775@gmail.com" className="text-primary hover:underline">swamygoud2775@gmail.com</a></p>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
