"use client";

import { RotateCcw } from "lucide-react";
import { Container } from "@/shared/components/container";
import { EmptyState } from "@/shared/components/empty-state";
import { Button } from "@/shared/components/ui/button";

/** Route-level error boundary: never leave the user on a blank screen. */
export default function RouteError({ retry }: { retry: () => void }) {
  return (
    <Container className="flex flex-1 items-center justify-center py-16">
      <EmptyState
        title="Algo saiu do forno errado"
        description="Ocorreu um erro inesperado ao carregar a página. Tente novamente — se persistir, recarregue o navegador."
        action={
          <Button onClick={retry} size="lg">
            <RotateCcw data-icon="inline-start" aria-hidden="true" />
            Tentar novamente
          </Button>
        }
      />
    </Container>
  );
}
