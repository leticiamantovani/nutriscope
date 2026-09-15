import Link from "next/link";
import { Home } from "lucide-react";
import { Container } from "@/shared/components/container";
import { EmptyState } from "@/shared/components/empty-state";
import { Button } from "@/shared/components/ui/button";

export default function NotFound() {
  return (
    <Container className="flex flex-1 items-center justify-center py-16">
      <EmptyState
        title="Página não encontrada"
        description="O endereço que você abriu não existe. A análise de ingredientes fica na página inicial."
        action={
          <Button asChild size="lg">
            <Link href="/">
              <Home data-icon="inline-start" aria-hidden="true" />
              Ir para a análise
            </Link>
          </Button>
        }
      />
    </Container>
  );
}
