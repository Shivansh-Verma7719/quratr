import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Instagram } from "lucide-react";
import { useTheme } from "next-themes";
import { getPages } from "../pages";
import Logo_Light from "@/components/logos/logo_light";
import Logo from "@/components/logos/logo";

const Footer: React.FC = () => {
  const { theme } = useTheme();
  const ThemeLogo = theme === "light" ? Logo_Light : Logo;
  const [mounted, setMounted] = useState(false);
  const [pages, setPages] = useState<
    { name: string; href: string; icon: React.ElementType }[]
  >([]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const fetchPages = async () => {
      const pages = await getPages();
      setPages(pages);
    };
    fetchPages();
  }, []);

  if (!mounted) return null;

  return (
    <footer className="bg-background text-text py-12">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          <div className="col-span-1 lg:col-span-2">
            <a href="/">
              <div className="flex items-center space-x-2 mb-4 text-2xl font-bold">
                <ThemeLogo width={35} height={35} />
                <h1
                  className="text-2xl p-0 ml-0 font-bold translate-y-[0.3rem]"
                  style={{ marginLeft: "0px" }}
                >
                  uratr
                </h1>
              </div>
            </a>
            <p className="text-gray-400 mb-4">
              © {new Date().getFullYear()} Quratr. All rights reserved.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Pages</h3>
            <ul className="space-y-2">
              {pages.map((page) => (
                <li key={page.name}>
                  <Link
                    href={page.href}
                    className="text-gray-400 transition-colors"
                  >
                    {page.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Socials</h3>
            <ul className="space-y-2">
              {/* <li><Link href="#" className="text-gray-400 transition-colors flex items-center"><Facebook className="w-5 h-5 mr-2" /> Facebook</Link></li> */}
              <li>
                <Link
                  href="https://www.instagram.com/quratr.app"
                  className="text-gray-400 transition-colors flex items-center"
                >
                  <Instagram className="w-5 h-5 mr-2" /> Instagram
                </Link>
              </li>
              {/* <li><Link href="#" className="text-gray-400 transition-colors flex items-center"><Twitter className="w-5 h-5 mr-2" /> Twitter</Link></li> */}
              {/* <li>
                <Link
                  href="#"
                  className="text-gray-400 transition-colors flex items-center"
                >
                  <Linkedin className="w-5 h-5 mr-2" /> LinkedIn
                </Link>
              </li> */}
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/privacy_policy"
                  className="text-gray-400 transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/termsandconditions"
                  className="text-gray-400 transition-colors"
                >
                  Terms and Conditions
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
