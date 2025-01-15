import glassTypesUrl from '../data/GLASS_TYPES.csv?url';

export interface GlassType {
  name: string;
}

// Cache the loaded glass types to avoid parsing the CSV on every search
let cachedGlassTypes: GlassType[] | null = null;

export async function loadGlassTypes(): Promise<GlassType[]> {
  // Return cached results if available
  if (cachedGlassTypes) {
    return cachedGlassTypes;
  }

  try {
    // Fetch the CSV file
    const response = await fetch(glassTypesUrl);
    const data = await response.text();
    console.log('Fetched CSV data:', data.substring(0, 100));

    // Split into lines and filter out empty lines
    const lines = data.split('\n').filter(line => line.trim() !== '');
    console.log('First 5 lines:', lines.slice(0, 5));
    
    // Skip the header row and extract only the glass names from the first column
    cachedGlassTypes = lines
      .slice(1) // Skip header row
      .map(line => {
        const columns = line.split(',');
        const name = columns[0].trim();
        return { name };
      })
      .filter(type => type.name !== ''); // Filter out any empty names
    
    console.log('Final glass types:', cachedGlassTypes);
    return cachedGlassTypes;
  } catch (error) {
    console.error('Error loading glass types:', error);
    return [];
  }
}

export async function findMatchingGlassTypes(query: string): Promise<GlassType[]> {
  if (!query.trim()) {
    return [];
  }

  const glassTypes = await loadGlassTypes();
  const normalizedQuery = query.toLowerCase().trim();
  
  const matches = glassTypes.filter(type => 
    type.name.toLowerCase().includes(normalizedQuery)
  );
  
  console.log(`Search query: "${normalizedQuery}" found ${matches.length} matches:`, matches);
  return matches.slice(0, 10);
} 