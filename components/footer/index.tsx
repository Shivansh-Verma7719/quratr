import React from "react";
import Link from "next/link";
import QuratrLogo from "@/public/images/logo.png";
import Image from "next/image";
// import { Facebook, Instagram, Twitter, Linkedin } from 'lucide-react'
import { Instagram } from "lucide-react";
import QuratrLogoDark from "@/public/images/logo_dark.png";
import { useTheme } from "next-themes";

const Footer: React.FC = () => {
  const { theme } = useTheme();
  const themeLogo = theme === "light" ? QuratrLogoDark : QuratrLogo;

  return (
    <footer className="bg-background text-text py-12">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          <div className="col-span-1 lg:col-span-2">
            <a href="/">
              <div className="flex items-center space-x-2 mb-4 text-2xl font-bold">
                <Image
                  src={themeLogo}
                  alt="Logo"
                  width={35}
                  height={35}
                  className="-translate-y-[0.1rem] translate-x-[0.2rem]"
                />
                <h1 className="text-2xl p-0 ml-0 font-bold"
                style={{marginLeft: "0px"}}>uratr</h1>
              </div>
            </a>
            <p className="text-gray-400 mb-4">
              © {new Date().getFullYear()} Quratr. All rights reserved.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Pages</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="#features"
                  className="text-gray-400 transition-colors"
                >
                  Features
                </Link>
              </li>
              <li>
                <Link
                  href="#about"
                  className="text-gray-400 transition-colors"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="#waitlist"
                  className="text-gray-400 transition-colors"
                >
                  Waitlist
                </Link>
              </li>
              {/* <li><Link href="#" className="text-gray-400 transition-colors">Clients</Link></li> */}
              {/* <li><Link href="#" className="text-gray-400 transition-colors">Pricing</Link></li> */}
              {/* <li><Link href="#" className="text-gray-400 transition-colors">Blog</Link></li> */}
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Socials</h3>
            <ul className="space-y-2">
              {/* <li><Link href="#" className="text-gray-400 transition-colors flex items-center"><Facebook className="w-5 h-5 mr-2" /> Facebook</Link></li> */}
              <li>
                <Link
                  href="#"
                  className="text-gray-400 transition-colors flex items-center"
                >
                  <Instagram className="w-5 h-5 mr-2" /> Instagram
                </Link>
              </li>
              {/* <li><Link href="#" className="text-gray-400 transition-colors flex items-center"><Twitter className="w-5 h-5 mr-2" /> Twitter</Link></li> */}
              {/* <li><Link href="#" className="text-gray-400 transition-colors flex items-center"><Linkedin className="w-5 h-5 mr-2" /> LinkedIn</Link></li> */}
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="#"
                  className="text-gray-400 transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-gray-400 transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
              {/* <li><Link href="#" className="text-gray-400 transition-colors">Cookie Policy</Link></li> */}
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
