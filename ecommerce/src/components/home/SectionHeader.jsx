import Icon from '../shared/Icon.jsx';

export default function SectionHeader({ title, link = 'Voir tout' }) {
  return (
    <div className="flex items-center justify-between mb-3">
      <div className="font-['Barlow_Condensed'] text-[22px] font-black text-[#0d1b2a] flex items-center gap-2.5">
        <span className="w-1 h-5 bg-orange-500 rounded block" />
        {title}
      </div>
      <span className="text-[13px] text-orange-500 font-semibold cursor-pointer hover:underline flex items-center gap-1">
        {link} <Icon name="arrowRight" size={14} />
      </span>
    </div>
  );
}
