/**
 * Formatează o valoare numerică ca monedă în format românesc (RON).
 * @param amount - Suma de formatat.
 * @returns Un string cu suma formatată, ex: "100,00 RON".
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('ro-RO', {
    style: 'currency',
    currency: 'RON',
  }).format(amount)
}
