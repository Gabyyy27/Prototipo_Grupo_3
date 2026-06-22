import { formatCurrency } from './currency.js';
import { getLatestSale } from './calculations.js';
import { todayIso } from './dates.js';

function normalize(value) {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

function parseNumber(value, fallback) {
  const parsed = Number(String(value || '').replace(',', '.'));
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function formatCurrencyWithDecimals(value) {
  return `L ${Number(value || 0).toLocaleString('es-HN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export function parseChatbotMessage(message, { products, movements }) {
  const text = normalize(message);

  if (text.includes('vendi') && text.includes('brownie')) {
    const brownie = products.find((product) => normalize(product.name).includes('brownie'));
    const quantityMatch = text.match(/vendi\s+(\d+(?:[.,]\d+)?)\s+brownies?/);
    const priceMatch = text.match(/(?:a|por)\s+l?\s*(\d+(?:[.,]\d+)?)/);
    const quantity = parseNumber(quantityMatch?.[1], 3);
    const unitPrice = parseNumber(priceMatch?.[1], Number(brownie?.price || 50));
    const total = quantity * unitPrice;
    const unitsLabel = quantity === 1 ? 'brownie' : 'brownies';

    return {
      kind: 'confirmation',
      response: `\u00a1Entendido! He registrado la venta de ${quantity} ${unitsLabel} por un total de ${formatCurrencyWithDecimals(total)}.\nSu inventario se ha actualizado.\n\u00bfDeseas guardar esta venta?`,
      movement: {
        id: `movement-${Date.now()}`,
        date: todayIso(),
        concept: `Venta de ${quantity} ${unitsLabel}`,
        productId: 'brownie-chocolate',
        productName: brownie?.name || 'Brownie de Chocolate',
        customer: 'Cliente WhatsApp',
        amount: total,
        quantity,
        type: 'sale',
        status: 'paid',
        channel: 'WhatsApp',
      },
    };
  }

  if (text.includes('compre') && text.includes('ingredientes')) {
    const amountMatch = text.match(/(?:por|l)\s+l?\s*(\d+(?:[.,]\d+)?)/);
    const amount = parseNumber(amountMatch?.[1], 300);

    return {
      kind: 'confirmation',
      response: `\u00a1Entendido! He detectado una compra de ingredientes por ${formatCurrencyWithDecimals(amount)}.\n\u00bfDeseas guardar esta compra?`,
      movement: {
        id: `movement-${Date.now()}`,
        date: todayIso(),
        concept: 'Compra de ingredientes',
        productId: '',
        productName: 'Ingredientes',
        customer: '',
        amount,
        quantity: 1,
        type: 'purchase',
        status: 'paid',
        channel: 'WhatsApp',
      },
    };
  }

  if (text.includes('precio') && text.includes('brownie')) {
    const brownie = products.find((product) => normalize(product.name).includes('brownie'));
    return {
      kind: 'answer',
      response: brownie
        ? `El precio del brownie es ${formatCurrency(brownie.price)}.`
        : 'No encontr\u00e9 brownie en tu inventario.',
    };
  }

  if (text.includes('cuanto vendi') || text.includes('resumen de hoy')) {
    const total = movements
      .filter((movement) => movement.type === 'sale' && movement.date === todayIso())
      .reduce((sum, movement) => sum + Number(movement.amount), 0);
    return { kind: 'answer', response: `Hoy llevas vendido ${formatCurrency(total)}.` };
  }

  if (text.includes('ultima venta')) {
    const latestSale = getLatestSale(movements);
    return {
      kind: 'answer',
      response: latestSale
        ? `Tu \u00faltima venta fue ${latestSale.productName}, por ${formatCurrency(latestSale.amount)}.`
        : 'A\u00fan no tienes ventas registradas.',
    };
  }

  if (text.includes('pulseras') && text.includes('inventario')) {
    const product = products.find((item) => normalize(item.name).includes('pulsera'));
    return {
      kind: 'answer',
      response: product
        ? `Tienes ${product.stock} pulseras en inventario.`
        : 'No tienes pulseras registradas en inventario.',
    };
  }

  return {
    kind: 'answer',
    response: 'Puedo registrar ventas, registrar compras y responder consultas b\u00e1sicas de tu negocio.',
  };
}
