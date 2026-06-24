import TopBar from '@/components/shared/TopBar';

export default function DarkPageShell({ children }) {
  return (
    <div className="min-h-screen bg-[#111827] pb-12 text-white">
      <TopBar />
      {children}
    </div>
  );
}
