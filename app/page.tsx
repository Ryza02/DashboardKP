'use client'
import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'

const NAV_LINKS = [
  { href: '#intro', label: 'Intro' },
  { href: '#about', label: 'About' },
]

export default function LandingPage() {
  const [active, setActive] = useState('#intro')
  const navRef = useRef<HTMLElement>(null)

  // Smooth scroll & navbar active section
  useEffect(() => {
    const handleScroll = () => {
      const offsets: { href: string; top: number }[] = NAV_LINKS.map(l => {
        const el = document.querySelector(l.href)
        if (!el) return { href: l.href, top: 0 }
        // Offset - navbar
        const y = (el as HTMLElement).getBoundingClientRect().top + window.scrollY - 80
        return { href: l.href, top: y }
      })
      const scrollY = window.scrollY
      // Aktif jika scroll >= top
      let found = '#intro'
      for (const o of offsets) {
        if (scrollY >= o.top - 16) found = o.href
      }
      setActive(found)
    }

    window.addEventListener('scroll', handleScroll)
    // Scroll smooth onclick
    const nav = navRef.current
    if (nav) {
      nav.querySelectorAll('a[data-nav]').forEach((a) => {
        a.addEventListener('click', e => {
          e.preventDefault()
          const href = a.getAttribute('href')!
          const el = document.querySelector(href)
          if (el) {
            const y = el.getBoundingClientRect().top + window.scrollY - 75
            window.scrollTo({ top: y, behavior: 'smooth' })
            setActive(href)
          }
        })
      })
    }
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div style={{
      background: "#0a0a11",
      minHeight: "100vh",
      color: "#e2e2e2",
      fontFamily: "'Inter', serif"
    }}>
      {/* Navbar */}
      <nav ref={navRef} style={navbarStyle}>
        <div style={logoStyle}>Dashboard.</div>
        <div style={navMenuStyle}>
          {NAV_LINKS.map(link =>
            <a
              key={link.href}
              href={link.href}
              data-nav
              style={{
                ...navLinkStyle,
                color: active === link.href ? "#FFD180" : "#ccc",
                fontWeight: active === link.href ? 700 : 500,
                borderBottom: active === link.href ? "2.5px solid #FFD180" : "2.5px solid transparent"
              }}
            >
              {link.label}
            </a>
          )}
          <motion.a
            href="/login"
            whileHover={{
              scale: 1.07,
              background: "linear-gradient(92deg,#ffeab3 0%,#ffd180 50%,#fffde0 100%)",
              color: "#111",
              boxShadow: "0 2px 24px #ffd18088"
            }}
            style={loginButtonStyle}
          >
            Login / Register
          </motion.a>
        </div>
      </nav>

      {/* Intro Section */}
      <motion.section
        id="intro"
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={introSectionStyle}
      >
        <div style={introLeftStyle}>
          <div style={introWelcomeStyle}>Welcome to</div>
          <h1 style={introTitleStyle}>Project<br />Dashboard</h1>
          <div style={introDescStyle}>
            PowerBI Dashboard Project — Visualisasi, monitoring, dan analisa data lebih mudah, modern, dan cepat!  
            Semua data terpusat, dengan akses multi-role: admin, manager, developer, tester, dan lainnya.
          </div>
          <ul style={socialListStyle}>
            <li><a href="#" style={socialStyle}>Sosmed1</a></li>
            <li><a href="#" style={socialStyle}>Sosmed2</a></li>
            <li><a href="#" style={socialStyle}>Sosmed3</a></li>
            <li><a href="#" style={socialStyle}>Sosmed4</a></li>
          </ul>
        </div>
        <div style={introImgWrapperStyle}>
          <img
            src="/images/intro-pic-primary.jpg"
            alt="Dashboard Preview"
            style={introImgStyle}
          />
        </div>
      </motion.section>

      {/* About Section */}
      <section id="about" style={aboutSectionStyle}>
        <div style={aboutContainerStyle}>
          <img
            src="/images/about-pic-primary.jpg"
            alt="Dashboard Features"
            style={aboutImgStyle}
          />
          <div>
            <div style={aboutTitleStyle}>About The Project</div>
            <p style={aboutTextStyle}>
              Project Dashboard adalah aplikasi monitoring & reporting berbasis web, terintegrasi dengan PowerBI dan database MySQL, dikembangkan menggunakan Next.js & CodeIgniter 4.
              <br /><br />
              <b>Fitur utama:</b>
              <ul style={{ marginLeft: 18, marginTop: 6, color: "#b3b3b3", fontSize: "1.07rem" }}>
                <li>• Login multi-role (admin, manager, tester, developer)</li>
                <li>• Manajemen user & perangkat</li>
                <li>• Pengujian & validasi device (with report export PDF)</li>
                <li>• Visualisasi data PowerBI</li>
                <li>• Riwayat aktivitas & notifikasi</li>
                <li>• Dashboard modern & responsive</li>
              </ul>
              <br />
              Sistem ini mendukung efisiensi workflow, pencatatan data, dan pelaporan kinerja tim secara terstruktur dan mudah digunakan.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="footer" style={footerStyle}>
        <div style={footerInnerStyle}>
          <div style={footerColStyle}>
            <div style={footerLogoStyle}>Dashboard.</div>
            <div style={footerTextStyle}>Project Magang 2025</div>
            <div style={footerTextStyle}>Universitas Jenderal Achmad Yani</div>
            <div style={footerTextStyle}>dashboard@example.com</div>
          </div>
          <div style={footerColStyle}>
            <div style={footerTitleStyle}>Useful Links</div>
            <div><a href="https://github.com" target="_blank" style={footerLinkStyle}>GitHub</a></div>
            <div><a href="https://nextjs.org" target="_blank" style={footerLinkStyle}>Next.js</a></div>
          </div>
          <div style={footerColStyle}>
            <div style={footerTitleStyle}>Contact</div>
            <div style={footerTextStyle}>Jl. Terusan Buah Batu No. 1, Bandung</div>
            <div style={footerTextStyle}>Telp: 0821-xxx-xxx</div>
          </div>
        </div>
        <div style={{
          color: "#777",
          marginTop: 32,
          fontSize: "1rem",
          textAlign: "center"
        }}>
          &copy; Project Dashboard 2025. Design by <a href="https://styleshout.com/" style={{ color: "#eee" }}>RizaRisma</a>
        </div>
      </footer>

      {/* Responsive CSS - inject style tag */}
      <style>{`
        html { scroll-behavior: smooth }
        @media (max-width: 1000px) {
          #intro {
            flex-direction: column !important;
            text-align: center;
            padding-left: 0 !important;
            padding-right: 0 !important;
          }
          #intro img {
            margin-top: 2rem;
            width: 95vw !important;
            max-width: 98vw !important;
          }
        }
        @media (max-width: 800px) {
          nav {
            flex-direction: column !important;
            gap: 12px;
            padding: 1rem 2vw !important;
            font-size: 1.05rem !important;
          }
          #about > div {
            flex-direction: column !important;
            text-align: center;
            gap: 32px !important;
          }
        }
        @media (max-width: 700px) {
          footer > div {
            flex-direction: column !important;
            align-items: center !important;
            gap: 22px !important;
          }
        }
      `}</style>
    </div>
  )
}

// --- Style Constants ---
const navbarStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "2rem 5vw 2rem 4vw",
  borderBottom: "1px solid #181828",
  fontSize: "1.35rem",
  background: "rgba(8,8,14,0.97)",
  position: "sticky",
  top: 0,
  zIndex: 50
}
const logoStyle: React.CSSProperties = {
  fontFamily: "serif",
  fontWeight: 700,
  fontSize: "2.2rem",
  color: "#e2e2e2",
  letterSpacing: 1.5
}
const navMenuStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center"
}
const navLinkStyle: React.CSSProperties = {
  color: "#ccc",
  marginRight: 24,
  textDecoration: "none",
  fontWeight: 500,
  fontSize: "1.13rem",
  transition: "all .22s cubic-bezier(.7,.2,.5,1)",
  position: "relative",
  paddingBottom: 2,
  borderBottom: "2.5px solid transparent"
}
const loginButtonStyle: React.CSSProperties = {
  background: "linear-gradient(90deg, #ffecb3 0%, #ffd180 100%)",
  color: "#1d1d1d",
  border: "none",
  borderRadius: "999px",
  padding: "0.65rem 2rem",
  fontWeight: 700,
  fontSize: "1.13rem",
  marginLeft: 35,
  boxShadow: "0 2px 12px 0 #ffd18080",
  textDecoration: "none",
  cursor: "pointer",
  transition: "all .23s cubic-bezier(.6,0,.35,1)",
  display: "inline-flex",
  alignItems: "center",
  letterSpacing: 0.2
}
const introSectionStyle: React.CSSProperties = {
  padding: "5vw 0 2vw 0",
  minHeight: 400,
  display: "flex",
  alignItems: "center",
  justifyContent: "center"
}
const introLeftStyle: React.CSSProperties = {
  flex: 1,
  paddingLeft: "6vw",
  minWidth: 350
}
const introWelcomeStyle: React.CSSProperties = {
  fontSize: "1.7rem",
  color: "#ffe57f",
  fontStyle: "italic",
  marginBottom: 8,
  letterSpacing: 0.8
}
const introTitleStyle: React.CSSProperties = {
  fontFamily: "serif",
  fontSize: "7vw",
  lineHeight: 0.95,
  color: "#ececec",
  marginBottom: 0,
  fontWeight: 600,
  textShadow: "0 6px 32px #0a0a1199"
}
const introDescStyle: React.CSSProperties = {
  margin: "3vw 0 0 0",
  fontSize: "1.4rem",
  maxWidth: 600,
  color: "#e2d8b5"
}
const socialListStyle: React.CSSProperties = {
  display: "flex",
  gap: 22,
  marginTop: 32,
  padding: 0,
  listStyle: "none"
}
const socialStyle: React.CSSProperties = {
  color: "#ffd180",
  background: "#161616",
  borderRadius: 14,
  padding: "5px 20px",
  fontWeight: 600,
  letterSpacing: 2,
  fontSize: "1.1rem",
  boxShadow: "0 2px 18px #0006",
  textDecoration: "none"
}
const introImgWrapperStyle: React.CSSProperties = {
  flex: 1,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  minWidth: 340
}
const introImgStyle: React.CSSProperties = {
  width: "75%",
  borderRadius: "2rem",
  boxShadow: "0 10px 40px rgba(0,0,0,0.6)",
  objectFit: "cover",
  maxHeight: 420
}
const aboutSectionStyle: React.CSSProperties = {
  padding: "6vw 0",
  background: "#191927"
}
const aboutContainerStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "6vw"
}
const aboutImgStyle: React.CSSProperties = {
  width: 320,
  borderRadius: "1.4rem",
  boxShadow: "0 10px 30px rgba(0,0,0,0.6)"
}
const aboutTitleStyle: React.CSSProperties = {
  fontSize: "2.3rem",
  color: "#ffd180",
  fontFamily: "serif",
  fontWeight: 700
}
const aboutTextStyle: React.CSSProperties = {
  fontSize: "1.15rem",
  margin: "1.5rem 0 0 0",
  color: "#e0e0e0",
  maxWidth: 620,
  lineHeight: 1.6
}
const footerStyle: React.CSSProperties = {
  padding: "3vw 6vw",
  borderTop: "1px solid #191922",
  background: "#13131b"
}
const footerInnerStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "row",
  gap: 40,
  alignItems: "flex-start",
  flexWrap: "wrap",
  justifyContent: "center"
}
const footerColStyle: React.CSSProperties = {
  minWidth: 190,
  marginBottom: 12
}
const footerLogoStyle: React.CSSProperties = {
  fontFamily: "serif",
  fontSize: "2rem",
  fontWeight: 700,
  marginBottom: 12,
  color: "#ffd180"
}
const footerTitleStyle: React.CSSProperties = {
  fontWeight: 700,
  fontSize: "1.08rem",
  marginBottom: 8,
  color: "#ffd180"
}
const footerTextStyle: React.CSSProperties = {
  color: "#e2e2e2",
  marginBottom: 5
}
const footerLinkStyle: React.CSSProperties = {
  color: "#ffd180",
  textDecoration: "none"
}
