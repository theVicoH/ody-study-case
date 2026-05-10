import { useState } from "react";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from "./pagination";

import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof Pagination> = {
  title: "Components/UI/Pagination",
  component: Pagination,
  tags: ["autodocs"]
};

export default meta;

type Story = StoryObj<typeof Pagination>;

const TOTAL_PAGES = 5;

const PaginationDemo = (): React.JSX.Element => {
  const [page, setPage] = useState(1);

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>
            Previous
          </PaginationPrevious>
        </PaginationItem>
        {Array.from({ length: TOTAL_PAGES }, (_, i) => i + 1).map((p) => (
          <PaginationItem key={p}>
            <PaginationLink isActive={p === page} onClick={() => setPage(p)}>
              {p}
            </PaginationLink>
          </PaginationItem>
        ))}
        <PaginationItem>
          <PaginationNext onClick={() => setPage((p) => Math.min(TOTAL_PAGES, p + 1))} disabled={page === TOTAL_PAGES}>
            Next
          </PaginationNext>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export const Default: Story = {
  render: () => <PaginationDemo />
};

export const WithEllipsis: Story = {
  render: () => (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious>Previous</PaginationPrevious>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink>1</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationEllipsis />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink isActive>5</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationEllipsis />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink>10</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationNext>Next</PaginationNext>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
};
