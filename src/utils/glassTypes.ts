import glassTypesUrl from '../data/GLASS_TYPES.csv?url';

export interface GlassType {
  name: string;
}

// Cache the loaded glass types to avoid parsing the CSV on every search
let cachedGlassTypes: GlassType[] | null = null;

export async function loadGlassTypes(): Promise<GlassType[]> {
  // Return cached results if available
  if (cachedGlassTypes) {
    console.log('Returning cached glass types:', cachedGlassTypes.length);
    return cachedGlassTypes;
  }

  try {
    // Fetch the CSV file
    const response = await fetch(glassTypesUrl);
    const data = await response.text();
    console.log('Raw CSV data:', data);

    // Split into lines and filter out empty lines
    const lines = data.split('\n').filter(line => line.trim() !== '');
    console.log('Number of lines:', lines.length);
    
    // Skip the header row and extract only the glass names from the first column
    cachedGlassTypes = lines
      .slice(1) // Skip header row
      .map(line => {
        const name = line.split(',')[0].trim();
        return { name };
      })
      .filter(type => type.name !== '') // Filter out any empty names
      .sort((a, b) => a.name.localeCompare(b.name)); // Sort alphabetically
    
    console.log('Loaded glass types:', cachedGlassTypes);
    return cachedGlassTypes;
  } catch (error) {
    console.error('Error loading glass types:', error);
    return [];
  }
}

export async function findMatchingGlassTypes(query: string): Promise<GlassType[]> {
  // If query is empty, return all glass types
  const glassTypes = await loadGlassTypes();
  
  if (!query.trim()) {
    return glassTypes;
  }

  const normalizedQuery = query.toLowerCase().trim();
  const matches = glassTypes.filter(type => 
    type.name.toLowerCase().includes(normalizedQuery)
  );
  
  console.log(`Search query: "${normalizedQuery}" found ${matches.length} matches`);
  return matches.slice(0, 10);
} 