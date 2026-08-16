import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";

export function SearchBar({
  initialValue = "",
  className,
}: {
  initialValue?: string;
  className?: string;
}) {
  const [value, setValue] = useState(initialValue);
  const navigate = useNavigate();

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = value.trim();
    navigate({ to: "/", search: q ? { q } : {} });
  };

  return (
    <form onSubmit={submit} className={className} role="search">
      <div className="relative flex items-center">
        <Search className="pointer-events-none absolute left-3 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Search products…"
          aria-label="Search products"
          className="h-10 rounded-full border-border bg-secondary/60 pl-9 pr-20 text-sm"
        />
        {value ? (
          <button
            type="button"
            aria-label="Clear search"
            onClick={() => {
              setValue("");
              navigate({ to: "/", search: {} });
            }}
            className="absolute right-16 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        ) : null}
        <button
          type="submit"
          className="absolute right-1 h-8 rounded-full bg-primary px-3 text-xs font-bold text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Search
        </button>
      </div>
    </form>
  );
}