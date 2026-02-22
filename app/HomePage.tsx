"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import Image from "next/image";

export default function HomePage() {
  const router = useRouter();
  const [namaTamu, setNamaTamu] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [isTransitioning, setIsTransitioning] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);

  const flowerTopRef = useRef<HTMLImageElement>(null);
  const flowerBottomRef = useRef<HTMLImageElement>(null);

  const lineMobile1 = useRef<HTMLImageElement>(null);
  const lineMobile2 = useRef<HTMLImageElement>(null);

  const lineDesk1 = useRef<HTMLImageElement>(null);
  const lineDesk2 = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    tl.fromTo(
      cardRef.current,
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 1 },
    )

      .fromTo(
        logoRef.current,
        { opacity: 0, y: -20, scale: 0.9 },
        { opacity: 1, y: 0, scale: 1, duration: 1 },
        "-=0.6",
      )

      .fromTo(
        flowerTopRef.current,
        { opacity: 0, y: -40, scale: 0.9 },
        { opacity: 1, y: 0, scale: 1, duration: 1.2 },
        "-=0.8",
      )

      .fromTo(
        flowerBottomRef.current,
        { opacity: 0, y: 40, scale: 0.9 },
        { opacity: 1, y: 0, scale: 1, duration: 1.2 },
        "-=1",
      );

    gsap.fromTo(
      [lineMobile1.current, lineMobile2.current],
      { opacity: 0, rotate: -10, scale: 0.95 },
      {
        opacity: 0.6,
        rotate: 0,
        scale: 1,
        duration: 1.2,
        stagger: 0.2,
        ease: "power2.out",
      },
    );

    gsap.fromTo(
      [lineDesk1.current, lineDesk2.current],
      { opacity: 0, rotate: -10, scale: 0.95 },
      {
        opacity: 0.4,
        rotate: 0,
        scale: 1,
        duration: 1.2,
        stagger: 0.2,
        ease: "power2.out",
      },
    );
  }, []);

  useEffect(() => {
    router.prefetch(`/undangan?nama=${namaTamu}`);
  }, []);

  const handleEnter = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);

    gsap.to(containerRef.current, {
      y: "-100%",
      duration: 1.3,
      ease: "power4.inOut",
      onComplete: () => {
        router.push(`/undangan`);
      },
    });
  };

  useEffect(() => {
    const savedName = localStorage.getItem("guestName");
    if (savedName) {
      setNamaTamu(savedName);
      setIsSubmitted(true);
    } else {
      setIsModalOpen(true);
    }
  }, []);

  const handleSubmitNama = () => {
    if (namaTamu.trim() !== "") {
      localStorage.setItem("guestName", namaTamu);
      setIsSubmitted(true);
      setIsModalOpen(false);
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-screen overflow-hidden bg-[#662222] flex items-center justify-center p-4 z-10"
    >
      <Image
        ref={flowerTopRef}
        src="/assets/FlowerTop.svg"
        alt="bunga atas"
        width={400}
        height={400}
        className="absolute top-0 left-0 translate-x-[-10%] translate-y-[-10%] w-64 sm:w-96 pointer-events-none select-none"
      />

      <Image
        ref={flowerBottomRef}
        src="/assets/FlowerBottom.svg"
        alt="bunga bawah"
        width={400}
        height={400}
        className="absolute bottom-0 right-0 translate-x-[10%] translate-y-[10%] w-64 sm:w-96 pointer-events-none select-none"
      />

      <Image
        src="/assets/Texture.svg"
        alt="tekstur"
        width={400}
        height={400}
        className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none opacity-70"
      />
      <Image
        src="/assets/Texture.svg"
        alt="tekstur"
        width={400}
        height={400}
        className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none opacity-70 rotate-180"
      />

      <Image
        ref={lineMobile1}
        src="/assets/Line.svg"
        alt="garis mobile"
        width={400}
        height={400}
        className="absolute inset-0 w-full h-full object-cover rotate-12 opacity-80 lg:hidden pointer-events-none"
      />

      <Image
        ref={lineMobile2}
        src="/assets/Line.svg"
        alt="garis mobile"
        width={400}
        height={400}
        className="absolute inset-0 w-full h-full object-cover -rotate-7 mt-80 opacity-80 lg:hidden pointer-events-none"
      />

      <Image
        ref={lineDesk1}
        src="/assets/Line.svg"
        alt="garis atas kanan"
        width={450}
        height={450}
        className="hidden lg:block absolute top-0 right-0 w-[420px] opacity-80 rotate-6 translate-x-[20%] translate-y-[-20%] pointer-events-none"
      />

      <Image
        ref={lineDesk2}
        src="/assets/Line.svg"
        alt="garis kiri bawah"
        width={450}
        height={450}
        className="hidden lg:block absolute bottom-0 left-0 w-[420px] opacity-80 -rotate-6 translate-x-[-20%] translate-y-[20%] pointer-events-none"
      />

      <div
        ref={logoRef}
        className="
    absolute 
    top-20 sm:top-24 lg:top-28
    flex flex-col items-center
    w-full
    pointer-events-none
  "
      >
        <Image
          src="/assets/Logo.svg"
          alt="logo Puri"
          width={96}
          height={96}
          className="drop-shadow-lg w-38 sm:w-36 lg:w-34 h-auto"
        />
      </div>

      <div
        ref={cardRef}
        className="relative bg-[#E6CFA9] text-[#6B2121] rounded-lg max-w-sm w-full px-6 py-4 mt-14 text-center space-y-1 border border-black/75"
      >
        <h2
          className="text-6xl font-bold"
          style={{ fontFamily: "Tangerine, cursive" }}
        >
          Danan & Oka
        </h2>

        <p
          className="text-xl font-semibold"
          style={{ fontFamily: "Crimson Text, serif" }}
        >
          Undangan Pawiwahan
        </p>

        <p className="text-lg" style={{ fontFamily: "Crimson Text, serif" }}>
          Kepada
        </p>

        <p className="text-lg" style={{ fontFamily: "Crimson Text, serif" }}>
          Bapak/Ibu/Saudara/i
        </p>

        {isSubmitted ? (
          <p
            className="text-3xl font-semibold"
            style={{ fontFamily: "Crimson Text, serif" }}
          >
            {namaTamu || "Tamu Undangan"}
          </p>
        ) : (
          <div className="flex flex-col gap-2 items-center">
            <input
              type="text"
              placeholder="Masukkan Nama Anda"
              value={namaTamu}
              onChange={(e) => setNamaTamu(e.target.value)}
              className="px-3 py-2 rounded border text-center w-full"
            />
          </div>
        )}

        <button
          onClick={handleEnter}
          className="px-6 py-3 mt-1 bg-[#6B2121] text-[#F5E6CB] rounded-lg font-medium shadow-md text-xl hover:bg-[#581818] transition tracking-wider"
          style={{ fontFamily: "Crimson Text, serif" }}
        >
          Buka Undangan
        </button>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[#E6CFA9] text-[#6B2121] rounded-lg p-6 w-[90%] max-w-sm text-center shadow-xl border border-black/70">
            <h2
              className="text-2xl font-semibold mb-4"
              style={{ fontFamily: "Crimson Text, serif" }}
            >
              Masukkan Nama Anda
            </h2>

            <input
              type="text"
              placeholder="Nama Lengkap"
              value={namaTamu}
              onChange={(e) => setNamaTamu(e.target.value)}
              className="w-full px-4 py-2 rounded border mb-4 text-center"
            />

            <button
              onClick={handleSubmitNama}
              className="w-full bg-[#6B2121] text-[#F5E6CB] py-2 rounded-lg hover:bg-[#581818] transition"
            >
              Simpan & Lanjutkan
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
