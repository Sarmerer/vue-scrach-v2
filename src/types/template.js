export class Template {
  static dynamic(strings, ...keys) {
    return (...values) => {
      const dict = values[values.length - 1] || {}
      const result = [strings[0]]
      keys.forEach((key, i) => {
        const value = Number.isInteger(key) ? values[key] : dict[key]
        result.push(value, strings[i + 1])
      })
      return result.join('')
    }
  }

  static interpolate(template, values) {
    return template.replace(/[$]{([^}]+)}/g, function (_, path) {
      const properties = path.split('.')
      return properties.reduce((prev, curr) => {
        if (prev[curr] == undefined) return ''
        return prev[curr]
      }, values)
    })
  }
}
