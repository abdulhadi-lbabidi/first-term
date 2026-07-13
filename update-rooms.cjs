const fs = require('fs');
const file = 'd:/projects/vercel-hotels/src/pages/Rooms.tsx';
let content = fs.readFileSync(file, 'utf8');

// Add List import
content = content.replace(
  "import { SlidersHorizontal, LayoutGrid, Grid } from 'lucide-react';",
  "import { SlidersHorizontal, LayoutGrid, Grid, List as ListIcon } from 'lucide-react';"
);

// Update state type
content = content.replace(
  "const [cols, setCols] = useState<'grid-2' | 'grid-3'>('grid-3');",
  "const [cols, setCols] = useState<'grid-2' | 'grid-3' | 'list'>('grid-3');"
);

// Add List button to layout switcher
const grid3Button = `              <Button
                type="button"
                variant="ghost"
                size="icon"
                title={currentLang === 'ar' ? 'عرض 3 أعمدة' : '3 Columns'}
                onClick={() => setCols('grid-3')}
                className={\`rounded-full transition-all duration-300 \${cols === 'grid-3'
                  ? 'bg-primary text-white shadow-sm hover:bg-primary hover:text-white'
                  : 'text-muted hover:text-ink dark:hover:text-canvas hover:bg-transparent'
                  }\`}
              >
                <Grid className="w-4 h-4" />
              </Button>`;
              
const listButton = `              <Button
                type="button"
                variant="ghost"
                size="icon"
                title={currentLang === 'ar' ? 'عرض قائمة' : 'List View'}
                onClick={() => setCols('list')}
                className={\`rounded-full transition-all duration-300 \${cols === 'list'
                  ? 'bg-primary text-white shadow-sm hover:bg-primary hover:text-white'
                  : 'text-muted hover:text-ink dark:hover:text-canvas hover:bg-transparent'
                  }\`}
              >
                <ListIcon className="w-4 h-4" />
              </Button>`;

content = content.replace(grid3Button, grid3Button + '\n' + listButton);

// Update grid class for loading
content = content.replace(
  "className={`grid gap-6 ${cols === 'grid-3' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-2 lg:grid-cols-2'}`}",
  "className={`grid gap-6 ${cols === 'list' ? 'grid-cols-1' : cols === 'grid-3' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-2 lg:grid-cols-2'}`}"
);

// Update grid class for rooms
content = content.replace(
  "className={`grid gap-6 ${cols === 'grid-3' ? (showFilters ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1 md:grid-cols-3 lg:grid-cols-4') : (showFilters ? 'grid-cols-2 lg:grid-cols-2' : 'grid-cols-2 lg:grid-cols-3')}`}",
  "className={`grid gap-6 ${cols === 'list' ? 'grid-cols-1' : cols === 'grid-3' ? (showFilters ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1 md:grid-cols-3 lg:grid-cols-4') : (showFilters ? 'grid-cols-2 lg:grid-cols-2' : 'grid-cols-2 lg:grid-cols-3')}`}"
);

// Pass layout to RoomCard
content = content.replace(
  '<RoomCard key={room.id} room={room} branch={branch} />',
  '<RoomCard key={room.id} room={room} branch={branch} layout={cols === "list" ? "list" : "grid"} />'
);

fs.writeFileSync(file, content, 'utf8');
console.log('Rooms.tsx updated');
