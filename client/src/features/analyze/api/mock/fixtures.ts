import type { FlaggedIngredient } from "../../model/types";

/**
 * Fixed sample product returned for ANY query.
 * Covers all four verdicts and both sources so every visual state is
 * exercised by the mock.
 */
export const SAMPLE_PRODUCT_NAME = "Biscoito recheado sabor chocolate";

export const SAMPLE_INGREDIENTS: FlaggedIngredient[] = [
  { name: "Farinha de trigo enriquecida", verdict: "adequado", source: "database" },
  { name: "Açúcar", verdict: "moderado", source: "database" },
  { name: "Gordura vegetal hidrogenada", verdict: "evitar", source: "database" },
  { name: "Cacau em pó", verdict: "adequado", source: "database" },
  { name: "Xarope de glicose", verdict: "moderado", source: "database" },
  { name: "Amido de milho", verdict: "adequado", source: "database" },
  { name: "Sal", verdict: "moderado", source: "database" },
  { name: "Corante caramelo IV", verdict: "cancerigeno", source: "database" },
  { name: "Emulsificante lecitina de soja", verdict: "adequado", source: "database" },
  { name: "Antioxidante TBHQ", verdict: "evitar", source: "estimated" },
  { name: "Fermento químico bicarbonato de sódio", verdict: "adequado", source: "database" },
  { name: "Aromatizante artificial", verdict: "moderado", source: "estimated" },
  { name: "Corante tartrazina", verdict: "evitar", source: "estimated" },
];

export const SAMPLE_EXPLANATION = `Este biscoito tem três pontos de atenção. O principal é o corante caramelo IV, produzido com sulfito de amônia: ele pode conter 4-MEI, substância classificada pela IARC como possivelmente cancerígena para humanos (grupo 2B). Não há dose segura consolidada, então o mais prudente é limitar o consumo.

A gordura vegetal hidrogenada é fonte de gordura trans, associada a aumento do colesterol LDL e risco cardiovascular. O TBHQ e a tartrazina aparecem como estimativa — são aditivos comuns em recheios sabor chocolate, mas não constam na base curada para este produto; confira no rótulo físico.

Açúcar e xarope de glicose ocupam o topo da lista, o que indica alta proporção de açúcares adicionados. Os demais ingredientes são comuns em panificação e não têm alertas relevantes.`;
