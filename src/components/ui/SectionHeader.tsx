interface Props {
  /** Section index (decorative watermark), e.g. "01". */
  index?: string
  kickerIcon?: React.ReactNode
  kickerLabel?: string
  title: string
  tagline?: string
  /** Optional backdrop image URL — rendered very subtly behind. */
  backdrop?: string
}

export default function SectionHeader({ index, kickerIcon, kickerLabel, title, tagline, backdrop }: Props) {
  return (
    <header className="relative mb-14 overflow-hidden rounded-3xl border border-brand/15 px-4 py-14 md:mb-16 md:py-20">
      {/* Backdrop image */}
      {backdrop && (
        <>
          <div
            className="pointer-events-none absolute inset-0 bg-cover bg-top opacity-[0.18]"
            style={{ backgroundImage: `url(${backdrop})` }}
            aria-hidden="true"
          />
          {/* Soft white wash so text stays readable */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                'radial-gradient(ellipse at center, rgba(245,239,223,0.55) 0%, rgba(245,239,223,0.85) 70%, rgba(245,239,223,1) 100%)',
            }}
            aria-hidden="true"
          />
        </>
      )}

      {/* Decorative giant index watermark */}
      {index && (
        <span
          aria-hidden="true"
          className="font-display pointer-events-none absolute -top-4 right-4 select-none text-[8rem] font-bold leading-none tracking-tighter text-brand/[0.10] md:-top-8 md:right-10 md:text-[16rem]"
        >
          {index}
        </span>
      )}

      {/* Content */}
      <div className="relative flex flex-col items-center text-center">
        {kickerLabel && (
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand/30 bg-brand/10 px-4 py-1.5 backdrop-blur-sm">
            {kickerIcon && <span className="text-brand">{kickerIcon}</span>}
            <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-brand">
              {kickerLabel}
            </span>
          </div>
        )}

        <h2 className="font-display text-5xl font-bold leading-[1.05] tracking-tight text-brand md:text-7xl lg:text-[6rem]">
          {title}
        </h2>

        {tagline && (
          <p className="mx-auto mt-5 max-w-2xl text-sm italic opacity-70 md:text-base lg:text-lg">{tagline}</p>
        )}
      </div>
    </header>
  )
}
