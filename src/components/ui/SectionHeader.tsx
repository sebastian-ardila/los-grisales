interface Props {
  /** Section index (decorative watermark), e.g. "01". */
  index?: string
  kickerIcon?: React.ReactNode
  kickerLabel: string
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
            className="pointer-events-none absolute inset-0 bg-cover bg-center opacity-[0.18]"
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

      {/* Top decorative gradient bar */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, var(--color-brand), transparent)' }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, var(--color-brand), transparent)' }}
      />

      {/* Decorative giant index watermark */}
      {index && (
        <span
          aria-hidden="true"
          className="font-display pointer-events-none absolute -top-4 right-4 select-none text-[8rem] font-bold leading-none tracking-tighter text-brand/[0.10] md:-top-8 md:right-10 md:text-[16rem]"
        >
          {index}
        </span>
      )}

      {/* Coffee-bean dot ornaments */}
      <div className="pointer-events-none absolute left-6 top-6 hidden gap-1.5 md:flex" aria-hidden="true">
        <span className="h-1.5 w-1.5 rounded-full bg-brand/50" />
        <span className="h-1.5 w-1.5 rounded-full bg-brand/35" />
        <span className="h-1.5 w-1.5 rounded-full bg-brand/20" />
      </div>
      <div className="pointer-events-none absolute left-6 bottom-6 hidden gap-1.5 md:flex" aria-hidden="true">
        <span className="h-1.5 w-1.5 rounded-full bg-brand/20" />
        <span className="h-1.5 w-1.5 rounded-full bg-brand/35" />
        <span className="h-1.5 w-1.5 rounded-full bg-brand/50" />
      </div>

      {/* Content */}
      <div className="relative flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-brand/30 bg-brand/10 px-4 py-1.5 backdrop-blur-sm">
          {kickerIcon && <span className="text-brand">{kickerIcon}</span>}
          <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-brand">
            {kickerLabel}
          </span>
        </div>

        {/* Divider with brand dot */}
        <div className="mt-5 flex items-center gap-3">
          <span className="h-px w-10 bg-brand/40" />
          <span className="h-1.5 w-1.5 rotate-45 bg-brand/70" />
          <span className="h-px w-10 bg-brand/40" />
        </div>

        <h2 className="font-display mt-5 text-4xl font-bold leading-tight md:text-5xl lg:text-6xl">
          {title}
        </h2>

        {tagline && (
          <p className="mx-auto mt-4 max-w-xl text-sm italic opacity-70 md:text-base">{tagline}</p>
        )}
      </div>
    </header>
  )
}
