'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Modal } from '@/components/Modal';
import confetti from 'canvas-confetti';

export default function SetupPage() {
  const [figmaToken, setFigmaToken] = useState('');
  const [fileKey, setFileKey] = useState('');
  const [status, setStatus] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [tokenCopied, setTokenCopied] = useState(false);
  const [fileKeyCopied, setFileKeyCopied] = useState(false);
  const figmaTokenRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Auto-focus first input on mount
  useEffect(() => {
    if (figmaTokenRef.current) {
      figmaTokenRef.current.focus();
    }
  }, []);

  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#00FFA7', '#061019', '#1E2A37'],
      ticks: 200
    });
  };

  const handlePaste = async (field: 'token' | 'key') => {
    try {
      const text = await navigator.clipboard.readText();
      if (field === 'token') {
        setFigmaToken(text);
      } else {
        setFileKey(text);
      }
    } catch (err) {
      console.error('Failed to paste:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading || isConnected) return;
    
    setIsLoading(true);
    setStatus('Testing connection...');

    try {
      const response = await fetch('/api/setup/figma', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ figmaToken, fileKey }),
      });

      if (response.ok) {
        setStatus('Connected successfully to Figma');
        setIsConnected(true);
        triggerConfetti();
      } else {
        setStatus('Failed to connect. Please check your credentials.');
        setIsLoading(false);
      }
    } catch (error) {
      setStatus('Error connecting to Figma. Please try again.');
      setIsLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 260,
        damping: 20
      }
    }
  };

  return (
    <main className="min-h-screen bg-dark/background/default flex flex-col items-center justify-center p-8">
      <motion.div 
        className="max-w-md w-full space-y-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div 
          className="text-center"
          variants={itemVariants}
        >
          <motion.div
            animate={{
              scale: [1, 1.02, 1],
              transition: { duration: 2, repeat: Infinity }
            }}
          >
            <Image
              src="/Nansen-Logo-GIF-1_GREEN.gif"
              alt="Nansen Logo"
              width={68}
              height={68}
              className="mx-auto"
              priority
              unoptimized
            />
          </motion.div>
        </motion.div>

        {!isConnected ? (
          <>
            <motion.div className="text-center" variants={itemVariants}>
              <h2 className="mt-6 text-2xl font-bold text-dark/text/primary">
                Sync with Nansen's Design System
              </h2>
              <p className="mt-2 text-sm text-dark/text/secondary">
                Log in with your Figma credentials to connect design tokens
              </p>
            </motion.div>
            <motion.form 
              onSubmit={handleSubmit} 
              className="mt-8 space-y-6"
              variants={itemVariants}
            >
              <div className="space-y-4">
                <motion.div 
                  variants={itemVariants}
                  className="relative group"
                >
                  <input
                    ref={figmaTokenRef}
                    id="figmaToken"
                    name="figmaToken"
                    type="password"
                    required
                    value={figmaToken}
                    onChange={(e) => setFigmaToken(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 bg-[#121C26] border-0 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#00FFA7] text-white transition-all duration-200 placeholder-gray-400 group-hover:bg-[#1a2632]"
                    placeholder="Figma Access Token"
                    disabled={isLoading}
                  />
                </motion.div>

                <motion.div 
                  variants={itemVariants}
                  className="relative group"
                >
                  <input
                    id="fileKey"
                    name="fileKey"
                    type="text"
                    required
                    value={fileKey}
                    onChange={(e) => setFileKey(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 bg-[#121C26] border-0 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#00FFA7] text-white transition-all duration-200 placeholder-gray-400 group-hover:bg-[#1a2632]"
                    placeholder="Figma File Key"
                    disabled={isLoading}
                  />
                </motion.div>
              </div>

              <motion.div variants={itemVariants} className="space-y-6">
                <button
                  type="submit"
                  disabled={isLoading || !figmaToken || !fileKey}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-[#061019] bg-[#00FFA7] hover:bg-[#00FFA7]/90 focus:outline-none focus:ring-2 focus:ring-[#00FFA7] transition-all duration-200 relative disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-[#061019]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Connecting...
                    </div>
                  ) : (
                    'Connect to Figma'
                  )}
                </button>

                <motion.button
                  type="button"
                  onClick={() => setIsModalOpen(true)}
                  className="w-full text-center text-xs text-gray-400 hover:text-white transition-colors mt-6"
                  variants={itemVariants}
                >
                  Where do I find these credentials?
                </motion.button>
              </motion.div>

              <AnimatePresence>
                {status && (
                  <motion.p 
                    className="mt-2 text-sm text-center text-dark/text/secondary"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    {status}
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.form>
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 text-center"
          >
            <h2 className="text-2xl font-bold text-[#00FFA7]">
              Figma Connection Successful!
            </h2>
            <p className="mt-2 text-sm text-dark/text/secondary">
              Create anything you imagine - This page will now automatically update based on the prompts you enter in Cursor.
            </p>
          </motion.div>
        )}
      </motion.div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="text-white">
          <h3 className="text-lg font-semibold mb-4">Our Credentials</h3>
          <div className="space-y-4">
            <div>
              <h4 className="text-[#00FFA7] font-medium mb-2">Figma Access Token</h4>
              <ol className="list-decimal list-inside space-y-2 text-sm text-gray-300">
                <li>Open Figma and log in</li>
                <li>Click on your profile picture</li>
                <li>Go to Settings → Account</li>
                <li>Scroll to Personal access tokens</li>
                <li>Click "Create new token"</li>
              </ol>
              <button
                onClick={async () => {
                  await navigator.clipboard.writeText("your_figma_access_token");
                  setTokenCopied(true);
                  setTimeout(() => setTokenCopied(false), 2000);
                }}
                className="mt-4 w-full flex items-center gap-2 py-2 px-4 bg-[#121C26] rounded-md text-sm text-[#00FFA7] hover:bg-[#1a2632] transition-colors border border-[#1E2A37]"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  {tokenCopied ? (
                    <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round"/>
                  ) : (
                    <>
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                    </>
                  )}
                </svg>
                {tokenCopied ? 'Copied!' : 'Copy Figma Token'}
              </button>
            </div>
            <div>
              <h4 className="text-[#00FFA7] font-medium mb-2">Figma File Key</h4>
              <ol className="list-decimal list-inside space-y-2 text-sm text-gray-300">
                <li>Open your Figma design file</li>
                <li>Look at the URL in your browser</li>
                <li>Find the part after "/file/"</li>
                <li>Copy everything before the next "/"</li>
                <li>Example: figma.com/file/KEY/filename</li>
              </ol>
              <button
                onClick={async () => {
                  await navigator.clipboard.writeText("your_figma_file_key");
                  setFileKeyCopied(true);
                  setTimeout(() => setFileKeyCopied(false), 2000);
                }}
                className="mt-4 w-full flex items-center gap-2 py-2 px-4 bg-[#121C26] rounded-md text-sm text-[#00FFA7] hover:bg-[#1a2632] transition-colors border border-[#1E2A37]"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  {fileKeyCopied ? (
                    <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round"/>
                  ) : (
                    <>
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                    </>
                  )}
                </svg>
                {fileKeyCopied ? 'Copied!' : 'Copy Figma File Key'}
              </button>
            </div>
          </div>
          <button
            onClick={() => setIsModalOpen(false)}
            className="mt-6 w-full py-2 px-4 bg-[#1E2A37] hover:bg-[#2A3744] transition-colors rounded-md text-sm text-white"
          >
            Got it
          </button>
        </div>
      </Modal>
    </main>
  );
} 