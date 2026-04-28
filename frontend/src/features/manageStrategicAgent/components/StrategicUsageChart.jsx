"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useStrategicMetrics } from "../hooks/useStrategicMetrics"
import { Loader2 } from "lucide-react"

const chartConfig = {
  usage: {
    label: "Consumo (MB)",
    color: "var(--chart-1)",
  },
  clients: {
    label: "Clientes Únicos",
    color: "var(--chart-2)",
  },
}

export function StrategicUsageChart() {
  const { hourlyMetrics, loading, error } = useStrategicMetrics()
  const [metricType, setMetricType] = React.useState("usage")

  // Transform data for the chart
  const chartData = React.useMemo(() => {
    if (!hourlyMetrics) return []
    return hourlyMetrics.map((item, index) => ({
      hour: `H-${index}`,
      usage: item.total_connections * 15, // Mocking usage based on connections for trend
      clients: item.unique_clients,
      disconnections: item.total_disconnections,
    }))
  }, [hourlyMetrics])

  if (loading) {
    return (
      <Card className="flex items-center justify-center h-[350px]">
        <Loader2 className="animate-spin text-muted-foreground" />
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="flex items-center justify-center h-[350px] text-destructive">
        Error al cargar datos de consumo
      </Card>
    )
  }

  return (
    <Card className="col-span-12">
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1">
          <CardTitle>Análisis de Utilización de Datos</CardTitle>
          <CardDescription>
            Relación entre clientes únicos y volumen de tráfico (MB)
          </CardDescription>
        </div>
        <Select value={metricType} onValueChange={setMetricType}>
          <SelectTrigger className="w-[180px] rounded-lg sm:ml-auto">
            <SelectValue placeholder="Seleccionar métrica" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="usage">Consumo Total</SelectItem>
            <SelectItem value="clients">Clientes Únicos</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="fillUsage" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--chart-1)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--chart-1)" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="fillClients" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--chart-2)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--chart-2)" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="hour"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <YAxis hide />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dot" />}
            />
            <Area
              dataKey={metricType === "usage" ? "usage" : "clients"}
              type="natural"
              fill={metricType === "usage" ? "url(#fillUsage)" : "url(#fillClients)"}
              stroke={metricType === "usage" ? "var(--chart-1)" : "var(--chart-2)"}
              stackId="a"
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
