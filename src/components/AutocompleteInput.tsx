import React, { useState, useRef, useEffect } from 'react';
import { GlassType } from '../utils/glassTypes';

interface AutocompleteInputProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: (query: string) => Promise<GlassType[]>;
  placeholder?: string;
  className?: string;
  darkMode?: boolean;
}

const AutocompleteInput: React.FC<AutocompleteInputProps> = ({
  value,
  onChange,
  onSearch,
  placeholder,
  className = '',
  darkMode = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [inputValue, setInputValue] = useState(value.toUpperCase());
  const [suggestions, setSuggestions] = useState<GlassType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setInputValue(value.toUpperCase());
  }, [value]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex(prev => 
        prev < suggestions.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex(prev => prev > 0 ? prev - 1 : -1);
    } else if (e.key === 'Enter' && highlightedIndex >= 0) {
      e.preventDefault();
      onChange(suggestions[highlightedIndex].name.toUpperCase());
      setIsOpen(false);
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value.toUpperCase();
    setInputValue(newValue);
    onChange(newValue);
    setIsOpen(true);
    setHighlightedIndex(-1);
    
    try {
      setIsLoading(true);
      const results = await onSearch(newValue);
      setSuggestions(results);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div ref={wrapperRef} className="relative">
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onFocus={() => setIsOpen(true)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder?.toUpperCase()}
        style={{ textTransform: 'uppercase' }}
        className={`block w-full rounded-md border-gray-300 ${
          darkMode ? 'bg-gray-800 text-white' : 'bg-[#f7f6f2]'
        } text-sm ${className}`}
      />
      {isOpen && (isLoading || suggestions.length > 0) && (
        <ul className={`absolute z-10 w-full mt-1 max-h-60 overflow-auto rounded-md border ${
          darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'
        } shadow-lg`}>
          {isLoading ? (
            <li className="px-3 py-2 text-sm text-gray-500">Loading...</li>
          ) : (
            suggestions.map((suggestion, index) => (
              <li
                key={suggestion.name}
                onClick={() => {
                  onChange(suggestion.name.toUpperCase());
                  setInputValue(suggestion.name.toUpperCase());
                  setIsOpen(false);
                }}
                className={`px-3 py-2 text-sm cursor-pointer uppercase ${
                  index === highlightedIndex
                    ? darkMode
                      ? 'bg-gray-700 text-white'
                      : 'bg-gray-100'
                    : darkMode
                    ? 'text-white hover:bg-gray-700'
                    : 'hover:bg-gray-50'
                }`}
              >
                {suggestion.name.toUpperCase()}
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
};

export default AutocompleteInput; 