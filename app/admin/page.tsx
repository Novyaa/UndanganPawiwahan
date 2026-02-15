"use client";

import { useEffect, useState } from "react";
import { db, auth, provider } from "@/firebase";
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  deleteDoc,
  doc,
} from "firebase/firestore";
import {
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";

type Ucapan = {
  id: string;
  nama: string;
  pesan: string;
  konfirmasi: "Hadir" | "Tidak Hadir" | "Ragu";
};

const ADMIN_EMAIL = "putusiwinovianti17@gmail.com"; 

export default function AdminPage() {
  const [data, setData] = useState<Ucapan[]>([]);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    if (!user || user.email !== ADMIN_EMAIL) return;

    const q = query(collection(db, "doaRestu"), orderBy("tanggal", "desc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const result = snapshot.docs.map((docItem) => ({
        id: docItem.id,
        nama: docItem.data().nama,
        pesan: docItem.data().pesan,
        konfirmasi: docItem.data().konfirmasi,
      }));

      setData(result);
    });

    return () => unsubscribe();
  }, [user]);

  const handleDelete = async (id: string) => {
    const confirmDelete = confirm("Yakin ingin menghapus pesan ini?");
    if (!confirmDelete) return;

    await deleteDoc(doc(db, "doaRestu", id));
  };

  const totalHadir = data.filter((d) => d.konfirmasi === "Hadir").length;
  const totalTidakHadir = data.filter(
    (d) => d.konfirmasi === "Tidak Hadir"
  ).length;
  const totalRagu = data.filter((d) => d.konfirmasi === "Ragu").length;

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-black text-white">Loading...</div>;
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white">
        <h1 className="mb-4 text-xl font-bold">Login Admin</h1>
        <button
          onClick={() => signInWithPopup(auth, provider)}
          className="bg-white text-black px-4 py-2 rounded"
        >
          Login dengan Google
        </button>
      </div>
    );
  }

  if (user.email !== ADMIN_EMAIL) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <h1>Akses Ditolak</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-10">
      <div className="flex justify-between mb-6">
        <h1 className="text-3xl font-bold">Dashboard RSVP</h1>
        <button
          onClick={() => signOut(auth)}
          className="bg-red-600 px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>

      <div className="mb-8 space-y-2">
        <p>Hadir: {totalHadir}</p>
        <p>Tidak Hadir: {totalTidakHadir}</p>
        <p>Ragu: {totalRagu}</p>
        <p className="font-bold">Total: {data.length}</p>
      </div>

      <div className="space-y-4">
        {data.map((item) => (
          <div key={item.id} className="border border-gray-700 p-4 rounded">
            <p className="font-semibold">{item.nama}</p>
            <p className="text-sm opacity-70">{item.konfirmasi}</p>
            <p className="mt-2">{item.pesan}</p>

            <button
              onClick={() => handleDelete(item.id)}
              className="mt-3 text-red-400"
            >
              Hapus
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
