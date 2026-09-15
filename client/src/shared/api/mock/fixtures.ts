import type { Macros } from '../types'

export interface DishFixture {
  /** Palavras-chave (minúsculas, sem acento) que ativam esta fixture. */
  keywords: string[]
  macros: Macros
  explanation: string
}

/**
 * Pratos conhecidos. O matching é por palavra-chave, então "feijoada completa"
 * e "uma feijoada" caem na mesma fixture. Consultas sem match usam
 * `buildGenericFixture`, que gera valores determinísticos a partir do texto.
 */
export const dishes: DishFixture[] = [
  {
    keywords: ['feijoada'],
    macros: { calories: 780, protein: 42, carbs: 68 },
    explanation:
      'A feijoada completa combina feijão-preto, carnes suínas curadas, arroz branco, couve refogada e farofa. As carnes e o feijão concentram a proteína, enquanto arroz e farofa respondem pela maior parte dos carboidratos. A gordura das carnes curadas eleva bastante o total calórico — uma porção com menos linguiça e mais couve reduz cerca de 150 kcal sem perder o sabor.',
  },
  {
    keywords: ['caesar', 'cesar'],
    macros: { calories: 520, protein: 38, carbs: 22 },
    explanation:
      'A salada Caesar com frango grelhado tem uma base leve de alface-romana, mas o molho à base de maionese e parmesão e os croutons concentram calorias. O frango entrega uma dose generosa de proteína magra. Os carboidratos vêm quase inteiramente dos croutons; trocar por pão integral torrado mantém a crocância com mais fibras.',
  },
  {
    keywords: ['ovo', 'ovos', 'pao frances', 'cafe com leite'],
    macros: { calories: 460, protein: 22, carbs: 48 },
    explanation:
      'Um café da manhã clássico: dois ovos garantem proteína de alta qualidade e gorduras boas, o pão francês fornece a maior parte dos carboidratos e o café com leite adiciona cálcio e um pouco de proteína. É uma combinação equilibrada para começar o dia — para mais saciedade, vale incluir uma fruta ou trocar o pão pela versão integral.',
  },
  {
    keywords: ['acai'],
    macros: { calories: 610, protein: 9, carbs: 96 },
    explanation:
      'O açaí na tigela com granola e banana é energético: a polpa costuma vir adoçada com xarope de guaraná, e a granola soma açúcar e carboidratos. A banana contribui com potássio e fibras. Como fonte de proteína é fraca — adicionar pasta de amendoim ou whey transforma a tigela em um lanche mais completo.',
  },
  {
    keywords: ['frango grelhado', 'arroz integral', 'brocolis'],
    macros: { calories: 540, protein: 46, carbs: 52 },
    explanation:
      'Frango grelhado com arroz integral e brócolis é o prato-modelo de refeição balanceada: proteína magra abundante, carboidrato complexo com fibras e um vegetal rico em vitamina C. O total calórico moderado e a boa proporção entre macros o tornam ideal para quem treina. Uma colher de azeite eleva as gorduras boas sem pesar.',
  },
  {
    keywords: ['pizza'],
    macros: { calories: 880, protein: 34, carbs: 92 },
    explanation:
      'Três fatias de pizza margherita somam uma refeição substancial. A massa é a principal fonte de carboidratos; o queijo muçarela entrega a proteína e boa parte das calorias por causa da gordura. O molho de tomate e o manjericão são leves e adicionam licopeno. Para uma versão mais equilibrada, uma salada de folhas ao lado ajuda a moderar a porção.',
  },
  {
    keywords: ['pao de queijo'],
    macros: { calories: 330, protein: 8, carbs: 36 },
    explanation:
      'Três pães de queijo médios rendem um lanche denso em energia: o polvilho é quase puro carboidrato e o queijo traz gordura e um pouco de proteína. Por ser feito sem trigo, é naturalmente sem glúten. Vai bem com um café sem açúcar e uma fruta para equilibrar.',
  },
  {
    keywords: ['strogonoff', 'estrogonofe', 'strogonof'],
    macros: { calories: 720, protein: 36, carbs: 70 },
    explanation:
      'O strogonoff de frango com arroz e batata palha é cremoso por causa do creme de leite, que também concentra boa parte das calorias. O frango sustenta a proteína e o arroz, os carboidratos. A batata palha, frita, adiciona gordura e sódio — reduzir a porção dela é o ajuste mais eficiente para aliviar o prato.',
  },
]

const genericExplanations = [
  'Estimativa feita a partir dos ingredientes informados e de porções típicas. A proteína vem principalmente das fontes animais ou leguminosas descritas; os carboidratos, dos cereais, tubérculos e açúcares. Ajuste as quantidades para uma estimativa mais precisa — o tamanho da porção é o fator que mais altera o resultado.',
  'Com base na descrição, este prato tem um perfil calórico moderado. Os carboidratos são a principal fonte de energia, e a proteína está em quantidade razoável para uma refeição principal. Se a intenção é aumentar a saciedade, vale adicionar uma fonte extra de proteína magra ou fibras.',
  'Os valores consideram preparo caseiro padrão. Métodos como fritura ou molhos à base de creme elevam bastante o total calórico; preparações grelhadas ou cozidas ficam mais leves. Se quiser refinar a análise, descreva as quantidades e o modo de preparo.',
]

/** Hash simples e determinístico para gerar macros plausíveis a partir do texto. */
function hash(text: string): number {
  let h = 2166136261
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return Math.abs(h >>> 0)
}

export function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .trim()
}

export function findFixture(query: string): DishFixture {
  const q = normalize(query)
  const match = dishes.find((d) => d.keywords.some((k) => q.includes(k)))
  return match ?? buildGenericFixture(q)
}

function buildGenericFixture(normalized: string): DishFixture {
  const h = hash(normalized)
  return {
    keywords: [],
    macros: {
      calories: 320 + (h % 520), // 320..839
      protein: 12 + ((h >> 4) % 34), // 12..45
      carbs: 25 + ((h >> 8) % 70), // 25..94
    },
    explanation: genericExplanations[h % genericExplanations.length],
  }
}
