import React from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

// Future expansion locations along the New England to DC corridor
const expansionLocations = [
  {
    id: 1,
    name: 'Boston',
    state: 'MA',
    status: 'planned',
    estimatedOpeningYear: 2026,
    coordinates: { x: 78, y: 27 } // % coordinates on the map
  },
  {
    id: 2,
    name: 'New York City',
    state: 'NY',
    status: 'planned',
    estimatedOpeningYear: 2026,
    coordinates: { x: 65, y: 42 }
  },
  {
    id: 3,
    name: 'Philadelphia',
    state: 'PA',
    status: 'planned',
    estimatedOpeningYear: 2027,
    coordinates: { x: 55, y: 52 }
  },
  {
    id: 4,
    name: 'Washington',
    state: 'DC',
    status: 'planned',
    estimatedOpeningYear: 2027,
    coordinates: { x: 48, y: 67 }
  },
  {
    id: 5,
    name: 'Rochester',
    state: 'NY',
    status: 'open',
    openedYear: 2025,
    coordinates: { x: 43, y: 30 }
  },
  {
    id: 6,
    name: 'Albany',
    state: 'NY',
    status: 'planned',
    estimatedOpeningYear: 2026,
    coordinates: { x: 55, y: 32 }
  },
  {
    id: 7,
    name: 'Hartford',
    state: 'CT',
    status: 'planned',
    estimatedOpeningYear: 2027,
    coordinates: { x: 68, y: 33 }
  },
  {
    id: 8,
    name: 'Providence',
    state: 'RI',
    status: 'planned',
    estimatedOpeningYear: 2027,
    coordinates: { x: 76, y: 32 }
  }
];

export default function ExpansionMap() {
  return (
    <Card className="border-0 shadow-sm bg-gradient-to-br from-background to-muted">
      <CardHeader>
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight mb-2">Our Expansion Journey</h2>
          <p className="text-muted-foreground">
            Currently in Rochester, NY with planned expansion throughout the Northeast corridor
          </p>
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative w-full aspect-[4/3] bg-muted rounded-lg mb-6 overflow-hidden">
          {/* Map background - simplified US East Coast outline */}
          <svg 
            className="absolute inset-0 w-full h-full"
            viewBox="0 0 100 100"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Simplified path for East Coast outline */}
            <path
              d="M30,80 C35,75 40,65 45,60 C50,55 55,45 60,40 C65,35 70,30 75,25 C80,20 85,15 90,20 C85,25 80,30 75,35 C70,40 65,45 60,50 C55,55 50,65 45,70 C40,75 35,80 30,85 Z"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.5"
              opacity="0.5"
              strokeDasharray="1 1"
            />
            
            {/* Corridor path */}
            <path
              d="M40,75 Q55,50 80,25"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              opacity="0.5"
              strokeDasharray="2 2"
            />
            
            {/* Location markers */}
            {expansionLocations.map((location) => (
              <g key={location.id}>
                <circle
                  cx={location.coordinates.x}
                  cy={location.coordinates.y}
                  r={location.status === 'open' ? 1.5 : 1}
                  fill={location.status === 'open' ? 'hsl(var(--primary))' : 'hsl(var(--muted-foreground))'}
                  opacity={location.status === 'open' ? 1 : 0.7}
                />
                <text
                  x={location.coordinates.x + 2}
                  y={location.coordinates.y}
                  fontSize="2"
                  fill="currentColor"
                  textAnchor="start"
                  alignmentBaseline="middle"
                  fontWeight={location.status === 'open' ? 'bold' : 'normal'}
                >
                  {location.name}
                </text>
              </g>
            ))}
          </svg>
        </div>
        
        <div className="flex flex-wrap gap-2 justify-center">
          <Badge variant="default" className="bg-primary text-primary-foreground">
            Current Location
          </Badge>
          <Badge variant="outline">Future Location</Badge>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          {expansionLocations.map((location) => (
            <div key={location.id} className="border rounded-md p-3 bg-card">
              <div className="font-semibold">
                {location.name}, {location.state}
              </div>
              <div className="text-sm text-muted-foreground">
                {location.status === 'open' 
                  ? `Open since ${location.openedYear}`
                  : `Planned opening: ${location.estimatedOpeningYear}`
                }
              </div>
              {location.status === 'open' && (
                <Badge variant="default" className="mt-2 bg-primary text-primary-foreground">
                  Now Open
                </Badge>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}