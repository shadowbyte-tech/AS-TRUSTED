import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Cookie } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cookie Policy | AS Trusted Consultancy',
  description: 'Cookie Policy — how AS Trusted Consultancy uses cookies and similar technologies.',
};

export default function CookiesPage() {
  const year = new Date().getFullYear();
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 container max-w-4xl mx-auto px-4 py-16">
        <div className="flex items-center gap-3 mb-8">
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
            <Cookie className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-black font-headline">Cookie Policy</h1>
            <p className="text-sm text-muted-foreground">Last updated: May {year}</p>
          </div>
        </div>

        <div className="space-y-8 text-muted-foreground leading-relaxed">

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">What Are Cookies?</h2>
            <p>
              Cookies are small text files stored on your device when you visit a website. They help websites
              remember your preferences, keep you logged in, and understand how you use the site.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">Cookies We Use</h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-border rounded-lg text-sm">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="border border-border px-4 py-3 text-left text-foreground font-semibold">Cookie Name</th>
                    <th className="border border-border px-4 py-3 text-left text-foreground font-semibold">Type</th>
                    <th className="border border-border px-4 py-3 text-left text-foreground font-semibold">Purpose</th>
                    <th className="border border-border px-4 py-3 text-left text-foreground font-semibold">Duration</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-border px-4 py-3 font-mono text-xs">auth-token</td>
                    <td className="border border-border px-4 py-3">Essential</td>
                    <td className="border border-border px-4 py-3">Keeps you logged in to the owner portal</td>
                    <td className="border border-border px-4 py-3">Session</td>
                  </tr>
                  <tr className="bg-muted/20">
                    <td className="border border-border px-4 py-3 font-mono text-xs">user-token</td>
                    <td className="border border-border px-4 py-3">Essential</td>
                    <td className="border border-border px-4 py-3">Keeps you logged in to the investor portal</td>
                    <td className="border border-border px-4 py-3">7 days</td>
                  </tr>
                  <tr>
                    <td className="border border-border px-4 py-3 font-mono text-xs">theme</td>
                    <td className="border border-border px-4 py-3">Preference</td>
                    <td className="border border-border px-4 py-3">Remembers your dark/light mode preference</td>
                    <td className="border border-border px-4 py-3">1 year</td>
                  </tr>
                  <tr className="bg-muted/20">
                    <td className="border border-border px-4 py-3 font-mono text-xs">_ga, _gid</td>
                    <td className="border border-border px-4 py-3">Analytics</td>
                    <td className="border border-border px-4 py-3">Google Analytics — tracks website usage statistics</td>
                    <td className="border border-border px-4 py-3">2 years / 24 hours</td>
                  </tr>
                  <tr>
                    <td className="border border-border px-4 py-3 font-mono text-xs">__gads</td>
                    <td className="border border-border px-4 py-3">Advertising</td>
                    <td className="border border-border px-4 py-3">Google AdSense — used to serve relevant advertisements</td>
                    <td className="border border-border px-4 py-3">13 months</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">Google AdSense Cookies</h2>
            <p>
              We use Google AdSense to display advertisements on our website. Google uses cookies to serve
              ads based on your interests and prior visits to our site and other sites on the internet.
              These cookies do not contain any personally identifiable information.
            </p>
            <p className="mt-3">
              You can opt out of personalized advertising at{' '}
              <a href="https://www.google.com/settings/ads" target="_blank" rel="noreferrer" className="text-primary hover:underline">
                Google Ad Settings
              </a>{' '}
              or by visiting{' '}
              <a href="https://www.aboutads.info" target="_blank" rel="noreferrer" className="text-primary hover:underline">
                aboutads.info
              </a>.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">Managing Cookies</h2>
            <p>
              You can control and manage cookies through your browser settings. Most browsers allow you to:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-3">
              <li>View what cookies are stored on your device</li>
              <li>Delete individual cookies or all cookies</li>
              <li>Block cookies from specific or all websites</li>
              <li>Set preferences for certain types of cookies</li>
            </ul>
            <p className="mt-3">
              Please note that disabling essential cookies may affect the functionality of our investor portal
              and login features.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">Contact Us</h2>
            <p>
              If you have questions about our cookie practices, contact us at{' '}
              <a href="mailto:swamygoud2775@gmail.com" className="text-primary hover:underline">swamygoud2775@gmail.com</a>{' '}
              or call <a href="tel:+919866404090" className="text-primary hover:underline">+91 98664 04090</a>.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
