import React from "react";

import type { Meta, StoryObj } from "@storybook/react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";


const meta: Meta = {
  title: "Patterns/Data Display",
  parameters: { layout: "centered" }
};

export default meta;

type Story = StoryObj;

const orders = [
  { id: "#1042", table: "Table 4", items: "3 items", total: "€68.50", status: "Ready", time: "12:32" },
  { id: "#1041", table: "Table 7", items: "5 items", total: "€124.00", status: "In prep", time: "12:28" },
  { id: "#1040", table: "Table 2", items: "2 items", total: "€42.00", status: "Delivered", time: "12:15" },
  { id: "#1039", table: "Table 9", items: "4 items", total: "€89.20", status: "New", time: "12:45" }
];

const statusVariant: Record<string, "default" | "secondary" | "outline" | "destructive"> = {
  "New": "default",
  "In prep": "secondary",
  "Ready": "outline",
  "Delivered": "outline"
};

export const OrdersTable: Story = {
  render: () => (
    <div className="gap-md flex w-full max-w-[42rem] flex-col">
      <div className="flex items-center justify-between">
        <h2 className="typo-h4 text-foreground">Live orders</h2>
        <Badge variant="secondary">4 active</Badge>
      </div>
      <div className="border-border bg-card overflow-hidden rounded-xl border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order</TableHead>
              <TableHead>Table</TableHead>
              <TableHead>Items</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Time</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="typo-body-sm text-foreground font-medium">{order.id}</TableCell>
                <TableCell className="typo-body-sm text-muted-foreground">{order.table}</TableCell>
                <TableCell className="typo-body-sm text-muted-foreground">{order.items}</TableCell>
                <TableCell className="typo-body-sm text-foreground font-medium">{order.total}</TableCell>
                <TableCell>
                  <Badge variant={statusVariant[order.status] ?? "outline"}>{order.status}</Badge>
                </TableCell>
                <TableCell className="typo-body-sm text-muted-foreground">{order.time}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
};

export const KpiCards: Story = {
  render: () => (
    <div className="gap-md grid w-full max-w-[42rem] grid-cols-3">
      {[
        { label: "Revenue today", value: "€4,280", change: "+12.4%", positive: true },
        { label: "Orders", value: "47", change: "+8 vs yesterday", positive: true },
        { label: "Avg. ticket", value: "€91", change: "-3.2%", positive: false }
      ].map((kpi) => (
        <Card key={kpi.label} className="glass-card">
          <CardHeader className="pb-xs">
            <CardTitle className="typo-caption text-muted-foreground">{kpi.label}</CardTitle>
          </CardHeader>
          <CardContent className="gap-xs flex flex-col">
            <span className="typo-h2 text-foreground">{kpi.value}</span>
            <span className={`typo-caption ${kpi.positive ? "text-primary" : "text-destructive"}`}>
              {kpi.change}
            </span>
          </CardContent>
        </Card>
      ))}
    </div>
  )
};

export const Default: Story = KpiCards;
