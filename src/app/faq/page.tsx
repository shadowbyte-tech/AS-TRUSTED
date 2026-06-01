import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Metadata } from 'next';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HelpCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Frequently Asked Questions | AS Trusted',
  description: 'Find answers to common questions about buying plots, DTCP approvals, land registration, and real estate investment in Telangana.',
};

export default function FAQPage() {
  const faqs = [
    {
      question: "What is the difference between DTCP and HMDA approved plots?",
      answer: "HMDA (Hyderabad Metropolitan Development Authority) governs urban planning for Hyderabad and its immediate surroundings, requiring wide roads and infrastructure. DTCP (Directorate of Town and Country Planning) governs the rest of Telangana. Both are legally secure government approvals, but DTCP plots are typically more affordable and offer higher ROI for long-term investors due to their location in upcoming growth corridors."
    },
    {
      question: "Is it safe to buy open plots in Telangana?",
      answer: "Yes, buying open plots in Telangana is highly safe provided you purchase DTCP or HMDA approved layouts. You must verify the Encumbrance Certificate (EC) for the last 30 years and ensure clear title deeds. At AS Trusted, we conduct a rigorous 50-point legal verification before listing any property."
    },
    {
      question: "What is an Encumbrance Certificate (EC)?",
      answer: "An Encumbrance Certificate (EC) is an official document that records all registered transactions (sales, mortgages, gifts) on a property over a specific period. It proves whether the property is free from legal disputes or financial dues."
    },
    {
      question: "Can NRIs buy agricultural land or plots in Telangana?",
      answer: "Under FEMA regulations, NRIs cannot buy agricultural land, plantation property, or farmhouses in India without special permission from the RBI. However, NRIs can freely purchase residential or commercial open plots within approved layouts."
    },
    {
      question: "What are the registration charges for plots in Telangana?",
      answer: "In Telangana, property registration generally incurs a 7.5% total charge, which is broken down into: 5.5% Stamp Duty, 0.5% Registration Fee, and 1.5% Transfer Duty. These are calculated on the higher of either the market value or the actual sale consideration."
    },
    {
      question: "Does AS Trusted help with bank loans for plot purchases?",
      answer: "Yes, we partner with major financial institutions including SBI, HDFC, and ICICI to facilitate plot loans for our clients. Plot loans typically offer up to 70-75% of the property value, and our team assists with the entire documentation process."
    },
    {
      question: "What is RERA and do open plots need RERA registration?",
      answer: "RERA (Real Estate Regulatory Authority) ensures transparency in real estate. In Telangana, plotted developments exceeding 500 square meters must be registered with TSRERA. We ensure all our large layout listings are fully RERA compliant."
    },
    {
      question: "Why should I invest in the Regional Ring Road (RRR) corridors?",
      answer: "The 340km Regional Ring Road is a mega-infrastructure project that will connect major districts outside Hyderabad. Just as the Outer Ring Road (ORR) created exponential wealth between 2010-2020, the RRR zones are expected to yield the highest appreciation in the next 5-10 years."
    },
    {
      question: "How does Vastu Shastra impact plot selection?",
      answer: "Vastu Shastra significantly impacts a plot's resale value and the pool of potential buyers in Telangana. Plots facing East or North are highly sought after. We screen all our properties for Vastu compliance to ensure maximum future liquidity for our investors."
    },
    {
      question: "What is Mutation and why is it important?",
      answer: "Mutation is the process of updating the government revenue records with the new owner's name after the property registration is complete. It is crucial for paying property taxes and establishing undisputed ownership in municipal records."
    }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 bg-background pt-24 pb-16">
        <div className="container px-4 md:px-6 max-w-4xl mx-auto">
          <div className="mb-12 text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-gold/20 bg-gold/5 text-xs font-bold uppercase tracking-widest text-gold mx-auto">
              <HelpCircle size={14} /> Knowledge Center
            </div>
            <h1 className="text-4xl md:text-5xl font-bold font-serif text-gold">
              Frequently Asked Questions
            </h1>
            <p className="text-lg text-white/70 max-w-2xl mx-auto">
              Clear, expert answers to your most important questions about investing in Telangana real estate.
            </p>
          </div>

          <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-6 md:p-8">
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`} className="border-white/10">
                  <AccordionTrigger className="text-left text-lg font-semibold text-white hover:text-gold transition-colors py-4">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-white/70 leading-relaxed text-base pb-6">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
