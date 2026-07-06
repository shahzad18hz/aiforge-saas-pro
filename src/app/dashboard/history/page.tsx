"use client";

import { useState } from "react";
import { useHistory, useDeleteHistory } from "@/hooks";
import {
  Card,
  Badge,
  EmptyState,
  SkeletonTable,
  Modal,
} from "@/components/ui";
import { Button } from "@/components/ui/button";
import {
  PenTool,
  ShoppingBag,
  Share2,
  Mail,
  Search,
  Clock,
  Copy,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Eye,
  Filter,
} from "lucide-react";
import { formatDateTime, truncate, cn } from "@/lib/utils";
import { ToolType } from "@/types";
import { toast } from "sonner";

const TOOL_META = {
  blog: {
    label: "Blog",
    icon: PenTool,
    color: "text-violet-500",
    bg: "bg-violet-100 dark:bg-violet-950/30",
  },
  "product-description": {
    label: "Product",
    icon: ShoppingBag,
    color: "text-blue-500",
    bg: "bg-blue-100 dark:bg-blue-950/30",
  },
  "social-media": {
    label: "Social",
    icon: Share2,
    color: "text-pink-500",
    bg: "bg-pink-100 dark:bg-pink-950/30",
  },
  email: {
    label: "Email",
    icon: Mail,
    color: "text-orange-500",
    bg: "bg-orange-100 dark:bg-orange-950/30",
  },
  "seo-meta": {
    label: "SEO",
    icon: Search,
    color: "text-green-500",
    bg: "bg-green-100 dark:bg-green-950/30",
  },
};

const FILTERS = [
  { value: "", label: "All Tools" },
  { value: "blog", label: "Blog" },
  { value: "product-description", label: "Product" },
  { value: "social-media", label: "Social" },
  { value: "email", label: "Email" },
  { value: "seo-meta", label: "SEO" },
];

export default function HistoryPage() {
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState("");
  const [viewItem, setViewItem] = useState<{
    prompt: string;
    result: string;
    toolType: ToolType;
  } | null>(null);

  const { data, isLoading } = useHistory(page, filter || undefined);
  const deleteMutation = useDeleteHistory();

  const copy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Generation History</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {data?.pagination?.total ?? 0} total generations
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <Filter className="w-4 h-4 text-muted-foreground" />

        {FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => {
              setFilter(f.value);
              setPage(1);
            }}
            className={cn(
              "px-3 py-1.5 rounded-full text-sm font-medium transition-all",
              filter === f.value
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-accent hover:text-foreground"
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      <Card className="overflow-hidden">
        {isLoading ? (
          <div className="p-6">
            <SkeletonTable rows={8} />
          </div>
        ) : !data?.history?.length ? (
          <EmptyState
            icon={<Clock className="w-6 h-6" />}
            title="No history found"
            description={
              filter
                ? `No ${filter} generations yet.`
                : "Start generating content to see your history here."
            }
          />
        ) : (
          <>
            <div className="divide-y divide-border">
              {data.history.map((item: any) => {
                const meta =
                  TOOL_META[item.toolType as keyof typeof TOOL_META];
                const Icon = meta?.icon || Clock;

                return (
                  <div
                    key={item._id.toString()}
                    className="flex items-start gap-4 p-4 hover:bg-muted/30 transition-colors group"
                  >
                    <div
                      className={cn(
                        "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0",
                        meta?.bg
                      )}
                    >
                      <Icon className={cn("w-5 h-5", meta?.color)} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">
                        {truncate(item.prompt, 60)}
                      </p>

                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                        {truncate(item.result, 120)}
                      </p>

                      <div className="flex items-center gap-3 mt-2">
                        <Badge variant="secondary">{meta?.label}</Badge>

                        <span className="text-xs text-violet-500 font-medium">
                          {item.creditsUsed} cr
                        </span>

                        <span className="text-xs text-muted-foreground">
                          {formatDateTime(item.createdAt)}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                      <button
                        onClick={() =>
                          setViewItem({
                            prompt: item.prompt,
                            result: item.result,
                            toolType: item.toolType,
                          })
                        }
                        className="p-2 rounded-lg hover:bg-accent transition-colors text-muted-foreground hover:text-foreground"
                        title="View"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => copy(item.result)}
                        className="p-2 rounded-lg hover:bg-accent transition-colors text-muted-foreground hover:text-foreground"
                        title="Copy"
                      >
                        <Copy className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() =>
                          deleteMutation.mutate(item._id.toString())
                        }
                        className="p-2 rounded-lg hover:bg-destructive/10 transition-colors text-muted-foreground hover:text-destructive"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {data.pagination.pages > 1 && (
              <div className="flex items-center justify-between p-4 border-t border-border">
                <p className="text-sm text-muted-foreground">
                  Page {data.pagination.page} of {data.pagination.pages}
                </p>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => p - 1)}
                    disabled={page <= 1}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => p + 1)}
                    disabled={page >= data.pagination.pages}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </Card>

      <Modal
        open={!!viewItem}
        onClose={() => setViewItem(null)}
        title="Generation Details"
      >
        {viewItem && (
          <div className="space-y-4">
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">
                Prompt
              </p>

              <p className="text-sm bg-muted rounded-xl p-3">
                {viewItem.prompt}
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">
                Result
              </p>

              <div className="text-sm bg-muted rounded-xl p-3 max-h-72 overflow-y-auto whitespace-pre-wrap font-mono">
                {viewItem.result}
              </div>
            </div>

            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                copy(viewItem.result);
                setViewItem(null);
              }}
            >
              <Copy className="w-4 h-4 mr-2" />
              Copy Result
            </Button>
          </div>
        )}
      </Modal>
    </div>
  );
}