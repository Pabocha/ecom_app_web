import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function SectionHeader({ title, link = 'Voir tout', to = '/all-products' }) {
  const navigate = useNavigate();
  return (
    <div className="flex items-center justify-between mb-3">
      <div className="font-['Barlow_Condensed'] text-[22px] font-black text-[#0d1b2a] flex items-center gap-2.5">
        <span className="w-1 h-5 bg-orange-500 rounded block" />
        {title}
      </div>
      <span onClick={() => navigate(to)} className="text-[13px] text-orange-500 font-semibold cursor-pointer hover:underline flex items-center gap-1">
        {link} <ArrowRight size={14} />
      </span>
    </div>
  );
}
