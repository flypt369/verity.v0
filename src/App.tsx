import React, { useState } from 'react';
import { Shield, Upload, CheckCircle, AlertCircle, QrCode, Lock, Zap, Eye, Plane } from 'lucide-react';

interface Permit {
  permit_id: string;
  file_hash: string;
  printer: string;
  user: string;
  timestamp: string;
  status: string;
}

const AUTHORIZED_USERS: Record<string, string[]> = {
  "john.doe@dod.mil": ["Printer-7", "Printer-9"],
  "jane.smith@lockheed.com": ["Printer-7"],
  "mike.johnson@raytheon.com": ["Printer-9"]
};

const AUTHORIZED_PRINTERS = ["Printer-7", "Printer-9"];

function App() {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [fileHash, setFileHash] = useState<string>('');
  const [selectedPrinter, setSelectedPrinter] = useState<string>('');
  const [userEmail, setUserEmail] = useState<string>('');
  const [permit, setPermit] = useState<Permit | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string>('');

  const computeHash = async (file: File): Promise<string> => {
    const arrayBuffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      const hash = await computeHash(file);
      setFileHash(hash);
      setError('');
      setPermit(null);
    }
  };

  const handleAuthorization = async () => {
    if (!uploadedFile || !selectedPrinter || !userEmail) {
      setError('Please complete all fields');
      return;
    }

    setIsProcessing(true);
    setError('');

    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    if (!(userEmail in AUTHORIZED_USERS)) {
      setError('Unauthorized user');
      setIsProcessing(false);
      return;
    }

    if (!AUTHORIZED_USERS[userEmail].includes(selectedPrinter)) {
      setError('You are not authorized to use this printer');
      setIsProcessing(false);
      return;
    }

    // Generate permit
    const permitId = `DOD-${new Date().toISOString().split('T')[0]}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
    const newPermit: Permit = {
      permit_id: permitId,
      file_hash: fileHash,
      printer: selectedPrinter,
      user: userEmail,
      timestamp: new Date().toISOString(),
      status: 'AUTHORIZED'
    };

    setPermit(newPermit);
    setIsProcessing(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" style={{fontFamily: 'Orbitron, "Courier New", monospace'}}>
      {/* Google Fonts Import */}
      <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;700;900&display=swap" rel="stylesheet" />
      
      {/* Header */}
      <div className="border-b border-slate-700/50 bg-slate-900/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-lg">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-black bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent tracking-wider">
                Verity
              </h1>
              <p className="text-sm text-slate-400 font-medium tracking-wide">ZERO-KNOWLEDGE MANUFACTURING AUTHORIZATION</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left Column - Main Interface */}
          <div className="space-y-8">
            <div className="text-center lg:text-left">
              {/* 3D Aircraft Animation */}
              <div className="flex justify-center lg:justify-start mb-8">
                <div className="relative w-32 h-32">
                  <div className="symbiote-container">
                    <div className="symbiote-core">
                      <div className="plasma-orb"></div>
                      <div className="plasma-ring ring-1"></div>
                      <div className="plasma-ring ring-2"></div>
                      <div className="plasma-ring ring-3"></div>
                      <div className="plasma-tendril tendril-1"></div>
                      <div className="plasma-tendril tendril-2"></div>
                      <div className="plasma-tendril tendril-3"></div>
                      <div className="plasma-tendril tendril-4"></div>
                    </div>
                  </div>
                </div>
              </div>
              
              <h2 className="text-4xl font-black text-white mb-4 tracking-wider">
                SECURE PRINT AUTHORIZATION
              </h2>
              <p className="text-xl text-slate-300 leading-relaxed font-medium">
                AUTHORIZE 3D PRINTS WITHOUT EXPOSING DESIGNS. 
                <span className="text-cyan-400 font-bold"> ZERO KNOWLEDGE. MAXIMUM SECURITY.</span>
              </p>
            </div>

            {/* Upload Section */}
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8">
              <div className="flex items-center space-x-3 mb-6">
                <Upload className="w-5 h-5 text-cyan-400" />
                <h3 className="text-lg font-bold text-white tracking-wide">UPLOAD DESIGN FILE</h3>
              </div>
              
              <div className="border-2 border-dashed border-slate-600 rounded-xl p-8 text-center hover:border-cyan-400/50 transition-colors">
                <input
                  type="file"
                  onChange={handleFileUpload}
                  accept=".stl,.step,.stp"
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <div className="space-y-4">
                    <div className="w-12 h-12 bg-slate-700 rounded-lg flex items-center justify-center mx-auto">
                      <Upload className="w-6 h-6 text-slate-400" />
                    </div>
                    <div>
                      <p className="text-white font-bold tracking-wide">DROP YOUR .STL OR .STEP FILE HERE</p>
                      <p className="text-slate-400 text-sm mt-1 font-medium tracking-wide">OR CLICK TO BROWSE</p>
                    </div>
                  </div>
                </label>
              </div>

              {uploadedFile && (
                <div className="mt-6 p-4 bg-slate-700/50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-bold tracking-wide">{uploadedFile.name.toUpperCase()}</p>
                      <p className="text-slate-400 text-sm font-mono">HASH: {fileHash.substring(0, 16)}...</p>
                    </div>
                    <div className="flex items-center space-x-2 text-green-400">
                      <Eye className="w-4 h-4" />
                      <span className="text-sm font-bold tracking-wide">FILE STAYS LOCAL</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Authorization Section */}
            {uploadedFile && (
              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8">
                <div className="flex items-center space-x-3 mb-6">
                  <Lock className="w-5 h-5 text-cyan-400" />
                  <h3 className="text-lg font-bold text-white tracking-wide">REQUEST AUTHORIZATION</h3>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-300 mb-2 tracking-wide">
                      SELECT PRINTER
                    </label>
                    <select
                      value={selectedPrinter}
                      onChange={(e) => setSelectedPrinter(e.target.value)}
                      className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-cyan-400 focus:border-transparent font-bold tracking-wide"
                      style={{fontFamily: 'Orbitron, "Courier New", monospace'}}
                    >
                      <option value="">CHOOSE PRINTER...</option>
                      {AUTHORIZED_PRINTERS.map(printer => (
                        <option key={printer} value={printer}>{printer}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-300 mb-2 tracking-wide">
                      DOD EMAIL
                    </label>
                    <input
                      type="email"
                      value={userEmail}
                      onChange={(e) => setUserEmail(e.target.value)}
                      placeholder="john.doe@dod.mil"
                      className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:ring-2 focus:ring-cyan-400 focus:border-transparent font-bold tracking-wide"
                      style={{fontFamily: 'Orbitron, "Courier New", monospace'}}
                    />
                  </div>

                  <button
                    onClick={handleAuthorization}
                    disabled={isProcessing || !uploadedFile || !selectedPrinter || !userEmail}
                    className="w-full bg-gradient-to-r from-blue-500 to-cyan-400 text-white font-black py-3 px-6 rounded-lg hover:from-blue-600 hover:to-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2 tracking-wider"
                  >
                    {isProcessing ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>PROCESSING...</span>
                      </>
                    ) : (
                      <>
                        <Zap className="w-5 h-5" />
                        <span>AUTHORIZE PRINT</span>
                      </>
                    )}
                  </button>

                  {error && (
                    <div className="flex items-center space-x-2 text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg p-3">
                      <AlertCircle className="w-5 h-5" />
                      <span className="font-bold tracking-wide">{error.toUpperCase()}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Results */}
          <div className="space-y-8">
            {/* Security Features */}
            <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/30 rounded-2xl p-8">
              <h3 className="text-xl font-black text-white mb-6 tracking-wider">SECURITY FEATURES</h3>
              <div className="space-y-4">
                {[
                  { icon: Shield, text: "FILES NEVER LEAVE YOUR DEVICE", color: "text-green-400" },
                  { icon: Lock, text: "CRYPTOGRAPHIC HASH VERIFICATION", color: "text-blue-400" },
                  { icon: Eye, text: "ZERO-KNOWLEDGE AUTHORIZATION", color: "text-cyan-400" },
                  { icon: CheckCircle, text: "IMMUTABLE AUDIT TRAIL", color: "text-purple-400" }
                ].map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <feature.icon className={`w-5 h-5 ${feature.color}`} />
                    <span className="text-slate-300 font-bold tracking-wide">{feature.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Permit Display */}
            {permit && (
              <div className="bg-gradient-to-br from-green-500/10 to-cyan-500/10 border border-green-400/20 rounded-2xl p-8">
                <div className="flex items-center space-x-3 mb-6">
                  <CheckCircle className="w-6 h-6 text-green-400" />
                  <h3 className="text-xl font-black text-white tracking-wider">PRINT AUTHORIZED</h3>
                </div>

                <div className="space-y-4">
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-slate-400 font-bold tracking-wide">PERMIT ID</p>
                        <p className="text-white font-mono font-bold">{permit.permit_id}</p>
                      </div>
                      <div>
                        <p className="text-slate-400 font-bold tracking-wide">PRINTER</p>
                        <p className="text-white font-bold">{permit.printer}</p>
                      </div>
                      <div>
                        <p className="text-slate-400 font-bold tracking-wide">USER</p>
                        <p className="text-white font-bold">{permit.user.toUpperCase()}</p>
                      </div>
                      <div>
                        <p className="text-slate-400 font-bold tracking-wide">STATUS</p>
                        <p className="text-green-400 font-black tracking-wider">{permit.status}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg p-6 flex flex-col items-center">
                    <QrCode className="w-24 h-24 text-slate-800 mb-3" />
                    <p className="text-slate-600 text-sm text-center font-bold tracking-wide">
                      SCAN AT PRINTER TO UNLOCK
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Demo Credentials */}
            <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/30 rounded-2xl p-6">
              <h4 className="text-lg font-black text-white mb-4 tracking-wider">DEMO CREDENTIALS</h4>
              <div className="space-y-2 text-sm">
                <div className="text-slate-300">
                  <span className="text-cyan-400 font-bold">JOHN.DOE@DOD.MIL</span> <span className="font-bold">- ACCESS TO ALL PRINTERS</span>
                </div>
                <div className="text-slate-300">
                  <span className="text-cyan-400 font-bold">JANE.SMITH@LOCKHEED.COM</span> <span className="font-bold">- PRINTER-7 ONLY</span>
                </div>
                <div className="text-slate-300">
                  <span className="text-cyan-400 font-bold">MIKE.JOHNSON@RAYTHEON.COM</span> <span className="font-bold">- PRINTER-9 ONLY</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-slate-700/50 bg-slate-900/50 backdrop-blur-sm mt-16">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="text-center text-slate-400">
            <p className="text-sm font-bold tracking-wider">
              VERITY • ZERO-KNOWLEDGE MANUFACTURING AUTHORIZATION • 
              <span className="text-cyan-400 ml-1">POWERED BY ADVANCED CRYPTOGRAPHY</span>
            </p>
          </div>
        </div>
      </div>

      {/* 3D Aircraft Animation Styles */}
      <style jsx>{`
        .symbiote-container {
          width: 128px;
          height: 128px;
          perspective: 1000px;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .symbiote-core {
          position: relative;
          transform-style: preserve-3d;
          animation: symbioteFloat 8s ease-in-out infinite;
        }

        .plasma-orb {
          width: 40px;
          height: 40px;
          background: radial-gradient(circle at 30% 30%, #00ffff, #0080ff, #0040ff);
          border-radius: 50%;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          box-shadow: 
            0 0 20px rgba(0, 255, 255, 0.6),
            0 0 40px rgba(0, 128, 255, 0.4),
            inset 0 0 20px rgba(255, 255, 255, 0.2);
          animation: plasmaPulse 3s ease-in-out infinite;
        }

        .plasma-ring {
          border: 2px solid transparent;
          border-radius: 50%;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: linear-gradient(45deg, transparent, rgba(0, 255, 255, 0.3), transparent);
          background-clip: padding-box;
        }

        .ring-1 {
          width: 60px;
          height: 60px;
          animation: ringRotate 4s linear infinite;
          border-image: linear-gradient(45deg, #00ffff, transparent, #0080ff) 1;
        }

        .ring-2 {
          width: 80px;
          height: 80px;
          animation: ringRotate 6s linear infinite reverse;
          border-image: linear-gradient(90deg, #0080ff, transparent, #00ffff) 1;
        }

        .ring-3 {
          width: 100px;
          height: 100px;
          animation: ringRotate 8s linear infinite;
          border-image: linear-gradient(135deg, #00ffff, transparent, #0040ff) 1;
        }

        .plasma-tendril {
          width: 3px;
          height: 25px;
          background: linear-gradient(to bottom, rgba(0, 255, 255, 0.8), transparent);
          border-radius: 2px;
          position: absolute;
          top: 50%;
          left: 50%;
          transform-origin: bottom center;
          box-shadow: 0 0 10px rgba(0, 255, 255, 0.5);
        }

        .tendril-1 {
          transform: translate(-50%, -100%) rotateZ(0deg);
          animation: tendrilWave 3s ease-in-out infinite;
        }

        .tendril-2 {
          transform: translate(-50%, -100%) rotateZ(90deg);
          animation: tendrilWave 3s ease-in-out infinite 0.75s;
        }

        .tendril-3 {
          transform: translate(-50%, -100%) rotateZ(180deg);
          animation: tendrilWave 3s ease-in-out infinite 1.5s;
        }

        .tendril-4 {
          transform: translate(-50%, -100%) rotateZ(270deg);
          animation: tendrilWave 3s ease-in-out infinite 2.25s;
        }

        @keyframes symbioteFloat {
          0% {
            transform: rotateX(10deg) rotateY(0deg) rotateZ(0deg) translateY(0px);
          }
          25% {
            transform: rotateX(5deg) rotateY(90deg) rotateZ(5deg) translateY(-5px);
          }
          50% {
            transform: rotateX(-5deg) rotateY(180deg) rotateZ(0deg) translateY(0px);
          }
          75% {
            transform: rotateX(5deg) rotateY(270deg) rotateZ(-5deg) translateY(5px);
          }
          100% {
            transform: rotateX(10deg) rotateY(360deg) rotateZ(0deg) translateY(0px);
          }
        }

        @keyframes plasmaPulse {
          0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
          50% { transform: translate(-50%, -50%) scale(1.1); opacity: 0.8; }
        }

        @keyframes ringRotate {
          0% { transform: translate(-50%, -50%) rotateZ(0deg); }
          100% { transform: translate(-50%, -50%) rotateZ(360deg); }
        }

        @keyframes tendrilWave {
          0%, 100% { transform: translate(-50%, -100%) rotateZ(var(--rotation, 0deg)) scaleY(1); }
          50% { transform: translate(-50%, -100%) rotateZ(var(--rotation, 0deg)) scaleY(1.3); }
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .symbiote-core {
            animation: none;
            transform: rotateX(10deg) rotateY(45deg);
          }
          .plasma-orb, .plasma-ring, .plasma-tendril {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}

export default App;