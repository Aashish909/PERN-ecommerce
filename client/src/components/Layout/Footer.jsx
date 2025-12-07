import { Link } from "react-router-dom";
import {
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Store,
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-[#0f172a] text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand & Description */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center gap-2">
              <div className="relative h-10 w-10 flex items-center justify-center">
                <div className="absolute inset-0 bg-white/10 blur-xl rounded-lg" />
                <div className="relative h-9 w-9 rounded-lg border-2 border-white flex items-center justify-center">
                  <Store size={20} className="text-white" />
                </div>
              </div>
              <span className="text-2xl font-bold tracking-tight">ReShop</span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Auctor libero id et, in gravida. Sit diam duis mauris nulla cursus. Erat et lectus vel ut sollicitudin elit at amet.
            </p>

            <div className="flex gap-3 pt-4">
              <button className="bg-[#1e293b] hover:bg-[#334155] text-white px-4 py-2 rounded-lg flex items-center gap-3 transition-colors border border-white/10">
                <div className="w-6 h-6 bg-contain bg-no-repeat bg-center" style={{ backgroundImage: "url('https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg')" }}></div>
                <div className="text-left">
                  <div className="text-[10px] text-gray-400">Get it on</div>
                  <div className="text-sm font-semibold leading-none">Google Play</div>
                </div>
              </button>
              <button className="bg-[#1e293b] hover:bg-[#334155] text-white px-4 py-2 rounded-lg flex items-center gap-3 transition-colors border border-white/10">
                <div className="w-6 h-6 bg-contain bg-no-repeat bg-center" style={{ backgroundImage: "url('https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg')" }}></div>
                <div className="text-left">
                  <div className="text-[10px] text-gray-400">Download on the</div>
                  <div className="text-sm font-semibold leading-none">App Store</div>
                </div>
              </button>
            </div>
          </div>

          {/* About Us */}
          <div>
            <h3 className="text-lg font-bold mb-6">About Us</h3>
            <ul className="space-y-4 text-sm text-gray-400">
              <li><Link to="#" className="hover:text-white transition-colors">Careers</Link></li>
              <li><Link to="#" className="hover:text-white transition-colors">Our Stores</Link></li>
              <li><Link to="#" className="hover:text-white transition-colors">Our Cares</Link></li>
              <li><Link to="#" className="hover:text-white transition-colors">Terms & Conditions</Link></li>
              <li><Link to="#" className="hover:text-white transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h3 className="text-lg font-bold mb-6">Customer Care</h3>
            <ul className="space-y-4 text-sm text-gray-400">
              <li><Link to="#" className="hover:text-white transition-colors">Help Center</Link></li>
              <li><Link to="#" className="hover:text-white transition-colors">Track Your Order</Link></li>
              <li><Link to="#" className="hover:text-white transition-colors">Corporate & Bulk Purchasing</Link></li>
              <li><Link to="#" className="hover:text-white transition-colors">Returns & Refunds</Link></li>
            </ul>
          </div>

          {/* Contact Us */}
          <div>
            <h3 className="text-lg font-bold mb-6">Contact Us</h3>
            <div className="space-y-4 text-sm text-gray-400">
              <p className="leading-relaxed">
                70 Washington Square South, New York, NY 10012, United States
              </p>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-white">Email:</span>
                <span>uilib.help@gmail.com</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-white">Phone:</span>
                <span>+1 1123 456 780</span>
              </div>

              <div className="flex gap-4 pt-4">
                <a href="#" className="w-8 h-8 rounded-full bg-[#1e293b] flex items-center justify-center hover:bg-primary hover:text-white transition-all">
                  <Facebook size={16} />
                </a>
                <a href="#" className="w-8 h-8 rounded-full bg-[#1e293b] flex items-center justify-center hover:bg-primary hover:text-white transition-all">
                  <Twitter size={16} />
                </a>
                <a href="#" className="w-8 h-8 rounded-full bg-[#1e293b] flex items-center justify-center hover:bg-primary hover:text-white transition-all">
                  <Instagram size={16} />
                </a>
                <a href="#" className="w-8 h-8 rounded-full bg-[#1e293b] flex items-center justify-center hover:bg-primary hover:text-white transition-all">
                  <Youtube size={16} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-[#0f172a] border-t border-white/10 py-6">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-500 text-sm">
            © Copyright 2025 UI Lib, All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
