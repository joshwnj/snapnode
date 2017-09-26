export default function (base, latest) {
  if (!latest) { return false }

  return base.data !== latest.data
}
