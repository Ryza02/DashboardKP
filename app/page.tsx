"use client";
import Spline3D from "@/components/spline3D";
import Link from "next/link";

// Tambahkan <link href="https://fonts.googleapis.com/css2?family=Pacifico&display=swap" rel="stylesheet" />
// di <Head> (app/layout.tsx atau _app.tsx) untuk font Pacifico

export default function Home() {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <Spline3D />
      <main className="relative z-10 flex flex-col items-center justify-center w-full px-4">
        <div
          className="w-full max-w-lg mx-auto flex flex-col items-center py-10 px-6 rounded-3xl"
          style={{
            background: "rgba(0,0,0,0.07)", // sangat transparan, biar text tetap jelas tapi spline tetap hidup
          }}
        >
          <h1
            className="text-5xl sm:text-6xl md:text-7xl mb-2 text-center font-bold"
            style={{
              color: "#fff",
              fontFamily: "'Poppins', cursive",
              letterSpacing: 2,
              textShadow: "0 3px 18px #6366f1cc, 0 1px 0 #18186260", // indigo-500 tailwind shadow
            }}
          >
            Welcome !
          </h1>
          <h2
            className="text-2xl font-bold mb-2 text-center"
            style={{
              color: "#fff",
              textShadow: "0 2px 10px #6366f199",
            }}
          >
            To Dashboard Analys.
          </h2>
          <p
            className="mb-6 text-center font-normal leading-relaxed"
            style={{
              color: "#fff",
              textShadow: "0 2px 8px #6366f180",
            }}
          >
            Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam <span className="font-bold" style={{ textShadow: "0 2px 6px #6366f180" }}>nonummy</span> nibh euismod tincidunt ut laoreet dolore magna aliquam erat.
          </p>
          <div className="flex justify-center w-full">
            <Link href="/login" passHref>
              <button
                className="px-8 py-2 rounded-full font-semibold text-base text-indigo-900 shadow-md
                  bg-white/30 border border-white/30
                  backdrop-blur-md
                  hover:bg-white/70 hover:shadow-lg transition-all duration-200"
                style={{
                  boxShadow: "0 4px 18px 0 #6366f155",
                }}
              >
                Login/Register
              </button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
