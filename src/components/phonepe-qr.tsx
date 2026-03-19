'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { X, Smartphone, QrCode, UserPlus, Phone, MessageCircle } from 'lucide-react';
import Link from 'next/link';

interface PhonePeQRProps {
  className?: string;
}

export default function PhonePeQR({ className }: PhonePeQRProps) {
  const [showFullQR, setShowFullQR] = useState(false);

  // Generate a simple QR code placeholder using SVG
  const QRCodePlaceholder = ({ size = 200 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 200 200" className="bg-white">
      {/* QR Code Pattern - Simple 7x7 grid */}
      <rect x="10" y="10" width="60" height="60" fill="#000" />
      <rect x="20" y="20" width="40" height="40" fill="#fff" />
      <rect x="30" y="30" width="20" height="20" fill="#000" />
      
      <rect x="130" y="10" width="60" height="60" fill="#000" />
      <rect x="140" y="20" width="40" height="40" fill="#fff" />
      <rect x="150" y="30" width="20" height="20" fill="#000" />
      
      <rect x="10" y="130" width="60" height="60" fill="#000" />
      <rect x="20" y="140" width="40" height="40" fill="#fff" />
      <rect x="30" y="150" width="20" height="20" fill="#000" />
      
      {/* Center pattern */}
      <rect x="80" y="80" width="40" height="40" fill="#000" />
      <rect x="90" y="90" width="20" height="20" fill="#fff" />
      
      {/* Additional patterns */}
      <rect x="100" y="20" width="20" height="20" fill="#000" />
      <rect x="80" y="40" width="20" height="20" fill="#000" />
      <rect x="120" y="80" width="20" height="20" fill="#000" />
      <rect x="60" y="100" width="20" height="20" fill="#000" />
      <rect x="140" y="120" width="20" height="20" fill="#000" />
      <rect x="80" y="140" width="20" height="20" fill="#000" />
      
      <text x="100" y="195" textAnchor="middle" fontSize="8" fill="#666">PhonePe QR</text>
    </svg>
  );

  return (
    <div className={className}>
      {/* Small QR Code Card */}
      <div className="bg-white/90 backdrop-blur-sm border border-primary/20 rounded-lg p-3 shadow-lg">
        <div className="text-center space-y-3">
          <div className="flex items-center justify-center gap-2 text-sm font-semibold text-primary">
            <Smartphone className="h-4 w-4" />
            PhonePe Payment
          </div>
          
          {/* Small QR Code */}
          <div 
            className="w-24 h-24 mx-auto bg-white rounded border-2 border-gray-300 cursor-pointer hover:border-primary transition-colors overflow-hidden"
            onClick={() => setShowFullQR(true)}
          >
            <QRCodePlaceholder size={96} />
          </div>
          
          <div className="space-y-1">
            <p className="text-xs font-medium text-gray-700">Scan to Pay</p>
            <p className="text-xs text-gray-500">Click to enlarge</p>
          </div>
        </div>
      </div>

      {/* Full QR Code Modal */}
      {showFullQR && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md mx-auto">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-800">PhonePe Payment</h3>
                <Button
                  onClick={() => setShowFullQR(false)}
                  variant="ghost"
                  size="sm"
                  className="p-2 h-8 w-8 hover:bg-gray-100 rounded-full"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="space-y-4">
                {/* Large QR Code */}
                <div className="bg-gray-100 p-4 rounded-lg border-2 border-gray-300">
                  <div className="w-48 h-48 mx-auto bg-white rounded-lg overflow-hidden flex items-center justify-center">
                    <QRCodePlaceholder size={192} />
                  </div>
                </div>

                <div className="space-y-2 text-sm text-gray-600">
                  <p className="font-medium">Scan to Pay</p>
                  <p>Use PhonePe app to scan and pay</p>
                </div>

                {/* Contact Options */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <h4 className="text-sm font-semibold text-blue-800 mb-2">Need Help?</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-blue-600" />
                      <span className="text-sm">+91 98664 04090</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MessageCircle className="h-4 w-4 text-blue-600" />
                      <a 
                        href="https://wa.me/919866404090" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:underline"
                      >
                        WhatsApp Support
                      </a>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={() => setShowFullQR(false)}
                  className="w-full"
                >
                  Close
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
