
type Props = { pdf: string; title: string }

export default function Screen({ pdf, title }: Props) {
  return (
    <div className="h-screen w-screen bg-black text-white flex flex-col">
      <header className="h-12 flex items-center justify-between px-4 border-b border-white/10 bg-neutral-900/80 backdrop-blur">
        <div className="text-sm opacity-80">{title}</div>
        <a href="/" className="text-xs underline">Home</a>
      </header>
      <main className="flex-1 relative">
        <iframe
          title={title}
          src={`${pdf}#view=FitH`}
          className="absolute inset-0 w-full h-full"
          style={{ border: 'none' }}
        />
      </main>
    </div>
  )
}
