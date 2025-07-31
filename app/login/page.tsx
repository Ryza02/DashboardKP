'use client'
import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

export default function AuthPage() {
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [showPass, setShowPass] = useState(false)
  const [showPassReg, setShowPassReg] = useState(false)

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(110deg, #13131b 0%, #191927 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "'Inter', serif"
    }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.93, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [.6, 0, .3, 1] }}
        style={{
          background: "#181826",
          borderRadius: 22,
          boxShadow: "0 10px 40px #0007, 0 1px 2px #2225",
          padding: "42px 35px 32px 35px",
          minWidth: 340,
          maxWidth: 400,
          width: "94vw",
          color: "#e2e2e2",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div style={{ fontSize: "2rem", fontWeight: 700, fontFamily: "serif", color: "#ffd180", letterSpacing: 1 }}>Dashboard.</div>
        <AnimatePresence mode="wait">
          {mode === 'login' ? (
            <motion.div
              key="login"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.35, ease: [.55, 0, .3, 1] }}
              style={{ width: "100%" }}
            >
              <div style={{ color: "#e2e2e2", fontSize: "1.14rem", marginBottom: 28, marginTop: 12, fontWeight: 600 }}>Masuk ke Akun Anda</div>
              <form autoComplete="off" onSubmit={e => { e.preventDefault(); /* Login logic di sini */ }}>
                <div style={{ marginBottom: 18 }}>
                  <label style={labelStyle}>Email</label>
                  <input
                    type="email"
                    required
                    placeholder="email@contoh.com"
                    style={inputStyle}
                    autoFocus
                  />
                </div>
                <div style={{ marginBottom: 14 }}>
                  <label style={labelStyle}>Kata Sandi</label>
                  <div style={{ position: "relative" }}>
                    <input
                      type={showPass ? "text" : "password"}
                      required
                      placeholder="Kata Sandi"
                      style={{ ...inputStyle, paddingRight: 46 }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass(v => !v)}
                      style={showPassBtn}
                      tabIndex={-1}
                      aria-label={showPass ? "Sembunyikan sandi" : "Tampilkan sandi"}
                    >
                      {showPass ? "🙈" : "👁️"}
                    </button>
                  </div>
                </div>
                <motion.button
                  type="submit"
                  whileHover={{
                    scale: 1.045,
                    background: "linear-gradient(90deg, #ffd180 0%, #ffeab3 100%)",
                    color: "#232320",
                    boxShadow: "0 4px 30px #ffd18098"
                  }}
                  style={loginBtnStyle}
                >
                  Masuk
                </motion.button>
                <div style={{
                  marginTop: 20,
                  fontSize: "1.04rem",
                  color: "#bdbdbd",
                  textAlign: "center"
                }}>
                  Belum punya akun?{' '}
                  <a
                    style={{ color: "#ffd180", textDecoration: "underline", cursor: "pointer" }}
                    onClick={e => { e.preventDefault(); setMode('register') }}
                  >
                    Daftar sekarang
                  </a>
                </div>
              </form>
            </motion.div>
          ) : (
            <motion.div
              key="register"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.35, ease: [.55, 0, .3, 1] }}
              style={{ width: "100%" }}
            >
              <div style={{ color: "#e2e2e2", fontSize: "1.14rem", marginBottom: 28, marginTop: 12, fontWeight: 600 }}>Buat Akun Baru</div>
              <form autoComplete="off" onSubmit={e => { e.preventDefault(); /* Register logic di sini */ }}>
                <div style={{ marginBottom: 16 }}>
                  <label style={labelStyle}>Nama Lengkap</label>
                  <input
                    type="text"
                    required
                    placeholder="Nama Anda"
                    style={inputStyle}
                    autoFocus
                  />
                </div>
                <div style={{ marginBottom: 16 }}>
                  <label style={labelStyle}>Email</label>
                  <input
                    type="email"
                    required
                    placeholder="email@contoh.com"
                    style={inputStyle}
                  />
                </div>
                <div style={{ marginBottom: 16 }}>
                  <label style={labelStyle}>Kata Sandi</label>
                  <div style={{ position: "relative" }}>
                    <input
                      type={showPassReg ? "text" : "password"}
                      required
                      placeholder="Kata Sandi"
                      style={{ ...inputStyle, paddingRight: 46 }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassReg(v => !v)}
                      style={showPassBtn}
                      tabIndex={-1}
                      aria-label={showPassReg ? "Sembunyikan sandi" : "Tampilkan sandi"}
                    >
                      {showPassReg ? "🙈" : "👁️"}
                    </button>
                  </div>
                </div>
                <motion.button
                  type="submit"
                  whileHover={{
                    scale: 1.045,
                    background: "linear-gradient(90deg, #ffd180 0%, #ffeab3 100%)",
                    color: "#232320",
                    boxShadow: "0 4px 30px #ffd18098"
                  }}
                  style={loginBtnStyle}
                >
                  Daftar
                </motion.button>
                <div style={{
                  marginTop: 20,
                  fontSize: "1.04rem",
                  color: "#bdbdbd",
                  textAlign: "center"
                }}>
                  Sudah punya akun?{' '}
                  <a
                    style={{ color: "#ffd180", textDecoration: "underline", cursor: "pointer" }}
                    onClick={e => { e.preventDefault(); setMode('login') }}
                  >
                    Masuk di sini
                  </a>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
      {/* Responsive & custom styles */}
      <style>{`
        @media (max-width: 560px) {
          form { min-width: 90vw !important; }
          .login-card { padding: 28px 8vw 28px 8vw !important; }
        }
        input:focus {
          outline: 2px solid #ffd180;
          background: #191927;
        }
      `}</style>
    </div>
  )
}

const labelStyle: React.CSSProperties = {
  fontWeight: 600,
  fontSize: "1.05rem",
  color: "#ffd180",
  marginBottom: 7,
  marginLeft: 2,
  display: "block"
}
const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "10px 14px",
  borderRadius: 12,
  border: "1.6px solid #222230",
  fontSize: "1.1rem",
  marginTop: 2,
  background: "#16161d",
  color: "#ffd180",
  fontWeight: 600,
  transition: "all .18s cubic-bezier(.6,0,.3,1)",
  boxShadow: "0 1px 5px #0002",
  marginBottom: 0
}
const showPassBtn: React.CSSProperties = {
  position: "absolute",
  top: 8,
  right: 8,
  background: "none",
  border: "none",
  color: "#ffd180",
  fontWeight: 700,
  cursor: "pointer",
  fontSize: "1.1rem",
  opacity: 0.85
}
const loginBtnStyle: React.CSSProperties = {
  marginTop: 20,
  width: "100%",
  padding: "13px 0",
  borderRadius: 999,
  background: "linear-gradient(90deg, #ffd180 0%, #ffecb3 100%)",
  color: "#232320",
  fontWeight: 700,
  fontSize: "1.13rem",
  border: "none",
  boxShadow: "0 4px 16px #ffd18070",
  cursor: "pointer",
  transition: "all .22s cubic-bezier(.6,0,.35,1)",
  letterSpacing: 0.3
}
