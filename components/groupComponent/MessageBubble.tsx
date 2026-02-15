import { Card, CardContent } from "@/components/ui/card";

type MessageBubbleProps = {
  pesan: string;
  nama: string;
  konfirmasi: "Hadir" | "Tidak Hadir" | "Ragu";
};

export function MessageBubble({ pesan, nama, konfirmasi }: MessageBubbleProps) {
  return (
    <div className="flex flex-col items-start gap-3">
      <Card
        className="
    relative
    bg-[#E6CFA9]
    border-none
    rounded-md
    shadow-sm
    max-w-[85%]

    before:content-['']
    before:absolute
    before:left-3
    before:-bottom-2
    before:w-0
    before:h-0
    before:border-l-10
    before:border-r-20
    before:border-t-13
    before:border-l-transparent
    before:border-r-transparent
    before:border-t-[#E6CFA9]
  "
      >
        <CardContent className="px-5 py-1 text-[#2E0808] font-aleo leading-relaxed">
          {pesan}
        </CardContent>
      </Card>

      <div className="mt-1 ml-2 text-sm text-[#E6CFA9]/90 font-aleo">
        <span className="font-semibold">{nama}</span>, {konfirmasi}
      </div>
    </div>
  );
}
