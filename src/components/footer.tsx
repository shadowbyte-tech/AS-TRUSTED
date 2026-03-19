import Link from 'next/link';
import { ASLogo } from './as-logo';
import { Mail, Phone, MapPin, Facebook, Instagram, Linkedin, Twitter } from 'lucide-react';

export function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-background border-t">
            <div className="container px-4 py-12 md:py-24">
                <div className="grid grid-cols-1 gap-12 md:grid-cols-4">
                    {/* Brand Column */}
                    <div className="space-y-6">
                        <div className="flex items-center space-x-2">
                            <ASLogo className="h-10 w-10 text-primary" />
                            <span className="text-xl font-bold font-headline tracking-tighter">
                                AS TRUSTED
                                <span className="block text-xs font-medium text-muted-foreground uppercase tracking-[0.2em]">Consultancy</span>
                            </span>
                        </div>
                        <p className="text-muted-foreground text-sm max-w-xs leading-relaxed">
                            Strategic land investment advisory specializing in high-growth urban corridors and legally verified property acquisition.
                        </p>
                        <div className="space-y-4 pt-4">
                            <div className="inline-flex items-center px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-[10px] font-black uppercase tracking-widest text-primary">
                                RERA No: REG-004129
                            </div>
                        </div>
                        <div className="flex space-x-4">
                            <Link href="https://www.facebook.com/as.trusted.customers?sfnsn=wa" target="_blank" className="h-10 w-10 rounded-full glass flex items-center justify-center text-muted-foreground hover:text-primary hover:scale-110 transition-all">
                                <Facebook className="h-5 w-5" />
                            </Link>
                            <Link href="https://www.instagram.com/swamy.goud.37201901?igsh=b2VmZG9zNTZ2YXRt" target="_blank" className="h-10 w-10 rounded-full glass flex items-center justify-center text-muted-foreground hover:text-primary hover:scale-110 transition-all">
                                <Instagram className="h-5 w-5" />
                            </Link>
                            <Link href="https://twitter.com" target="_blank" className="h-10 w-10 rounded-full glass flex items-center justify-center text-muted-foreground hover:text-primary hover:scale-110 transition-all">
                                <Twitter className="h-5 w-5" />
                            </Link>
                            <Link href="https://linkedin.com" target="_blank" className="h-10 w-10 rounded-full glass flex items-center justify-center text-muted-foreground hover:text-primary hover:scale-110 transition-all">
                                <Linkedin className="h-5 w-5" />
                            </Link>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="font-headline font-bold mb-6 text-sm uppercase tracking-widest">Company</h4>
                        <ul className="space-y-4 text-sm">
                            <li>
                                <Link href="/" className="text-muted-foreground hover:text-primary transition-colors">Home</Link>
                            </li>
                            <li>
                                <Link href="/properties" className="text-muted-foreground hover:text-primary transition-colors">Properties</Link>
                            </li>
                            <li>
                                <Link href="/register" className="text-muted-foreground hover:text-primary transition-colors">Register</Link>
                            </li>
                            <li>
                                <Link href="/login" className="text-muted-foreground hover:text-primary transition-colors">Owner Login</Link>
                            </li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h4 className="font-headline font-bold mb-6 text-sm uppercase tracking-widest">Premium Services</h4>
                        <ul className="space-y-4 text-sm">
                            <li>
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <span className="text-xs">🔒</span>
                                    <span>Vastu Analysis</span>
                                </div>
                            </li>
                            <li>
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <span className="text-xs">🔒</span>
                                    <span>Market Intelligence</span>
                                </div>
                            </li>
                            <li>
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <span className="text-xs">🔒</span>
                                    <span>Legal Assistance</span>
                                </div>
                            </li>
                            <li>
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <span className="text-xs">🔒</span>
                                    <span>Property Management</span>
                                </div>
                            </li>
                        </ul>
                        <Link href="/register" className="text-xs text-primary mt-4 font-medium hover:underline cursor-pointer transition-colors">
                            Register & login to access premium services
                        </Link>
                    </div>

                    {/* Contact */}
                    <div className="space-y-6">
                        <h4 className="font-headline font-bold mb-6 text-sm uppercase tracking-widest">Contact Us</h4>
                        <div className="space-y-4 text-sm">
                            <div className="flex items-start space-x-3">
                                <MapPin className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                                <span className="text-muted-foreground leading-relaxed">
                                    Nizamsagar Rd, Vidhya Nagar Colony,<br />
                                    Kamareddy, Telangana 503111<br />
                                    Opposite to Jeevadhan Hospital
                                </span>
                            </div>
                            <div className="flex items-center space-x-3">
                                <Phone className="h-5 w-5 text-accent shrink-0" />
                                <span className="text-muted-foreground">+91 98664 04090</span>
                            </div>
                            <div className="flex items-center space-x-3">
                                <Mail className="h-5 w-5 text-accent shrink-0" />
                                <span className="text-muted-foreground">contact@swamygoud2775@gmail.com</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-24 pt-8 border-t border-primary/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground">
                    <p> {currentYear} AS Trusted Consultancy. All rights reserved.</p>
                    <div className="flex space-x-8">
                        <Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link>
                        <Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link>
                        <Link href="/cookies" className="hover:text-primary transition-colors">Cookie Policy</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
