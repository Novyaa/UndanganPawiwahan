"use client";

import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { ScrollToPlugin } from "gsap/dist/ScrollToPlugin";
import Image from "next/image";
import { db } from "@/firebase";
import {
  collection,
  addDoc,
  Timestamp,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";
import { CustomRadioGroup } from "@/components/custom-radio-group";
import { MessageBubble } from "@/components/groupComponent/MessageBubble";

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

type Ucapan = {
  id: string;
  nama: string;
  pesan: string;
  konfirmasi: "Hadir" | "Tidak Hadir" | "Ragu";
};

export default function HalamanInti() {
  const [ucapanList, setUcapanList] = useState<Ucapan[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const textureRef = useRef<HTMLImageElement | null>(null);
  const flowerTopRef = useRef<HTMLImageElement | null>(null);
  const lineRef = useRef<HTMLImageElement | null>(null);
  const logoRef = useRef<HTMLImageElement | null>(null);
  const [namaTamu, setNamaTamu] = useState("");

  const containerRef = useRef<HTMLDivElement | null>(null);

  const [nama, setNama] = useState("");
  const [pesan, setPesan] = useState("");
  const [konfirmasi, setKonfirmasi] = useState<
    "Hadir" | "Tidak Hadir" | "Ragu" | ""
  >("");
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const toggleMusic = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play();
      setIsPlaying(true);
    }
  };

  useEffect(() => {
    const audio = audioRef.current;

    if (audio) {
      audio.volume = 0.5;
      audio
        .play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch(() => {
          console.log("Autoplay diblokir browser");
        });
    }
  }, []);
  useEffect(() => {
    const savedName = localStorage.getItem("guestName");
    if (savedName) {
      setNamaTamu(savedName);
      setNama(savedName);
    }
  }, []);
  /* ====================== SUBMIT ====================== */
  const handleKirim = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!konfirmasi) {
      alert("Mohon pilih kehadiran.");
      return;
    }

    if (pesan.trim().length < 5) {
      alert("Pesan minimal 5 karakter.");
      return;
    }

    setIsSubmitting(true);

    try {
      await addDoc(collection(db, "doaRestu"), {
        nama,
        pesan,
        konfirmasi,
        tanggal: Timestamp.now(),
      });

      setNama(namaTamu || "");
      setPesan("");
      setKonfirmasi("");

      alert("Terima kasih! Pesan berhasil dikirim 🙏");
    } catch (error) {
      console.error(error);
      alert("Gagal mengirim. Coba lagi nanti.");
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ====================== GSAP ====================== */
  useEffect(() => {
    if (!containerRef.current) return;

    const items = containerRef.current.querySelectorAll(".fade-up");

    items.forEach((item) => {
      gsap.set(item, { opacity: 1, y: 0 });

      ScrollTrigger.create({
        trigger: item,
        start: "top 85%",
        onEnter: () => {
          gsap.fromTo(
            item,
            { y: 30, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.8,
              ease: "power3.out",
            },
          );
        },
        once: true,
      });
    });

    return () => ScrollTrigger.getAll().forEach((t) => t.kill());
  }, []);

  /* ====================== SIMPLE ASSET INTRO ====================== */
  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: "power2.out" } });

    tl.fromTo(textureRef.current, { opacity: 0 }, { opacity: 0.7, duration: 1 })
      .fromTo(
        flowerTopRef.current,
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, duration: 0.8 },
        "-=0.6",
      )
      .fromTo(
        lineRef.current,
        { opacity: 0, x: 20 },
        { opacity: 0.8, x: 0, duration: 0.8 },
        "-=0.6",
      )
      .fromTo(
        logoRef.current,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.8 },
        "-=0.5",
      );
  }, []);

  /* ====================== COUNTDOWN ====================== */
  const targetDate = new Date("2026-03-20T14:00:00+08:00");

  const [countdown, setCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate.getTime() - now;

      if (distance <= 0) {
        clearInterval(timer);
        return;
      }

      setCountdown({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor(
          (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
        ),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  /* ====================== FIRESTORE REALTIME ====================== */
  useEffect(() => {
    const q = query(collection(db, "doaRestu"), orderBy("tanggal", "desc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        nama: doc.data().nama,
        pesan: doc.data().pesan,
        konfirmasi: doc.data().konfirmasi,
      }));

      setUcapanList(data);
      setIsLoadingData(false);
    });

    return () => unsubscribe();
  }, []);

  /* ====================== AUTO ISI NAMA ====================== */
  useEffect(() => {
    if (namaTamu) {
      setNama(namaTamu);
    }
  }, [namaTamu]);
  return (
    <div
      ref={containerRef}
      className="w-full min-h-screen overflow-y-auto scroll-smooth bg-[#662222] text-[#F5E6CB]"
    >
      <Image
        ref={textureRef}
        src="/assets/Texture.svg"
        alt="tekstur"
        width={400}
        height={400}
        className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none opacity-70 rotate-180"
      />
      <Image
        ref={flowerTopRef}
        src="/assets/FlowerTop.svg"
        alt="bunga atas"
        width={400}
        height={400}
        className="absolute top-0 left-0 translate-x-[-10%] translate-y-[-10%] w-64 sm:w-96 pointer-events-none select-none"
      />
      <Image
        ref={lineRef}
        src="/assets/Line.svg"
        alt="garis mobile"
        width={400}
        height={400}
        className="
    absolute 
    top-0 
    right-0 
    w-[75%]          /* agar tidak terlalu besar di mobile */
    max-w-[300px]    /* batas maksimal di HP */
    opacity-80 
    rotate-12 
    lg:hidden 
    pointer-events-none
  "
      />

      <section className="min-h-screen flex flex-col items-center pt-30 pb-7 px-6 relative">
        <Image
          ref={logoRef}
          src="/assets/LogoDO.svg"
          alt="logo"
          width={700}
          height={700}
          className="mb-6 fade-up"
        />
        <div>
          <h1 className="text-[68px] md:text-[128px] font-serif font-allison text-center text-[#E6CFA9]">
            Om Swastiastu
          </h1>
          <div className="flex items-center justify-center">
            <span className="text-lg font-aleo text-center text-[#E6CFA9] md:text-xl">
              Atas Asung Kertha Wara Nugraha Ida Sang Hyang Widhi Wasa/Tuhan
              Yang Maha Esa kami bermaksud mengundang Bapak/Ibu/Saudara/i pada
              Upacara Manusa Yadnya Pawiwahan Putra dan Putri kami.
            </span>
          </div>
        </div>

        <div className="relative py-10 text-center overflow-hidden">
          <span
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
               text-[238px] md:text-[300px]
               font-allison font-black text-white
               opacity-10 pb-72"
          >
            &
          </span>
          <div className="mt-10">
            <div className="relative mb-18 z-10">
              <span
                className="absolute inset-0 flex items-center justify-center
                 text-7xl md:text-9xl
                 font-allison text-yellow-400 opacity-45 mb-90"
              >
                Danan
              </span>
              <div>
                <h2 className="relative font-aleo text-xl text-[#F3D9B1] font-bold">
                  dr. ANAK AGUNG GD PUTRA DANANJAYA, M.Biomed, SpB
                </h2>

                <span className="relative font-aleo italic text-md text-[#E6C79C] mt-2">
                  Anak ketiga dari pasangan
                </span>

                <h2 className="relative font-aleo text-lg text-[#F3D9B1]">
                  Ir. Anak Agung Gede Dalem Sudarsana, MS & Anak Agung Istri
                  Kartini, SH
                </h2>

                <span className="relative font-aleo text-md text-[#E6C79C] mt-2">
                  Puri Kelodan, Banjar Tengah Kauh, Peliatan, Ubud
                </span>
              </div>
            </div>

            <div className="relative z-10 mt-20">
              <span
                className="absolute inset-0 flex items-center justify-center
                 text-7xl md:text-9xl
                 font-allison text-yellow-400 opacity-45 mb-90"
              >
                Oka
              </span>

              <h2 className="relative font-aleo text-xl text-[#F3D9B1] font-bold">
                dr. ANAK AGUNG AYU OKA KUSUMA DEWI, M.Biomed, SpB
              </h2>

              <span className="relative font-aleo italic text-md text-[#E6C79C] mt-2">
                Anak kedua dari pasangan
              </span>

              <h2 className="relative font-aleo text-lg text-[#F3D9B1]">
                dr. I Gusti Putu Gde Arsana, SpOG & dr. Anak Agung Ayu Mas
                Ranidewi, SpTHT-BKL, MARS
              </h2>

              <span className="relative font-aleo text-md text-[#E6C79C] mt-2">
                Jero Dauh Buah - Puri Peguyangan Denpasar
              </span>
            </div>
          </div>
          <div className="items-center justify-center flex mt-14 mb-3">
            <Image
              src="/assets/LeafLine.svg"
              alt="logo"
              width={260}
              height={260}
            />
          </div>
          <span className="font-aleo text-md text-[#E6C79C] mt-5 italic">
            Ihaiva stam ma vi yaustam, visvam ayur vyasnutam, kridantau putrair
            naptrbhih, modamanau sve grhe.
          </span>
          <h2 className="relative font-aleo text-2xl italic text-[#D4AF37] p-2 font-semibold">
            (Rg Veda X.85.42)
          </h2>
          <span className="font-aleo text-md text-[#E6C79C] italic">
            Wahai pasangan suami-isteri, semoga kalian tetap bersatu dan tidak
            pernah terpisahkan. Semoga kalian mencapai hidup penuh kebahagiaan,
            tinggal di rumah yang penuh kegembiraan bersama seluruh keturunanmu.
          </span>
          <div className="items-center justify-center flex mt-3">
            <Image
              src="/assets/LeafLine.svg"
              alt="logo"
              width={260}
              height={260}
            />
          </div>
        </div>
      </section>
      {/* ====================== INTI INFORMASI ====================== */}
      <section className="flex flex-col items-center justify-center px-6 py-5 text-center bg-gradient">
        <h2 className="text-[68px] md:text-[128px] font-serif font-allison text-center text-[#E6CFA9] mb-5">
          Waktu & Tempat
        </h2>

        {/* CARD UTAMA */}
        <div className="fade-up bg-[#E6CFA9] rounded-2xl shadow-lg p-8 max-w-md w-md mb-12">
          <div className="absolute top-[-25px] left-1/2 transform -translate-x-1/2">
            <Image
              src="/assets/IDOwithDO.svg"
              alt="logo"
              width={200}
              height={200}
            />
          </div>
          <h3 className="text-2xl font-aleo font-semibold mb-1 mt-10 text-[#613A3A]">
            PAWIWAHAN
          </h3>
          <p className="mb-1 font-aleo text-lg italic text-[#2E0808]">
            Jumat, 20 Maret 2026
          </p>
          <p className="mb-1 font-aleo text-lg italic text-[#2E0808]">
            14.00 - 18.00 WITA – Selesai
          </p>

          <p className="text-sm mb-1 font-aleo text-md italic font-light text-[#2E0808]">
            Bertempat di
          </p>
          <p className="mb-3 font-aleo text-md italic font-semibold text-[#2E0808]">
            Puri Kelodan, Banjar Tengah Kauh, Peliatan, Ubud
          </p>

          <button
            onClick={() =>
              window.open("https://maps.app.goo.gl/Dz9WkzgRv6DsvV376", "_blank")
            }
            className="px-6 py-3 bg-[#6B2121] text-[#FE6CFA9] rounded-lg mb-2 font-aleo text-lg hover:opacity-95 transition"
          >
            Map Lokasi Acara
          </button>
        </div>

        <div>
          <div className="items-center justify-center flex mt-2">
            <Image
              src="/assets/LeafLine.svg"
              alt="logo"
              width={260}
              height={260}
            />
          </div>
          <div className="text-md font-aleo italic text-[#E6C79C] text-aleo text-center">
            <p>
              Merupakan suatu kebahagiaan dan kehormatan bagi kami, apabila
              Bapak/ Ibu/ Saudara/i, berkenan hadir untuk memberikan doa restu.
            </p>
            <p className="mt-2">
              Atas kehadiran dan doa restunya kami ucapkan terimakasih.
            </p>
            <p className="mt-2 font-bold italic">kami yang berbahagia</p>
            <p className="mt-1 font-semibold italic">
              Kel. Ir. Anak Agung Gede Dalem Sudarsana, MS <br /> & Kel. dr. I
              Gusti Putu Gde Arsana, SpOG
            </p>
          </div>
        </div>
        {/* COUNTDOWN */}
        <div>
          <h3 className="text-[68px] font-allison fade-up mb-6 mt-12">
            Hari Bahagia
          </h3>
          <div className="fade-up grid grid-cols-4 gap-4">
            {[
              { label: "HARI", value: countdown.days },
              { label: "JAM", value: countdown.hours },
              { label: "MENIT", value: countdown.minutes },
              { label: "DETIK", value: countdown.seconds },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-[#E6CFA9] text-[#6B2121] rounded-sm px-4 py-3 min-w-20 "
              >
                <p className="text-[45px] font-besley">
                  {String(item.value).padStart(2, "0")}
                </p>
                <p className="text-xs tracking-widest font-semibold font-aleo">
                  {item.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ====================== MOHON DOA RESTU ====================== */}
      <section className="flex items-center justify-center px-6 py-12">
        <div className="max-w-xl w-full">
          <h2 className="text-[68px] md:text-[128px] font-serif font-allison text-center text-[#E6CFA9] ">
            Mohon Doa Restu
          </h2>
          <div className="items-center justify-center flex ">
            <Image
              src="/assets/LeafLine.svg"
              alt="logo"
              width={260}
              height={260}
            />
          </div>
          <form onSubmit={handleKirim} className="space-y-4 mt-8 font-aleo">
            <h2 className="text-[17px] text-[#E6CFA9]">Masukkan nama anda</h2>
            <input
              className="fade-up w-full p-3 rounded-md text-[#E6CFA9] bg-black/20 placeholder-[#F5E6CB]/50 focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
              placeholder="Silahkan masukkan nama..."
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              required
            />
            <h2 className="text-[17px] text-[#E6CFA9]">Berikan ucapanmu</h2>
            <textarea
              className="fade-up w-full p-3 rounded-md text-[#E6CFA9] bg-black/20 focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
              rows={4}
              placeholder="Masukkan ucapan anda..."
              value={pesan}
              onChange={(e) => setPesan(e.target.value)}
              required
            />

            {/* ====================== RADIO BUTTON ====================== */}
            <div>
              <p className="text-[17px] text-[#E6CFA9] mb-2">
                Kamu akan hadir?
              </p>
              <CustomRadioGroup
                options={[
                  { value: "Hadir", label: "Hadir" },
                  { value: "Tidak Hadir", label: "Tidak Hadir" },
                  { value: "Ragu", label: "Masih Ragu" },
                ]}
                value={konfirmasi}
                onChange={(value) =>
                  setKonfirmasi(value as "Hadir" | "Tidak Hadir" | "Ragu" | "")
                }
              />
            </div>

            <div className="flex justify-center">
              <button
                type="submit"
                disabled={isLoadingData}
                className="w-38 flex justify-center items-center py-2 bg-[#F5E6CB] text-[#6B2121] rounded-full font-aleo font-semibold hover:opacity-85"
              >
                {isLoadingData ? "Mengirim..." : "Kirim Ucapan"}
              </button>
            </div>
          </form>
        </div>
      </section>
      {/* UCAPAN DOA */}
      <section className="px-6 py-3">
        <h2 className="text-center text-[64px] font-allison text-[#E6CFA9]">
          Ucapan Doa
        </h2>
        <div className="items-center justify-center flex ">
          <Image
            src="/assets/LeafLine.svg"
            alt="logo"
            width={260}
            height={260}
          />
        </div>

        <div className="mt-10 max-h-[420px] overflow-y-auto pr-2 space-y-6 scrollbar-thin scrollbar-thumb-[#E6CFA9]/40 scrollbar-track-transparent">
          {isLoadingData ? (
            <p className="text-center text-[#E6CFA9]">Memuat ucapan...</p>
          ) : (
            ucapanList.map((item) => (
              <MessageBubble
                key={item.id}
                pesan={item.pesan}
                nama={item.nama}
                konfirmasi={item.konfirmasi}
              />
            ))
          )}
        </div>
      </section>
      {/* AUDIO */}
      <audio ref={audioRef} loop>
        <source src="/assets/Song.mp3" type="audio/mpeg" />
      </audio>

      {/* MUSIC BUTTON */}
      <button
        onClick={toggleMusic}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-[#E6CFA9] text-[#6B2121] shadow-lg flex items-center justify-center hover:scale-105 transition"
      >
       {isPlaying ? <Volume2 size={22} /> : <VolumeX size={22} />}
      </button>
    </div>
  );
}
