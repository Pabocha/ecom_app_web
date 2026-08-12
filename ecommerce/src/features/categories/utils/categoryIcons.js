import {
  Car,
  Cpu,
  Dumbbell,
  Factory,
  HeartPulse,
  House,
  Laptop,
  Package,
  Shirt,
  ShoppingBag,
  Smartphone,
  Store,
  Tags,
} from 'lucide-react';

const CATEGORY_ICON_MAP = {
  Car,
  Cpu,
  Dumbbell,
  Factory,
  HeartPulse,
  House,
  Laptop,
  Package,
  Shirt,
  ShoppingBag,
  Smartphone,
  Store,
  Tags,
};

const FALLBACK_COLOR = '#6b7280';
const FALLBACK_BG = '#f3f4f6';

export function getCategoryIcon(cat) {
  const Icon = CATEGORY_ICON_MAP[cat?.icon_name] || Package;
  return {
    Icon,
    color: cat?.icon_color || FALLBACK_COLOR,
    bg: cat?.bg_icon || FALLBACK_BG,
  };
}
