import Link from 'next/link';
import { ASLogo } from './as-logo';
import { Mail, Phone, MapPin, Facebook, Instagram, ArrowUpRight, ArrowRight, ShieldCheck } from 'lucide-react';

export function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="relative bg-navy text-white overflow-hidden">
            {/* Decorative gradient */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 left-1/4 w-1/2 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />
            </div>

            <div className="container px-4 py-16 md:py-24 relative z-10">
                {/* Main Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">
                    {/* Brand Column - 4 cols */}
                    <div className="lg:col-span-4 space-y-6">
                        <div className="flex items-center space-x-3">
                            <ASLogo className="h-10 w-10" />
                            <div>
                                <span className="text-xl font-bold font-serif tracking-wide text-gold">
                                    AS TRUSTED
                                </span>
                                <span className="block text-xs text-white/40 uppercase tracking-[0.2em] font-medium">Premium Real Estate</span>
                            </div>
                        </div>
                        <p className="text-white/50 text-sm max-w-xs leading-relaxed">
                            Institutional-grade land investment advisory specializing in Telangana&apos;s highest-growth corridors. Every property is legally verified for uncompromising trust.
                        </p>
                        <div className="flex items-center gap-3">
                            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-gold/20 bg-gold/5 text-[10px] font-bold uppercase tracking-widest text-gold">
                                <ShieldCheck className="h-3 w-3" />
                                RERA: REG-004129
                            </div>
                        </div>
                        <div className="flex space-x-3">
                            <Link href="https://wa.me/919866404090" target="_blank" className="h-9 w-9 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 hover:bg-emerald-500 hover:text-white hover:scale-110 transition-all duration-300">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-message-circle"><path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z"/></svg>
                            </Link>
                            <Link href="https://www.facebook.com/as.trusted.customers?sfnsn=wa" target="_blank" className="h-9 w-9 rounded-full bg-white/5 flex items-center justify-center text-white/40 hover:bg-gold/20 hover:text-gold hover:scale-110 transition-all duration-300">
                                <Facebook className="h-4 w-4" />
                            </Link>
                            <Link href="https://www.instagram.com/swamy.goud.37201901?igsh=b2VmZG9zNTZ2YXRt" target="_blank" className="h-9 w-9 rounded-full bg-white/5 flex items-center justify-center text-white/40 hover:bg-gold/20 hover:text-gold hover:scale-110 transition-all duration-300">
                                <Instagram className="h-4 w-4" />
                            </Link>
                        </div>
                    </div>

                    {/* Quick Links - 2 cols */}
                    <div className="lg:col-span-2">
                        <h4 className="font-bold text-sm uppercase tracking-widest text-gold mb-6">Quick Links</h4>
                        <ul className="space-y-3.5">
                            {[
                                { href: '/', label: 'Home' },
                                { href: '/properties', label: 'Properties' },
                                { href: '/about', label: 'About Us' },
                                { href: '/services', label: 'Services' },
                                { href: '/trust-center', label: 'Trust Center' },
                                { href: '/faq', label: 'FAQ' },
                                { href: '/book-site-visit', label: 'Site Visit' },
                            ].map((link) => (
                                <li key={link.href}>
                                    <Link href={link.href} className="group inline-flex items-center gap-1.5 text-sm text-white/50 hover:text-gold transition-colors">
                                        <span>{link.label}</span>
                                        <ArrowUpRight className="h-3 w-3 opacity-0 -translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all" />
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Premium Services - 3 cols */}
                    <div className="lg:col-span-3">
                        <h4 className="font-bold text-sm uppercase tracking-widest text-gold mb-6">Premium Services</h4>
                        <ul className="space-y-3.5">
                            {[
                                { icon: '✦', label: 'Vastu-Compliant Properties' },
                                { icon: '✦', label: 'AI Market Intelligence' },
                                { icon: '✦', label: 'Legal Title Verification' },
                                { icon: '✦', label: 'Investment Portfolio Management' },
                                { icon: '✦', label: 'Site Visit Coordination' },
                                { icon: '✦', label: 'NRI Investment Advisory' },
                            ].map((service, i) => (
                                <li key={i} className="flex items-center gap-3 text-sm text-white/50">
                                    <span className="text-gold/60 text-xs">{service.icon}</span>
                                    <span>{service.label}</span>
                                </li>
                            ))}
                        </ul>
                        <Link href="/register" className="inline-flex items-center gap-2 text-xs text-gold mt-4 font-medium hover:text-gold-light transition-colors group">
                            Register to access premium services
                            <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>

                    {/* Contact - 3 cols */}
                    <div className="lg:col-span-3 space-y-6">
                        <h4 className="font-bold text-sm uppercase tracking-widest text-gold mb-6">Contact</h4>
                        <div className="space-y-4 text-sm">
                            <div className="flex items-start space-x-3 group">
                                <div className="h-8 w-8 rounded-lg bg-gold/10 flex items-center justify-center shrink-0 group-hover:bg-gold/20 transition-colors">
                                    <MapPin className="h-4 w-4 text-gold" />
                                </div>
                                <span className="text-white/50 leading-relaxed group-hover:text-white/70 transition-colors">
                                    Nizamsagar Rd, Vidhya Nagar Colony,<br />
                                    Kamareddy, Telangana 503111<br />
                                    <span className="text-xs text-white/30">Opp. Jeevadhan Hospital</span>
                                </span>
                            </div>
                            <div className="flex items-center space-x-3 group">
                                <div className="h-8 w-8 rounded-lg bg-gold/10 flex items-center justify-center shrink-0 group-hover:bg-gold/20 transition-colors">
                                    <Phone className="h-4 w-4 text-gold" />
                                </div>
                                <a href="tel:+919866404090" className="text-white/50 hover:text-gold transition-colors group-hover:text-white/70">
                                    +91 98664 04090
                                </a>
                            </div>
                            <div className="flex items-center space-x-3 group">
                                <div className="h-8 w-8 rounded-lg bg-gold/10 flex items-center justify-center shrink-0 group-hover:bg-gold/20 transition-colors">
                                    <Mail className="h-4 w-4 text-gold" />
                                </div>
                                <a href="mailto:swamygoud2775@gmail.com" className="text-white/50 hover:text-gold transition-colors group-hover:text-white/70">
                                    swamygoud2775@gmail.com
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-white/30">
                    <p>© {currentYear} AS Trusted. All rights reserved.</p>
                    <div className="flex space-x-6">
                        <Link href="/privacy" className="hover:text-gold transition-colors">Privacy Policy</Link>
                        <Link href="/terms" className="hover:text-gold transition-colors">Terms of Service</Link>
                        <Link href="/cookies" className="hover:text-gold transition-colors">Cookie Policy</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
