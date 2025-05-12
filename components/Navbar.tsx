'use client';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { UserButton, SignedIn, SignedOut, SignInButton, SignUpButton } from '@clerk/nextjs';
import { X, Menu } from 'lucide-react';

const navLinks: { href: string; label: string; }[] = [
  { href: '#home', label: 'Home' },
  { href: '#services', label: 'Diensten' },
  { href: '#offers', label: 'Aanbiedingen' },
  { href: '#about', label: 'Over ons' },
  { href: '#blogs', label: 'Blog' },
  { href: '#contact', label: 'Contact' },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeLink, setActiveLink] = useState<string>('');

  const handleClick = (link: string) => {
    setActiveLink(link);
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      <div className="container mx-auto px-4 py-2 flex justify-between items-center">
        {/* Logo + Brand Name */}
        <div className="flex items-center gap-2">
          <Image src="/assets/images/logo.png" alt="Tulip Tours" width={50} height={50} />
          <Link href="/" className="text-2xl font-bold text-purple-600">
            Tulip Tours
          </Link>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-6">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={`text-gray-700 hover:text-purple-600 px-3 py-2 rounded-md font-semibold transition ${activeLink === link.href ? 'text-purple-600' : ''
                }`}
              onClick={() => handleClick(link.href)}
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Auth Buttons */}
        <div className="hidden lg:flex items-center gap-4">
          <SignedOut>
            <SignInButton>
              <button className="text-sm px-4 py-2 bg-purple-600 text-white rounded">Inloggen</button>
            </SignInButton>
            <SignUpButton>
              <button className="text-sm px-4 py-2 bg-purple-300 text-white rounded">Account Aanmaken</button>
            </SignUpButton>
          </SignedOut>
          <SignedIn>
            <div className="flex items-center gap-4">
              <Link
                href="/dashboard"
                className="text-sm px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition"
              >
                Dashboard
              </Link>
              <UserButton afterSignOutUrl="/" />
            </div>
          </SignedIn>
        </div>

        {/* Mobile Menu Button */}
        <button onClick={() => setMenuOpen(true)} className="lg:hidden">
          <Menu className="w-6 h-6 text-purple-600" />
        </button>
      </div>

      {/* Mobile Menu Drawer */}
      {menuOpen && (
        <div className="fixed inset-0 bg-white z-50 p-6 lg:hidden shadow-lg">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-purple-600">Tulip Tours</h2>
            <button onClick={() => setMenuOpen(false)}>
              <X className="w-6 h-6 text-purple-600" />
            </button>
          </div>
          <nav className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={`text-gray-700 hover:text-purple-600 px-3 py-2 rounded-md font-semibold transition ${activeLink === link.href ? 'text-purple-600' : ''
                  }`}
                onClick={() => {
                  handleClick(link.href);
                  setMenuOpen(false);
                }}
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="mt-6 flex flex-col gap-3">
            <SignedOut>
              <SignInButton>
                <button className="w-full text-sm px-4 py-2 bg-purple-600 text-white rounded">
                  Inloggen
                </button>
              </SignInButton>
              <SignUpButton>
                <button className="w-full text-sm px-4 py-2 bg-purple-300 text-white rounded">
                  Account Aanmaken
                </button>
              </SignUpButton>
            </SignedOut>
            <SignedIn>
              <div className="flex flex-col gap-3">
                <Link
                  href="/dashboard"
                  className="text-sm px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition"
                >
                  Dashboard
                </Link>
                <UserButton afterSignOutUrl="/" />
              </div>
            </SignedIn>
          </div>
        </div>
      )}
    </header>
  );
}
