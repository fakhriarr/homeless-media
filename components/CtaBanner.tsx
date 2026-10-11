import SubscribeButton from "@/components/newsletter/SubscribeButton";
import { ArrowRightIcon } from "@/components/icons";

export default function CtaBanner() {
  return (
    <section id="berlangganan" className="relative mb-8 min-h-[280px] overflow-hidden rounded-3xl bg-brand-700 p-6 sm:p-8 md:grid md:grid-cols-2 md:items-center md:gap-8 md:p-12">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
          backgroundPosition: "0 0",
        }}
        aria-hidden="true"
      />
      <div className="relative z-10 flex flex-col">
        <h2 className="font-heading text-3xl font-extrabold tracking-tight leading-tight text-white sm:text-4xl lg:text-[44px]">
          Jangan Lewatkan
          <br />
          Artikel Menarik
        </h2>
        <p className="mt-4 max-w-md text-sm text-white/80 md:text-base">
          Berlangganan newsletter kami dan terima ringkasan artikel menarik setiap pekan.
        </p>
        <div className="mt-8">
          <SubscribeButton
            variant="banner"
            label="Berlangganan Sekarang"
            icon={<ArrowRightIcon className="h-5 w-5 transition-transform group-hover:translate-x-1" />}
            className="group inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-base font-medium text-brand-700 shadow-sm hover:bg-[#FFF7EE] focus-visible:ring-2 focus-visible:ring-white/40"
          />
        </div>
      </div>

      <div className="pointer-events-none relative z-0 hidden sm:block" aria-hidden="true">
        <div className="relative mx-auto h-[240px] w-full max-w-[320px] md:absolute md:-bottom-10 md:right-6 md:h-[320px] md:max-w-[420px] lg:right-10">
          <div className="absolute -bottom-4 left-4 w-[220px] -rotate-6 rounded-2xl bg-white p-4 shadow-2xl md:-bottom-6 md:left-0 md:w-[280px]">
            <div className="flex items-center gap-2">
              <img src="/logo.png" alt="JelajahRasa" className="h-5 w-auto" />
              <span className="text-xs font-medium text-zinc-500">Ringkasan Mingguan</span>
            </div>
            <div className="mt-3 h-24 w-full rounded-lg bg-[#FFF7EE] md:h-32" />
            <div className="mt-3 space-y-1.5">
              <div className="h-2 w-3/4 rounded-full bg-[#F3E9DF]" />
              <div className="h-2 w-full rounded-full bg-[#F3E9DF]" />
              <div className="h-2 w-5/6 rounded-full bg-[#F3E9DF]" />
            </div>
          </div>
          <div className="absolute -top-2 right-0 w-[220px] rotate-6 rounded-2xl bg-white p-4 shadow-2xl md:-top-4 md:w-[280px]">
            <div className="flex items-center gap-2">
              <img src="/logo.png" alt="JelajahRasa" className="h-5 w-auto" />
              <span className="text-xs font-medium text-zinc-500">Newsletter JelajahRasa</span>
            </div>
            <div className="mt-3 h-20 w-full rounded-lg bg-[#F3E9DF]/60 md:h-24" />
            <div className="mt-3 space-y-1.5">
              <div className="h-2 w-4/5 rounded-full bg-[#F3E9DF]" />
              <div className="h-2 w-2/3 rounded-full bg-[#F3E9DF]" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}