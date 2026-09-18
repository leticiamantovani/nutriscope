import type { FlaggedIngredient } from "../../model/types";

/**
 * Fixed sample product returned for ANY query.
 * Covers all four verdicts and both sources so every visual state is
 * exercised by the mock.
 */
export const SAMPLE_PRODUCT_NAME = "Chocolate-flavored filled cookie";

export const SAMPLE_INGREDIENTS: FlaggedIngredient[] = [
  { name: "Enriched wheat flour", verdict: "adequate", source: "database" },
  { name: "Sugar", verdict: "moderate", source: "database" },
  { name: "Hydrogenated vegetable fat", verdict: "avoid", source: "database" },
  { name: "Cocoa powder", verdict: "adequate", source: "database" },
  { name: "Glucose syrup", verdict: "moderate", source: "database" },
  { name: "Corn starch", verdict: "adequate", source: "database" },
  { name: "Salt", verdict: "moderate", source: "database" },
  { name: "Caramel color IV", verdict: "carcinogenic", source: "database" },
  { name: "Soy lecithin emulsifier", verdict: "adequate", source: "database" },
  { name: "Antioxidant TBHQ", verdict: "avoid", source: "estimated" },
  { name: "Sodium bicarbonate leavening agent", verdict: "adequate", source: "database" },
  { name: "Artificial flavor", verdict: "moderate", source: "estimated" },
  { name: "Tartrazine color", verdict: "avoid", source: "estimated" },
];

export const SAMPLE_EXPLANATION = `This cookie has three things to watch. The main one is caramel color IV, produced with ammonia sulfite: it may contain 4-MEI, a substance classified by IARC as possibly carcinogenic to humans (group 2B). There is no established safe dose, so the prudent choice is to limit consumption.

Hydrogenated vegetable fat is a source of trans fat, linked to higher LDL cholesterol and cardiovascular risk. TBHQ and tartrazine are shown as estimates — they are common additives in chocolate fillings, but they are not in the curated database for this product; check the physical label.

Sugar and glucose syrup sit at the top of the list, which indicates a high share of added sugars. The remaining ingredients are common in baking and have no relevant alerts.`;
