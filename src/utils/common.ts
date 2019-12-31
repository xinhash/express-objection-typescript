export default function getRandomItem(items: string[]) {
  return items[Math.floor(Math.random() * items.length)]
}
