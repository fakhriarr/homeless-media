import SubscribeButton from "@/components/newsletter/SubscribeButton";
import { MailIcon } from "@/components/icons";

export default function CtaBanner() {
  return (
    <section id="berlangganan" className="mb-8 overflow-hidden rounded-2xl bg-red-700">
      <div className="flex flex-col items-center gap-5 px-6 py-8 text-center sm:flex-row sm:justify-between sm:text-left">
        <div className="flex items-center gap-4">
          <span className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/15 sm:flex">
            <MailIcon className="h-6 w-6 text-white" />
          </span>
          <div>
            <h2 className="font-serif text-xl font-bold text-white sm:text-2xl">
              Jangan Lewatkan Berita Penting
            </h2>
            <p className="mt-1 text-sm text-red-100">
              Berlangganan newsletter kami dan terima ringkasan berita terbaik setiap pekan.
            </p>
          </div>
        </div>
        <div className="shrink-0">
          <SubscribeButton variant="banner" label="Berlangganan Sekarang" />
        </div>
      </div>
    </section>
  );
}