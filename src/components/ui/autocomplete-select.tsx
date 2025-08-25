import * as React from "react"
import { useState, useCallback, useRef, useEffect } from "react"
import { Check, ChevronsUpDown, Loader2, Search } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"

interface AutocompleteSelectItem {
  id: string
  name: string
  codigo?: string
  description?: string
}

interface AutocompleteSelectProps {
  items: AutocompleteSelectItem[]
  value?: string
  onValueChange: (value: string) => void
  onSearch: (query: string, page?: number, reset?: boolean) => void
  onLoadMore?: () => void
  placeholder?: string
  emptyMessage?: string
  disabled?: boolean
  loading?: boolean
  hasMore?: boolean
  error?: string | null
  className?: string
  searchPlaceholder?: string
  minSearchLength?: number
}

export function AutocompleteSelect({
  items,
  value,
  onValueChange,
  onSearch,
  // onLoadMore, // não precisamos mais do botão
  placeholder = "Selecione uma opção",
  emptyMessage = "Nenhum item encontrado",
  disabled = false,
  loading = false,
  hasMore = false,
  error = null,
  className,
  searchPlaceholder = "Buscar...",
  minSearchLength = 2,
}: AutocompleteSelectProps) {
  const [open, setOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [page, setPage] = useState(0)

  // refs para controle do observer e do viewport real de scroll
  const abortControllerRef = useRef<AbortController | null>(null)
  const scrollContainerRef = useRef<HTMLDivElement | null>(null)
  const viewportRef = useRef<HTMLElement | null>(null)
  const loadMoreRef = useRef<HTMLDivElement | null>(null)
  const pageRef = useRef(0) // evita múltiplos disparos para a mesma página

  // Debounce search
  const debouncedSearch = useCallback(
    debounce((query: string) => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
      abortControllerRef.current = new AbortController()

      // reset na paginação
      pageRef.current = 0
      setPage(0)
      onSearch(query, 0, true)
    }, 350),
    [onSearch]
  )

  // Handle search input change
  const handleSearchChange = (query: string) => {
    setSearchQuery(query)
    if (query.length >= minSearchLength || query.length === 0) {
      debouncedSearch(query)
    }
  }

  // Encontrar item selecionado
  const selectedItem = items.find(item => item.id === value)

  // Carregar dados iniciais ao abrir
  useEffect(() => {
    if (open && items.length === 0 && !loading) {
      pageRef.current = 0
      setPage(0)
      onSearch("", 0, true)
    }
  }, [open, items.length, loading, onSearch])

  // Quando o popover abrir, localizar o "viewport" interno do ScrollArea (Radix)
  useEffect(() => {
    if (!open) return
    // o ref aponta para a div root; procuramos o viewport interno da Radix
    if (scrollContainerRef.current) {
      const vp = scrollContainerRef.current.querySelector<HTMLElement>('[data-radix-scroll-area-viewport]')
      if (vp) {
        viewportRef.current = vp
      }
    }
  }, [open])

  // IntersectionObserver para "infinite scroll"
  useEffect(() => {
    const vp = viewportRef.current
    const sentinel = loadMoreRef.current

    if (!open || !vp || !sentinel) return

    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0]
        if (
          first.isIntersecting &&
          hasMore &&
          !loading
        ) {
          const nextPage = pageRef.current + 1
          pageRef.current = nextPage
          setPage(nextPage)
          onSearch(searchQuery, nextPage, false)
        }
      },
      {
        root: vp,           // importante: observar dentro do ScrollArea
        rootMargin: "200px" // dispara um pouco antes de chegar ao fim
      }
    )

    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [open, hasMore, loading, searchQuery, onSearch])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-full justify-between",
            !value && "text-muted-foreground",
            className
          )}
          disabled={disabled}
        >
          {selectedItem ? (
            <span className="truncate">
              {selectedItem.name}
              {selectedItem.codigo && (
                <span className="text-muted-foreground ml-1">
                  ({selectedItem.codigo})
                </span>
              )}
            </span>
          ) : (
            placeholder
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" style={{ width: "var(--radix-popover-trigger-width)" }}>
        <Command shouldFilter={false}>
          <div className="flex items-center border-b px-3">
            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <CommandInput
              placeholder={searchPlaceholder}
              value={searchQuery}
              onValueChange={handleSearchChange}
              className="flex-1"
            />
          </div>
          <CommandList>
            {/* ref no container para localizar o viewport interno */}
            <ScrollArea className="h-72" ref={scrollContainerRef}>
              <CommandGroup>
                {error && (
                  <div className="px-3 py-2 text-sm text-destructive">
                    {error}
                  </div>
                )}

                {searchQuery.length > 0 && searchQuery.length < minSearchLength && (
                  <CommandEmpty>
                    Digite pelo menos {minSearchLength} caracteres para buscar
                  </CommandEmpty>
                )}

                {(searchQuery.length === 0 || searchQuery.length >= minSearchLength) && (
                  <>
                    {items.length === 0 && !loading && !error && (
                      <CommandEmpty>{emptyMessage}</CommandEmpty>
                    )}

                    {items.map((item) => (
                      <CommandItem
                        key={item.id}
                        value={item.id}
                        onSelect={(currentValue) => {
                          onValueChange(currentValue === value ? "" : currentValue)
                          setOpen(false)
                        }}
                        className="cursor-pointer"
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            value === item.id ? "opacity-100" : "opacity-0"
                          )}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="truncate">
                            {item.name}
                            {item.codigo && (
                              <span className="text-muted-foreground ml-1">
                                ({item.codigo})
                              </span>
                            )}
                          </div>
                          {item.description && (
                            <div className="text-xs text-muted-foreground truncate">
                              {item.description}
                            </div>
                          )}
                        </div>
                      </CommandItem>
                    ))}

                    {loading && (
                      <div className="flex items-center justify-center py-4">
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        <span className="text-sm text-muted-foreground">
                          Carregando...
                        </span>
                      </div>
                    )}

                    {/* Sentinela para disparar o "load more" ao chegar perto do fim */}
                    <div ref={loadMoreRef} className="h-4" />
                  </>
                )}
              </CommandGroup>
            </ScrollArea>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

// Debounce utility
function debounce<T extends (...args: any[]) => void>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => func(...args), delay)
  }
}
