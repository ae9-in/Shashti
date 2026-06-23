
export const Footer = () => {
  return (
    <footer
      className="relative py-16 border-t-2 border-[#C9A227]"
      style={{
        backgroundColor: '#3D0A12',
        backgroundImage: 'radial-gradient(circle at 20% 80%, rgba(201, 162, 39, 0.04) 0%, transparent 50%), linear-gradient(135deg, #3D0A12 0%, #5C0F1A 100%)',
      }}
    >
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <img src="/logo.png" alt="Shashti Logo" className="w-8 h-8 object-contain" />
              <span
                className="text-xl font-bold tracking-widest uppercase text-[#C9A227]"
                style={{ fontFamily: 'Cinzel Decorative, serif' }}
              >
                SHASHTI
              </span>
            </div>
            <p className="text-[#E3C567] text-sm leading-relaxed">
              Your trusted partner for premium pooja products and exclusive business opportunities.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-[#FBF4E6] font-bold uppercase tracking-widest text-sm">Quick Links</h3>
            <ul className="space-y-2">
              {['Home', 'Why Partner', 'Benefits', 'Apply'].map((link) => (
                <li key={link}>
                  <a
                    href={`#${link.toLowerCase().replace(' ', '-')}`}
                    className="text-[#E3C567] hover:text-[#F3E3B0] transition-colors duration-300 text-sm"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="text-[#FBF4E6] font-bold uppercase tracking-widest text-sm">Contact</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="tel:+919876543210"
                  className="text-[#E3C567] hover:text-[#F3E3B0] transition-colors duration-300 text-sm"
                >
                  +91 98765 43210
                </a>
              </li>
              <li>
                <a
                  href="mailto:sales@shashti.in"
                  className="text-[#E3C567] hover:text-[#F3E3B0] transition-colors duration-300 text-sm"
                >
                  sales@shashti.in
                </a>
              </li>
              <li>
                <a
                  href="https://www.shashti.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#E3C567] hover:text-[#F3E3B0] transition-colors duration-300 text-sm"
                >
                  www.shashti.in
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-[#C9A227] to-transparent mb-8" />

        {/* Copyright */}
        <div className="text-center">
          <p className="text-[#E3C567] text-sm">
            © {new Date().getFullYear()} Shashti Pooja Products. All rights reserved.
          </p>
          <p className="text-[#C9A227]/50 text-xs mt-2">
            Preferred Partner Program — Exclusive Business Opportunity
          </p>
        </div>
      </div>
    </footer>
  );
};
