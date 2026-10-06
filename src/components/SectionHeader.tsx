type SectionHeaderProps = {
  label: string;
  title: string;
};

export default function SectionHeader({ label, title }: SectionHeaderProps) {
  return (
    <header>
      <p className="text-label uppercase text-neon-pink">{label}</p>
      <h2 className="mt-4 text-h2 uppercase text-ink-900">{title}</h2>
    </header>
  );
}
