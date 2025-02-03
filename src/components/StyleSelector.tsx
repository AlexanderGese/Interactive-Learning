import React from 'react';
import { AdventureStyle } from '../types';
import {
  Sword,
  Rocket,
  Building2,
  Skull,
  Cpu,
  Cog,
  Scroll
} from 'lucide-react';

interface StyleOption {
  id: AdventureStyle;
  name: string;
  description: string;
  icon: React.ReactNode;
  bgImage: string;
}

const styles: StyleOption[] = [
  {
    id: 'fantasy',
    name: 'Fantasy',
    description: 'Dragons, magic, and medieval adventures',
    icon: <Sword className="w-6 h-6" />,
    bgImage: 'https://images.unsplash.com/photo-1514994960127-ed3ef9239d11?auto=format&fit=crop&q=80'
  },
  {
    id: 'scifi',
    name: 'Sci-Fi',
    description: 'Space exploration and futuristic technology',
    icon: <Rocket className="w-6 h-6" />,
    bgImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80'
  },
  {
    id: 'modern',
    name: 'Modern',
    description: 'Contemporary urban adventures',
    icon: <Building2 className="w-6 h-6" />,
    bgImage: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&q=80'
  },
  {
    id: 'apocalyptic',
    name: 'Apocalyptic',
    description: 'Survive in a post-apocalyptic world',
    icon: <Skull className="w-6 h-6" />,
    bgImage: 'https://images.unsplash.com/photo-1542281286-9e0a16bb7366?auto=format&fit=crop&q=80'
  },
  {
    id: 'cyberpunk',
    name: 'Cyberpunk',
    description: 'High tech, low life in neon-lit cities',
    icon: <Cpu className="w-6 h-6" />,
    bgImage: 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?auto=format&fit=crop&q=80'
  },
  {
    id: 'steampunk',
    name: 'Steampunk',
    description: 'Victorian-era technology and adventure',
    icon: <Cog className="w-6 h-6" />,
    bgImage: 'https://images.unsplash.com/photo-1534224039826-c7a0eda0e6b3?auto=format&fit=crop&q=80'
  },
  {
    id: 'historical',
    name: 'Historical',
    description: 'Real historical events and settings',
    icon: <Scroll className="w-6 h-6" />,
    bgImage: 'https://images.unsplash.com/photo-1599789197514-47270cd526b4?auto=format&fit=crop&q=80'
  }
];

interface StyleSelectorProps {
  selectedStyle: AdventureStyle;
  onStyleSelect: (style: AdventureStyle) => void;
}

export default function StyleSelector({ selectedStyle, onStyleSelect }: StyleSelectorProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {styles.map((style) => (
        <div
          key={style.id}
          onClick={() => onStyleSelect(style.id)}
          className={`group relative overflow-hidden rounded-xl cursor-pointer
                     border-2 transition-all duration-200
                     ${selectedStyle === style.id
                       ? 'border-indigo-500 shadow-lg scale-[1.02]'
                       : 'border-transparent hover:border-indigo-500/50'}`}
        >
          <div className="absolute inset-0">
            <img
              src={style.bgImage}
              alt={style.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/20" />
          </div>
          
          <div className="relative p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-white/10 backdrop-blur-sm rounded-lg text-white 
                            group-hover:bg-indigo-500/20 transition-colors duration-200">
                {style.icon}
              </div>
              <h3 className="text-xl font-semibold text-white">{style.name}</h3>
            </div>
            <p className="text-gray-200">{style.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}