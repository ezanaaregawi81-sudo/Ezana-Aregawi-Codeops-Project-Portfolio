export const VAT = 0.15
export const withVat = n => n * (1 + VAT)

export default function format (n){
    return `${n.toFixed(2)} ETB`
}