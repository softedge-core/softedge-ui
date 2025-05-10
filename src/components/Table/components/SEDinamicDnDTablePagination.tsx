import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/ui/button";

export default function CFDinamicDnDTablePagination({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  const getPages = () => {
    const pages = [];

    if (totalPages <= 9) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 5) {
        pages.push(...[1, 2, 3, 4, 5, 6, 7, "...", totalPages]);
      } else if (currentPage >= totalPages - 4) {
        pages.push(1, "...", ...Array.from({ length: 7 }, (_, i) => totalPages - 6 + i));
      } else {
        pages.push(
          1,
          "...",
          currentPage - 2,
          currentPage - 1,
          currentPage,
          currentPage + 1,
          currentPage + 2,
          "...",
          totalPages
        );
      }
    }

    return pages;
  };

  return (
    <>
    <div className="sticky left-0 z-30 w-full">
      <div className="relative w-full">
        {/* Kiri - Info Halaman */}
        <div className="absolute left-0 top-0 pt-2 pl-4 pb-4 text-xs z-20">
          Halaman <b>{currentPage}</b> dari <b>{totalPages}</b>
        </div>

        {/* Tengah - Navigasi Paging */}
        <div className="flex justify-center mt-6 z-10">
          <div className="flex items-center space-x-1">
            <Button
              size="xs2"
              variant="nov"
              disabled={currentPage === 1}
              onClick={() => onPageChange(currentPage - 1)}
            >
              <ChevronLeft className="h-4 w-4 font-semibold" />
            </Button>

            {getPages().map((page, index) =>
              page === "..." ? (
                <span
                  key={`ellipsis-${index}`}
                  className="px-2 text-slate-400 text-xs"
                >
                  ...
                </span>
              ) : (
                <Button
                  key={page}
                  size="xs2"
                  variant={page === currentPage ? "cureflow" : "ghost2"}
                  onClick={() => onPageChange(page as number)}
                >
                  <span className={`${page === currentPage ? "font-semibold" : ""}`}>
                    {page}
                  </span>
                </Button>
              )
            )}

            <Button
              size="xs2"
              variant="nov"
              disabled={currentPage === totalPages}
              onClick={() => onPageChange(currentPage + 1)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}