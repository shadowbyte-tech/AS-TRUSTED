
import UserLoginForm from '@/components/user-login-form';
import { Header } from '@/components/header';
import PhonePeQR from '@/components/phonepe-qr';
import { CheckCircle } from 'lucide-react';
import Image from 'next/image';

export const dynamic = 'force-dynamic';

const features = [
    "Access exclusive plot details and pricing.",
    "Get free AI-powered Vastu analysis for any plot.",
    "Visualize future development potential with AI.",
    "Save your favorite properties for later viewing."
];

export default function UserLoginPage() {
  return (
    <div className="w-full min-h-screen flex flex-col bg-black overflow-x-hidden">
      <Header />
      <div className="flex-grow grid grid-cols-1 lg:grid-cols-2">
        {/* Left Side - Premium Informational Content */}
        <div className="relative hidden lg:flex flex-col items-center justify-center bg-black text-white p-12 overflow-hidden shadow-2xl z-10 border-r border-white/10">
           {/* Premium Video Background */}
           <div className="absolute inset-0">
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="absolute w-full h-full object-cover"
                >
                  <source src="/videos/user-login-background.mp4.mp4" type="video/mp4" />
                </video>
                {/* Clean dark gradient overlay for text readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20"></div>
           </div>

           <div className="relative z-10 w-full max-w-md animate-fade-in-up">
                <h2 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent font-headline mb-4">
                    Premium Property Access
                </h2>
                <p className="text-purple-200 mb-8">
                    Sign in to access exclusive properties, AI-powered analysis, and premium investment opportunities.
                </p>
                <ul className="space-y-4">
                    {features.map((feature, index) => (
                        <li 
                          key={index} 
                          className="flex items-start animate-fade-in-up"
                          style={{ animationDelay: `${index * 0.1}s` }}
                        >
                            <CheckCircle className="h-6 w-6 mr-3 text-amber-400 flex-shrink-0" />
                            <span className="text-purple-100">{feature}</span>
                        </li>
                    ))}
                </ul>
           </div>
        </div>
        
        {/* Right Side - Premium Login Form */}
        <div className="relative flex items-center justify-center bg-black p-4 sm:p-8 overflow-hidden min-h-[calc(100vh-80px)] lg:min-h-0">
          {/* Subtle Premium Gold Background */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40">
            <div className="absolute -top-1/4 -right-1/4 w-[800px] h-[800px] bg-gradient-to-b from-amber-500/10 to-transparent rounded-full blur-[100px]"></div>
            <div className="absolute -bottom-1/4 -left-1/4 w-[600px] h-[600px] bg-gradient-to-t from-primary/10 to-transparent rounded-full blur-[80px]"></div>
          </div>

          <div className="flex flex-col lg:flex-row gap-6 items-center lg:items-start relative z-10 animate-fade-in-up animation-delay-200 w-full max-w-4xl px-4">
            {/* Premium Login Form */}
            <div className="w-full max-w-md space-y-8 flex-shrink-0">
              <div className="text-center">
                <h2 className="mt-6 text-center text-2xl sm:text-3xl font-bold tracking-tight bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent font-headline">
                  Premium Member Access
                </h2>
                <p className="mt-2 text-center text-sm text-purple-200 font-medium">
                  For Buyers & Premium Investors
                </p>
                <p className="mt-1 text-center text-xs text-purple-300">
                  Enter your credentials to access exclusive properties.
                </p>
              </div>
              <UserLoginForm />
            </div>

            {/* PhonePe QR Code */}
            <div className="hidden sm:block lg:mt-12">
              <PhonePeQR />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
