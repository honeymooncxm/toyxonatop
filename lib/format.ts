export function formatNumber(n: number) {
  return new Intl.NumberFormat("en-US").format(n).replace(/,/g, " ");
}
