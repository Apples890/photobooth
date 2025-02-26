import { FILTERS } from "@/lib/constants";
import { Button } from "@/components/ui/button";

interface FiltersProps {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
}

export function Filters({ activeFilter, onFilterChange }: FiltersProps) {
  return (
    <div>
      <h3 className="font-semibold mb-4">Filters</h3>
      <div className="grid grid-cols-2 gap-2">
        {FILTERS.map((filter) => (
          <Button
            key={filter.id}
            variant={activeFilter === filter.id ? "default" : "outline"}
            className="w-full"
            onClick={() => onFilterChange(filter.id)}
          >
            {filter.name}
          </Button>
        ))}
      </div>
    </div>
  );
}
