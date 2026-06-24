import { Mail, MessageCircle, Phone } from 'lucide-react';

import footerData from '@/data/footer.json';

const Footer = () => {
  return (
    <footer
      id="contact"
      className="w-full mt-16 bg-peoplecert-navy text-gray-200 border-t border-peoplecert-navy-400"
    >
      <div className="pc-container py-12">
        {/* Contact strip */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          <a
            href="#"
            className="flex items-center gap-3 p-4 rounded-lg bg-peoplecert-navy-400/40 hover:bg-peoplecert-navy-400/70 transition-colors"
          >
            <span className="flex items-center justify-center w-10 h-10 rounded-full bg-peoplecert-orange/20 text-peoplecert-orange">
              <MessageCircle className="w-5 h-5" />
            </span>
            <div>
              <div className="text-sm font-semibold text-white">Chat with us</div>
              <div className="text-xs text-gray-400">24/7 on exam day, Mon-Fri otherwise</div>
            </div>
          </a>
          <a
            href="mailto:support@peoplecert.org"
            className="flex items-center gap-3 p-4 rounded-lg bg-peoplecert-navy-400/40 hover:bg-peoplecert-navy-400/70 transition-colors"
          >
            <span className="flex items-center justify-center w-10 h-10 rounded-full bg-peoplecert-orange/20 text-peoplecert-orange">
              <Mail className="w-5 h-5" />
            </span>
            <div>
              <div className="text-sm font-semibold text-white">Email support</div>
              <div className="text-xs text-gray-400">Typical response within 1 business day</div>
            </div>
          </a>
          <a
            href="tel:+442073 477 444"
            className="flex items-center gap-3 p-4 rounded-lg bg-peoplecert-navy-400/40 hover:bg-peoplecert-navy-400/70 transition-colors"
          >
            <span className="flex items-center justify-center w-10 h-10 rounded-full bg-peoplecert-orange/20 text-peoplecert-orange">
              <Phone className="w-5 h-5" />
            </span>
            <div>
              <div className="text-sm font-semibold text-white">Call support</div>
              <div className="text-xs text-gray-400">Regional numbers available</div>
            </div>
          </a>
        </div>

        {/* Nav columns */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {footerData.map((list, index) => (
            <div key={`${list.mainTitle}-${index}`}>
              <h4 className="text-xs font-bold uppercase tracking-wider text-peoplecert-orange mb-4">
                {list.mainTitle}
              </h4>
              <ul className="space-y-2">
                {list.items.map((item, i) => (
                  <li key={`${item}-${i}`}>
                    <a href="#" className="text-sm text-gray-300 hover:text-white transition-colors">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-6 border-t border-peoplecert-navy-400 flex flex-col md:flex-row justify-between items-start md:items-center gap-3 text-xs text-gray-400">
          <div>
            &copy; {new Date().getFullYear()} PeopleCert International Ltd. Demo Support Center powered by Sitecore
            Search.
          </div>
          <div className="flex items-center gap-2">
            <span className="pc-chip bg-peoplecert-navy-400 text-gray-300">Demo environment</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
