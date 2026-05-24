"use client";

import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";

import { cn } from "../../lib/utils";

type TabsListVariant = "default" | "line";

const TabsVariantContext = React.createContext<TabsListVariant>("default");

function Tabs({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Root>) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      className={cn("flex flex-col gap-2", className)}
      {...props}
    />
  );
}

function TabsList({
  className,
  variant = "default",
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List> & {
  variant?: TabsListVariant;
}) {
  return (
    <TabsVariantContext.Provider value={variant}>
      <TabsPrimitive.List
        data-slot="tabs-list"
        data-variant={variant}
        className={cn(
          variant === "line"
            ? "inline-flex h-auto w-fit items-center justify-start gap-6 border-b border-border bg-transparent p-0 text-muted-foreground"
            : "bg-neutral-100 text-neutral-500 inline-flex min-h-9 w-fit items-stretch justify-center rounded-lg p-[3px] dark:bg-neutral-800 dark:text-neutral-400",
          className,
        )}
        {...props}
      />
    </TabsVariantContext.Provider>
  );
}

function TabsTrigger({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  const variant = React.useContext(TabsVariantContext);

  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      data-variant={variant}
      className={cn(
        variant === "line"
          ? "inline-flex h-auto items-center justify-center gap-1.5 rounded-none border-b-2 border-transparent bg-transparent px-0 pb-3 text-sm font-medium whitespace-nowrap text-muted-foreground shadow-none transition-[color,border-color] focus-visible:border-foreground focus-visible:ring-ring/50 focus-visible:outline-1 focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50 data-[state=active]:border-foreground data-[state=active]:text-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*=size-])]:size-4"
          : "data-[state=active]:bg-white dark:data-[state=active]:text-neutral-950 focus-visible:border-neutral-950 focus-visible:ring-neutral-950/50 focus-visible:outline-ring dark:data-[state=active]:border-neutral-200 dark:data-[state=active]:bg-neutral-200/30 text-neutral-950 dark:text-neutral-500 inline-flex min-h-8 min-w-0 flex-1 items-center justify-center gap-1.5 rounded-md border border-neutral-200 border-transparent px-2 py-1 text-center text-xs leading-tight font-medium whitespace-normal shadow-none transition-[color,box-shadow] focus-visible:ring-[3px] focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 sm:text-sm sm:whitespace-nowrap [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 dark:data-[state=active]:bg-neutral-950 dark:dark:data-[state=active]:text-neutral-50 dark:focus-visible:border-neutral-300 dark:focus-visible:ring-neutral-300/50 dark:dark:data-[state=active]:border-neutral-800 dark:dark:data-[state=active]:bg-neutral-800/30 dark:text-neutral-50 dark:dark:text-neutral-400 dark:border-neutral-800",
        className,
      )}
      {...props}
    />
  );
}

function TabsContent({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn("flex-1 outline-none", className)}
      {...props}
    />
  );
}

export { Tabs, TabsList, TabsTrigger, TabsContent };
