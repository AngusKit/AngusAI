import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover.tsx';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command.tsx';
import type { AvailableResourceItem } from '../hooks/useAvailableResources.ts';

/** 资源选择 Combobox（搜索框与下拉选项合并） */
export function ResourceSelectCombobox({
  selectedResourceId,
  setSelectedResourceId,
  resourceSearchKeyword,
  setResourceSearchKeyword,
  availableResources,
  resourcesLoading,
}: {
  selectedResourceId: string;
  setSelectedResourceId: (v: string) => void;
  resourceSearchKeyword: string;
  setResourceSearchKeyword: (v: string) => void;
  availableResources: AvailableResourceItem[];
  resourcesLoading: boolean;
}) {
  const [open, setOpen] = useState(false);
  const selectedName =
    availableResources.find((r) => r.id === selectedResourceId)?.name ?? '';

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-gray-900 dark:border-gray-700 dark:text-white dark:ring-offset-gray-800"
        >
          <span className={selectedName ? '' : 'text-muted-foreground'}>
            {selectedName || '选择或搜索资源...'}
          </span>
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[var(--radix-popover-trigger-width)] p-0 dark:bg-gray-800 dark:border-gray-700"
        align="start"
      >
        <Command
          shouldFilter={false}
          className="rounded-lg border-0 bg-transparent dark:bg-transparent"
        >
          <CommandInput
            placeholder="输入关键字搜索..."
            value={resourceSearchKeyword}
            onValueChange={setResourceSearchKeyword}
            className="dark:bg-gray-900 dark:border-gray-700"
          />
          <CommandList>
            <CommandEmpty>
              {resourcesLoading ? '加载中...' : '无匹配结果'}
            </CommandEmpty>
            <CommandGroup>
              {availableResources.map((resource) => {
                const Icon = resource.icon;
                return (
                  <CommandItem
                    key={resource.id}
                    value={resource.id}
                    onSelect={() => {
                      setSelectedResourceId(resource.id);
                      setOpen(false);
                    }}
                    className="dark:text-gray-200 dark:hover:bg-gray-700 dark:hover:text-white"
                  >
                    <Icon className="mr-2 h-4 w-4" />
                    {resource.name}
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
